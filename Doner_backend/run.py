# run.py
from dotenv import load_dotenv

load_dotenv()


from doner import create_app, register_extensions
from doner.extensions import db
from flasgger import Swagger

app, celery_app = create_app()
register_extensions(app)
with app.app_context():
    db.create_all()

swa = Swagger(app)

if __name__ == '__main__':
    app.run()
