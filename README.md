<div align="center" id="project-logo">
  <img
    src="./prometheus-edu-logo.png"
    width="145"
    height="145"
  />
</div>
<h1 align="center">Prometheus.EDU🔥: Igniting the Flame of Knowledge for the Underserved</h1>

A comprehensive online education platform developed by **Mount Olympus**.

## Problem Statement

Despite ongoing global efforts, many young people still face significant barriers to quality education—ranging from geographical restrictions and gender-based prohibitions to poverty and inadequate local infrastructure. **Agape**, in pursuit of its mission to deliver educational equity, has discovered that existing platforms either do not cater to the specific constraints of these learners or lack the interactive support and guidance necessary for sustained learning success.
Consequently, Agape needs a versatile yet user-friendly solution that not only offers structured course content but also provides real-time support from both educators and AI-based services. This platform must be designed to accommodate various limitations and ensure inclusivity and effectiveness for learners from diverse backgrounds.

## Proposed Solution

**MountOlympus Software Company** will develop **Prometheus.EDU**, a unified learning platform combining video courses, peer interaction, and AI-powered guidance. Prometheus.EDU will contain the following functionalities that address Agape’s needs:

- **Structured Learning via NousTube**: Educational videos and lectures will be curated and hosted on a module called *NousTube*. The user-friendly interface provides functions such as video streaming, learning material distribution, and assignment management.
- **Community Support through MetisHub**: *MetisHub* will serve as the primary forum for discussions, where learners can post questions, exchange ideas, and receive timely assistance. Additionally, they can reach out directly to partnering NGOs for help with study-related challenges, such as financial constraints or access to learning materials.
- **AI-Powered Experience with Athena Intelligence**: Leveraging Retrieval-Augmented Generation (RAG) techniques, *Athena Intelligence* delivers an exceptional learning experience. Athena Intelligence consists of three components:
    - **AthenaTutor**: references approved course content to provide quick and accurate answers to learners’ questions.
    - **AthenaReviewer**: reviews assignments submitted by learners, reducing the need for constant human intervention while maintaining consistent, fact-checked feedback.
    - **AthenaRecommender**: offers search and recommendation functionalities based on course information.
Through **Prometheus.EDU**, **MountOlympus** will deliver an end-to-end educational ecosystem that breaks barriers to access, fosters community collaboration, and leverages cutting-edge AI to support learners across the globe.

## Tech Stack

- **Web Frontend**
    - Next.js + React
    - Mantine
- **Web Backend**
    - Flask
    - Redis
    - PostgreSQL
    - Celery
    - Amazon S3
- **AI Features**
    - LangChain
    - Faiss
    - Gemini 2.0 Flash

## Ethics, Bias, Social Impacts & UN SDGs

### Ethics

We foster a high standard of professional integrity by creating regionally relevant learning materials and transparent user guidelines. Our platform emphasizes respectful communication and responsible conduct, ensuring that educational resources and community interactions align with core ethical values.

### Bias

To mitigate bias, we use balanced, diverse datasets and RAG systems that utilizing credible, vetted sources for constructing the knowledge base. This approach helps minimize skewed outputs and ensures that learners receive fact-based information devoid of prejudiced perspectives.

### Social Impacts

By prioritizing equitable access to quality education, our platform helps expand opportunities for underserved communities. Students benefit from supportive online forums and real-time AI assistance, which can lead to improved career prospects, heightened social mobility, and stronger local economies.

### UN Sustainable Development Goals (SDGs)

Our project aligns with several UN Sustainable Development Goals (SDGs), including:

- **SDG 4 (Quality Education)**: The project provides reliable, high-quality educational content to learners regardless of their geographic or socio-economic constraints.
- **SDG 5 (Gender Equality)**: The project aims to include and empowering girls and women, creating an environment where they can learn free from cultural or systemic limitations.
- **SDG 10 (Reduced Inequalities)**: The project is dedicated to help level the playing field for individuals who lack traditional access to formal education.

## Tips

### Run this project

1. Install all dependencies under the project's root directory

    ```shell
    npm install
    ```

2. Run the project with the following command

   ```shell
   npm run dev
   ```

3. Set up a virtual environment for the backend and set up `$FLASK_APP` and `$FLASK_ENV` to `run.py` and `development/production` respectively

4. Create a `.env` file under the directory `/Doner_backend` with the following environment variables:

   ```text
   GOOGLE_API_KEY=""
   SQLALCHEMY_DATABASE_URI=""
   AWS_ACCESS_KEY_ID=""
   AWS_SECRET_ACCESS_KEY=""
   AWS_DEFAULT_REGION=""
   REDIS_URL=""
   ```

5. Run the project
   - on macOS/Linux:

      ```shell
      cd Doner_backend
      source donerenv/bin/activate # or other virtual environment of your choice
      flask run
      celery -A run.celery_app worker --loglevel=INFO
      ```
   - on Windows:

      ```shell
      cd Doner_backend
      donerenv\Scripts\activate # or other virtual environment of your choice
      flask run
      celery -A run.celery_app worker --loglevel=INFO
      ```

### Login to the admin dashboard

Run the backend of this project and visit http://127.0.0.1:5000/admin

### Swagger API Docs

[API Docs](http://127.0.0.1:5000/apidocs)

### Commands Clips

1. Freeze newly added Python dependencies to `requirements.txt`.
    ```shell
    pip freeze > requirements.txt
    ```
2. Install the Python dependencies this project needs.
   ```shell
   pip install -r requirements.txt
   # or
   pip install -r requirements.txt --no-deps # if you encounter dependency conflict.
   ```

3. Migrate DB
    ```shell
    flask db migrate
    flask db upgrade
    ```


