from flask import jsonify
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from .login import login_bp
from .extensions import db
from .router import setRoot

import os.path

from .Publish import post_bp
from flask_migrate import Migrate

from .athena import athena_bp

import os


def create_app():
    app = Flask(__name__, static_folder='../static')
    app.debug = True
    app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('SQLALCHEMY_DATABASE_URI')
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['SWAGGER'] = {
        'title': 'Doner API',
        'uiversion': 3
    }
    app.config['MAX_CONTENT_LENGTH'] = 500 * 1024 * 1024  # 50MB
    app.secret_key = 'boyuan'
    migrate = Migrate(app, db)
    setRoot(app)
    app.register_blueprint(login_bp, url_prefix='/login')
    app.register_blueprint(post_bp, url_prefix='/post')
    app.register_blueprint(athena_bp, url_prefix='/athena')


    return app


def register_extensions(app):
    db.init_app(app)

