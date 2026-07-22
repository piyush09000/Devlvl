from app.extensions import db
from datetime import datetime, date

class Quest(db.Model):
    __tablename__ = 'quests'
    
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text, nullable=False)
    xp_reward = db.Column(db.Integer, default=50)
    
    # E.g. 'solve_any', 'solve_easy', 'solve_medium', 'solve_without_hints'
    quest_type = db.Column(db.String(50), nullable=False)
    target_count = db.Column(db.Integer, default=1)
    
    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'xp_reward': self.xp_reward,
            'quest_type': self.quest_type,
            'target_count': self.target_count
        }

class UserQuest(db.Model):
    __tablename__ = 'user_quests'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    quest_id = db.Column(db.Integer, db.ForeignKey('quests.id'), nullable=False)
    
    assigned_date = db.Column(db.Date, nullable=False, default=datetime.utcnow().date)
    progress = db.Column(db.Integer, default=0)
    is_completed = db.Column(db.Boolean, default=False)
    
    user = db.relationship('User', backref=db.backref('quests', lazy=True))
    quest = db.relationship('Quest')
    
    def to_dict(self):
        return {
            'id': self.id,
            'quest_id': self.quest_id,
            'quest': self.quest.to_dict() if self.quest else None,
            'assigned_date': self.assigned_date.isoformat(),
            'progress': self.progress,
            'is_completed': self.is_completed
        }
