from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import Sequence
db = SQLAlchemy()
shared_sequence = Sequence('shared_id_seq')