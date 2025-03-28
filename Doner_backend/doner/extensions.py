from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import Sequence
from celery import Celery

db = SQLAlchemy()
shared_sequence = Sequence('shared_id_seq')
celery = None


def make_celery(app):
    celery_temp = Celery(
        main=app.import_name,
        backend='redis://shawarma-wrze6a.serverless.apse1.cache.amazonaws.com:6379/0',
        broker='redis://shawarma-wrze6a.serverless.apse1.cache.amazonaws.com:6379/0'
    )
    celery_temp.conf.update(app.config)

    class ContextTask(celery_temp.Task):
        def __call__(self, *args, **kwargs):
            with app.app_context():
                return self.run(*args, **kwargs)

    celery_temp.Task = ContextTask

    celery = celery_temp