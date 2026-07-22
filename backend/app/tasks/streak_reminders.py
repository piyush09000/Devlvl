from app.extensions import celery
from app.models.user import User
from app.services.notification_service import send_notification
from datetime import datetime, timedelta

@celery.task
def send_streak_reminders():
    """
    Called daily (e.g., at 6 PM UTC).
    Finds users who haven't completed a task today but have an active streak,
    and sends them a reminder notification based on their tone preference.
    """
    today = datetime.utcnow().date()
    yesterday = today - timedelta(days=1)
    
    # Users with active streaks who haven't completed today's task
    at_risk_users = User.query.filter(
        User.current_streak > 0,
        (User.last_completed_date == yesterday) | 
        ((User.last_completed_date < yesterday) & (User.streak_freezes > 0))
    ).all()
    
    count = 0
    for user in at_risk_users:
        send_notification(
            user.id,
            title="Streak at Risk!",
            type="streak_warning"
        )
        count += 1
        
    return f"Sent {count} streak reminders."
