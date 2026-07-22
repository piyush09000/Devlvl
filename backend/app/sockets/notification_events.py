import json
from flask_socketio import emit
from app.extensions import socketio, redis_client

def broadcast_notification(user_id, title, message, notification_type='general'):
    """
    Broadcasts a notification to a specific user's room.
    This can be called from anywhere in the Flask application.
    """
    payload = {
        'title': title,
        'message': message,
        'type': notification_type
    }
    
    # Emit to the personal room of the user
    socketio.emit('new_notification', payload, room=f'user_{user_id}')
    
    # Also store in redis or DB if needed for history
