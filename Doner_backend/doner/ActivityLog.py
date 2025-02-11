from flask import jsonify
from .extensions import db
from datetime import datetime
class ActivityLog(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))  # 关联用户
    action = db.Column(db.String(50))  # 操作类型，如 'like', 'comment', 'view' 等
    target_type = db.Column(db.String(50))  # 操作对象的类型，如 'post', 'comment' 等
    target_id = db.Column(db.Integer)  # 操作对象的 ID
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)  # 操作发生的时间

    user = db.relationship('User', backref='activities')  # 可选的反向关联

    @staticmethod
    def log_login(user_id):
        log = ActivityLog(user_id=user_id, action='login', target_type='user', target_id=user_id) 
        db.session.add(log)
        db.session.commit()

    @staticmethod
    def log_logout(user_id):
        log = ActivityLog(user_id=user_id, action='logout', target_type='user', target_id=user_id) 
        db.session.add(log)
        db.session.commit()    

    @staticmethod
    def log_register(user_id):
        log = ActivityLog(user_id=user_id, action='register', target_type='user', target_id=user_id) 
        db.session.add(log)
        db.session.commit()

    # 类似的方法可以为收藏、点赞、关注、评论、发贴实现
    # 例如，记录收藏操作
    @staticmethod
    def log_favorite_post(user_id, post_id):
        log = ActivityLog(user_id=user_id, action='favorite', target_type='post', target_id=post_id) 
        db.session.add(log)
        db.session.commit()

    @staticmethod
    def log_unFavorite_post(user_id, post_id):
        log = ActivityLog(user_id=user_id, action='unFavorite', target_type='post', target_id=post_id) 
        db.session.add(log)
        db.session.commit()    

    # 记录点赞操作
    @staticmethod
    def log_like(user_id, post_id):
        log = ActivityLog(user_id=user_id, action='like', target_type='post/comment', target_id=post_id) 
        db.session.add(log)
        db.session.commit()

    @staticmethod
    def log_unLike(user_id, post_id):
        log = ActivityLog(user_id=user_id, action='unLike', target_type='post/comment', target_id=post_id) 
        db.session.add(log)
        db.session.commit()   

     

    # 记录关注操作
    @staticmethod
    def log_follow(user_id, followed_id):
        log = ActivityLog(user_id=user_id, action='follow', target_type='user', target_id=followed_id) 
        db.session.add(log)
        db.session.commit()

    @staticmethod
    def log_unFollow(user_id, followed_id):
        log = ActivityLog(user_id=user_id, action='unFollow', target_type='user', target_id=followed_id) 
        db.session.add(log)
        db.session.commit()    

    # 记录评论操作
    @staticmethod
    def log_comment(user_id, post_id):
        log = ActivityLog(user_id=user_id, action='comment', target_type='post', target_id=post_id) 
        db.session.add(log)
        db.session.commit()

    # 记录发帖操作
    @staticmethod
    def log_post(user_id, post_id):
        log = ActivityLog(user_id=user_id, action='post', target_type='post', target_id=post_id) 
        db.session.add(log)
        db.session.commit()

    @staticmethod
    def log_error( message):    
        log = ActivityLog(action=message, target_type='error') 
        db.session.add(log)
        db.session.commit()
