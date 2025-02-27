from flask import jsonify
import os

from .extensions import db
from sqlalchemy.orm import relationship
from imagekitio import ImageKit
import base64

imagekit = ImageKit(
    public_key='public_hFkFUjxLwp4lIZH7BIYyg1EdnXE=',
    private_key='private_nMVTNHc+9oqeoWQXn0yBNaR9awg=',
    url_endpoint='https://ik.imagekit.io/vhboyr/purple-note/'
)


def fileUpload(file):
    file.seek(0)  # Reset file pointer to beginning
    # Upload file to ImageKit
    binary = base64.b64encode(file.read())
    upload_response = imagekit.upload(
        file=binary,
        file_name=file.filename,
    )
    if upload_response:
        return upload_response.response_metadata.raw['url']
    else:
        raise Exception("upload failed")


class Image(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    url = db.Column(db.Text, nullable=False)
    target_id = db.Column(db.Integer, db.ForeignKey('reply_target.id'), nullable=False)
    # 在 Image 中定义 target 关系，表示每个 Image 仅对应一个 ReplyTarget
    target = relationship('ReplyTarget', back_populates='images')

    @classmethod
    def save_image(cls, file, target):
        image = cls(url=fileUpload(file), target=target)
        db.session.add(image)
        db.session.commit()
