"""
create_tables.py — Create all new LMS tables directly using SQLAlchemy.
This is safe to run on an existing DB — it only creates tables that don't exist yet.
"""
from app import create_app
from app.extensions import db

app = create_app()

with app.app_context():
    db.create_all()
    print("All tables created (new ones added, existing ones skipped).")
