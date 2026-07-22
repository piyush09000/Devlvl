import os
from dotenv import load_dotenv

# Load .env explicitly so Celery gets the Redis URLs before initializing
load_dotenv()

from app import create_app
from app.extensions import celery

# Creating the app configures celery.conf.update(...) internally
app = create_app()

app.app_context().push()
