from app.extensions import db
from app.models.notification import Notification
from app.models.user import User
import json
import os
import random

def load_templates():
    base_dir = os.path.dirname(os.path.abspath(__file__))
    template_path = os.path.join(base_dir, '..', 'notification_templates.json')
    with open(template_path, 'r') as f:
        return json.load(f)

TEMPLATES = load_templates()

def generate_message(notification_type, tone):
    """
    Selects a random message template based on type and user's tone preference.
    """
    options = TEMPLATES.get(notification_type, {}).get(tone, ["Notification"])
    return random.choice(options)

def send_notification(user_id, title, message=None, type='system'):
    """
    Creates an in-app notification. If message is not provided, it generates one
    based on the user's tone preference and the notification type.
    """
    user = db.session.get(User, user_id)
    if not user:
        return None
        
    if not message and type in TEMPLATES:
        message = generate_message(type, user.notification_tone)
        
    notification = Notification(
        user_id=user_id,
        title=title,
        message=message or "New notification",
        type=type
    )
    db.session.add(notification)
    db.session.commit()
    
    # Mock email delivery for MVP
    print(f"[EMAIL SIMULATION] To: {user.email} | Subject: {title} | Body: {notification.message}")
    
    return notification
