from flask import request, jsonify
from flask_jwt_extended import jwt_required
from app.extensions import db
from app.models.problem import Problem
from . import problems_bp

@problems_bp.route('/', methods=['GET'])
def get_problems():
    # Only return summary data for list view (not hidden tests or heavy editorial)
    problems = Problem.query.all()
    return jsonify([p.to_dict(include_hidden=False) for p in problems]), 200

@problems_bp.route('/<slug>', methods=['GET'])
def get_problem(slug):
    problem = Problem.query.filter_by(slug=slug).first_or_404()
    return jsonify(problem.to_dict(include_hidden=False)), 200

# Admin endpoints for Enterprise management
@problems_bp.route('/', methods=['POST'])
@jwt_required()
def create_problem():
    data = request.get_json()
    new_problem = Problem(
        slug=data.get('slug'),
        title=data.get('title'),
        description=data.get('description'),
        difficulty=data.get('difficulty', 'Easy'),
        tags=data.get('tags', []),
        companies=data.get('companies', []),
        hints=data.get('hints', []),
        editorial=data.get('editorial'),
        xp_reward=data.get('xp_reward', 10),
        coin_reward=data.get('coin_reward', 5),
        supported_languages=data.get('supported_languages', ['python', 'javascript']),
        starter_code=data.get('starter_code', {}),
        time_limit_ms=data.get('time_limit_ms', 2000),
        memory_limit_kb=data.get('memory_limit_kb', 128000),
        sample_tests=data.get('sample_tests', []),
        hidden_tests=data.get('hidden_tests', [])
    )
    db.session.add(new_problem)
    db.session.commit()
    return jsonify(new_problem.to_dict(include_hidden=True)), 201

@problems_bp.route('/<slug>', methods=['PUT'])
@jwt_required()
def update_problem(slug):
    problem = Problem.query.filter_by(slug=slug).first_or_404()
    data = request.get_json()
    
    # Update fields dynamically
    for key, value in data.items():
        if hasattr(problem, key) and key not in ['id', 'created_at', 'updated_at']:
            setattr(problem, key, value)
            
    db.session.commit()
    return jsonify(problem.to_dict(include_hidden=True)), 200

@problems_bp.route('/<slug>', methods=['DELETE'])
@jwt_required()
def delete_problem(slug):
    problem = Problem.query.filter_by(slug=slug).first_or_404()
    db.session.delete(problem)
    db.session.commit()
    return jsonify({"message": "Problem deleted"}), 200
