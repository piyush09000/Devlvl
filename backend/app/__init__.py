from flask import Flask
from .config import Config
from .extensions import db, migrate, jwt, celery, init_redis, socketio

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    # Initialize extensions
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    init_redis(app)
    socketio.init_app(app, message_queue=app.config.get('CELERY_BROKER_URL', 'redis://localhost:6379/0'))
    
    # Import all models for Alembic
    from app import models
    
    # Configure Celery
    celery.conf.update(
        broker_url=app.config.get('CELERY_BROKER_URL', 'redis://localhost:6379/0'),
        result_backend=app.config.get('CELERY_RESULT_BACKEND', 'redis://localhost:6379/0'),
        beat_schedule={
            'rotate-daily-quests-midnight': {
                'task': 'app.tasks.quest_rotation.rotate_daily_quests',
                'schedule': 86400.0, # Every 24 hours for now, in prod use crontab(hour=0, minute=0)
            },
            'send-streak-reminders': {
                'task': 'app.tasks.streak_reminders.send_streak_reminders',
                'schedule': 86400.0,
            }
        }
    )
    
    # Import tasks so Celery discovers them
    from app.tasks import quest_rotation
    from app.tasks import streak_reminders
    
    # Import socket events
    from app import sockets
    
    # Register blueprints
    from app.api.auth import auth_bp
    from app.api.problems import problems_bp
    from app.api.submissions import submissions_bp
    from app.api.skills import skills_bp
    from app.api.quests import quests_bp
    from app.api.leaderboard import leaderboard_bp
    from app.api.learning import learning_bp
    from app.api.marketplace import marketplace_bp
    from app.api.analytics import analytics_bp
    from app.api.ai import ai_bp
    from app.api.cms import cms_bp
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(problems_bp, url_prefix='/api/problems')
    app.register_blueprint(submissions_bp, url_prefix='/api/submissions')
    app.register_blueprint(skills_bp, url_prefix='/api/skills')
    app.register_blueprint(quests_bp, url_prefix='/api/quests')
    app.register_blueprint(leaderboard_bp, url_prefix='/api/leaderboard')
    app.register_blueprint(learning_bp, url_prefix='/api/learning')
    app.register_blueprint(marketplace_bp, url_prefix='/api/marketplace')
    app.register_blueprint(analytics_bp, url_prefix='/api/analytics')
    app.register_blueprint(ai_bp, url_prefix='/api/ai')
    app.register_blueprint(cms_bp, url_prefix='/api/cms')

    @app.route('/health')
    def health_check():
        return {'status': 'ok'}, 200

    return app
