"""Encrypt note title

Revision ID: 61facccc16d1
Revises: 48212c8b9f3d
Create Date: 2025-11-23 00:02:37.586279

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '61facccc16d1'
down_revision: Union[str, Sequence[str], None] = '48212c8b9f3d'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # encrypted_title already created in first migration
    # This migration is mainly a placeholder
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass

