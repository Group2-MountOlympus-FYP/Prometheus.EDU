from flask import jsonify
from .extensions import db
from datetime import datetime

mention = db.Table('mention',
                   db.Column('user_id', db.Integer, db.ForeignKey('user.id'), primary_key=True),
                   db.Column('post_id', db.Integer, db.ForeignKey('post.id'), primary_key=True),
                   db.Column('read', db.Boolean, default=False),
                   db.Column('created_at', db.DateTime, default=datetime.utcnow)
                   )
