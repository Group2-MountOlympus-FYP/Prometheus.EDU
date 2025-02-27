from functools import wraps
from flask import request, jsonify, session
from .User import *


def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if not session.get('id'):
            user_id = request.cookies.get('id')  # 从cookie中获取user_id
            if user_id:
                session['id'] = user_id  # 将user_id存储到session中
            else:
                return 'You are not logged in!', 401

        return f(*args, **kwargs)

    return decorated_function


def teacher_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):

        user_id = session.get('id')
        # 先确保用户已登录
        if not user_id:
            user_id = request.cookies.get('id')
            if user_id:
                session['id'] = user_id
            else:
                return 'You are not logged in!', 401

        # 验证用户是否是教师
        if session.get('role') != UserStatus.TEACHER:
            user = User.query.get(user_id)
            if user.status == UserStatus.TEACHER:
                session['role'] = UserStatus.TEACHER
            else:
                return 'You do not have teacher privileges!', 403

        return f(*args, **kwargs)

    return decorated_function
