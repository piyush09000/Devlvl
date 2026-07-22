import os

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY', 'dev-key-change-in-prod')
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL', 'postgresql://devlvl_enterprise:devlvl_enterprise_pass@127.0.0.1:5433/devlvl_db')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY', 'jwt-secret-key-change-in-prod')
    
    REDIS_URL = os.environ.get('REDIS_URL', 'redis://localhost:6379/0')
    
    CELERY_BROKER_URL = os.environ.get('CELERY_BROKER_URL', REDIS_URL)
    CELERY_RESULT_BACKEND = os.environ.get('CELERY_RESULT_BACKEND', REDIS_URL)

    JUDGE0_API_URL = os.environ.get('JUDGE0_API_URL', 'http://localhost:2358')

class TestConfig(Config):
    TESTING = True
    import tempfile
    import os
    db_fd, db_path = tempfile.mkstemp()
    SQLALCHEMY_DATABASE_URI = f'sqlite:///{db_path}'
