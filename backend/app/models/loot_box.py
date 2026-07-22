from app.extensions import db
from datetime import datetime

class LootBox(db.Model):
    __tablename__ = 'loot_boxes'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False) # e.g. "Common Code Cache", "Mythic Bug Bounty"
    rarity = db.Column(db.String(20), nullable=False) # 'common', 'rare', 'epic', 'legendary'
    price_coins = db.Column(db.Integer, default=100)
    
    # JSON array of possible rewards with weights
    reward_pool = db.Column(db.JSON, nullable=False)

class UserInventory(db.Model):
    __tablename__ = 'user_inventory'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    
    item_type = db.Column(db.String(50), nullable=False) # 'loot_box', 'avatar', 'theme', 'title'
    item_id = db.Column(db.String(100), nullable=False) # specific ID of the item
    quantity = db.Column(db.Integer, default=1)
    acquired_at = db.Column(db.DateTime, default=datetime.utcnow)
