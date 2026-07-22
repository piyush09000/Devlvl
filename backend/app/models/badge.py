from app.extensions import db
from datetime import datetime

class Badge(db.Model):
    __tablename__ = 'badges'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), unique=True, nullable=False)
    description = db.Column(db.String(255), nullable=False)
    icon_url = db.Column(db.String(255), nullable=True)
    
    # E.g., 'streak_7', 'streak_30', 'xp_1000', 'first_problem'
    trigger_rule = db.Column(db.String(50), nullable=False, unique=True)
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'icon_url': self.icon_url,
            'trigger_rule': self.trigger_rule
        }

class UserBadge(db.Model):
    __tablename__ = 'user_badges'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    badge_id = db.Column(db.Integer, db.ForeignKey('badges.id'), nullable=False)
    earned_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    user = db.relationship('User', backref=db.backref('badges', lazy=True))
    badge = db.relationship('Badge')
    
    def to_dict(self):
        return {
            'badge': self.badge.to_dict() if self.badge else None,
            'earned_at': self.earned_at.isoformat()
        }
