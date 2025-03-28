"""empty message

Revision ID: ebf2768d783e
Revises: 08717fcb019d
Create Date: 2025-03-26 12:34:05.326306

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'ebf2768d783e'
down_revision = '08717fcb019d'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('comment', schema=None) as batch_op:
        batch_op.drop_constraint('comment_user_id_fkey', type_='foreignkey')
        batch_op.drop_column('user_id')

    with op.batch_alter_table('lecture', schema=None) as batch_op:
        batch_op.add_column(sa.Column('name', sa.String(), nullable=False))
        batch_op.add_column(sa.Column('description', sa.String(), nullable=True))

    with op.batch_alter_table('post', schema=None) as batch_op:
        batch_op.drop_constraint('post_composer_id_fkey', type_='foreignkey')
        batch_op.drop_column('composer_id')

    with op.batch_alter_table('reply_target', schema=None) as batch_op:
        batch_op.add_column(sa.Column('author_id', sa.Integer(), nullable=False,server_default="3"))
        batch_op.create_foreign_key(None, 'user', ['author_id'], ['id'])

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('reply_target', schema=None) as batch_op:
        batch_op.drop_constraint(None, type_='foreignkey')
        batch_op.drop_column('author_id')

    with op.batch_alter_table('post', schema=None) as batch_op:
        batch_op.add_column(sa.Column('composer_id', sa.INTEGER(), autoincrement=False, nullable=False))
        batch_op.create_foreign_key('post_composer_id_fkey', 'user', ['composer_id'], ['id'])

    with op.batch_alter_table('lecture', schema=None) as batch_op:
        batch_op.drop_column('description')
        batch_op.drop_column('name')

    with op.batch_alter_table('comment', schema=None) as batch_op:
        batch_op.add_column(sa.Column('user_id', sa.INTEGER(), autoincrement=False, nullable=True))
        batch_op.create_foreign_key('comment_user_id_fkey', 'user', ['user_id'], ['id'])

    # ### end Alembic commands ###
