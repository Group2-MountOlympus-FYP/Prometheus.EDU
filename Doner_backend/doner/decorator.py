from functools import wraps
from flask import request, jsonify, session, g
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


# 日志记录装饰器
def log_activity(action, target_type=None, target_id_func=None):
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            if not session.get('id'):
                user_id = request.cookies.get('id') # 从cookie中获取user_id
                if user_id:
                    # 获取当前用户
                    target_id = target_id_func(*args, **kwargs) if target_id_func else None

                    # 记录日志
                    log = ActivityLog(
                        user_id=user_id,
                        action=action,
                        target_type=target_type,
                        target_id=target_id,
                        timestamp=datetime.utcnow()
                    )
                    db.session.add(log)
                    db.session.commit()
                else:
                    return 'You are not logged in!', 401

            return f(*args, **kwargs)

        return decorated_function

    return decorator


# Before request 装饰器
def before_request():
    user_id = session.get('id')
    if user_id:
        g.user = get_current_user()
        g.user_id = g.user.id if g.user else None
    else:
        g.user = None
        g.user_id = None


# After request 装饰器
def after_request(response):
    return response
