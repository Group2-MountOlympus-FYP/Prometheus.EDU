import hashlib

import requests
import sqlalchemy
from flasgger import swag_from
from flask_admin import Admin, AdminIndexView, expose
from flask_admin.contrib.sqla import ModelView
from flask_wtf import FlaskForm
from wtforms import PasswordField
from wtforms.validators import InputRequired

from .User import *
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
    @log_activity(action='getLikeInfo', target_type='get', target_id_func=lambda: get_current_user().id if get_current_user() else None)
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
    @log_activity(action='getCollectInfo', target_type='get', target_id_func=lambda: get_current_user().id if get_current_user() else None)
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
    @log_activity(action='changeAvatar', target_type='post', target_id_func=lambda: get_current_user().id if get_current_user() else None)
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
    @log_activity(action='changeProfile', target_type='post', target_id_func=lambda: get_current_user().id if get_current_user() else None)
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
            return "用户名重复", 401
        return "个人信息更新成功"

    @app.route('/delete_user/<int:user_id>', methods=['POST'])
    @log_activity(action='delete_user',target_type='post',target_id_func=lambda user_id: user_id)
    # @login_required
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


class UserAdminModelView(ModelView):
    form_columns = ['status']

    def delete_model(self, model):
        try:
            session_cookie = {"session": request.cookies.get("session")}
            url = url_for('delete_user', user_id=model.id, _external=True)
            response = requests.post(url, cookies=session_cookie)
            if response.status_code == 200:
                return True
            else:
                return False
        except Exception as e:
            print("Error", e)
            return False

    def edit_form(self, obj=None):
        """
        自定义表单，确保 `status` 字段是下拉框，并且只能选择 `UserStatus` 中的值
        """
        form = super().edit_form(obj)
        if hasattr(form, 'status'):
            form.status.choices = [(status.name, status.name) for status in UserStatus]  # 让 choices 匹配 Enum

        return form

    def on_model_change(self, form, model, is_created):
        """
        拦截 `Flask-Admin` 的表单提交，请求 `change_user_status` 进行修改
        """
        try:
            session_cookie = {"session": request.cookies.get("session")}
            url = url_for('change_user_status', user_id=model.id, _external=True)
            payload = {"status": model.status.name}  # 传递 status 字符串

            response = requests.post(url, json=payload, cookies=session_cookie)

            if response.status_code != 200:
                raise ValueError(f"Failed to update user status: {response.json().get('message')}")

            return True
        except Exception as e:
            print(f"Error updating user status: {e}")
            raise ValueError(f"Error updating user status: {e}")


def init_admin(app):
    admin = Admin(app, name='Admin Panel', template_mode='bootstrap3', index_view=MyAdminIndexView())

    # 保护 Flask-Admin 只能被管理员访问
    admin.add_view(ModelView(ActivityLog, db.session))
    admin.add_view(UserAdminModelView(User, db.session))
    admin.add_view(ModelView(Post, db.session, endpoint="admin_post"))
    admin.add_view(ModelView(Comment, db.session))
    admin.add_view(ModelView(Course, db.session, endpoint="admin_course"))
    admin.add_view(ModelView(Tag, db.session))
