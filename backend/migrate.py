#!/usr/bin/env python3
"""
Database migration script for AWS deployment.
Run this once to initialize the database schema.
"""
import sys
import logging
from alembic.config import Config
from alembic import command

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def run_migrations():
    """Run Alembic migrations to upgrade database to latest version."""
    try:
        logger.info("🔄 Starting database migration...")
        
        # Create Alembic configuration
        alembic_cfg = Config("alembic.ini")
        
        # Run upgrade to head
        command.upgrade(alembic_cfg, "head")
        
        logger.info("✅ Database migration completed successfully!")
        return 0
        
    except Exception as e:
        logger.error(f"❌ Migration failed: {e}")
        return 1

if __name__ == "__main__":
    sys.exit(run_migrations())
