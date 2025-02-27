from flask import Blueprint, request, jsonify
from flasgger import swag_from
from .Course import *
from .decorator import teacher_required
from .schemas import CourseSchema
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
                'type': 'object',
                'properties': {
                    "type": "array",
                    "items": {"$ref": "static/definitions.yml#/Course"}

                }
            }
        }
    }
})
def get_all_courses():
    status = request.args.get('status')
    level = request.args.get('level')
    teacher_id = request.args.get('teacher_id')
    page = int(request.args.get('page', 1))
    per_page = int(request.args.get('per_page', 20))

    courses = Course.get_courses(status=status, level=level, teacher_id=teacher_id, page=page, per_page=per_page)
    return jsonify(CourseSchema(many=True).dump(courses))


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
                'type': 'object',
                'properties': {
                    "$ref": "static/definitions.yml#/Course"
                }
            }
        },
        '404': {
            'description': '课程未找到'
        }
    }
})
def get_course_by_id(course_id):
    course = Course.get_course_by_id(course_id)
    if not course:
        return {'message': '课程未找到'}, 404
    return jsonify(CourseSchema().dump(course))

course_input=[
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
    data = request.get_json()
    course_name = data.get('course_name')
    description = data.get('description')
    level = data.get('level', CourseLevel.LEVEL_1)
    status = data.get('status', CourseStatus.NORMAL)
    teacher_id = data.get('teacher_id')
    lower_level_course_id = data.get('lower_level_course_id')
    higher_level_course_id = data.get('higher_level_course_id')
    file = request.files.get('main_picture')

    course = Course.create_course(course_name, description, level, status, teacher_id, lower_level_course_id,
                                  higher_level_course_id)
    Image.save_image(file, course)

    return course.id, 201


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
    data = request.get_json()
    course = Course.get_course_by_id(course_id)
    if not course:
        return {'message': '课程未找到'}, 404

    course.update_course(
        course_name=data.get('course_name'),
        description=data.get('description'),
        level=data.get('level'),
        status=data.get('status'),
        teacher_id=data.get('teacher_id'),
        lower_level_course_id=data.get('lower_level_course_id'),
        higher_level_course_id=data.get('higher_level_course_id')
    )

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
