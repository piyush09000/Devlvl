from app.extensions import db
from datetime import datetime

class SkillNode(db.Model):
    __tablename__ = 'skill_nodes'
    
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=True)
    tier = db.Column(db.Integer, nullable=False, default=1) # e.g. 1=Basics, 2=Intermediate
    
    # Array of prerequisite skill_node IDs (JSON for simplicity in MVP)
    prerequisites = db.Column(db.JSON, nullable=True, default=[])
    
    # Number of problems required to unlock the next connected nodes
    completion_threshold = db.Column(db.Integer, default=5)
    
    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'tier': self.tier,
            'prerequisites': self.prerequisites,
            'completion_threshold': self.completion_threshold
        }

class UserSkillProgress(db.Model):
    __tablename__ = 'user_skill_progress'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    skill_node_id = db.Column(db.Integer, db.ForeignKey('skill_nodes.id'), nullable=False)
    
    problems_solved = db.Column(db.Integer, default=0)
    is_completed = db.Column(db.Boolean, default=False)
    unlocked_at = db.Column(db.DateTime, default=datetime.utcnow)
    completed_at = db.Column(db.DateTime, nullable=True)
    
    user = db.relationship('User', backref=db.backref('skill_progress', lazy=True))
    skill_node = db.relationship('SkillNode')
    
    def to_dict(self):
        return {
            'skill_node_id': self.skill_node_id,
            'problems_solved': self.problems_solved,
            'is_completed': self.is_completed,
            'unlocked_at': self.unlocked_at.isoformat() if self.unlocked_at else None,
            'completed_at': self.completed_at.isoformat() if self.completed_at else None
        }
