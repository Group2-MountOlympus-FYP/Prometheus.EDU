from flask import jsonify
from .extensions import db
from .ReplyTarget import ReplyTarget
from datetime import datetime
from.ActivityLog import ActivityLog


post_likes = db.Table('post_likes',
    db.Column('user_id', db.Integer, db.ForeignKey('user.id'), primary_key=True),
    db.Column('comment_id', db.Integer, db.ForeignKey('comment.id'), primary_key=True),
    db.Column('created_at', db.DateTime, default=datetime.utcnow)
)


class Comment(ReplyTarget):
    __tablename__ = 'comment'
    id = db.Column(db.Integer, db.ForeignKey('reply_target.id'), primary_key=True)
    content = db.Column(db.Text, nullable=False)
    parent_target_id = db.Column(db.Integer, db.ForeignKey('reply_target.id'))
    parent_target = db.relationship('ReplyTarget', foreign_keys=[parent_target_id])
    liked_by = db.relationship('User', secondary=post_likes, backref=db.backref('liked_comments', lazy='dynamic'))


    __mapper_args__ = {
        'polymorphic_identity': 'comment',
        'polymorphic_on': ReplyTarget.type,
        'inherit_condition': (id == ReplyTarget.id)
    }

    @property
    def parent_type(self):
        # 获取与此评论关联的 ReplyTarget
        parent_target = ReplyTarget.query.get(self.target_id)
        if parent_target:
            return parent_target.type
        return None

    @property
    def parent_comment(self):
        # 获取与此评论关联的 ReplyTarget
        parent_target = ReplyTarget.query.get(self.target_id)
        if parent_target:
            # 检查 parent_target 的类型
            if parent_target.type == 'comment':
                # 返回 Comment 对象
                return Comment.query.get(self.target_id)
        return None    
    @property
    def author_avatar_url(self):
        return self.user.avatarUrl

    @property
    def child_comments_count(self):
        # 返回 target_id 等于当前评论 id 的 Comment 对象的数量
        return Comment.query.filter_by(target_id=self.id).count()
    
    @property
    def child_comments(self):
        # 查找所有 target_id 等于当前评论 id 的 Comment 对象
        return Comment.query.filter_by(target_id=self.id).all()

    @property
    def is_assignment(self):
        return

    @staticmethod
    def comment(target_id, comment_text, user_id):
        comment=Comment(content=comment_text,target_id=target_id,author_id=user_id)
        db.session.add(comment) 
        db.session.commit()
        ActivityLog.log_comment(user_id,comment.id)
        return comment

    
    def toggle_like(self,user):
        if not user in self.liked_by:
            self.liked_by.append(user)
            db.session.commit()
            ActivityLog.log_like(user.id,self.id)
            return True
        else:
            self.liked_by.remove(user)
            db.session.commit()
            ActivityLog.log_unLike(user.id,self.id)
            return False
        
    def is_like_by_user(self,user):
        return user in self.liked_by

    @property
    def get_like_count(self):
        return len(list(self.liked_by)) # type: ignore
    
 
    def dfs_traverse(self):
        # 初始化一个列表来存储子评论
        comments = [self]

        # 对每个子评论递归调用 dfs_traverse 并扩展到列表中
        for child_comment in self.child_comments:
            comments.extend(child_comment.dfs_traverse())

        return comments
    

    
    def need_reply_statment(self):
        parent_comment=self.parent_comment
        if parent_comment and parent_comment.parent_comment :
                return "Reply "+parent_comment.user.username+": "
        return ""    
  
