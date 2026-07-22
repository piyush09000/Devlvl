from datetime import datetime, date, timedelta
from app.extensions import db
from app.models.user import User

def record_daily_completion(user_id, today_date=None):
    """
    Records that a user has completed their daily task.
    Implements streak rules: consecutive days, timezone-aware, freezes, idempotency.
    """
    # For MVP, we assume server time. To do timezone-aware properly, 
    # we would use pytz or python 3.9+ zoneinfo and user.timezone.
    # We will use UTC as default.
    today = today_date or datetime.utcnow().date()
    
    user = db.session.get(User, user_id)
    if not user:
        return
        
    if user.last_completed_date == today:
        # Idempotency: Already completed today, do nothing.
        return
        
    if user.last_completed_date:
        days_diff = (today - user.last_completed_date).days
        
        if days_diff == 1:
            # Completed yesterday -> increment streak
            user.current_streak += 1
        elif days_diff == 2 and user.streak_freezes > 0:
            # Missed exactly 1 day and has a freeze -> consume freeze, increment streak for today
            user.streak_freezes -= 1
            # Current streak remains intact for the missed day, and increments for today
            user.current_streak += 1
        else:
            # Missed >1 day without freeze -> reset streak
            user.current_streak = 1
    else:
        # First completion ever
        user.current_streak = 1
        
    user.longest_streak = max(user.longest_streak, user.current_streak)
    user.last_completed_date = today
    
    # Award freeze for 7-day streaks
    if user.current_streak % 7 == 0 and user.streak_freezes < 2:
        user.streak_freezes += 1
        
    # Badge triggers
    from app.services.badge_service import check_and_award_badge
    if user.current_streak >= 7:
        check_and_award_badge(user_id, 'streak_7')
    if user.current_streak >= 30:
        check_and_award_badge(user_id, 'streak_30')
        
    db.session.commit()
