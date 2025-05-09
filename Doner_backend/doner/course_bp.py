from flask import Blueprint, request, jsonify, session
from flasgger import swag_from
from sqlalchemy.exc import IntegrityError

from .Course import *
from .Lecture import Lecture
from .User import get_current_user, UserStatus
from .decorator import teacher_required, login_required
from .schemas import CourseSchema, LectureSchema, EnrollmentSchema
from .athena import athena_client
import re
from bs4 import BeautifulSoup
from collections import OrderedDict

course_bp = Blueprint('course', __name__)
from .Image import Image


# 获取所有课程接口
@course_bp.route('/all', methods=['GET'])
@swag_from({
    'tags': ['课程'],
    'summary': '获取所有课程',
    'description': '获取所有课程，可以通过课程状态、等级、教师筛选并分页返回。',
    'parameters': [
        {
            'name': 'status',
            'in': 'query',
            'type': 'string',
            'enum': ['DELETED', 'NORMAL', 'VIP'],
            'description': '课程状态'
        },
        {
            'name': 'level',
            'in': 'query',
            'type': 'integer',
            'enum': [1, 2, 3, 4, 5],
            'description': '课程等级'
        },
        {
            'name': 'teacher_id',
            'in': 'query',
            'type': 'integer',
            'description': '教师ID'
        },
        {
            'name': 'page',
            'in': 'query',
            'type': 'integer',
            'description': '当前页码，默认为1'
        },
        {
            'name': 'per_page',
            'in': 'query',
            'type': 'integer',
            'description': '每页显示的课程数量，默认为20'
        }
    ],
    'responses': {
        '200': {
            'description': '成功返回课程列表',
            'schema': {
                "type": "array",
                "items": {"$ref": "static/definitions.yml#/Course"}
            }
        }
    }
})
def get_all_courses():
    data = request.args
    teacher_id = data.get('teacher_id')
    page = int(request.args.get('page', 1))
    per_page = int(request.args.get('per_page', 20))
    level = CourseLevel.__members__.get(data.get('level'))
    status = CourseStatus.__members__.get(data.get('status'))
    category = Category._value2member_map_.get(data.get('category'))

    courses = Course.get_courses(status=status, level=level, teacher_id=teacher_id, category=category, page=page,
                                 per_page=per_page)

    # 修改 author 为 username
    course_list = []
    for course in courses:
        course_dict = CourseSchema().dump(course)
        course_dict['author'] = course.author.username  # 替换为用户名
        course_list.append(course_dict)

    return jsonify(course_list)



@course_bp.route('/search', methods=['GET'])
def search():
    data = request.args.get("query")
    if not data:
        return "query param error", 400
    ids=athena_client.search_course_ids(data)
    print(ids)
    courses = Course.query.filter(Course.id.in_(ids)).all()

    result = []
    for course in courses:
        course_dict = CourseSchema().dump(course)
        course_dict['author'] = course.author.username  # 替换为用户名
        result.append(course_dict)
    return result
    #return CourseSchema(many=True).dump(courses)


# 仅保留中文（CJK 统一表意文字区段）、英文大小写和空格
NON_CN_EN_RE = re.compile(r'[^A-Za-z\u4E00-\u9FFF\s]+')


def clean_text(text: str) -> str:
    if not text:
        return ""

    # 1. 去除 HTML 标签
    text = BeautifulSoup(text, "html.parser").get_text()

    # 2. 去除所有非中英文字符（保留空格）
    text = NON_CN_EN_RE.sub('', text)

    # 3. 去除换行符并压缩多余空格
    text = re.sub(r'[\r\n]+', ' ', text)
    text = re.sub(r'\s+', ' ', text).strip()

    # 4. 删除重复“片段”
    #    这里把“片段”理解为以空格分隔的 token（英文单词或连续中文字符）
    #    先按空格切分，再按出现顺序保留第一次出现的 token
    tokens = text.split(' ')
    unique_tokens = list(OrderedDict.fromkeys(tokens))  # Ordered 去重
    text = ' '.join(unique_tokens)

    return text


