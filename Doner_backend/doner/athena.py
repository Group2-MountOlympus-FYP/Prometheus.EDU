from flask import Blueprint, jsonify, send_file
from flask_wtf import FlaskForm
from wtforms import StringField
from wtforms.validators import InputRequired

from .athena_ta_core import TA_Client

from dotenv import load_dotenv
import os

from io import BytesIO
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer 
from reportlab.lib.pagesizes import LETTER
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER


load_dotenv()

athena_bp = Blueprint('athena', __name__)

ta_client = TA_Client(api_key=os.getenv('GOOGLE_API_KEY', ''),
                      directory='./doner/study_materials',
                      model='gemini-2.0-flash')



class QueryForm(FlaskForm):
    query = StringField('Query', validators=[InputRequired()])


@athena_bp.route('/generate', methods=['POST'])
def generate():
    """
    基于 RAG 的生成接口
    ---
    tags:
      - TA Client
    summary: 基于 RAG 生成答案
    description: 提供问题查询，返回基于 RAG 的答案。
    parameters:
      - name: query
        in: formData
        type: string
        required: true
        description: 用户查询问题
    responses:
      200:
        description: 成功返回生成的答案
        schema:
          type: object
          properties:
            result:
              type: string
              description: 生成的答案
    """
    form = QueryForm()
    if form.validate_on_submit():
        query = form.query.data
        result = ta_client.generate(query)
        return jsonify({"result": result})
    return jsonify({"error": "Invalid form data"}), 400


@athena_bp.route('/generate_without_rag', methods=['POST'])
def generate_without_rag():
    """
    不使用 RAG 的生成接口
    ---
    tags:
      - TA Client
    summary: 直接生成答案，不使用 RAG
    description: 提供问题查询，返回不依赖 RAG 的答案。
    parameters:
      - name: query
        in: formData
        type: string
        required: true
        description: 用户查询问题
    responses:
      200:
        description: 成功返回生成的答案
        schema:
          type: object
          properties:
            result:
              type: string
              description: 生成的答案
    """
    form = QueryForm()
    if form.validate_on_submit():
        query = form.query.data
        result = ta_client.generate_without_rag(query)
        return jsonify({"result": result})
    return jsonify({"error": "Invalid form data"}), 400


@athena_bp.route('/retrieve_documents_only', methods=['POST'])
def retrieve_documents_only():
    """
    仅检索相关文档接口
    ---
    tags:
      - TA Client
    summary: 检索与查询相关的文档
    description: 提供问题查询，返回相关的文档列表。
    parameters:
      - name: query
        in: formData
        type: string
        required: true
        description: 用户查询问题
    responses:
      200:
        description: 成功返回相关文档
        schema:
          type: object
          properties:
            documents:
              type: array
              items:
                type: string
              description: 检索到的文档内容
    """
    form = QueryForm()
    if form.validate_on_submit():
        query = form.query.data
        documents = ta_client.retrieve_documents_only(query)
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
    #    Adjust margins and pagesize as desired
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

    # Optionally, create a custom ParagraphStyle
    # e.g., a justified style with extra spacing
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
    flowables.append(Paragraph("TA Report", title_style))
    flowables.append(Spacer(1, 20))  # Spacer(width, height)

    # -- Optional: Add a subheading if you want
    flowables.append(Paragraph("Detailed Step-by-Step Instructions", heading_style))
    flowables.append(Spacer(1, 12))

    # -- Now, split the report text into paragraphs
    #    If your text has natural paragraph breaks, you can split by "\n\n"
    #    or keep it simpler and do line-by-line.
    paragraphs = report_text.strip().split("\n\n")  # Split by double newlines

    for idx, para in enumerate(paragraphs, start=1):
        # Add a heading or bullet for each paragraph if you want enumerated steps
        # e.g., "Step 1:", "Step 2:"
        step_heading = f"<b>Step {idx}:</b> " if len(paragraphs) > 1 else ""

        # Combine the heading with the paragraph text
        replaced_para = para.replace('\n', '<br/>')
        text_with_heading = f"{step_heading}{replaced_para}"

        # Create a Paragraph object with your custom style
        flowables.append(Paragraph(text_with_heading, custom_body_style))
        flowables.append(Spacer(1, 12))

        # Optionally insert a page break after each step if the text is lengthy
        # flowables.append(PageBreak())

    # 5. Build the PDF
    doc.build(flowables)

    # 6. Reset the buffer’s cursor and return
    buffer.seek(0)
    return buffer


@athena_bp.route('/generate_report', methods=['POST'])
def generate_report():
    """
    基于 RAG 的生成报告接口 (PDF)
    ---
    tags:
      - TA Client
    summary: 基于 RAG 生成带有分步骤说明的 PDF 报告
    description: 提供问题查询，返回一个包含详细分步骤说明的 PDF 报告。
    parameters:
      - name: query
        in: formData
        type: string
        required: true
        description: 用户查询问题
    responses:
      200:
        description: 成功返回生成的 PDF 报告
        schema:
          type: file
    """
    form = QueryForm()
    if not form.validate_on_submit():
        return jsonify({"error": "Invalid form data"}), 400

    # 1. Extract user query
    query = form.query.data.strip()

    # 2. Generate the step-by-step report text from your RAG pipeline
    report_text = ta_client.generate_report(query)['result']

    # 3. Build a nicely formatted PDF
    pdf_buffer = build_pdf(report_text)

    # 4. Send the PDF back as a file
    return send_file(
        pdf_buffer,
        as_attachment=True,
        download_name="ta_report.pdf",
        mimetype='application/pdf'
    )

