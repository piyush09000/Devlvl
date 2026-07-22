from app.extensions import db
from app.models.user import User
from app.models.progression import UserStats, LevelThreshold, XPEvent

def get_or_create_stats(user_id):
    stats = UserStats.query.filter_by(user_id=user_id).first()
    if not stats:
        stats = UserStats(user_id=user_id)
        db.session.add(stats)
        db.session.flush()
    return stats

def calculate_xp_with_boosts(base_xp, user_id, difficulty=None):
    stats = get_or_create_stats(user_id)
    
    multiplier = stats.active_xp_boost if stats.active_xp_boost else 1.0
    
    if difficulty:
        difficulty_multipliers = {
            'Easy': 1.0,
            'Medium': 1.5,
            'Hard': 2.5,
            'Extreme': 4.0
        }
        multiplier *= difficulty_multipliers.get(difficulty, 1.0)
        
    return int(base_xp * multiplier)

def check_level_up(stats):
    """
    Check if the user has enough XP to level up based on LevelThreshold.
    If no thresholds exist, fall back to algorithmic calculation.
    """
    # Fetch highest possible level user qualifies for
    threshold = LevelThreshold.query.filter(LevelThreshold.xp_required <= stats.total_xp).order_by(LevelThreshold.level.desc()).first()
    
    new_level = stats.level
    reward_coins = 0
    
    if threshold:
        new_level = threshold.level
    else:
        # Fallback algorithm
        new_level = (stats.total_xp // 100) + 1
        
    if new_level > stats.level:
        # User leveled up!
        levels_gained = new_level - stats.level
        stats.level = new_level
        # Dummy logic: 50 coins per level gained if no threshold
        stats.dev_coins += (threshold.reward_coins if threshold else 50 * levels_gained)
        
        # Trigger level up badge/notification
        from app.services.badge_service import check_and_award_badge
        check_and_award_badge(stats.user_id, f'level_{new_level}')
        
    return new_level > stats.level

def award_xp(user_id, base_amount, source="system", reference_id=None, difficulty=None):
    user = User.query.get(user_id)
    if not user:
        return 0
        
    stats = get_or_create_stats(user_id)
    
    final_amount = calculate_xp_with_boosts(base_amount, user_id, difficulty)
    
    # Ledger entry
    xp_event = XPEvent(
        user_id=user_id,
        amount=final_amount,
        source=source,
        reference_id=reference_id,
        description=f"Earned {final_amount} XP from {source}"
    )
    db.session.add(xp_event)
    
    stats.total_xp += final_amount
    
    # Sync legacy fields on User for backwards compatibility
    user.total_xp = stats.total_xp
    
    # Level up check
    leveled_up = check_level_up(stats)
    if leveled_up:
        user.level = stats.level
        user.dev_coins = stats.dev_coins
    
    from app.services.badge_service import check_and_award_badge
    if stats.total_xp >= 1000:
        check_and_award_badge(user_id, 'xp_1000')
        
    # Also update leaderboard
    from app.services.leaderboard_service import leaderboard_service
    leaderboard_service.add_xp(user_id, final_amount)
        
    db.session.commit()
    return final_amount
