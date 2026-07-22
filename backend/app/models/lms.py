from datetime import datetime
from app.extensions import db

class Academy(db.Model):
    __tablename__ = 'academies'
    id = db.Column(db.Integer, primary_key=True)
    slug = db.Column(db.String(100), unique=True, nullable=False, index=True)
    name = db.Column(db.String(150), nullable=False)
    description = db.Column(db.Text)
    paths = db.relationship('LearningPath', backref='academy', lazy=True, cascade='all, delete-orphan')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class LearningPath(db.Model):
    __tablename__ = 'learning_paths'
    id = db.Column(db.Integer, primary_key=True)
    academy_id = db.Column(db.Integer, db.ForeignKey('academies.id'), nullable=False)
    slug = db.Column(db.String(100), unique=True, nullable=False, index=True)
    name = db.Column(db.String(150), nullable=False) # e.g. "Frontend Developer"
    description = db.Column(db.Text)
    icon = db.Column(db.String(255))
    courses = db.relationship('Course', backref='learning_path', lazy=True, cascade='all, delete-orphan')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class Course(db.Model):
    __tablename__ = 'courses'
    id = db.Column(db.Integer, primary_key=True)
    learning_path_id = db.Column(db.Integer, db.ForeignKey('learning_paths.id'), nullable=False)
    slug = db.Column(db.String(150), unique=True, nullable=False, index=True)
    title = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text)
    difficulty = db.Column(db.String(50), default='Beginner')
    estimated_duration = db.Column(db.Integer) # in minutes
    thumbnail = db.Column(db.String(255))
    banner = db.Column(db.String(255))
    instructor_id = db.Column(db.Integer, db.ForeignKey('users.id')) # Link to instructor
    prerequisites = db.Column(db.JSON)
    learning_outcomes = db.Column(db.JSON)
    xp_reward = db.Column(db.Integer, default=500)
    coin_reward = db.Column(db.Integer, default=100)
    status = db.Column(db.String(50), default='Draft') # Draft, Published, Archived
    version = db.Column(db.String(20), default='1.0')
    language = db.Column(db.String(50), default='en')
    seo_metadata = db.Column(db.JSON)
    
    modules = db.relationship('Module', backref='course', lazy=True, cascade='all, delete-orphan')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class Module(db.Model):
    __tablename__ = 'modules'
    id = db.Column(db.Integer, primary_key=True)
    course_id = db.Column(db.Integer, db.ForeignKey('courses.id'), nullable=False)
    slug = db.Column(db.String(150), unique=True, nullable=False, index=True)
    title = db.Column(db.String(255), nullable=False)
    summary = db.Column(db.Text)
    difficulty = db.Column(db.String(50), default='Beginner')
    estimated_time = db.Column(db.Integer)
    unlock_requirement = db.Column(db.JSON)
    xp_reward = db.Column(db.Integer, default=100)
    order = db.Column(db.Integer, default=1)
    
    chapters = db.relationship('Chapter', backref='module', lazy=True, cascade='all, delete-orphan')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class Chapter(db.Model):
    __tablename__ = 'lms_chapters'
    id = db.Column(db.Integer, primary_key=True)
    module_id = db.Column(db.Integer, db.ForeignKey('modules.id'), nullable=False)
    title = db.Column(db.String(255), nullable=False)
    order = db.Column(db.Integer, default=1)
    
    lessons = db.relationship('Lesson', backref='chapter', lazy=True, cascade='all, delete-orphan')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class Lesson(db.Model):
    __tablename__ = 'lms_lessons'
    id = db.Column(db.Integer, primary_key=True)
    chapter_id = db.Column(db.Integer, db.ForeignKey('lms_chapters.id'), nullable=False)
    slug = db.Column(db.String(150), unique=True, nullable=False, index=True)
    title = db.Column(db.String(255), nullable=False)
    content_blocks = db.Column(db.JSON) # Array of blocks (markdown, code, video, etc)
    order = db.Column(db.Integer, default=1)
    status = db.Column(db.String(50), default='Draft')
    
    # Associated Assessment / Problem / Project
    problem_id = db.Column(db.Integer, db.ForeignKey('problems.id'), nullable=True)
    # quiz_id and project_id will be added in assessments.py relationships
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
