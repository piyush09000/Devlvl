from flask import Blueprint

learning_bp = Blueprint('learning', __name__)

from . import routes
