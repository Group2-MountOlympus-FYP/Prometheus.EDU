from flask import request, Response, send_file, Blueprint,abort
import os
from .extensions import s3,BUCKET_NAME
video_bp = Blueprint('video', __name__)


@video_bp.route('/<filename>', methods=['GET'])
def get_video(filename):
    print('Getting video from S3:', filename)

    # 获取客户端请求的 Range 头
    byte_range = request.headers.get('Range', None)

    # 获取对象元数据（文件总大小）
    try:
        head_resp = s3.head_object(Bucket=BUCKET_NAME, Key=filename)
        file_size = head_resp['ContentLength']
    except Exception as e:
        print('Error getting metadata:', e)
        return abort(404)

    if byte_range:
        # 解析 Range: bytes=start-end
        try:
            start, end = byte_range.strip().replace('bytes=', '').split('-')
            start = int(start)
            end = int(end) if end else file_size - 1
        except ValueError:
            return abort(400, 'Invalid Range header')

        content_length = end - start + 1

        try:
            s3_resp = s3.get_object(
                Bucket=BUCKET_NAME,
                Key=filename,
                Range=f'bytes={start}-{end}'
            )
            chunk = s3_resp['Body'].read()
        except Exception as e:
            print('Error fetching range from S3:', e)
            return abort(416)

        response = Response(chunk, status=206, content_type='video/mp4')
        response.headers['Content-Range'] = f'bytes {start}-{end}/{file_size}'
        response.headers['Content-Length'] = str(content_length)
        response.headers['Accept-Ranges'] = 'bytes'
        return response

    # 没有 Range 请求，则直接流式传输整个视频（不建议用于大文件）
    try:
        s3_resp = s3.get_object(Bucket=BUCKET_NAME, Key=filename)
        return Response(s3_resp['Body'].read(), status=200, content_type='video/mp4')
    except Exception as e:
        print('Error fetching file:', e)
        return abort(404)
