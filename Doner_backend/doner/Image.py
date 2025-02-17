from flask import jsonify
import os
from .utils import fileUpload
from .extensions import db




class Image(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    filename = db.Column(db.String(120), nullable=False)
    post_id = db.Column(db.Integer, db.ForeignKey('post.id'), nullable=False)



    @staticmethod
    def saveFile(file, new_post):
        return Image(filename=fileUpload(file), post=new_post)


    @property
    def url(self):
        # Return the public URL of the image
        return self.filename