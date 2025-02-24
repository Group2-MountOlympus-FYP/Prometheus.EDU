from flask import Blueprint, request, jsonify
from flask_wtf import FlaskForm
from wtforms import StringField
from wtforms.validators import InputRequired

athena_bp = Blueprint('athena', __name__)

# ta_client = TA_Client(api_key="dummy_api_key", directory="docs")


class QueryForm(FlaskForm):
    query = StringField('Query', validators=[InputRequired()])


# @athena_bp.route('/generate', methods=['POST'])
# def generate():
#     """
#     基于 RAG 的生成接口
#     ---
#     tags:
#       - TA Client
#     summary: 基于 RAG 生成答案
#     description: 提供问题查询，返回基于 RAG 的答案。
#     parameters:
#       - name: query
#         in: formData
#         type: string
#         required: true
#         description: 用户查询问题
#     responses:
#       200:
#         description: 成功返回生成的答案
#         schema:
#           type: object
#           properties:
#             result:
#               type: string
#               description: 生成的答案
#     """
#     form = QueryForm()
#     if form.validate_on_submit():
#         query = form.query.data
#         result = ta_client.generate(query)
#         return jsonify({"result": result})
#     return jsonify({"error": "Invalid form data"}), 400
#
#
# @athena_bp.route('/generate_without_rag', methods=['POST'])
# def generate_without_rag():
#     """
#     不使用 RAG 的生成接口
#     ---
#     tags:
#       - TA Client
#     summary: 直接生成答案，不使用 RAG
#     description: 提供问题查询，返回不依赖 RAG 的答案。
#     parameters:
#       - name: query
#         in: formData
#         type: string
#         required: true
#         description: 用户查询问题
#     responses:
#       200:
#         description: 成功返回生成的答案
#         schema:
#           type: object
#           properties:
#             result:
#               type: string
#               description: 生成的答案
#     """
#     form = QueryForm()
#     if form.validate_on_submit():
#         query = form.query.data
#         result = ta_client.generate_without_rag(query)
#         return jsonify({"result": result})
#     return jsonify({"error": "Invalid form data"}), 400
#
#
# @athena_bp.route('/retrieve_documents_only', methods=['POST'])
# def retrieve_documents_only():
#     """
#     仅检索相关文档接口
#     ---
#     tags:
#       - TA Client
#     summary: 检索与查询相关的文档
#     description: 提供问题查询，返回相关的文档列表。
#     parameters:
#       - name: query
#         in: formData
#         type: string
#         required: true
#         description: 用户查询问题
#     responses:
#       200:
#         description: 成功返回相关文档
#         schema:
#           type: object
#           properties:
#             documents:
#               type: array
#               items:
#                 type: string
#               description: 检索到的文档内容
#     """
#     form = QueryForm()
#     if form.validate_on_submit():
#         query = form.query.data
#         documents = ta_client.retrieve_documents_only(query)
#         docs_content = [doc.page_content for doc in documents]
#         return jsonify({"documents": docs_content})
#     return jsonify({"error": "Invalid form data"}), 400
