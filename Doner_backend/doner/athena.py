from flask import Blueprint, jsonify, send_file, request
from flask_wtf import FlaskForm
from wtforms import StringField
from wtforms.validators import InputRequired

from .athena_ta_core import athena_client

import os

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
        return jsonify({"result": result})
    
    form = QueryForm()
    if form.validate_on_submit():
        query = form.query.data
        result = athena_client.generate_without_rag(query)
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


def build_pdf(report_text: str) -> BytesIO:
    """
    Build a multi-page PDF in memory using ReportLab with a cleaner layout.
    :param report_text: The text content (e.g., step-by-step instructions) to include in the PDF.
    :return: A BytesIO stream containing the PDF data.
    """
    # 1. Create a buffer for the PDF
    buffer = BytesIO()

    # 2. Configure a SimpleDocTemplate
    doc = SimpleDocTemplate(
        buffer,
        pagesize=LETTER,
        rightMargin=40,
        leftMargin=40,
        topMargin=60,
        bottomMargin=60
    )

    # 3. Setup default and custom styles
    styles = getSampleStyleSheet()

    # Some built-in styles you might use
    title_style = styles["Title"]
    heading_style = styles["Heading2"]
    body_style = styles["BodyText"]

    custom_body_style = ParagraphStyle(
        name="CustomBody",
        parent=body_style,
        alignment=0,  # 0=left, 1=center, 2=right, 4=justify
        fontName="Helvetica",
        fontSize=11,
        leading=14,
        spaceAfter=12,
    )

    # 4. Build the “flowables” list, which will be fed into the document
    flowables = []

    # -- Title
    #   Centered by default in "Title", or you can override alignment here
    title_style.alignment = TA_CENTER
    flowables.append(Paragraph("AthenaTutor Report", title_style))
    flowables.append(Spacer(1, 20))  # Spacer(width, height)

    flowables.append(Paragraph("Detailed Step-by-Step Instructions", heading_style))
    flowables.append(Spacer(1, 12))

    # -- Now, split the report text into paragraphs
    paragraphs = report_text.strip().split("\n\n")  # Split by double newlines

    for idx, para in enumerate(paragraphs, start=1):
        step_heading = f"<b>Step {idx}:</b> " if len(paragraphs) > 1 else ""

        # Combine the heading with the paragraph text.
        replaced_para = para.replace('\n', '<br/>')
        text_with_heading = f"{step_heading}{replaced_para}"

        # Create a Paragraph object with your custom style
        flowables.append(Paragraph(text_with_heading, custom_body_style))
        flowables.append(Spacer(1, 12))

    # 5. Build the PDF
    doc.build(flowables)

    # 6. Reset the buffer’s cursor and return
    buffer.seek(0)
    return buffer


@athena_bp.route('/generate_report', methods=['POST'])
def generate_report():
    if request.is_json:
        data = request.get_json()
        if not data or 'query' not in data or not data['query']:
            return jsonify({"error": "Invalid form data"}), 400

        query = data['query']
        report_text = athena_client.generate_report(query)['result']
        pdf_buffer = build_pdf(report_text)

        return send_file(
            pdf_buffer,
            as_attachment=True,
            download_name="ta_report.pdf",
            mimetype='application/pdf'
        )
    
    form = QueryForm()
    if not form.validate_on_submit():
        return jsonify({"error": "Invalid form data"}), 400

    query = form.query.data.strip()
    report_text = athena_client.generate_report(query)['result']
    pdf_buffer = build_pdf(report_text)

    return send_file(
        pdf_buffer,
        as_attachment=True,
        download_name="ta_report.pdf",
        mimetype='application/pdf'
    )


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

