from datetime import datetime
from app.extensions import db

class World(db.Model):
    __tablename__ = 'worlds'
    id = db.Column(db.Integer, primary_key=True)
    slug = db.Column(db.String(100), unique=True, nullable=False, index=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=True)
    icon = db.Column(db.String(100), nullable=True)
    tier = db.Column(db.Integer, nullable=False, default=1)
    
    # Requirements
    prerequisite_world_id = db.Column(db.Integer, db.ForeignKey('worlds.id'), nullable=True)
    level_requirement = db.Column(db.Integer, default=1)
    
    # RPG Mapping: A World is a visual container for a Course
    course_id = db.Column(db.Integer, db.ForeignKey('courses.id'), nullable=True)
    
    # Relationships
    regions = db.relationship('Region', backref='world', lazy=True, cascade='all, delete-orphan')

class Region(db.Model):
    __tablename__ = 'regions'
    id = db.Column(db.Integer, primary_key=True)
    world_id = db.Column(db.Integer, db.ForeignKey('worlds.id'), nullable=False)
    slug = db.Column(db.String(100), unique=True, nullable=False, index=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=True)
    order = db.Column(db.Integer, nullable=False, default=1)
    
    # RPG Mapping: A Region maps to a Module
    module_id = db.Column(db.Integer, db.ForeignKey('modules.id'), nullable=True)
    
    # Relationships
    villages = db.relationship('Village', backref='region', lazy=True, cascade='all, delete-orphan')
    dungeons = db.relationship('Dungeon', backref='region', lazy=True, cascade='all, delete-orphan')

class Village(db.Model):
    __tablename__ = 'villages'
    id = db.Column(db.Integer, primary_key=True)
    region_id = db.Column(db.Integer, db.ForeignKey('regions.id'), nullable=False)
    name = db.Column(db.String(100), nullable=False)
    coordinates = db.Column(db.JSON) # Visual placement on map
    
    # RPG Mapping: A Village is a visual node for a Lesson (theory)
    lesson_id = db.Column(db.Integer, db.ForeignKey('lms_lessons.id'), nullable=True)

class Dungeon(db.Model):
    __tablename__ = 'dungeons'
    id = db.Column(db.Integer, primary_key=True)
    region_id = db.Column(db.Integer, db.ForeignKey('regions.id'), nullable=False)
    name = db.Column(db.String(100), nullable=False)
    coordinates = db.Column(db.JSON)
    
    # RPG Mapping: A Dungeon is a visual node for an Assessment (Quiz, MiniProject, Challenge)
    # Could link directly to problem, quiz, or just a lesson that contains an assessment
    lesson_id = db.Column(db.Integer, db.ForeignKey('lms_lessons.id'), nullable=True)

class Portal(db.Model):
    __tablename__ = 'portals'
    id = db.Column(db.Integer, primary_key=True)
    from_world_id = db.Column(db.Integer, db.ForeignKey('worlds.id'), nullable=False)
    to_world_id = db.Column(db.Integer, db.ForeignKey('worlds.id'), nullable=False)
    unlock_condition = db.Column(db.JSON) # Conditions to activate portal
