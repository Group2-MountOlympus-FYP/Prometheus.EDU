import sqlalchemy
from flask import Blueprint, redirect, url_for, current_app, request, jsonify, session, make_response, session, \
    make_response, abort

from .Post import Post
from werkzeug.utils import secure_filename
from .Image import Image
from .User import *
import os
from .Comment import Comment
from .ActivityLog import ActivityLog
from .schemas import *
from .decorator import login_required
from flasgger import swag_from
from .ReplyTarget import Tag

from celery import shared_task

from .athena_ta_core import athena_client
from sqlalchemy.orm import aliased

post_bp = Blueprint('post', __name__)


@shared_task
def async_review_assignment(parent_dict_str, comment_content, comment_id):
    ai_reply = athena_client.review_assignment(parent_dict_str, comment_content)
    if 'result' in ai_reply:
        # 自动评论结果（用系统用户，比如ID 134）
        Comment.comment(comment_id, ai_reply['result'], 134)


@shared_task()
def generate_in_context(query, context, comment_id):
    ai_reply = athena_client.generate_in_context(query, context)
    if 'result' in ai_reply:
        # 自动评论结果（用系统用户，比如ID 134）
        Comment.comment(comment_id, ai_reply['result'], 134)


@post_bp.before_request
@login_required
def before_request():
    return


@post_bp.route('/publish', methods=['POST'])
@swag_from({
    "responses": {
        "200": {
            "description": "成功发布新帖子",
            "schema": {
                "$ref": "static/definitions.yml#/Post"
            }
        }
    },
    "tags": ["Post"],
    "summary": "发布新帖子",
    "description": "用户提交标题、内容以及图片来发布新帖子，并返回发布后的帖子信息",
    "consumes": "multipart/form-data",
    "parameters": [
        {
            "name": "title",
            "in": "formData",
            "type": "string",
            "required": True,
            "description": "帖子标题"
        },
        {
            "name": "content",
            "in": "formData",
            "type": "string",
            "required": True,
            "description": "帖子内容"
        },
        {
            "name": "tags",
            "in": "formData",
            "type": "array",
            "items": {
                "type": "integer",
            },
            "description": "tag的id"
        },
        {
            "name": "images",
            "in": "formData",
            "type": "array",
            "items": {
                "type": "file",
                "format": "binary"
            },
            "required": False,
            "description": "帖子附带的图片（可选）"
        },
        {
            "name": "mention_list",
            "in": "formData",
            "type": "array",
            "items": {
                "type": "integer",
            },
            "description": "at的用户的id"
        }
    ]
})
def publish():
    if 'multipart/form-data' not in request.content_type:
        abort(400, description="请求必须使用 multipart/form-data 格式")
    title = request.form.get('title')
    content = request.form.get('content')
    files = request.files.getlist('images')
    tags = request.form.getlist('tags')
    lecture_id = request.form.get('lecture_id')
    mention = request.form.getlist('mention_list')
    new_post = Post(title=title, content=content, author_id=session['id'], lecture_id=lecture_id)
    if tags:
        new_post.tags = Tag.query.filter(Tag.id.in_(tags)).all()
    if mention:
        users = User.query.filter(User.id.in_(mention)).all()
        new_post.mentions = [Mention(user=u) for u in users]


    images_to_add = []

    for file in files:
        if file and file.filename:
            images_to_add.append(Image.save_image(file, new_post))

    new_post.addPost(images_to_add)
    if new_post.is_at_ai:
        generate_in_context(new_post.content, LectureSchema().dump(new_post.lecture), new_post.id)

    ActivityLog.log_post(session['id'], new_post.id)
    return jsonify(PostSchema().dump(new_post))


@post_bp.route('/like', methods=['POST'])
@swag_from({
    "responses": {
        "200": {
            "description": "成功切换帖子点赞状态",
            "schema": {
                "type": "string",
                "enum": ["liked", "unliked"],
                "description": "返回的点赞状态，'liked' 表示已点赞，'unliked' 表示已取消点赞"
            }
        },
        "400": {
            "description": "操作失败，用户 ID 或帖子 ID 未找到",
            "schema": {
                "type": "string",
                "description": "错误信息"
            },
            "examples": {
                "application/json": "操作失败"
            }
        }
    },
    "tags": ["Post"],
    "summary": "切换帖子点赞状态",
    "description": "用户通过提交用户 ID 和帖子 ID 来切换帖子的点赞状态，成功后返回当前的点赞状态。",
    "parameters": [
        {
            "name": "user_id",
            "in": "formData",
            "type": "string",
            "required": True,
            "description": "用户 ID，标识点赞的用户"
        },
        {
            "name": "post_id",
            "in": "formData",
            "type": "string",
            "required": True,
            "description": "帖子 ID，标识要点赞的帖子"
        }
    ]
})
def like_post():
    user_id = request.form.get('user_id')
    post_id = request.form.get('post_id')

    return User.toggle_like_post(user_id, post_id)


