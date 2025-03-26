"""empty message

Revision ID: dfc8da28184e
Revises: b62fd107e3ba
Create Date: 2025-03-26 17:58:47.591736

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'dfc8da28184e'
down_revision = 'b62fd107e3ba'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('lecture', schema=None) as batch_op:
        batch_op.drop_constraint('lecture_teacher_id_fkey', type_='foreignkey')
        batch_op.drop_column('teacher_id')

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('lecture', schema=None) as batch_op:
        batch_op.add_column(sa.Column('teacher_id', sa.INTEGER(), autoincrement=False, nullable=True, comment='授课教师ID'))
        batch_op.create_foreign_key('lecture_teacher_id_fkey', 'user', ['teacher_id'], ['id'])

    # ### end Alembic commands ###
