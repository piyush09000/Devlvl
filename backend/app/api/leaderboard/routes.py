from flask import jsonify
from app.services.leaderboard_service import leaderboard_service
from . import leaderboard_bp

@leaderboard_bp.route('/global', methods=['GET'])
def get_global_leaderboard():
    results = leaderboard_service.get_global_leaderboard()
    return jsonify(results), 200

@leaderboard_bp.route('/guild/<int:guild_id>', methods=['GET'])
def get_guild_leaderboard(guild_id):
    results = leaderboard_service.get_guild_leaderboard(guild_id)
    return jsonify(results), 200
