from app.extensions import db
from datetime import datetime

class Guild(db.Model):
    __tablename__ = 'guilds'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), unique=True, nullable=False)
    description = db.Column(db.String(255), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'member_count': len(self.members) if self.members else 0
        }

class GuildMember(db.Model):
    __tablename__ = 'guild_members'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    guild_id = db.Column(db.Integer, db.ForeignKey('guilds.id'), nullable=False)
    joined_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    user = db.relationship('User', backref=db.backref('guild_membership', uselist=False))
    guild = db.relationship('Guild', backref=db.backref('members', lazy=True))
