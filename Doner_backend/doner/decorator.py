from functools import wraps
from flask import request, jsonify, session
from .User import User

def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if not session.get('id'):
            user_id = request.cookies.get('id')  # 从cookie中获取user_id
            if user_id:
                session['id'] = user_id  # 将user_id存储到session中
            else:
                return jsonify({'message': 'You are not logged in!'}), 401

        return f(*args, **kwargs)
    return decorated_function