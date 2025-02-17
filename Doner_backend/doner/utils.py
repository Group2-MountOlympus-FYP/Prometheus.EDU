from imagekitio import ImageKit
from imagekitio.models.UploadFileRequestOptions import UploadFileRequestOptions
import base64
# Configure ImageKit instance
imagekit = ImageKit(
    public_key='public_hFkFUjxLwp4lIZH7BIYyg1EdnXE=',
    private_key='private_nMVTNHc+9oqeoWQXn0yBNaR9awg=',
    url_endpoint='https://ik.imagekit.io/vhboyr/purple-note/'
)

def fileUpload(file):
    file.seek(0)  # Reset file pointer to beginning
    # Upload file to ImageKit
    binary=base64.b64encode(file.read())
    upload_response=imagekit.upload(
        file=binary,
        file_name=file.filename,
    )
    if upload_response:
        return upload_response.response_metadata.raw['url']
    else:
        raise Exception("upload failed")

