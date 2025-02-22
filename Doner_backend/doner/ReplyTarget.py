from flask import jsonify
from .extensions import db
from datetime import datetime


class ReplyTarget(db.Model):
    __tablename__ = 'reply_target'
    id = db.Column(db.Integer, primary_key=True)
    type = db.Column(db.String(50))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    __mapper_args__ = {
        'polymorphic_identity': 'reply_target',
        'polymorphic_on': type
    }
