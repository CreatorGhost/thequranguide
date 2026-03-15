"""add surah_insights table

Revision ID: 26084ced52fb
Revises: 
Create Date: 2026-03-13 00:46:44.391764

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql


# revision identifiers, used by Alembic.
revision: str = '26084ced52fb'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "surah_insights",
        sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
        sa.Column("surah", sa.Integer(), nullable=False),
        sa.Column("version", sa.Integer(), nullable=False, server_default="1"),
        sa.Column("content", postgresql.JSONB(), nullable=False),
        sa.Column("word_count", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("model_used", sa.String(50), nullable=False, server_default="sonnet"),
        sa.Column("generated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("surah"),
    )
    op.create_index("ix_surah_insights_surah", "surah_insights", ["surah"])


def downgrade() -> None:
    op.drop_index("ix_surah_insights_surah", table_name="surah_insights")
    op.drop_table("surah_insights")
