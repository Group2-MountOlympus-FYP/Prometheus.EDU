<div align="center" id="project-logo">
  <img
    src="https://github.com/Group2-MountOlympus-FYP/Prometheus.EDU/blob/main/prometheus-edu-logo.png"
    width="140"
    height="140"
  />
</div>
<h1 align="center">Prometheus.EDU🔥: Igniting the Flame of Knowledge for the Underserved</h1>

A comprehensive online education platform developed by **Mount Olympus**.

## Problem Statement

Despite ongoing global efforts, many young people still face significant barriers to quality education—ranging from geographical restrictions and gender-based prohibitions to poverty and inadequate local infrastructure. **Agape**, in pursuit of its mission to deliver educational equity, has discovered that existing platforms either do not cater to the specific constraints of these learners or lack the interactive support and guidance necessary for sustained learning success.
Consequently, Agape needs a versatile yet user-friendly solution that not only offers structured course content but also provides real-time support from both educators and an AI-based assistant. This platform must be designed to accommodate various limitations in internet connectivity and device usage, ensuring inclusivity and effectiveness for learners from diverse backgrounds.

## Proposed Solution

**MountOlympus Software Company** will develop **Prometheus.EDU**, a unified learning platform combining video courses, peer interaction, and AI-powered guidance. Prometheus.EDU will contain the following functionalities that address Agape’s needs:

- **Structured Learning via NousTube**: Educational videos and lectures will be curated and hosted on the a module called *NousTube*, with features for taking notes and tracking course completion. The user-friendly interface ensures compatibility with mobile devices and low-bandwidth environments.
- **Community Support through MetisHub**: *MetisHub* will serve as the primary forum for discussions, where learners can post questions, exchange ideas, and receive timely assistance. Additionally, they can reach out directly to partnering NGOs for help regarding study-related hurdles, such as financial constraints or access to learning materials.
- **AI-Powered Assistance with AthenaIntelligence**: Leveraging Retrieval-Augmented Generation (RAG) techniques, *AthenaIntelligence* will reference approved course content to provide quick and accurate answers to learners’ questions. This minimizes the need for constant human intervention while maintaining consistent, fact-checked responses.

Through **Prometheus.EDU**, **MountOlympus** will deliver an end-to-end educational ecosystem that breaks barriers to access, fosters community collaboration, and leverages cutting-edge AI to support learners across the globe.

## Tech Stack

- **Web Frontend**
    - Next.js + React
    - Mantine
- **Web Backend**
    - Flask
- **AI Features**
    - LangChain

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

3. Set up the backend environment using  

   ```shell
   python Doner_backend/set_env.py
   ```

4. Run the project
   - on macOS:

      ```shell
      cd Doner_backend
      source donerenv/bin/activate
      flask run
      ```
   - on Windows:

      ```shell
      cd Doner_backend
      donerenv\Scripts\activate
      flask run
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

### For AthenaTutor Module

在运行前，需要在 `Doner_backend/doner` 路径下创建 `.env`，并在其中添加 Google API Key

`.env` 文件的格式应为

```text
GOOGLE_API_KEY="<your_api_key>"
```

