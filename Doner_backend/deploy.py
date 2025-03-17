import os
import sys
import subprocess
import platform

# 虚拟环境的名称或路径
venv_name = "donerenv"  # 可以根据需要自定义虚拟环境的名字

# 确保我们是在项目目录下
project_dir = os.getcwd()

# 创建虚拟环境
def create_virtualenv():
    venv_path = os.path.join(project_dir, venv_name)

    # 检查虚拟环境是否已存在
    if not os.path.exists(venv_path):
        print(f"Creating virtual environment in: {venv_path}")
        subprocess.check_call([sys.executable, "-m", "venv", venv_path])
    else:
        print(f"Virtual environment already exists in: {venv_path}")

# 安装依赖（如果有 requirements.txt）
def install_requirements():
    print("Installing requirements...")
    if os.path.exists("requirements.txt"):
        print("Installing requirements from requirements.txt...")
        subprocess.check_call(
            [os.path.join(venv_name, 'bin', 'pip'), "install", "-r", "requirements.txt", "--no-deps"])

# 激活虚拟环境并设置环境变量
def activate_virtualenv():
    # 对于 Ubuntu 系统，修改 activate 脚本
    activate_script = os.path.join(venv_name, "bin", "activate")

    flask_env_variables = """
        export FLASK_ENV=production
        export FLASK_APP=run.py
        export FLASK_DEBUG=0
        export SQLALCHEMY_DATABASE_URI="postgresql://postgres:boyr_8170@vhboyr.com:5432/doner"
    """

    # 打开并写入环境变量到 activate 脚本
    with open(activate_script, 'a') as file:
        file.write(flask_env_variables)
    print(f"Added environment variables to {activate_script}")

# 使用 Supervisor 启动或重启 Flask 应用


if __name__ == "__main__":
    if platform.system() == 'Linux':
        project_dir = os.getcwd()
        create_virtualenv()
        install_requirements()
        activate_virtualenv()
    else:
        print("This script is designed to run on Ubuntu Linux.")