@post_bp.route('/favorit', methods=['POST'])
@swag_from({
    "responses": {
        "200": {
            "description": "成功切换帖子收藏状态",
            "schema": {
                "type": "string",
                "enum": ["favoritd", "unfavoritd"],
                "description": "返回的收藏状态，'favoritd' 表示已收藏，'unfavoritd' 表示已取消收藏"
            }
        },
        "400": {
            "description": "操作失败，用户 ID 或帖子 ID 未找到",
            "schema": {
                "type": "string",
                "description": "错误信息"
            },
            "examples": {
                "application/json": "操作失败"
            }
        }
    },
    "tags": ["Post"],
    "summary": "切换帖子收藏状态",
    "description": "用户通过提交用户 ID 和帖子 ID 来切换帖子的收藏状态，成功后返回当前的收藏状态。",
    "parameters": [
        {
            "name": "user_id",
            "in": "formData",
            "type": "string",
            "required": True,
            "description": "用户 ID，标识收藏的用户"
        },
        {
            "name": "post_id",
            "in": "formData",
            "type": "string",
            "required": True,
            "description": "帖子 ID，标识要收藏的帖子"
        }
    ]
})
def favorit_post():
    user_id = session['id']
    post_id = request.form.get('post_id')

    return User.toggle_favorit_post(user_id, post_id)


@post_bp.route('/follow', methods=['POST'])
@swag_from({
    "responses": {
        "200": {
            "description": "成功切换关注状态",
            "schema": {
                "type": "string",
                "enum": ["followed", "unfollowed"],
                "description": "返回的关注状态，'followed' 表示已关注，'unfollowed' 表示已取消关注"
            }
        },
        "400": {
            "description": "操作失败，用户 ID 或作曲家 ID 未找到",
            "schema": {
                "type": "string",
                "description": "错误信息"
            },
            "examples": {
                "application/json": "操作失败"
            }
        }
    },
    "tags": ["Post"],
    "summary": "切换关注状态",
    "description": "用户通过提交作曲家 ID 来切换对该作曲家的关注状态，成功后返回当前的关注状态。",
    "parameters": [
        {
            "name": "composer_id",
            "in": "formData",
            "type": "string",
            "required": True,
            "description": "作曲家 ID，表示要关注的作曲家"
        }
    ]
})
def follow():
    user = get_current_user()
    composer_id = request.form.get('composer_id')
    result = user.toggle_follow(composer_id)
    return result


def is_valid_list(mention_list):
    return any(m.strip() != '' for m in mention_list)

@post_bp.route('/comment', methods=['POST'])
@swag_from({
    "responses": {
        "200": {
            "description": "成功发表评论",
            "schema": {
                "$ref": "static/definitions.yml#/Comment"
            }
        },
        "400": {
            "description": "请求失败，缺少必要的参数或评论内容为空",
            "schema": {
                "type": "string",
                "description": "错误信息"
            },
            "examples": {
                "application/json": "缺少参数"
            }
        }
    },
    "tags": ["Post"],
    "summary": "发表评论",
    "description": "用户可以对帖子发表评论，提供目标帖子 ID 和评论内容，成功后返回评论的详细信息。",
    "parameters": [
        {
            "name": "target_id",
            "in": "formData",
            "type": "integer",
            "required": True,
            "description": "被评论的目标帖子的 ID"
        },
        {
            "name": "comment",
            "in": "formData",
            "type": "string",
            "required": True,
            "description": "评论内容"
        }
    ]
})
def comment():
    target_id = request.form['target_id']
    comment_text = request.form['comment']
    mention = request.form.getlist('mention_list')
    comment = Comment.comment(target_id, comment_text, session['id'])

    if is_valid_list(mention):
        users = User.query.filter(User.id.in_(mention)).all()
        comment.mentions = [Mention(user=u) for u in users]
        db.session.commit()

    if comment.is_assignment_submission:
        parent = comment.parent_target
        parent_dict = {"Title": parent.title, "Content": parent.content}

        async_review_assignment.delay(str(parent_dict), comment.content, comment.id)
    elif comment.is_at_ai:
        post = Post.query.get(comment.get_post_id())
        generate_in_context.delay(comment.content, str(PostSchema().dump(post)), comment.id)

    return CommentSchema().dump(comment)


@post_bp.route('/like_comment', methods=['POST'])
@swag_from({
    "responses": {
        "200": {
            "description": "成功切换评论的点赞状态",
            "schema": {
                "type": "string",
                "enum": ["liked", "unliked"],
                "description": "返回的评论点赞状态，'liked' 表示已点赞，'unliked' 表示已取消点赞"
            }
        },
        "404": {
            "description": "评论未找到",
            "schema": {
                "type": "string",
                "description": "错误信息"
            },
            "examples": {
                "application/json": "comment not found"
            }
        }
    },
    "tags": ["Post"],
    "summary": "切换评论的点赞状态",
    "description": "用户通过提交评论 ID 来切换评论的点赞状态，成功后返回当前的点赞状态。如果评论不存在，返回 404 错误。",
    "parameters": [
        {
            "name": "comment_id",
            "in": "formData",
            "type": "integer",
            "required": True,
            "description": "评论 ID，表示要点赞的评论"
        }
    ]
})
def liked_comment():
    user = get_current_user()
    comment_id = request.form.get('comment_id')
    comment = Comment.query.get(comment_id)
    if comment:
        if comment.toggle_like(user):
            return 'liked'
        else:
            return 'unliked'
    else:
        return 'comment not found', 404


