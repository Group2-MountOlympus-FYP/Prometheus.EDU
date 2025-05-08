from flask import Blueprint, jsonify, send_file, request
from flask_wtf import FlaskForm
from wtforms import StringField
from wtforms.validators import InputRequired

from .athena_ta_core import athena_client

from io import BytesIO
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer 
from reportlab.lib.pagesizes import LETTER
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER


athena_bp = Blueprint('athena', __name__)

class QueryForm(FlaskForm):
    query = StringField('Query', validators=[InputRequired()])


@athena_bp.route('/generate', methods=['POST'])
def generate():
    """基于 RAG 的生成接口"""
    # 首先检查是否是JSON请求
    if request.is_json:
        data = request.get_json()
        if not data or 'query' not in data or not data['query']:
            return jsonify({"error": "Invalid form data"}), 400

        query = data['query']
        result = athena_client.generate(query)
        return jsonify({"result": result})
    
    # 如果不是JSON，尝试表单数据
    form = QueryForm()
    if form.validate_on_submit():
        query = form.query.data
        result = athena_client.generate(query)
        return jsonify({"result": result})
    
    return jsonify({"error": "Invalid form data"}), 400


# 同样修改其他路由处理函数
@athena_bp.route('/generate_without_rag', methods=['POST'])
def generate_without_rag():
    if request.is_json:
        data = request.get_json()
        if not data or 'query' not in data or not data['query']:
            return jsonify({"error": "Invalid form data"}), 400

        query = data['query']
        result = athena_client.generate_without_rag(query)
        # 将AIMessage对象转换为字符串
        if hasattr(result, 'content'):
            result = result.content
        return jsonify({"result": result})
    
    form = QueryForm()
    if form.validate_on_submit():
        query = form.query.data
        result = athena_client.generate_without_rag(query)
        # 将AIMessage对象转换为字符串
        if hasattr(result, 'content'):
            result = result.content
        return jsonify({"result": result})
    
    return jsonify({"error": "Invalid form data"}), 400


@athena_bp.route('/retrieve_documents_only', methods=['POST'])
def retrieve_documents_only():
    if request.is_json:
        data = request.get_json()
        if not data or 'query' not in data or not data['query']:
            return jsonify({"error": "Invalid form data"}), 400

        query = data['query']
        documents = athena_client.retrieve_documents_only(query)
        docs_content = [doc.page_content for doc in documents]
        return jsonify({"documents": docs_content})
    
    form = QueryForm()
    if form.validate_on_submit():
        query = form.query.data
        documents = athena_client.retrieve_documents_only(query)
        docs_content = [doc.page_content for doc in documents]
        return jsonify({"documents": docs_content})
    
    return jsonify({"error": "Invalid form data"}), 400


@athena_bp.route('/generate_in_context', methods=['POST'])
def generate_in_context():
    """基于 RAG 的生成接口"""
    # 首先检查是否是JSON请求
    if request.is_json:
        data = request.get_json()
        if not data or 'query' not in data or not data['query'] or 'context' not in data or not data['context']:
            return jsonify({"error": "Invalid form data"}), 400

        query = data['query']
        context = data['context']
        result = athena_client.generate_in_context(query, context)
        return jsonify({"result": result})

    # 如果不是JSON，尝试表单数据
    form = QueryForm()
    if form.validate_on_submit():
        query = form.query.data
        context = form.context.data
        result = athena_client.generate_in_context(query, context)
        return jsonify({"result": result})

    return jsonify({"error": "Invalid form data"}), 400

