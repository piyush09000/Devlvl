from app.extensions import db
from app.models.quest import UserQuest
from app.services.xp_service import award_xp

def update_quest_progress(user_id, quest_type, amount=1):
    """
    Updates progress for today's active quests matching the given quest_type.
    """
    active_quests = UserQuest.query.filter_by(
        user_id=user_id,
        is_completed=False
    ).all()
    
    for uq in active_quests:
        if uq.quest.quest_type == quest_type:
            uq.progress += amount
            if uq.progress >= uq.quest.target_count:
                uq.progress = uq.quest.target_count
                uq.is_completed = True
                # Award XP
                award_xp(user_id, uq.quest.xp_reward)
                
    db.session.commit()
