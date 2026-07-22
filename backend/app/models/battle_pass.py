from app.extensions import db
from datetime import datetime

class Season(db.Model):
    __tablename__ = 'seasons'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False) # e.g. "Season Zero: Bug Apocalypse"
    start_date = db.Column(db.DateTime, nullable=False)
    end_date = db.Column(db.DateTime, nullable=False)
    tier_count = db.Column(db.Integer, default=100)
    is_active = db.Column(db.Boolean, default=False)
    
class BattlePassTier(db.Model):
    __tablename__ = 'battle_pass_tiers'
    
    id = db.Column(db.Integer, primary_key=True)
    season_id = db.Column(db.Integer, db.ForeignKey('seasons.id'), nullable=False)
    tier_number = db.Column(db.Integer, nullable=False)
    xp_required = db.Column(db.Integer, nullable=False)
    
    # JSON for rewards e.g. {"type": "coins", "amount": 100} or {"type": "title", "value": "Bug Slayer"}
    free_reward = db.Column(db.JSON, nullable=True) 
    premium_reward = db.Column(db.JSON, nullable=True)

class UserBattlePass(db.Model):
    __tablename__ = 'user_battle_passes'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    season_id = db.Column(db.Integer, db.ForeignKey('seasons.id'), nullable=False)
    
    current_tier = db.Column(db.Integer, default=1)
    current_xp = db.Column(db.Integer, default=0) # XP within the current pass
    is_premium = db.Column(db.Boolean, default=False)
    
    # Array of tier numbers already claimed
    claimed_free_tiers = db.Column(db.JSON, default=[])
    claimed_premium_tiers = db.Column(db.JSON, default=[])
