# Prometheus.EDU 🔥: Igniting the Flame of Knowledge for the Underserved

COMP3032J Final Year Project.

## How to run this project

1. Install all dependencies under the project root directory

    ```shell
    npm install
    ```

2. Run the project with the following command

   ```shell
   npm run dev
   ```

3. 安装python环境

   ```shell
   python Doner_backend/set_env.py
   ```

4. 激活环境并运行
   - 在macOS上:

      ```shell
      cd Doner_backend
      source donerenv/bin/activate
      flask run
      ```
   - 在Windows上:

      ```shell
      cd Doner_backend
      donerenv\Scripts\activate
      flask run
      ```

5. admin 管理使用方法：执行第四步后访问 http://127.0.0.1:5000/admin

## 如何使用
   [API文档](http://127.0.0.1:5000/apidocs)

## 常用指令

   ```shell
   pip freeze > requirements.txt
   ```

   ```shell
   pip install -r requirements.txt --no-deps
   ```

## 关于 Athena TA 模块

在运行前，需要在 `Doner_backend/doner` 路径下创建 `.env`，并在其中添加 Google API Key

`.env` 文件的格式应为

```text
GOOGLE_API_KEY="<your_api_key>"
```

