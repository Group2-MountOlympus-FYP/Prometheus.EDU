"""empty message

Revision ID: 53eca223a905
Revises: 5f80918287b0
Create Date: 2025-03-20 16:29:26.894537

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '53eca223a905'
down_revision = '5f80918287b0'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('course', schema=None) as batch_op:
        batch_op.add_column(sa.Column('institution', sa.String(length=100), nullable=False))

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('course', schema=None) as batch_op:
        batch_op.drop_column('institution')

    # ### end Alembic commands ###
