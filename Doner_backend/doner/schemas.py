# schemas.py
from marshmallow_sqlalchemy import SQLAlchemyAutoSchema
from marshmallow_sqlalchemy.fields import Nested
from marshmallow.fields import Integer, String, Float, Boolean, List, Dict

from .Course import Course, Enrollment
from .ReplyTarget import Tag
from .User import User
from .Post import Post
from .Comment import Comment
from .ActivityLog import ActivityLog
from .Image import Image
from .Lecture import Lecture, Resource
import yaml
import os



class CommentSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = Comment
        include_relationships = True




class ImageSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = Image
        load_instance = True


class PostSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = Post
        # include_fk=True 可以让外键也暴露在序列化结果中，比如 user_id
        include_relationships = True

    images = Nested(ImageSchema, many=True,)
    comments = Nested(CommentSchema, many=True)


class LightCourseSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = Course


class EnrollmentSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = Enrollment
        include_relationships = True

    course = Nested(LightCourseSchema)


class UserSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = User
        include_relationships = True

    enrollments = Nested(EnrollmentSchema, many=True)


class ActivityLogSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = ActivityLog
        include_fk = True
        load_instance = True


class TagSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = Tag


class ResourceSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = Resource
        include_relationships = True


class LectureSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = Lecture
        include_relationships = True

    resources = Nested(ResourceSchema, many=True)
    posts = Nested(PostSchema, many=True)
    author = Nested(UserSchema, exclude=["password_hash"])


class CourseSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = Course
        include_relationships = True

    lectures = Nested(LectureSchema, many=True)


# 定义一个映射表，key 是字段类型，value 是对应的 JSON 类型字符串
FIELD_TO_JSON_TYPE = {
    String: "string",
    Integer: "integer",
    Boolean: "boolean",
    List: "array",
    Nested: "array",
    Dict: "object",
    # 其他类型可以按需添加
}


def map_field_to_json_type(field):
    """
    根据字段类型返回对应的 JSON 类型字符串。
    如果字段类型不在映射表中，返回 None。
    """
    for field_type, json_type in FIELD_TO_JSON_TYPE.items():
        if isinstance(field, field_type):
            return json_type
    return "string"  # 如果未找到匹配类型，返回 None


def get_type_string(field_name):
    """
    根据字段名是否在指定列表中返回相应类型。
    如果字段名在列表中，则返回 "integer"；否则，返回字段名的路径格式。

    :param field_name: 字段名，字符串类型
    :return: 字符串，表示字段类型或路径格式
    """
    # 判断字段名是否在需要检查的列表中
    if field_name.rstrip('s').lower() in ['liked_by', 'favorited_by']:
        return {"type": "integer"}  # 如果字段名在列表中，返回 "integer"

    # 否则，返回根据 field_name 格式化后的路径
    return {"$ref": f"#/{field_name.rstrip('s').capitalize()}"}


def get_schema_dict(Schema):
    declared_fields = Schema._declared_fields
    return {
        "type": "object",
        "properties": {
            field_name: {
                "type": map_field_to_json_type(field),
                **(
                    {"items": get_type_string(field_name)}
                    if map_field_to_json_type(field) == "array" else {}
                )
            }

            for field_name, field in declared_fields.items()
        }
    }


def save_dict_as_yaml(name, schema_dict):
    # 将字典转换成 YAML 格式
    schema_yaml = yaml.dump(schema_dict, sort_keys=False)

    # 创建保存的目录路径
    save_dir = "static"

    # 目标文件路径
    save_path = os.path.join(save_dir, name + ".yml")
    # 将 YAML 写入文件
    with open(save_path, "w") as file:
        file.write(schema_yaml)


save_dict_as_yaml("definitions", {
    "Post": get_schema_dict(PostSchema),
    "User": get_schema_dict(UserSchema),
    "ActivityLog": get_schema_dict(ActivityLogSchema),
    "Image": get_schema_dict(ImageSchema),
    "Comment": get_schema_dict(CommentSchema),
    "Course": get_schema_dict(CourseSchema),
    "Tag": get_schema_dict(TagSchema)
})
