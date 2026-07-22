from datetime import datetime
from app.extensions import db

class Quiz(db.Model):
    __tablename__ = 'quizzes'
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text)
    is_adaptive = db.Column(db.Boolean, default=False)
    time_limit_sec = db.Column(db.Integer, nullable=True)
    xp_reward = db.Column(db.Integer, default=50)
    
    questions = db.relationship('Question', backref='quiz', lazy=True, cascade='all, delete-orphan')
    # Link to a Lesson
    lesson_id = db.Column(db.Integer, db.ForeignKey('lms_lessons.id'), nullable=True)

class Question(db.Model):
    __tablename__ = 'quiz_questions'
    id = db.Column(db.Integer, primary_key=True)
    quiz_id = db.Column(db.Integer, db.ForeignKey('quizzes.id'), nullable=False)
    type = db.Column(db.String(50), nullable=False) # MCQ, TrueFalse, FillBlank, DragDrop, CodeCompletion
    content = db.Column(db.Text, nullable=False)
    options = db.Column(db.JSON) # [{"id": "A", "text": "...", "is_correct": True}]
    explanation = db.Column(db.Text)
    order = db.Column(db.Integer, default=1)

class MiniProject(db.Model):
    __tablename__ = 'mini_projects'
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    requirements = db.Column(db.Text)
    starter_files = db.Column(db.JSON)
    resources = db.Column(db.JSON)
    checklist = db.Column(db.JSON)
    rubric = db.Column(db.JSON)
    xp_reward = db.Column(db.Integer, default=500)
    
    # Link to a Lesson
    lesson_id = db.Column(db.Integer, db.ForeignKey('lms_lessons.id'), nullable=True)

class BossBattle(db.Model):
    __tablename__ = 'boss_battles'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    avatar = db.Column(db.String(255))
    story = db.Column(db.Text)
    difficulty = db.Column(db.String(50), default='Hard')
    max_lives = db.Column(db.Integer, default=3)
    time_limit_sec = db.Column(db.Integer, default=3600)
    xp_reward = db.Column(db.Integer, default=1000)
    coin_reward = db.Column(db.Integer, default=500)
    unlock_condition = db.Column(db.JSON)
    animation_config = db.Column(db.JSON)
    
    # Boss is linked to a Module (appears at the end)
    module_id = db.Column(db.Integer, db.ForeignKey('modules.id'), nullable=True)
    
    # Boss Battle contains specific problems to defeat it
    # E.g. {"problem_ids": [1, 5, 9]}
    problems = db.Column(db.JSON, default=[])
    
class Certificate(db.Model):
    __tablename__ = 'certificates'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    course_id = db.Column(db.Integer, db.ForeignKey('courses.id'), nullable=False)
    verification_id = db.Column(db.String(100), unique=True, nullable=False, index=True)
    issued_at = db.Column(db.DateTime, default=datetime.utcnow)
    pdf_url = db.Column(db.String(255))
