from datetime import datetime
from app.extensions import db

class User(db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    
    # Profile
    avatar_url = db.Column(db.String(255), nullable=True)
    avatar_id = db.Column(db.Integer, nullable=True) # References PRESET_AVATARS
    developer_class = db.Column(db.String(50), nullable=True)
    title = db.Column(db.String(100), nullable=True)
    
    level = db.Column(db.Integer, default=1)
    total_xp = db.Column(db.Integer, default=0)
    dev_coins = db.Column(db.Integer, default=0)
    coding_time_today = db.Column(db.Integer, default=0)
    is_premium = db.Column(db.Boolean, default=False)
    
    # Streak tracking (basic fields, to be expanded)
    current_streak = db.Column(db.Integer, default=0)
    longest_streak = db.Column(db.Integer, default=0)
    streak_freezes = db.Column(db.Integer, default=0)
    last_completed_date = db.Column(db.Date, nullable=True)
    timezone = db.Column(db.String(50), default='UTC')
    
    notification_tone = db.Column(db.String(20), default='roast') # 'roast', 'encouraging', 'neutral'
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'level': self.level,
            'total_xp': self.total_xp,
            'current_streak': self.current_streak,
            'longest_streak': self.longest_streak,
            'avatar_url': self.avatar_url
        }
