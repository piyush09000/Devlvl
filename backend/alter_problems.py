"""
alter_problems.py — Adds new columns to the existing `problems` table on Neon DB.
Safe to run multiple times — uses IF NOT EXISTS pattern via raw SQL.
"""
from app import create_app
from app.extensions import db

app = create_app()

NEW_COLUMNS = [
    ("topics",                "JSONB DEFAULT '[]'::jsonb"),
    ("source",                "VARCHAR(100)"),
    ("input_format",          "TEXT"),
    ("output_format",         "TEXT"),
    ("constraints",           "TEXT"),
    ("video_explanation_url", "VARCHAR(500)"),
    ("related_problem_ids",   "JSONB DEFAULT '[]'::jsonb"),
    ("status",                "VARCHAR(50) DEFAULT 'Published'"),
    ("likes",                 "INTEGER DEFAULT 0"),
    ("bookmarks",             "INTEGER DEFAULT 0"),
    ("custom_checker",        "TEXT"),
    ("course_id",             "INTEGER REFERENCES courses(id)"),
    ("module_id",             "INTEGER REFERENCES modules(id)"),
]

with app.app_context():
    conn = db.engine.connect()
    for col_name, col_def in NEW_COLUMNS:
        try:
            conn.execute(db.text(f"ALTER TABLE problems ADD COLUMN IF NOT EXISTS {col_name} {col_def}"))
            conn.commit()
            print(f"  Added column: problems.{col_name}")
        except Exception as e:
            conn.rollback()
            print(f"  Skipped {col_name}: {e}")
    conn.close()
    print("Done. problems table updated.")
