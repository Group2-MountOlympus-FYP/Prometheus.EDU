import sqlalchemy
from flask import jsonify
from flask import session, url_for, redirect, request

from .ReplyTarget import ReplyTarget

from .User import *
from .Post import Post
from .extensions import db
from .Comment import Comment
from .ActivityLog import ActivityLog
from .Image import Image
from wtforms import PasswordField
from flask_wtf import FlaskForm
from wtforms.validators import InputRequired
import hashlib
from .schemas import *
from flasgger import swag_from
from .decorator import login_required
from flask_admin import Admin, AdminIndexView, expose
from flask_admin.contrib.sqla import ModelView


class AdminLoginForm(FlaskForm):
    password = PasswordField('Password', validators=[InputRequired()])


def generate_hash(input_string):
    # 创建 SHA-256 哈希对象
    sha256_hash = hashlib.sha256()

    # 更新哈希对象的内容
    sha256_hash.update(input_string.encode('utf-8'))

    # 获取十六进制表示的哈希值
    hashed_value = sha256_hash.hexdigest()

    return hashed_value


def setRoot(app):
    @app.route('/')
    @swag_from({
        "responses": {
            "200": {
                "description": "Successfully retrieved homepage data",
                "schema": {
                    "type": "object",
                    "properties": {
                        "user": {"$ref": "static/definitions.yml#/User"},
                        "posts": {
                            "type": "array",
                            "items": {"$ref": "static/definitions.yml#/Post"},
                        },
                    },
                },
            }
        },
        "tags": ["Homepage"],
        "summary": "Fetch homepage data",
        "description": "This endpoint retrieves all posts and user details for the homepage.",
    })
    def index():
        posts = Post.get_all_posts()
        post_dicts = PostSchema(many=True).dump(posts)

        return jsonify({"posts": post_dicts})

    @app.route('/my_profile')
    @swag_from({
        "responses": {
            "200": {
                "description": "Successfully retrieved user profile",
                "schema": {
                    "type": "array",
                    "items": {"$ref": "static/definitions.yml#/Post"}
                },
            },
        },
        "tags": ["User"],
        "summary": "User's profile and posts",
        "description": "User's profile and posts",
    })
    @login_required
    def profile_page():
        user = get_current_user()
        return jsonify(UserSchema(exclude=["password_hash"]).dump(user))

    @app.route('/my_likes')
    @login_required
    @swag_from({
        "responses": {
            "200": {
                "description": "Successfully retrieved user profile",
                "schema":
                    {
                        "type": "object",
                        "properties": {
                            "posts": {
                                "type": "array",
                                "items": {"$ref": "static/definitions.yml#/Post"},
                            },
                        },
                    }
                ,
            },
        },
        "tags": ["User"],
        "summary": "User's profile and posts",
        "description": "User's profile and posts",
    })
    @login_required
    def my_likes():
        user = get_current_user()
        posts = user.liked_posts  # 获取该用户赞过的帖子
        return jsonify({"posts": PostSchema(many=True).dump(posts)})

    @app.route('/my_collections')
    @swag_from({
        "responses": {
            "200": {
                "description": "成功获取用户收藏列表",
                "schema": {
                    "type": "object",
                    "properties": {
                        "favorited_by": {
                            "type": "array",
                            "items": {
                                "$ref": "static/definitions.yml#/User"
                            }
                        }
                    }
                }
            }
        },
        "tags": ["User"],
        "summary": "用户收藏的内容",
        "description": "获取用户收藏的内容列表"
    })
    @login_required
    def my_collections():
        user = get_current_user()
        posts = user.favorited_posts  #用户收藏
        return jsonify({"posts": PostSchema(many=True).dump(posts)})

    @app.route('/change_avatar', methods=['POST'])
    @login_required
    @swag_from({
        "responses": {
            "200": {
                "description": "成功更新头像",
                "schema": {
                    "type": "object",
                    "properties": {
                        "message": {
                            "type": "string",
                            "description": "操作成功后的消息"
                        }
                    },
                    "examples": {
                        "application/json": {
                            "message": "头像更新成功"
                        }
                    }
                }
            },
        },
        "tags": ["User"],
        "summary": "更新用户头像",
        "description": "用户通过上传文件来更新自己的头像。文件必须是有效的图片格式。如果用户未登录，则返回 401 错误。",
        "parameters": [
            {
                "name": "file",
                "in": "formData",
                "type": "file",
                "required": True,
                "description": "用户上传的头像图片文件"
            }
        ]
    })
    def change_avatar():
        file = request.files.get('file')
        user = get_current_user()
        user.saveAvatar(file)
        return "success"

    @app.route('/change_profile', methods=['POST'])
    @login_required
    @swag_from({
        "responses": {
            "200": {
                "description": "成功更新个人信息",
                "schema": {
                    "type": "object",
                    "properties": {
                        "message": {
                            "type": "string",
                            "description": "操作成功后的消息"
                        }
                    },
                    "examples": {
                        "application/json": {
                            "message": "个人信息更新成功"
                        }
                    }
                }
            }
        },
        "tags": ["User"],
        "summary": "更新用户个人信息",
        "description": "用户通过上传form-data数据来更新个人信息。若某字段未传或为空，则跳过该字段的更新。注意：头像和密码不在此接口更新范围。如果用户未登录，则返回 401 错误。",
        "parameters": [
            {
                "name": "username",
                "in": "formData",
                "type": "string",
                "required": False,
                "description": "用户名"
            },
            {
                "name": "birthdate",
                "in": "formData",
                "type": "string",
                "required": False,
                "description": "出生日期"
            },
            {
                "name": "gender",
                "in": "formData",
                "type": "string",
                "required": False,
                "description": "性别"
            },
            {
                "name": "nickname",
                "in": "formData",
                "type": "string",
                "required": False,
                "description": "昵称"
            },
            {
                "name": "status",
                "in": "formData",
                "type": "string",
                "required": False,
                "description": "用户状态"
            },
            {
                "name": "deleted",
                "in": "formData",
                "type": "boolean",
                "required": False,
                "description": "是否删除"
            }
        ]
    })
    def change_profile():
        user = get_current_user()
        data = request.form

        # 需要更新的字段列表，不包含头像和密码
        fields_to_update = ['username', 'birthdate', 'gender', 'nickname', 'status', 'deleted']

        def update_fields_recursively(fields):
            if not fields:
                return
            field = fields[0]
            value = data.get(field)
            if value and value.strip():  # 使用 strip() 去除首尾空格
                if field == 'deleted':
                    # 将字符串转换为布尔值
                    v = value.strip().lower()
                    if v in ['true', '1', 'yes']:
                        setattr(user, field, True)
                    elif v in ['false', '0', 'no']:
                        setattr(user, field, False)
                else:
                    setattr(user, field, value.strip())
            update_fields_recursively(fields[1:])

        update_fields_recursively(fields_to_update)
        try:
            db.session.commit()
        except sqlalchemy.exc.IntegrityError:
            return "用户名重复",401
        return "个人信息更新成功"


class AdminModelView(ModelView):
    def is_accessible(self):
        return session.get('admin')  # 只有 session['admin'] = True 时才能访问

    def inaccessible_callback(self, name, **kwargs):
        return jsonify({"message": "WRONG PASSWORD!!!"}), 401  # 直接返回 401 错误


# 自定义 Admin 首页，避免未登录用户访问
class MyAdminIndexView(AdminIndexView):
    @expose('/')
    def index(self):
        form = AdminLoginForm()
        if not session.get('admin'):
            if form.validate_on_submit():
                if generate_hash(
                        form.password.data) == "a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3":
                    session['admin'] = True
                    return "success"
                else:
                    return jsonify(
                        {"message": "WRONG PASSWORD!!!"}), 401

            else:
                return super().index()
        return super().index()


def init_admin(app):
    admin = Admin(app, name='Admin Panel', template_mode='bootstrap3', index_view=MyAdminIndexView())

    # 保护 Flask-Admin 只能被管理员访问
    admin.add_view(ModelView(ActivityLog, db.session))
    admin.add_view(ModelView(User, db.session))
    admin.add_view(ModelView(Post, db.session, endpoint="admin_post"))
