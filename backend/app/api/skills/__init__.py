from flask import Blueprint

skills_bp = Blueprint('skills', __name__)

from . import routes
