from app.extensions import db
from datetime import datetime

class StoreItem(db.Model):
    __tablename__ = 'store_items'
    
    id = db.Column(db.Integer, primary_key=True)
    category = db.Column(db.String(50), nullable=False) # 'avatars', 'pets', 'titles', 'boosts'
    name = db.Column(db.String(100), nullable=False)
    emoji = db.Column(db.String(20), nullable=False)
    rarity = db.Column(db.String(20), nullable=False) # 'common', 'uncommon', 'rare', 'epic', 'legendary'
    
    price_bp = db.Column(db.Integer, nullable=True) # Battle Pass points price
    price_dev_coins = db.Column(db.Integer, nullable=True) # DevCoins price
    
    is_new = db.Column(db.Boolean, default=False)
    is_active = db.Column(db.Boolean, default=True)
    
    def to_dict(self):
        return {
            'id': self.id,
            'category': self.category,
            'name': self.name,
            'emoji': self.emoji,
            'rarity': self.rarity,
            'price': self.price_bp,
            'devCoinPrice': self.price_dev_coins,
            'new': self.is_new
        }
