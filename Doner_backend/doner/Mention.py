from .extensions import db, shared_sequence
from datetime import datetime


class Mention(db.Model):
    __tablename__ = 'mention'
    id = db.Column(db.Integer, shared_sequence, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    post_id = db.Column(db.Integer, db.ForeignKey('post.id'))
    read = db.Column(db.Boolean, default=False,nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    user = db.relationship('User', back_populates='mentions')
    post = db.relationship('Post', back_populates='mentions')
