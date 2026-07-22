import pytest
from datetime import datetime, timedelta, date
from app.models.user import User
from app.services.streak_service import record_daily_completion
from app.extensions import db

def test_first_ever_completion(app):
    with app.app_context():
        user = User(username='test', email='test@test.com', password_hash='hash')
        db.session.add(user)
        db.session.commit()
        
        mock_today = date(2026, 1, 1)
        record_daily_completion(user.id, today_date=mock_today)
        
        updated_user = db.session.get(User, user.id)
        assert updated_user.current_streak == 1
        assert updated_user.longest_streak == 1
        assert updated_user.last_completed_date == mock_today
        assert updated_user.streak_freezes == 0

def test_consecutive_days_completion(app):
    with app.app_context():
        user = User(username='test2', email='test2@test.com', password_hash='hash')
        user.last_completed_date = date(2026, 1, 1)
        user.current_streak = 1
        user.longest_streak = 1
        db.session.add(user)
        db.session.commit()
        
        mock_today = date(2026, 1, 2)
        record_daily_completion(user.id, today_date=mock_today)
            
        updated_user = db.session.get(User, user.id)
        assert updated_user.current_streak == 2
        assert updated_user.longest_streak == 2

def test_same_day_completion(app):
    with app.app_context():
        user = User(username='test3', email='test3@test.com', password_hash='hash')
        user.last_completed_date = date(2026, 1, 1)
        user.current_streak = 5
        user.longest_streak = 5
        db.session.add(user)
        db.session.commit()
        
        mock_today = date(2026, 1, 1)
        record_daily_completion(user.id, today_date=mock_today)
            
        updated_user = db.session.get(User, user.id)
        assert updated_user.current_streak == 5 # Shouldn't increment
    
def test_gap_with_freeze(app):
    with app.app_context():
        user = User(username='test4', email='test4@test.com', password_hash='hash')
        user.last_completed_date = date(2026, 1, 1)
        user.current_streak = 10
        user.longest_streak = 10
        user.streak_freezes = 1
        db.session.add(user)
        db.session.commit()
        
        mock_today = date(2026, 1, 3) # Missed day 2
        record_daily_completion(user.id, today_date=mock_today)
            
        updated_user = db.session.get(User, user.id)
        assert updated_user.streak_freezes == 0 # Freeze consumed
        assert updated_user.current_streak == 11 # Maintained and incremented for today
    
def test_gap_without_freeze(app):
    with app.app_context():
        user = User(username='test5', email='test5@test.com', password_hash='hash')
        user.last_completed_date = date(2026, 1, 1)
        user.current_streak = 10
        user.longest_streak = 10
        user.streak_freezes = 0
        db.session.add(user)
        db.session.commit()
        
        mock_today = date(2026, 1, 3) # Missed day 2
        record_daily_completion(user.id, today_date=mock_today)
            
        updated_user = db.session.get(User, user.id)
        assert updated_user.current_streak == 1 # Reset to 1
        assert updated_user.longest_streak == 10 # Longest is preserved
