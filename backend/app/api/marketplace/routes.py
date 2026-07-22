from flask import request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.extensions import db
from app.models.marketplace import StoreItem
from app.models.loot_box import UserInventory
from app.models.user import User
from . import marketplace_bp

@marketplace_bp.route('/items', methods=['GET'])
def get_store_items():
    items = StoreItem.query.filter_by(is_active=True).all()
    return jsonify([i.to_dict() for i in items]), 200

@marketplace_bp.route('/buy', methods=['POST'])
@jwt_required()
def buy_item():
    current_user_id = get_jwt_identity()
    data = request.get_json()
    item_id = data.get('item_id')
    
    if not item_id:
        return jsonify({'error': 'item_id required'}), 400
        
    item = StoreItem.query.get_or_404(item_id)
    user = User.query.get(current_user_id)
    
    if item.price_dev_coins:
        if user.dev_coins < item.price_dev_coins:
            return jsonify({'error': 'Not enough DevCoins'}), 400
        user.dev_coins -= item.price_dev_coins
    elif item.price_bp:
        # Check battle pass points - assume we deduct from total_xp or a separate bp points field
        # Simplified for now
        pass
        
    # Add to inventory
    inv = UserInventory(
        user_id=current_user_id,
        item_type=item.category,
        item_id=str(item.id)
    )
    db.session.add(inv)
    db.session.commit()
    
    return jsonify({'message': 'Item purchased successfully', 'dev_coins': user.dev_coins}), 200
