"""add job application  migration

Revision ID: c84d7752f2ec
Revises: c6a7c6c8d509
Create Date: 2024-09-25 16:12:09.528576

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'c84d7752f2ec'
down_revision = 'c6a7c6c8d509'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('job_application',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=False),
    sa.Column('company', sa.String(length=120), nullable=False),
    sa.Column('job_title', sa.String(length=120), nullable=False),
    sa.Column('status', sa.String(length=50), nullable=False),
    sa.Column('date_applied', sa.Date(), nullable=False),
    sa.Column('notes', sa.Text(), nullable=True),
    sa.Column('resume', sa.String(length=120), nullable=True),
    sa.ForeignKeyConstraint(['user_id'], ['user.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('job_application')
    # ### end Alembic commands ###
