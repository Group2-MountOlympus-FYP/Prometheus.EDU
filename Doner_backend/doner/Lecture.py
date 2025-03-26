from .extensions import db  # 假设 db 为 SQLAlchemy 实例
from .ReplyTarget import ReplyTarget
from moviepy import VideoFileClip
import hashlib
import os


class Lecture(ReplyTarget):
    id = db.Column(db.Integer, db.ForeignKey('reply_target.id'), primary_key=True)
    name = db.Column(db.String, nullable=False)
    description = db.Column(db.String)
    course_id = db.Column(db.Integer, db.ForeignKey('course.id'), nullable=False)
    course = db.relationship('Course', backref='lectures', foreign_keys=course_id)
    video_time = db.Column(db.String, comment="视频时长")
    video_url = db.Column(db.String, nullable=False)
    posts = db.relationship('Post', backref='lecture', foreign_keys='Post.id')

    # 与资源的关联关系：一个讲座对应多个资源
    resources = db.relationship("Resource", backref="lecture")

    __mapper_args__ = {
        'polymorphic_identity': 'lecture',
    }

    @classmethod
    def create(cls, name, description, course_id, video_file, teacher_id, files=None):

        url, time = save_video(video_file)
        lecture = cls(name=name, description=description, course_id=course_id,author_id=teacher_id, video_time=time, video_url=url)
        if files is not None:
            lecture.resources = [Resource.create(file) for file in files]
        db.session.add(lecture)
        db.session.commit()

        return lecture





def hash_file_contents(file):
    hasher = hashlib.sha256()
    buf = file.read()
    hasher.update(buf)
    file_hash = hasher.hexdigest()
    original_filename = file.filename
    _, file_extension = os.path.splitext(original_filename)
    hashed_filename = file_hash + file_extension
    return hashed_filename


def save_resource(file):
    original_filename = file.filename
    filename = hash_file_contents(file)
    file.seek(0)  # 重置文件指针到开始位置
    url = os.path.join('static', 'resource', filename)
    file.save(url)
    return url,original_filename


def save_video(file):
    filename = hash_file_contents(file)
    file.seek(0)  # 重置文件指针到开始位置
    url = os.path.join('static', 'video', filename)
    file.save(url)
    # 使用 moviepy 获取视频时长
    clip = VideoFileClip(url)
    duration = clip.duration  # 视频时长，单位为秒

    # 转换为字符串形式（如 "2 minutes 30 seconds"）
    minutes = int(duration // 60)
    seconds = int(duration % 60)
    duration_str = f"{minutes}:{seconds}"
    return url,duration_str


class Resource(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    url = db.Column(db.String, comment="资源url")
    name = db.Column(db.String, comment="资源名")
    # 指定该资源所属的讲座（多对一关系）
    lecture_id = db.Column(db.Integer, db.ForeignKey('lecture.id'), comment="所属讲座ID", nullable=True)

    @classmethod
    def create(cls, file):
        url ,original_filename = save_resource(file)
        return cls(url=url,  name=original_filename)

