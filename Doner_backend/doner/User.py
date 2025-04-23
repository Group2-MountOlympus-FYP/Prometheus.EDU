from flask import jsonify, session, request
from werkzeug.security import check_password_hash
from enum import Enum, auto
from .extensions import db, shared_sequence
from .Post import Post
from datetime import datetime

from .Image import fileUpload
import os
from flask import url_for
from .ActivityLog import ActivityLog
from .Comment import Comment

favorites = db.Table('favorites',
                     db.Column('user_id', db.Integer, db.ForeignKey('user.id'), primary_key=True),
                     db.Column('post_id', db.Integer, db.ForeignKey('post.id'), primary_key=True),
                     db.Column('created_at', db.DateTime, default=datetime.utcnow)
                     )

followers = db.Table('followers',
                     db.Column('follower_id', db.Integer, db.ForeignKey('user.id'), primary_key=True),
                     db.Column('followed_id', db.Integer, db.ForeignKey('user.id'), primary_key=True),
                     db.Column('created_at', db.DateTime, default=datetime.utcnow)
                     )


class UserStatus(str, Enum):
    NORMAL = auto()
    VIP = auto()
    BANNED = auto()
    ADMIN = auto()
    TEACHER = auto()


class User(db.Model):
    id = db.Column(db.Integer, shared_sequence, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    birthdate = db.Column(db.Date, nullable=False)
    gender = db.Column(db.String(10), nullable=False)
    password_hash = db.Column(db.String(120), nullable=False)
    content = db.relationship('ReplyTarget', backref='author')
    avatar = db.Column(db.String(120), nullable=False,
                       default='https://ik.imagekit.io/vhboyr/placeholder_zRDIDDLmH.png')
    favorited_posts = db.relationship('Post', secondary=favorites, lazy='dynamic',
                                      backref=db.backref('favorited_by', lazy='dynamic'))
    followed = db.relationship('User',
                               secondary=followers,
                               primaryjoin=(followers.c.follower_id == id),
                               secondaryjoin=(followers.c.followed_id == id),
                               backref=db.backref('followers', lazy='dynamic'),
                               lazy='dynamic')
    mentions = db.relationship('Mention', back_populates='user', cascade='all, delete-orphan')
    nickname = db.Column(db.String(80), default='default nickname')
    status = db.Column(db.Enum(UserStatus), default=UserStatus.NORMAL)
    deleted = db.Column(db.Boolean, default=False, nullable=False)
    posts = db.relationship('Post', viewonly=True)

    def addUser(self):
        db.session.add(self)
        db.session.commit()

    def verify_password(self, password):
        return check_password_hash(self.password_hash, password)

    def delete_user_and_related_posts(self):
        # Delete associated posts and images
        for post in self.posts:  # type: ignore
            # Delete associated images
            for image in post.images:
                db.session.delete(image)
            db.session.delete(post)
        # Delete the user

        # Delete associated comments
        comments_to_delete = Comment.query.filter_by(user_id=self.id).all()
        for comment in comments_to_delete:
            db.session.delete(comment)

        db.session.delete(self)
        db.session.commit()

    @staticmethod
    def authenticate(username, password):
        user = User.query.filter_by(username=username).first()
        if user and user.verify_password(password):
            return user
        return None

    @staticmethod
    def userNameIsNotOccupied(username):
        return User.query.filter_by(username=username).first() is None

    @staticmethod
    def getUserById(id):
        return User.query.filter_by(id=id).first()

    @staticmethod
    def toggle_like_post(user_id, post_id):
        user = User.query.get(user_id)
        post = Post.query.get(post_id)
        if not user or not post:
            return "no post or user", 400

        if user.is_post_liked_by_user(post_id):
            user.unlike_post(post)
            info = 'unliked'
            ActivityLog.log_unLike(user.id, post.id)
        else:
            user.liked_posts.append(post)
            info = 'liked'
            ActivityLog.log_like(user.id, post.id)
        db.session.commit()
        return info

    def saveAvatar(self, file):
        self.avatar = fileUpload(file)
        db.session.commit()

    @staticmethod
    def toggle_favorit_post(user_id, post_id):
        user = User.query.get(user_id)
        post = Post.query.get(post_id)
        if not user or not post:
            return "no post or user", 400

        if user.is_post_favorited_by_user(post_id):
            user.unfavorit_post(post)
            info = 'unfavorit'
            ActivityLog.log_unFavorite_post(user.id, post.id)
        else:
            user.favorited_posts.append(post)
            info = 'favorit'
            ActivityLog.log_favorite_post(user.id, post.id)
        db.session.commit()
        return info

    def is_post_favorited_by_user(self, post_id):
        return self.favorited_posts.filter_by(id=post_id).first() is not None

    def unfavorit_post(self, post):
        # 如果找到，从用户的点赞列表中移除该帖子
        self.favorited_posts.remove(post)
        db.session.commit()
        return True

    def is_following(self, other_user):
        return self.followed.filter(followers.c.followed_id == other_user.id).count() > 0

    def toggle_follow(self, composer_id):
        composer = User.query.get(composer_id)
        if self.is_following(composer):
            self.followed.remove(composer)
            info = 'unfollowed'
            ActivityLog.log_unFollow(self.id, composer_id)
        else:
            self.followed.append(composer)
            info = 'followed'
            ActivityLog.log_follow(self.id, composer_id)
        db.session.commit()
        return info

    @property
    def is_vip(self):
        return self.status == UserStatus.VIP

    def unlike_post(self, post):
        # 如果找到，从用户的点赞列表中移除该帖子
        self.liked_posts.remove(post)
        db.session.commit()
        return True

    def get_my_comments(self):
        return Comment.query.filter_by(author_id=self.id).all()


def get_current_user():
    """
    获取当前登录用户,务必用login_require装饰器
    :return: User
    """
    user_id = session["id"]

    return User.getUserById(int(user_id))