@post_bp.route('/<int:id>')
@swag_from({
    "responses": {
        "200": {
            "description": "成功获取帖子详情",
            "schema": {
                "$ref": "static/definitions.yml#/Post"
            }
        },
        "404": {
            "description": "帖子未找到",
            "schema": {
                "type": "string",
                "description": "错误信息"
            },
            "examples": {
                "application/json": "Post Not Found"
            }
        }
    },
    "tags": ["Post"],
    "summary": "获取帖子详情",
    "description": "用户可以通过帖子 ID 获取特定帖子的详情信息。若帖子不存在，返回 404 错误。",
    "parameters": [
        {
            "name": "id",
            "in": "path",
            "type": "integer",
            "required": True,
            "description": "要查询的帖子 ID"
        }
    ]
})
def a_post(id):
    post = Post.query.get(id)
    if not post:
        return "Post Not Found", 404

    return jsonify(PostSchema().dump(post))


@post_bp.route('/add_tag', methods=['POST'])
@swag_from({
    "summary": "Add a new tag",
    "description": "This endpoint allows you to create a new tag by providing a tag name.",
    "tags": ["Post"],
    "parameters": [
        {
            "name": "tag",
            "in": "formData",
            "type": "string",
            "required": True,
            "description": "The name of the tag to be added."
        }
    ],
    "responses": {
        "200": {
            "description": "Tag added successfully.",
        },
        "400": {
            "description": "Invalid input or tag creation failed."
        }
    }
})
def add_tag():
    tag_name = request.form.get('tag')
    tag = Tag(name=tag_name)
    try:
        tag.add()
        return jsonify({"tag_id": tag.id})
    except sqlalchemy.exc.IntegrityError:
        return "Tag already exists", 400


@post_bp.route('/add_image', methods=['POST'])
def add_image():
    file = request.files.get('image')
    if file and file.filename:
        image = Image.save_image(file, None)
        return image.url
    else:
        return "Image Not Found", 404


@post_bp.route('/comment/<int:id>')
def get_comment(id):
    parent_comment = Comment.query.get_or_404(id)
    comment_dict = CommentSchema().dump(parent_comment)
    return jsonify(comment_dict)


@post_bp.route('/comment/all')
def get_all_comments():
    user = get_current_user()
    user_comments = user.get_my_comments()
    return jsonify(CommentSchema(many=True).dump(user_comments))


@post_bp.route('/my/all')
def get_all_posts():
    user = get_current_user()
    user_posts = Post.query.filter(Comment.author_id == user.id).all()
    return jsonify(PostSchema(many=True).dump(user_posts))


@post_bp.route('/get_notifications')
def get_notifications():
    user = get_current_user()
    ReplyTargetAlias = aliased(ReplyTarget)
    user_reply = (
        Comment.query
        .join(ReplyTargetAlias, Comment.parent_target)
        .filter(ReplyTargetAlias.author_id == user.id)
        .all()
    )

    user_mention = user.mentions

    # 3. 构建统一格式
    notifications = []

    for comment in user_reply:
        post_id = comment.get_post_id()
        post_title = Post.query.get(post_id).title
        notifications.append({
            "id": comment.id,
            "type": "replied",
            "created_at": comment.created_at,
            "created_by": UserSchema(only=['username', 'avatar', 'id']).dump(comment.author),
            "post_id": post_id,
            "post_title": post_title,
            "read": comment.read,
            "content": comment.content,
            "comment_id": comment.id
        })

    for mention in user_mention:
        post_id = mention.target_id
        post_title = ""
        if mention.target.type == "post":
            post_title = Post.query.get(post_id).title
        notifications.append({
            "id": mention.id,
            "type": "mentioned",
            "created_at": mention.created_at,
            "created_by": UserSchema(only=['username', 'avatar', 'id']).dump(mention.target.author),
            "post_id": post_id,
            "post_title": post_title,
            "read": mention.read

        })

    # 4. 按时间倒序排序
    notifications.sort(key=lambda x: x["created_at"], reverse=True)

    return jsonify(notifications)


@post_bp.route('/read/<int:id>')
def read_post(id):
    mention = Mention.query.get(id)
    if mention:
        mention.read = True
        db.session.commit()
    else:
        comment = Comment.query.get_or_404(id)
        comment.read = True
        db.session.commit()

    return "success", 200


@post_bp.route('/get_post_id_by_comment_id')
def get_post_id_by_comment_id():
    comment = Comment.query.get_or_404(request.args.get('comment_id'))
    return jsonify({"id": comment.get_post_id()})