def get_recommend(combined_text):
    cleaned_text = clean_text(combined_text)
    ids = athena_client.search_course_ids(cleaned_text)
    return  Course.query.filter(Course.id.in_(ids)).all()



@course_bp.route('/recommend', methods=['GET'])
@login_required
def recommend():
    user = get_current_user()

    # 收集 post 的 title 和 content
    post_parts = [f"{post.title} {post.content}" for post in user.posts]

    # 收集 comment 的 content
    comment_parts = [comment.content for comment in user.get_my_comments()]

    # 拼接所有文本内容（加上 birthdate 和 gender）
    combined_text = " ".join(
        filter(None, post_parts + comment_parts + [str(user.birthdate or ""), str(user.gender or "")])
    )

    # 获取推荐课程（返回应该是 Course 对象列表或含 author_id 的课程信息列表）
    recommended_courses = get_recommend(combined_text)
    # 修改 author 字段为 username（假设是 Course 对象列表）
    result = []
    for course in recommended_courses:
        course_dict = CourseSchema().dump(course)
        course_dict['author'] = course.author.username  # 替换为用户名
        result.append(course_dict)

    return jsonify(result)



# 获取课程详细信息接口
@course_bp.route('/<int:course_id>', methods=['GET'])
@swag_from({
    'tags': ['课程'],
    'summary': '获取课程详细信息',
    'description': '通过课程ID获取课程的详细信息。',
    'parameters': [
        {
            'name': 'course_id',
            'in': 'path',
            'type': 'integer',
            'required': True,
            'description': '课程ID'
        }
    ],
    'responses': {
        '200': {
            'description': '成功返回课程详细信息',
            'schema': {
                "$ref": "static/definitions.yml#/Course"
            }
        },
        '404': {
            'description': '课程未找到'
        }
    }
})
def get_course_by_id(course_id):
    course = Course.query.get_or_404(course_id)
    course_dict = CourseSchema().dump(course)

    # 将 author 字段从 ID 替换为 username
    course_dict['author'] = course.author.username  # 或 nickname

    course_dict['lecture_nums'] = len(course_dict['lectures'])

    # 提取不重复的讲座作者
    authors = {lecture["author"]["id"]: lecture["author"] for lecture in course_dict["lectures"]}
    course_dict["teachers"] = list(authors.values())
    course_dict["enrollment_count"] = len(course.enrollments)

    return jsonify(course_dict)


course_input = [
    {
        'name': 'course_name',
        'in': 'body',
        'type': 'string',
        'required': True,
        'description': '课程名称'
    },
    {
        "name": "main_picture",
        "in": "body",
        "type": "file",
        "description": "课程主图"
    },
    {
        'name': 'description',
        'in': 'body',
        'type': 'string',
        'required': True,
        'description': '课程简介'
    },
    {
        'name': 'level',
        'in': 'body',
        'type': 'integer',
        'default': 1,
        'description': '课程等级'
    },
    {
        'name': 'status',
        'in': 'body',
        'type': 'string',
        'enum': ['DELETED', 'NORMAL', 'VIP'],
        'default': 'NORMAL',
        'description': '课程状态'
    },
    {
        'name': 'teacher_id',
        'in': 'body',
        'type': 'integer',
        'required': True,
        'description': '教师ID'
    },
    {
        'name': 'lower_level_course_id',
        'in': 'body',
        'type': 'integer',
        'description': '低级课程的id'
    }
    ,
    {
        'name': 'higher_level_course_id',
        'in': 'body',
        'type': 'integer',
        'description': '高级课程的id'
    }

]


# 创建课程接口
@course_bp.route('/create', methods=['POST'])
@teacher_required
@swag_from({
    'tags': ['课程'],
    'summary': '创建新课程',
    'description': '通过提供课程信息创建一个新的课程。',
    'parameters': course_input,
    'responses': {
        '201': {
            'description': '课程创建成功',
            'schema': {
                'type': 'integer',
            }
        }
    }
})
def create_course():
    data = request.form
    course_name = data.get('course_name')
    description = data.get('description')
    level = CourseLevel.__members__.get(data.get('level'), CourseLevel.LEVEL_1)
    status = CourseStatus.__members__.get(data.get('status'), CourseStatus.NORMAL)
    file = request.files.get('main_picture')
    institution = request.form.get('institution', "No institution")
    category = Category.__members__.get(data.get('category'), Category.Others)

    course = Course.create_course(session['id'], course_name, description, institution, level, status, category)
    if file:
        Image.save_image(file, course)
    athena_client.update_course_vector_store()
    return {"id": course.id}, 201


