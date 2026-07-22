from datetime import datetime
from app.extensions import db

class LevelThreshold(db.Model):
    """
    Configurable level thresholds. Allows dynamic tuning of the XP curve.
    """
    __tablename__ = 'level_thresholds'
    
    id = db.Column(db.Integer, primary_key=True)
    level = db.Column(db.Integer, unique=True, nullable=False, index=True)
    xp_required = db.Column(db.Integer, nullable=False) # Total XP required to reach this level
    title = db.Column(db.String(100), nullable=True) # e.g. "Newbie", "Apprentice"
    reward_coins = db.Column(db.Integer, default=0) # Coins given when reaching this level

class UserStats(db.Model):
    """
    Decoupled progression stats for a user.
    """
    __tablename__ = 'user_stats'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), unique=True, nullable=False)
    
    level = db.Column(db.Integer, default=1)
    total_xp = db.Column(db.Integer, default=0)
    dev_coins = db.Column(db.Integer, default=0)
    coding_time_today = db.Column(db.Integer, default=0)
    
    # Streaks
    current_streak = db.Column(db.Integer, default=0)
    longest_streak = db.Column(db.Integer, default=0)
    streak_freezes = db.Column(db.Integer, default=0)
    last_completed_date = db.Column(db.Date, nullable=True)
    
    # Multipliers & Boosts
    active_xp_boost = db.Column(db.Float, default=1.0) # e.g. 1.5x for weekend events
    boost_expires_at = db.Column(db.DateTime, nullable=True)
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    user = db.relationship('User', backref=db.backref('stats', uselist=False, cascade="all, delete-orphan"))
    
    def to_dict(self):
        return {
            'level': self.level,
            'total_xp': self.total_xp,
            'dev_coins': self.dev_coins,
            'current_streak': self.current_streak,
            'longest_streak': self.longest_streak,
            'streak_freezes': self.streak_freezes,
            'active_xp_boost': self.active_xp_boost,
            'boost_expires_at': self.boost_expires_at.isoformat() if self.boost_expires_at else None
        }

class XPEvent(db.Model):
    """
    Ledger of XP gains for analytics and anti-cheat.
    """
    __tablename__ = 'xp_events'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False, index=True)
    amount = db.Column(db.Integer, nullable=False)
    source = db.Column(db.String(100), nullable=False) # e.g. "problem_solved", "quest_completed"
    reference_id = db.Column(db.Integer, nullable=True) # e.g. problem_id or quest_id
    description = db.Column(db.String(255), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, index=True)
