import json
import time
import uuid
from flask_socketio import emit, join_room, leave_room
from app.extensions import socketio, redis_client
from app.models.user import User
from flask import request
from flask_jwt_extended import decode_token

# Helper to verify token on socket connection
def get_user_from_token(token):
    try:
        decoded = decode_token(token)
        user_id = decoded['sub']
        return User.query.get(user_id)
    except Exception:
        return None

@socketio.on('authenticate')
def handle_authenticate(data):
    token = data.get('token')
    user = get_user_from_token(token)
    if user:
        # Join a personal room for notifications
        join_room(f'user_{user.id}')
        emit('authenticated', {'status': 'success', 'user_id': user.id})
    else:
        emit('error', {'message': 'Authentication failed'})

@socketio.on('join_pvp_queue')
def handle_join_queue(data):
    token = data.get('token')
    user = get_user_from_token(token)
    if not user:
        emit('error', {'message': 'Unauthorized'})
        return
        
    queue_key = 'pvp_matchmaking_queue'
    # Use Redis list as a simple queue
    redis_client.lpush(queue_key, json.dumps({
        'user_id': user.id,
        'username': user.username,
        'rating': getattr(user, 'pvp_rating', 1200),
        'socket_id': request.sid
    }))
    
    emit('queue_status', {'status': 'searching', 'message': 'Looking for an opponent...'})
    
    # Try to match
    match_players()

def match_players():
    queue_key = 'pvp_matchmaking_queue'
    # Simple matching: pop 2 players
    if redis_client.llen(queue_key) >= 2:
        player1_data = json.loads(redis_client.rpop(queue_key))
        player2_data = json.loads(redis_client.rpop(queue_key))
        
        # Avoid matching against self
        if player1_data['user_id'] == player2_data['user_id']:
            redis_client.lpush(queue_key, json.dumps(player1_data))
            return
            
        match_id = str(uuid.uuid4())
        
        # Setup match details
        # For demo, grab a random problem ID (in a real app, pick from DB)
        problem_id = 1 
        
        match_info = {
            'match_id': match_id,
            'problem_id': problem_id,
            'start_time': int(time.time()) + 3, # 3 seconds countdown
            'players': [
                {'id': player1_data['user_id'], 'username': player1_data['username'], 'rating': player1_data['rating']},
                {'id': player2_data['user_id'], 'username': player2_data['username'], 'rating': player2_data['rating']}
            ]
        }
        
        # Store match in Redis
        redis_client.set(f"match_{match_id}", json.dumps(match_info), ex=3600)
        
        # Notify both players
        socketio.emit('match_found', {
            **match_info,
            'opponent': match_info['players'][1]
        }, to=player1_data['socket_id'])
        
        socketio.emit('match_found', {
            **match_info,
            'opponent': match_info['players'][0]
        }, to=player2_data['socket_id'])

@socketio.on('pvp_progress')
def handle_pvp_progress(data):
    match_id = data.get('match_id')
    progress = data.get('progress') # 0 to 100
    # Broadcast progress to the opponent in the same match
    # A simple way is to use a match room
    emit('opponent_progress', {'progress': progress}, room=f'match_{match_id}', include_self=False)

@socketio.on('join_match_room')
def handle_join_match_room(data):
    match_id = data.get('match_id')
    join_room(f'match_{match_id}')
