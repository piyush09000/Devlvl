from app.extensions import celery, db
from app.models.user import User
from app.models.quest import Quest, UserQuest
from datetime import datetime
import random

@celery.task
def rotate_daily_quests():
    """
    Assigns new daily quests to all users at midnight.
    """
    today = datetime.utcnow().date()
    all_users = User.query.all()
    all_quests = Quest.query.all()
    
    if not all_quests:
        return "No quests available in DB."
        
    for user in all_users:
        # Check if user already has quests for today
        existing = UserQuest.query.filter_by(user_id=user.id, assigned_date=today).first()
        if existing:
            continue
            
        # Assign 1 to 3 random quests
        num_quests = random.randint(1, 3)
        selected_quests = random.sample(all_quests, min(num_quests, len(all_quests)))
        
        for q in selected_quests:
            new_uq = UserQuest(
                user_id=user.id,
                quest_id=q.id,
                assigned_date=today
            )
            db.session.add(new_uq)
            
    db.session.commit()
    return f"Assigned quests to {len(all_users)} users."
