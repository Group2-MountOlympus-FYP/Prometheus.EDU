from .extensions import db, shared_sequence
from datetime import datetime


class Mention(db.Model):
    __tablename__ = 'mention'
    id = db.Column(db.Integer, shared_sequence, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    target_id = db.Column(db.Integer, db.ForeignKey('reply_target.id'))
    read = db.Column(db.Boolean, default=False,nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    user = db.relationship('User', back_populates='mentions')
    target = db.relationship('ReplyTarget', back_populates='mentions')
