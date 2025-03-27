import hashlib

import requests
import sqlalchemy
from flasgger import swag_from
from flask_admin import Admin, AdminIndexView, expose
from flask_admin.contrib.sqla import ModelView
from flask_admin.form import Select2Widget, Select2Field
from flask_wtf import FlaskForm
from markupsafe import Markup
from wtforms import PasswordField, StringField, TextAreaField, IntegerField, SubmitField, SelectField
from wtforms.validators import InputRequired, DataRequired

from .decorator import *
from .extensions import db
from .schemas import *


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
    @log_activity(
        action='getProfile',
        target_type='get',
        target_id_func=lambda: get_current_user().id if get_current_user() else None
    )
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
    @log_activity(action='getLikeInfo', target_type='get',
                  target_id_func=lambda: get_current_user().id if get_current_user() else None)
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
    @log_activity(action='getCollectInfo', target_type='get',
                  target_id_func=lambda: get_current_user().id if get_current_user() else None)
    def my_collections():
        user = get_current_user()
        posts = user.favorited_posts  # 用户收藏
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
    @log_activity(action='changeAvatar', target_type='post',
                  target_id_func=lambda: get_current_user().id if get_current_user() else None)
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
    @log_activity(action='changeProfile', target_type='post',
                  target_id_func=lambda: get_current_user().id if get_current_user() else None)
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
                elif field == 'status':
                    setattr(user, field, UserStatus[value.strip().upper()])
                else:
                    setattr(user, field, value.strip())
            update_fields_recursively(fields[1:])

        update_fields_recursively(fields_to_update)
        try:
            db.session.commit()
        except sqlalchemy.exc.IntegrityError:
            return "用户名重复", 401
        return "个人信息更新成功"

    @app.route('/user/search-users', methods=['GET'])
    @login_required
    @log_activity(action='search-users', target_type='get', target_id_func=None)
    @swag_from({
        "tags": ["User"],
        "summary": "搜索用户",
        "description": "根据用户名首字母搜索用户，并支持分页。",
        "parameters": [
            {
                "name": "initial",
                "in": "formData",
                "type": "string",
                "required": True,
                "description": "用户名的首字母"
            },
            {
                "name": "per_page",
                "in": "formData",
                "type": "integer",
                "required": False,
                "default": 10,
                "description": "每页返回的用户数量，默认值为 10"
            }
        ],
        "responses": {
            "200": {
                "description": "成功返回匹配的用户列表",
                "schema": {
                    "type": "object",
                    "properties": {
                        "users": {
                            "type": "object",
                            "properties": {
                                "username": {
                                    "type": "string",
                                    "description": "用户名"
                                },
                                "user_id": {
                                    "type": "integer",
                                    "description": "用户 ID"
                                }
                            }
                        }
                    },
                    "example": {
                        "users": [
                            {
                            "username": "王洋",
                            "user_id": 13
                            }
                        ]
                    }
                }
            },
            "400": {
                "description": "请求参数错误",
                "schema": {
                    "type": "object",
                    "properties": {
                        "error": {
                            "type": "string",
                            "example": "initial 参数不能为空"
                        }
                    }
                }
            },
            "401": {
                "description": "未授权，用户未登录",
                "schema": {
                    "type": "object",
                    "properties": {
                        "error": {
                            "type": "string",
                            "example": "Unauthorized"
                        }
                    }
                }
            }
        }
    })
    def search_users():
        initial = request.args.get('initial', '', type=str)
        per_page = request.args.get('per_page', 10, type=int)

        if not initial:
            return jsonify({"error": "initial 参数不能为空"}), 400

        query = User.query.filter(User.username.startswith(initial), User.deleted == False)
        users = query.limit(per_page).all()

        result = {"users": [{"username": user.username, "user_id": user.id} for user in users]}

        return jsonify(result)

    @app.route('/delete_user/<int:user_id>', methods=['POST'])
    @log_activity(action='delete_user', target_type='post', target_id_func=lambda user_id: user_id)
    @login_required
    def delete_user(user_id):
        user = User.query.get(user_id)
        if not user:
            return jsonify({"message": "User not found"}), 404

        try:
            user.deleted = True
            db.session.commit()
            return jsonify({"message": "User marked as deleted"}), 200
        except Exception as e:
            db.session.rollback()
            return jsonify({"message": "Failed to delete user", "error": str(e)}), 500

    @app.route('/change_user_status/<int:user_id>', methods=['POST'])
    @login_required
    @log_activity(action='changeStatus', target_type='post', target_id_func=lambda user_id: user_id)
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
        "tags": ["Admin"],
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
    def change_user_status(user_id):
        user = User.query.get(user_id)
        if not user:
            return jsonify({"message": "User not found"}), 404

        new_status_str = request.json.get("status")  # 获取前端传来的新状态（字符串）

        # 验证 new_status 是否是合法的 UserStatus 值
        try:
            new_status = UserStatus[new_status_str]  # 直接从枚举获取值
        except KeyError:
            return jsonify({"message": "Invalid status"}), 400

        try:
            user.status = new_status  # 这里存储的是 UserStatus 枚举
            db.session.commit()
            return jsonify({"message": "User status updated successfully"}), 200
        except Exception as e:
            db.session.rollback()
            return jsonify({"message": "Failed to update user status", "error": str(e)}), 500

    @app.route('/delete_post/<int:post_id>', methods=['POST'])
    @log_activity(action='delete_post', target_type='post', target_id_func=lambda post_id: post_id)
    @login_required
    def delete_post(post_id):
        post = Post.query.get(post_id)
        if not post:
            return jsonify({"message": "Post not found"}), 404

        try:
            post.deleted = True
            db.session.commit()
            return jsonify({"message": "Post marked as deleted"}), 200
        except Exception as e:
            db.session.rollback()
            return jsonify({"message": "Failed to delete post", "error": str(e)}), 500

    @app.route('/delete_comment/<int:comment_id>', methods=['POST'])
    @log_activity(action='delete_comment', target_type='post', target_id_func=lambda comment_id: comment_id)
    @login_required
    def delete_comment(comment_id):
        comment = Comment.query.get(comment_id)
        if not comment:
            return jsonify({"message": "Comment not found"}), 404

        try:
            comment.deleted = True
            db.session.commit()
            return jsonify({"message": "Comment marked as deleted"}), 200
        except Exception as e:
            db.session.rollback()
            return jsonify({"message": "Failed to delete comment", "error": str(e)}), 500


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


