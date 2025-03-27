from .extensions import db
from .ReplyTarget import ReplyTarget
from enum import Enum, auto, IntEnum
from datetime import datetime


class CourseStatus(Enum):
    DELETED = auto()
    NORMAL = auto()
    VIP = auto()


class CourseLevel(IntEnum):
    LEVEL_1 = 1
    LEVEL_2 = 2
    LEVEL_3 = 3
    LEVEL_4 = 4
    LEVEL_5 = 5


class Enrollment(db.Model):
    # 外键字段，指向学生（User）
    student_id = db.Column(db.Integer, db.ForeignKey('user.id'), primary_key=True)
    student = db.relationship('User', backref='enrollments')

    # 外键字段，指向课程（Course）
    course_id = db.Column(db.Integer, db.ForeignKey('course.id'), primary_key=True)
    course = db.relationship('Course', backref='enrollments')

    # 报名日期
    enrollment_date = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)

    # 学生在课程中的进度，表示为百分比（0 到 100）
    progress = db.Column(db.Integer, nullable=False, default=0)  # 默认 0 表示未开始

    def enroll(self):
        db.session.add(self)
        db.session.commit()


class Course(ReplyTarget):
    __tablename__ = 'course'
    # 继承自 ReplyTarget 的 id 作为主键
    id = db.Column(db.Integer, db.ForeignKey('reply_target.id'), primary_key=True)

    # 课程名称（必填）
    course_name = db.Column(db.String(100), nullable=False)

    # 课程简介（必填）
    description = db.Column(db.Text, nullable=False)

    # 课程评分（必填，默认 0.0）
    rating = db.Column(db.Float, nullable=False, default=0.0)

    # 课程等级，使用 IntEnum 保存 1~5 级，默认为 1 级
    level = db.Column(db.Enum(CourseLevel), nullable=False, default=CourseLevel.LEVEL_1.value)

    # 课程状态（必填，可选值：'删除'、'普通'、'vip'，默认 '普通'）
    status = db.Column(db.Enum(CourseStatus), default=CourseStatus.NORMAL)

    student_count = db.Column(db.Integer, nullable=False, default=0)
    institution = db.Column(db.String(100), nullable=False)

    # 自关联：指向更低等级的课程（例如前置课程）
    lower_level_course_id = db.Column(db.Integer, db.ForeignKey('course.id'), nullable=True)
    lower_level_course = db.relationship(
        'Course',
        remote_side=[id],
        foreign_keys=[lower_level_course_id],
        post_update=True,
        backref='higher_level_courses'
    )

    # 自关联：指向更高等级的课程（例如进阶课程）
    higher_level_course_id = db.Column(db.Integer, db.ForeignKey('course.id'), nullable=True)
    higher_level_course = db.relationship(
        'Course',
        remote_side=[id],
        foreign_keys=[higher_level_course_id],
        post_update=True,
        backref='lower_level_courses'
    )

    __mapper_args__ = {
        'polymorphic_identity': 'course',
    }

    @classmethod
    def get_courses(cls, status=None, level=None, teacher_id=None, page=1, per_page=20):
        """
        获取课程列表，支持通过状态、等级和教师过滤，并分页返回
        :param status: 课程状态（例如 CourseStatus.NORMAL）
        :param level: 课程等级（例如 CourseLevel.LEVEL_1）
        :param teacher_id: 教师 ID（可以过滤某个教师的课程）
        :param page: 当前页码
        :param per_page: 每页显示的课程数量
        :return: 分页后的课程列表
        """
        query = cls.query

        # 根据状态筛选课程
        if status:
            query = query.filter_by(status=status)

        # 根据等级筛选课程
        if level:
            query = query.filter_by(level=level)

        # 根据教师 ID 筛选课程
        if teacher_id:
            query = query.filter_by(teacher_id=teacher_id)

        # 分页
        return query.paginate(page=page, per_page=per_page, error_out=False)

    @classmethod
    def create_course(cls, author_id, course_name, description, institution, level=CourseLevel.LEVEL_1,
                      status=CourseStatus.NORMAL, lower_level_course_id=None,
                      higher_level_course_id=None):
        """
        创建一个新课程
        :param author_id:
        :param institution:
        :param course_name: 课程名称
        :param description: 课程简介
        :param rating: 课程评分
        :param level: 课程等级
        :param status: 课程状态
        :param teacher_id: 教师的 ID
        :param lower_level_course_id: 前置课程 ID
        :param higher_level_course_id: 后置课程 ID
        :return: 新创建的课程对象
        """
        course = cls(
            author_id=author_id,
            course_name=course_name,
            description=description,
            institution=institution,
            level=level,
            status=status,
            lower_level_course_id=lower_level_course_id,
            higher_level_course_id=higher_level_course_id
        )
        db.session.add(course)
        db.session.commit()
        return course

    def update_course(self, course_name=None, description=None, institution=None, rating=None, level=None,
                      status=None, teacher_id=None, lower_level_course_id=None,
                      higher_level_course_id=None):
        """
        更新课程信息
        :param institution:
        :param course_name: 课程名称
        :param description: 课程简介
        :param rating: 课程评分
        :param level: 课程等级
        :param status: 课程状态
        :param teacher_id: 教师 ID
        :param lower_level_course_id: 前置课程 ID
        :param higher_level_course_id: 后置课程 ID
        :return: 更新后的课程对象
        """
        if course_name:
            self.course_name = course_name
        if description:
            self.description = description
        if rating is not None:
            self.rating = rating
        if institution:
            self.institution = institution
        if level:
            self.level = level
        if status:
            self.status = status
        if teacher_id:
            self.author_id = teacher_id
        if lower_level_course_id:
            self.lower_level_course_id = lower_level_course_id
        if higher_level_course_id:
            self.higher_level_course_id = higher_level_course_id

        db.session.commit()
        return self

    @classmethod
    def delete_course(cls, course_id):
        """
        删除课程
        :param course_id: 课程的 ID
        :return: 是否成功删除
        """
        course = cls.query.get(course_id)
        if course:
            course.deleted = True
            db.session.commit()
            return True
        return False

    @classmethod
    def get_enrollment_info(cls, course_id):
        """
        获取课程的报名信息，包括所有报名学生及其进度
        :param course_id: 课程 ID
        :return: 包含学生进度的列表
        """
        course = cls.query.get(course_id)
        if course:
            return [
                {'student_id': enrollment.student_id, 'progress': enrollment.progress}
                for enrollment in course.enrollments
            ]
        return []
