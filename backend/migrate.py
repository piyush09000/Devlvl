"""
migrate.py — Run Flask-Migrate without going through wsgi.py (avoids Eventlet conflict).
Usage:
    python migrate.py init      # First time only
    python migrate.py migrate   # Generate a new migration
    python migrate.py upgrade   # Apply to DB
"""
import sys
from app import create_app
from app.extensions import db
from flask_migrate import Migrate, init, migrate, upgrade, stamp

app = create_app()
flask_migrate = Migrate(app, db)

cmd = sys.argv[1] if len(sys.argv) > 1 else 'upgrade'

with app.app_context():
    if cmd == 'init':
        init()
    elif cmd == 'migrate':
        migrate(message=sys.argv[2] if len(sys.argv) > 2 else 'auto migration')
    elif cmd == 'upgrade':
        upgrade()
    elif cmd == 'stamp':
        stamp()
    else:
        print(f"Unknown command: {cmd}. Use: init | migrate | upgrade | stamp")
