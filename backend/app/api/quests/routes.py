from flask import request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models.quest import UserQuest
from . import quests_bp

@quests_bp.route('/daily', methods=['GET'])
@jwt_required()
def get_daily_quests():
    current_user_id = get_jwt_identity()
    quests = UserQuest.query.filter_by(user_id=current_user_id).all()
    # Assuming we return today's quests
    return jsonify([q.to_dict() for q in quests]), 200
