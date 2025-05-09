from .extensions import db
from .ReplyTarget import ReplyTarget
from .Comment import Comment


class Post(ReplyTarget):
    __tablename__ = 'post'
    id = db.Column(db.Integer, db.ForeignKey('reply_target.id'), primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    content = db.Column(db.Text, nullable=False)
    lecture_id = db.Column(db.Integer, db.ForeignKey('lecture.id'))
    lecture = db.relationship('Lecture',  backref='posts', foreign_keys=lecture_id)




    __mapper_args__ = {
        'polymorphic_identity': 'post',
    }


    def addPost(self, images):
        db.session.add(self)
        for image in images:
            db.session.add(image)
        db.session.commit()

    def delete_post(self):
        # Delete associated images
        for image in self.images:
            db.session.delete(image)
        db.session.delete(self)
        db.session.commit()

    @staticmethod
    def get_all_posts():
        return Post.query.all()

    @property
    def first_image(self):
        """返回帖子的第一张图片，如果没有图片则返回 None"""
        return self.images.first() if self.images else None
    @property
    def author_name(self):
        """返回帖子作者的用户名"""
        return self.composer.username if self.composer else None # type: ignore

    @property
    def author_avatar_url(self):
        """返回帖子作者的头像"""
        return self.composer.avatarUrl if self.composer else None # type: ignore

    @property
    def short_content(self):
        """返回帖子内容的前20个字"""
        return self.content[:20] if self.content else ''

    def get_like_count(self):
        return len(self.liked_by.all())

    def get_favorit_count(self):
        return len(self.favorited_by.all())

    def get_all_comments(self):
        return Comment.query.filter_by(parent_target_id=self.id).all()


