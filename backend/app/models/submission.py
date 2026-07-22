from datetime import datetime
from app.extensions import db

class Submission(db.Model):
    __tablename__ = 'submissions'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    problem_id = db.Column(db.Integer, db.ForeignKey('problems.id'), nullable=False)
    
    language_id = db.Column(db.Integer, nullable=False) # Judge0 language ID
    code = db.Column(db.Text, nullable=False)
    
    status = db.Column(db.String(50), nullable=False) # Pending, Accepted, Wrong Answer, Error
    runtime_ms = db.Column(db.Float, nullable=True)
    memory_kb = db.Column(db.Float, nullable=True)
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    user = db.relationship('User', backref=db.backref('submissions', lazy=True))
    problem = db.relationship('Problem', backref=db.backref('submissions', lazy=True))
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'problem_id': self.problem_id,
            'language_id': self.language_id,
            'code': self.code,
            'status': self.status,
            'runtime_ms': self.runtime_ms,
            'memory_kb': self.memory_kb,
            'created_at': self.created_at.isoformat()
        }
