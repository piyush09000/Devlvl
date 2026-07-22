from flask import jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.extensions import db
from app.models.submission import Submission
from app.models.progression import XPEvent
from sqlalchemy import func
from datetime import datetime, timedelta
from . import analytics_bp

@analytics_bp.route('/overview', methods=['GET'])
@jwt_required()
def get_analytics_overview():
    current_user_id = get_jwt_identity()
    
    # Problems solved
    solved_count = Submission.query.filter_by(user_id=current_user_id, status='Accepted').count()
    
    # Weekly XP
    one_week_ago = datetime.utcnow() - timedelta(days=7)
    recent_xp_events = XPEvent.query.filter(
        XPEvent.user_id == current_user_id,
        XPEvent.created_at >= one_week_ago
    ).all()
    
    total_weekly_xp = sum([e.amount for e in recent_xp_events])
    
    # Simple daily breakdown (last 7 days)
    daily_xp = [0] * 7
    for e in recent_xp_events:
        days_ago = (datetime.utcnow() - e.created_at).days
        if 0 <= days_ago < 7:
            daily_xp[6 - days_ago] += e.amount

    return jsonify({
        'solved_count': solved_count,
        'total_weekly_xp': total_weekly_xp,
        'weekly_xp_chart': daily_xp
    }), 200
