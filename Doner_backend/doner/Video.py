from flask import request, Response, send_file, Blueprint
import os

video_bp = Blueprint('video', __name__)


@video_bp.route('/<filename>', methods=['GET'])
def get_video(filename):
    print('getting video')

    current_dir = os.path.dirname(os.path.abspath(__file__))
    parent_dir = os.path.dirname(current_dir)

    video_path = os.path.join(parent_dir, 'static', 'Video', filename)
    file_size = os.path.getsize(video_path)

    # 获取客户端请求的Range头部
    byte_range = request.headers.get('Range', None)

    if byte_range:
        start, end = byte_range.strip('bytes=').split('-')
        start = int(start)
        end = int(end) if end else file_size - 1
        content_length = end - start + 1

        with open(video_path, 'rb') as f:
            f.seek(start)
            chunk = f.read(content_length)

        response = Response(chunk, status=206, content_type='video/mp4')
        response.headers['Content-Range'] = f'bytes {start}-{end}/{file_size}'
        response.headers['Content-Length'] = str(content_length)
        return response
    else:
        return send_file(video_path)
