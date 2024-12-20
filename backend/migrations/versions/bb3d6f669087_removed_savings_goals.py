"""Removed savings goals

Revision ID: bb3d6f669087
Revises: 8ec09f4e42df
Create Date: 2024-10-22 12:47:13.022035

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'bb3d6f669087'
down_revision = '8ec09f4e42df'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('savings_goals')
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('savings_goals',
    sa.Column('id', sa.INTEGER(), nullable=False),
    sa.Column('user_id', sa.INTEGER(), nullable=False),
    sa.Column('goal_name', sa.VARCHAR(length=100), nullable=False),
    sa.Column('target_amount', sa.FLOAT(), nullable=False),
    sa.Column('current_amount', sa.FLOAT(), nullable=True),
    sa.Column('deadline', sa.DATE(), nullable=True),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    # ### end Alembic commands ###
