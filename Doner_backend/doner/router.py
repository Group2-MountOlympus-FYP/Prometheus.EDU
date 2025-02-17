from flask import jsonify
from flask import session, url_for, redirect, request

from .ReplyTarget import ReplyTarget

from .User import *
from .Post import Post
from .extensions import db
from .UserStatus import UserStatus
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

        # 在序列化后的字典中合并 as_dict() 的结果
        for post, serialized_post in zip(posts, post_dicts):
            serialized_post.update(post.as_dict())

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

    @app.route('/change_avatar',methods=['POST'])
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




    @app.route('/admin', methods=['GET', 'POST'])
    def admin_page():
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
                return "success"

        # Query all users from the database
        users = User.query.all()
        posts = Post.query.all()
        logs = ActivityLog.query.all()

        if request.method == 'POST':
            # Check if the delete button is clicked
            print(request.form)
            if 'delete_user' in request.form:
                user_id_to_delete = int(request.form.get('delete_user'))  # type: ignore
                # Delete the user and associated posts from the database
                user_to_delete = User.query.get(user_id_to_delete)
                if user_to_delete:
                    user_to_delete.delete_user_and_related_posts()

            elif 'edit_user' in request.form:
                # If the form is submitted, update the user status
                user_id = int(request.form.get('user_id'))  # type: ignore
                new_status = request.form.get('new_status')

                # Find the user by ID
                user = User.query.get(user_id)

                if user:
                    # Update the user's status
                    user.status = UserStatus[new_status]  # type: ignore
                    db.session.commit()

            elif 'delete_post' in request.form:
                post_id_to_delete = int(request.form.get('delete_post'))  # type: ignore
                post_to_delete = Post.query.get(post_id_to_delete)
                if post_to_delete:
                    post_to_delete.delete_post()

        # Pass UserStatus enum to the template
        return jsonify({"users": users, "posts": posts, "user_status_enum": UserStatus, "logs": logs})
