from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import Sequence

db = SQLAlchemy()
shared_sequence = Sequence('shared_id_seq')

from celery import Celery, Task, shared_task
import os
import boto3


def celery_init_app(app) -> Celery:
    class FlaskTask(Task):
        def __call__(self, *args: object, **kwargs: object) -> object:
            with app.app_context():
                return self.run(*args, **kwargs)

    celery_app = Celery(app.name, task_cls=FlaskTask)
    celery_app.config_from_object(app.config["CELERY"])
    celery_app.set_default()
    app.extensions["celery"] = celery_app
    return celery_app


s3 = boto3.client("s3")
BUCKET_NAME='prometheus.edu'

@shared_task()
def upload_async(local_location, filename):
    s3.upload_file(local_location, BUCKET_NAME, filename)
    os.remove(local_location)
