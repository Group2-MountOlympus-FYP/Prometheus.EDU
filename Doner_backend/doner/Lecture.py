from .extensions import db  # 假设 db 为 SQLAlchemy 实例
from .ReplyTarget import ReplyTarget


class Lecture(ReplyTarget):
    id = db.Column(db.Integer, db.ForeignKey('reply_target.id'), primary_key=True)
    course_id = db.Column(db.Integer, db.ForeignKey('course.id'), nullable=False)
    video_time = db.Column(db.String, comment="视频时长")

    teacher_id = db.Column(db.Integer, db.ForeignKey('user.id'), comment="授课教师ID")


    # 与资源的关联关系：一个讲座对应多个资源
    resources = db.relationship("Resource", backref="lecture")

    __mapper_args__ = {
        'polymorphic_identity': 'lecture',
    }


class Resource(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    url = db.Column(db.String, comment="资源url")
    name = db.Column(db.String, comment="资源名")
    # 指定该资源所属的讲座（多对一关系）
    lecture_id = db.Column(db.Integer, db.ForeignKey('lecture.id'), comment="所属讲座ID", nullable=True)
