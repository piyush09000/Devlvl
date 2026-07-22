from flask import Blueprint

problems_bp = Blueprint('problems', __name__)

from . import routes