# 更新课程接口
@course_bp.route('/<int:course_id>/update', methods=['PUT'])
@teacher_required
@swag_from({
    'tags': ['课程'],
    'summary': '更新课程信息',
    'description': '更新已有课程的信息。',
    'parameters': course_input,
    'responses': {
        '200': {
            'description': '课程更新成功',
            'schema': {
                "$ref": "static/definitions.yml#/Course"
            }
        },
        '404': {
            'description': '课程未找到'
        }
    }
})
def update_course(course_id):
    data = request.form
    course = Course.query.get(course_id)
    if not course:
        return {'message': '课程未找到'}, 404

    course_name = data.get('course_name')
    description = data.get('description')
    level = CourseLevel.__members__.get(data.get('level', ''))
    status = CourseStatus.__members__.get(data.get('status', ''))
    file = request.files.get('main_picture')
    institution = request.form.get('institution')
    course = course.update_course(course_name, description, institution, level, status)

    if file:
        Image.save_image(file, course)

    return jsonify(CourseSchema().dump(course))


# 删除课程接口
@course_bp.route('/<int:course_id>/delete', methods=['DELETE'])
@swag_from({
    'tags': ['课程'],
    'summary': '删除课程',
    'description': '根据课程ID删除课程。',
    'parameters': [
        {
            'name': 'course_id',
            'in': 'path',
            'type': 'integer',
            'required': True,
            'description': '课程ID'
        }
    ],
    'responses': {
        '200': {
            'description': '课程删除成功'
        },
        '404': {
            'description': '课程未找到'
        }
    }
})
def delete_course(course_id):
    result = Course.delete_course(course_id)
    if not result:
        return {'message': '课程未找到'}, 404
    return {'message': '课程已删除'}, 200


@course_bp.route('/<int:course_id>/add_lecture', methods=['POST'])
@teacher_required
def add_lecture(course_id):
    result = Course.query.get_or_404(course_id)
    data = request.form
    video = request.files.get('video')
    files = request.files.getlist('resources')
    name = data.get('name')
    description = data.get('description')
    lecture = Lecture.create(name, description, result.id, video, session['id'], athena_client, files)

    return jsonify(LectureSchema().dump(lecture))


@course_bp.route('/get_lecture_detail', methods=['GET'])
@login_required
def get_lecture_detail():
    lecture_id = request.args.get('lecture_id')
    lecture = Lecture.query.get_or_404(lecture_id)
    lecture_dict = LectureSchema().dump(lecture)
    lecture_dict['teacher'] = lecture_dict.pop('author')
    return jsonify(lecture_dict)


@course_bp.route('/<int:course_id>/enroll')
@login_required
def enroll(course_id):
    course = Course.query.get_or_404(course_id)
    enrollment = Enrollment(course_id=course.id, student_id=session['id'])
    try:
        enrollment.enroll()
    except IntegrityError:
        return "Already Enrolled", 400
    return jsonify(EnrollmentSchema().dump(enrollment))


@course_bp.route('/my_course')
@login_required
def enrolled_courses():
    user = get_current_user()
    if user.status == UserStatus.TEACHER:
        # 获取所有由该教师发布的课程
        courses = Course.query.filter_by(author_id=user.id).all()

        result = []
        for course in courses:
            course_dict = CourseSchema().dump(course)

            # 手动添加作者用户名
            course_dict['author'] = course.author.username  # 或 course.author.nickname

            result.append({"course": course_dict})

        return jsonify(result)
    else:
        return jsonify(EnrollmentSchema().dump(user.enrollments, many=True))


