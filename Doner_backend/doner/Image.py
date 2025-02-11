from flask import jsonify
import os
import base64
from .extensions import db
from .utils import hash_file_contents
from imagekitio import ImageKit
from imagekitio.models.UploadFileRequestOptions import UploadFileRequestOptions

# Configure ImageKit instance
imagekit = ImageKit(
    public_key='public_hFkFUjxLwp4lIZH7BIYyg1EdnXE=',
    private_key='private_nMVTNHc+9oqeoWQXn0yBNaR9awg=',
    url_endpoint='https://ik.imagekit.io/vhboyr/purple-note/'
)


class Image(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    filename = db.Column(db.String(120), nullable=False)
    post_id = db.Column(db.Integer, db.ForeignKey('post.id'), nullable=False)

    @staticmethod
    def saveFile(file, new_post):

        file.seek(0)  # Reset file pointer to beginning
        # Upload file to ImageKit
        binary=base64.b64encode(file.read())
        upload_response = imagekit.upload(
            file=binary,
            file_name=file.filename,
            options=UploadFileRequestOptions(
                tags=["image_upload", "post_image"]
            )
        )

        # Check if upload was successful
        if upload_response:
            image_url = upload_response.response_metadata.raw['url']
            return Image(filename=image_url, post=new_post)
        else:
            # Handle errors (optional, add error handling logic as needed)
            raise Exception(f"Image upload failed: {upload_response.error_message}")

    @property
    def url(self):
        # Return the public URL of the image
        return self.filename