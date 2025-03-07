import pytest
from run import app


@pytest.fixture
def client():
    # 创建 Flask 测试客户端
    with app.test_client() as client:
        yield client


def test_flask_startup(client):
    # 测试是否可以正常启动并访问根路由
    response = client.get('/')
    assert response.status_code == 200  # 确保返回 200 状态码


def test_admin_access(client):
    # 访问 /admin 确保返回 200 状态码
    response = client.get('/admin')
    assert response.status_code == 200

