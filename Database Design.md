
数据库设计文档

1. 用户表（Users）

存储用户的基本信息，包括管理员、老师、学生。

| 字段名 | 数据类型 | 说明 |
| --- | --- | --- |
| id | INT (PK) | 用户ID，自增主键 |
| username | VARCHAR(255) | 唯一用户名 |
| password | VARCHAR(255) | 加密存储密码 |
| role | ENUM | 角色（管理员、老师、学生） |
| register_time | DATETIME | 注册时间 |
| avatar | TEXT | 头像URL，可为空 |
| status | ENUM | 账号状态（正常/封禁） |
| charity_org | VARCHAR(255) | 所属慈善机构（仅老师可有） |


2. 课程表（Courses）

存储课程的基本信息。

| 字段名 | 数据类型 | 说明 |
| --- | --- | --- |
| id | INT (PK) | 课程ID，自增主键 |
| title | VARCHAR(255) | 课程名称 |
| overview | TEXT | 课程概述 |
| objective | TEXT | 授课目标 |
| syllabus | TEXT | 课程大纲 |
| resources | TEXT | 参考资料链接 |
| teacher_id | INT (FK) | 关联授课老师ID |
| open_time | DATETIME | 课程开放时间 |
| status | ENUM | 状态（待审核/已发布/已下架） |
| rating | FLOAT | 课程评分（平均分） |
| student_count | INT | 课程报名学生数 |

3. 课程资源表（CourseResources）

存储课程的视频、PPT、作业等资源。

| 字段名 | 数据类型 | 说明 |
| --- | --- | --- |
| id | INT (PK) | 资源ID，自增主键 |
| course_id | INT (FK) | 关联课程ID |
| resource_type | ENUM | 资源类型（视频/PPT/作业） |
| url | TEXT | 资源存储路径（URL） |

4. 课程报名表（CourseEnrollments）

存储学生报名课程的信息。

| 字段名 | 数据类型 | 说明 |
| --- | --- | --- |
| id | INT (PK) | 记录ID，自增主键 |
| student_id | INT (FK) | 关联学生ID |
| course_id | INT (FK) | 关联课程ID |
| progress | FLOAT | 课程学习进度（0-100%） |
| score | FLOAT | 课程成绩 |

5. 课程评价表（CourseReviews）

存储学生对课程的评分和评价。

| 字段名 | 数据类型 | 说明 |
| --- | --- | --- |
| id | INT (PK) | 评价ID，自增主键 |
| student_id | INT (FK) | 关联学生ID |
| course_id | INT (FK) | 关联课程ID |
| rating | INT | 评分（1-5星） |
| comment | TEXT | 评价内容 |
| created_at | DATETIME | 评价时间 |

6. 作业/测验表（Assignments）

存储作业和考试信息。

| 字段名 | 数据类型 | 说明 |
| --- | --- | --- |
| id | INT (PK) | 作业ID，自增主键 |
| course_id | INT (FK) | 关联课程ID |
| title | VARCHAR(255) | 作业标题 |
| description | TEXT | 作业描述 |
| due_date | DATETIME | 截止日期 |

7. 作业提交表（Submissions）

存储学生提交的作业及批改信息。

| 字段名 | 数据类型 | 说明 |
| --- | --- | --- |
| id | INT (PK) | 提交ID，自增主键 |
| assignment_id | INT (FK) | 关联作业ID |
| student_id | INT (FK) | 关联学生ID |
| file_url | TEXT | 提交文件地址 |
| score | FLOAT | 作业得分 |
| feedback | TEXT | 批改反馈 |
| graded_by | INT (FK) | 批改人（老师ID） |

8. 课程讨论区表（Discussions）

存储课程讨论区的帖子。

| 字段名 | 数据类型 | 说明 |
| --- | --- | --- |
| id | INT (PK) | 讨论ID，自增主键 |
| course_id | INT (FK) | 关联课程ID |
| user_id | INT (FK) | 关联用户ID（学生或老师） |
| content |  | 讨论内容（支持多种形式，TEXT/富文本...) |
| created_at | DATETIME | 发布时间 |

9. 课程讨论回复表（DiscussionReplies）

存储讨论区的回复内容。

| 字段名 | 数据类型 | 说明 |
| --- | --- | --- |
| id | INT (PK) | 回复ID，自增主键 |
| discussion_id | INT (FK) | 关联讨论ID |
| user_id | INT (FK) | 关联用户ID（学生或老师） |
| content |  | 回复内容（支持多种形式，TEXT/富文本...) |
| created_at | DATETIME | 回复时间 |

10. 权限表（Permissions）

存储不同用户的权限。

| 字段名 | 数据类型 | 说明 |
| --- | --- | --- |
| id | INT (PK) | 权限ID，自增主键 |
| role | ENUM | 角色（管理员/老师/学生） |
| permission | TEXT | 拥有的权限描述 |

11. AI 相关表（AIQuestions）

存储学生在AI答疑功能中提出的问题及AI的回答。

| 字段名 | 数据类型 | 说明 |
| --- | --- | --- |
| id | INT (PK) | 记录ID，自增主键 |
| course_id | INT (FK) | 关联课程ID |
| student_id | INT (FK) | 关联学生ID |
| question | TEXT | 学生提问 |
| ai_answer | TEXT | AI回答 |
| created_at | DATETIME | 提问时间 |

