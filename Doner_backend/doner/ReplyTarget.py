from flask import jsonify
from .extensions import db ,shared_sequence
from datetime import datetime

post_tags = db.Table('post_tags',
                db.Column('tag_id', db.Integer, db.ForeignKey('tag.id'), primary_key=True),
                db.Column('reply_target_id', db.Integer, db.ForeignKey('reply_target.id'), primary_key=True),
                db.Column('done',db.Boolean, default=False),
                db.Column('created_at', db.DateTime, default=datetime.utcnow)
                )


class Tag(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(80), unique=True, nullable=False)
    reply_targets = db.relationship('ReplyTarget',secondary=post_tags,back_populates='tags')

    def add(self):
        db.session.add(self)
        db.session.commit()
class ReplyTarget(db.Model):
    __tablename__ = 'reply_target'
    id = db.Column(db.Integer,shared_sequence, primary_key=True)
    type = db.Column(db.String(50))
    tags = db.relationship("Tag", secondary=post_tags, back_populates='reply_targets')
    images = db.relationship('Image', back_populates='target')
    deleted = db.Column(db.Boolean, default=False, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    __mapper_args__ = {
        'polymorphic_identity': 'reply_target',
        'polymorphic_on': type
    }
