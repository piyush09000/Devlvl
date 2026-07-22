from app.extensions import db
from app.models.badge import Badge, UserBadge
from app.models.user import User

def check_and_award_badge(user_id, trigger_rule):
    """
    Checks if a user already has a badge for a given trigger_rule, and awards it if not.
    """
    user = db.session.get(User, user_id)
    if not user:
        return False
        
    badge = Badge.query.filter_by(trigger_rule=trigger_rule).first()
    if not badge:
        return False
        
    already_awarded = UserBadge.query.filter_by(user_id=user_id, badge_id=badge.id).first()
    if already_awarded:
        return False
        
    new_badge = UserBadge(user_id=user_id, badge_id=badge.id)
    db.session.add(new_badge)
    
    # Trigger a notification
    from app.services.notification_service import send_notification
    send_notification(user_id, "Badge Unlocked!", f"You earned the {badge.name} badge.", "badge_earned")
    
    return True