class BaseAdminView(ModelView):
    can_edit = False
    can_create = False


class UserAdminModelView(ModelView):
    column_exclude_list = ('password_hash',)
    column_display_pk = True  # 显示主键，避免自动解析外键
    form_columns = ('id','username','birthdate','gender','nickname', 'status','deleted')  # 只显示 ID 作为表单字段（避免所有字段）
    column_searchable_list = ('id', 'username','birthdate','gender','nickname','deleted')
    column_formatters = {
        'avatar': lambda v, c, m, p: Markup(
            f'<img src="{m.avatar}" width="50" height="50" style="border-radius: 10px;">')
    }
    # 定义 status 字段的选择项
    form_overrides = {
        'status': SelectField
    }
    form_args = {
        'status': {
            'choices': [(status.name, status.name) for status in UserStatus],  # Enum 转换为 (值, 显示名)
            'widget': Select2Widget()
        }
    }

    # 6. 处理删除用户（调用后端 API 删除）
    def delete_model(self, model):
        try:
            session_cookie = {"session": request.cookies.get("session")}
            url = url_for('delete_user', user_id=model.id, _external=True)
            response = requests.post(url, cookies=session_cookie)
            return response.status_code == 200  # 仅当返回 200 时删除成功
        except Exception as e:
            print("Error", e)
            return False


class PostAdminModelView(BaseAdminView):
    column_searchable_list = ('id', 'title', 'content', 'composer_id')

    def delete_model(self, model):
        """向 delete_post 路由发送请求进行逻辑删除"""
        try:

            session_cookie = {"session": request.cookies.get("session")}
            url = url_for('delete_post', post_id=model.id, _external=True)
            response = requests.post(url, cookies=session_cookie)
            return response.status_code == 200  # 仅当返回 200 时视为删除成功

        except Exception as e:
            print("Error:", e)
            return False


class CommentAdminModelView(BaseAdminView):
    column_searchable_list = ('user_id', 'content')

    def delete_model(self, model):
        """向 delete_comment 路由发送请求进行逻辑删除"""
        try:
            session_cookie = {"session": request.cookies.get("session")}
            url = url_for('delete_comment', comment_id=model.id, _external=True)
            response = requests.post(url, cookies=session_cookie)
            return response.status_code == 200
        except Exception as e:
            print("Error:", e)
            return False


class ActivityLogView(BaseAdminView):
    column_searchable_list = ('user_id', 'action', 'target_type')
    column_list = ('id', 'user_id', 'action', 'target_type', 'target_id', 'timestamp')  # 只列出具体字段
    form_excluded_columns = ('user',)


def init_admin(app):
    admin = Admin(app, name='Admin Panel', template_mode='bootstrap3', index_view=MyAdminIndexView())

    # 保护 Flask-Admin 只能被管理员访问
    admin.add_view(ActivityLogView(ActivityLog, db.session))
    admin.add_view(UserAdminModelView(User, db.session))
    # admin.add_view(PostAdminModelView(Post, db.session, endpoint="admin_post"))
    # admin.add_view(CommentAdminModelView(Comment, db.session))
    admin.add_view(BaseAdminView(Course, db.session, endpoint="admin_course"))
    admin.add_view(BaseAdminView(Tag, db.session))
