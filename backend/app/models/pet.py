from app.extensions import db
from datetime import datetime

class Pet(db.Model):
    __tablename__ = 'pets'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False) # "Rubber Duck", "AI Robot"
    species = db.Column(db.String(50), nullable=False)
    rarity = db.Column(db.String(20), nullable=False) # 'common', 'rare', 'epic', 'legendary'
    base_image = db.Column(db.String(255), nullable=True)

class UserPet(db.Model):
    __tablename__ = 'user_pets'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    pet_id = db.Column(db.Integer, db.ForeignKey('pets.id'), nullable=False)
    
    nickname = db.Column(db.String(50), nullable=True)
    pet_xp = db.Column(db.Integer, default=0)
    pet_level = db.Column(db.Integer, default=1)
    is_active = db.Column(db.Boolean, default=False)
    
    acquired_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    pet = db.relationship('Pet')
