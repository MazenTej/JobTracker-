"""added history

Revision ID: 34d6d17c2d17
Revises: 8a09ce2a5c9a
Create Date: 2024-09-26 12:08:31.033185

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '34d6d17c2d17'
down_revision = '8a09ce2a5c9a'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('job_application', schema=None) as batch_op:
        batch_op.drop_column('resume')

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('job_application', schema=None) as batch_op:
        batch_op.add_column(sa.Column('resume', sa.VARCHAR(length=120), nullable=True))

    # ### end Alembic commands ###
