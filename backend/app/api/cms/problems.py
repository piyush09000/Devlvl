"""
CMS Problems API — full CRUD for the Problem Library.
Supports pagination, filtering by difficulty/tags/companies, full-text search.
"""
from flask import request, jsonify
from flask_jwt_extended import jwt_required
from app.extensions import db
from app.models.problem import Problem
from . import cms_bp
from .courses import require_admin

@cms_bp.route('/problems', methods=['GET'])
@jwt_required()
def list_problems():
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 25, type=int)
    difficulty = request.args.get('difficulty')
    status = request.args.get('status')
    search = request.args.get('search')
    course_id = request.args.get('course_id', type=int)

    q = Problem.query
    if difficulty:
        q = q.filter_by(difficulty=difficulty)
    if status:
        q = q.filter_by(status=status)
    if course_id:
        q = q.filter_by(course_id=course_id)
    if search:
        q = q.filter(Problem.title.ilike(f'%{search}%'))

    paginated = q.order_by(Problem.id.desc()).paginate(page=page, per_page=per_page, error_out=False)
    return jsonify({
        'items': [p.to_dict() for p in paginated.items],
        'total': paginated.total,
        'pages': paginated.pages,
        'page': page
    }), 200

@cms_bp.route('/problems/<int:problem_id>', methods=['GET'])
@jwt_required()
def get_problem(problem_id):
    p = Problem.query.get_or_404(problem_id)
    return jsonify(p.to_dict(include_hidden=True, include_editorial=True)), 200

@cms_bp.route('/problems', methods=['POST'])
@jwt_required()
def create_problem():
    require_admin()
    data = request.get_json()
    p = Problem(
        slug=data['slug'],
        title=data['title'],
        description=data['description'],
        difficulty=data.get('difficulty', 'Easy'),
        tags=data.get('tags', []),
        companies=data.get('companies', []),
        topics=data.get('topics', []),
        source=data.get('source', 'LMS'),
        input_format=data.get('input_format'),
        output_format=data.get('output_format'),
        constraints=data.get('constraints'),
        hints=data.get('hints', []),
        editorial=data.get('editorial'),
        video_explanation_url=data.get('video_explanation_url'),
        related_problem_ids=data.get('related_problem_ids', []),
        status=data.get('status', 'Published'),
        xp_reward=data.get('xp_reward', 10),
        coin_reward=data.get('coin_reward', 5),
        supported_languages=data.get('supported_languages', ['python', 'javascript']),
        starter_code=data.get('starter_code', {}),
        time_limit_ms=data.get('time_limit_ms', 2000),
        memory_limit_kb=data.get('memory_limit_kb', 128000),
        sample_tests=data.get('sample_tests', []),
        hidden_tests=data.get('hidden_tests', []),
        course_id=data.get('course_id'),
        module_id=data.get('module_id'),
    )
    db.session.add(p)
    db.session.commit()
    return jsonify({'message': 'Problem created', 'id': p.id}), 201

@cms_bp.route('/problems/<int:problem_id>', methods=['PATCH'])
@jwt_required()
def update_problem(problem_id):
    require_admin()
    p = Problem.query.get_or_404(problem_id)
    data = request.get_json()
    updatable = [
        'title', 'description', 'difficulty', 'tags', 'companies', 'topics',
        'input_format', 'output_format', 'constraints', 'hints', 'editorial',
        'video_explanation_url', 'related_problem_ids', 'status', 'xp_reward',
        'coin_reward', 'supported_languages', 'starter_code', 'time_limit_ms',
        'memory_limit_kb', 'sample_tests', 'hidden_tests', 'custom_checker',
        'course_id', 'module_id'
    ]
    for field in updatable:
        if field in data:
            setattr(p, field, data[field])
    db.session.commit()
    return jsonify({'message': 'Problem updated'}), 200

@cms_bp.route('/problems/<int:problem_id>', methods=['DELETE'])
@jwt_required()
def delete_problem(problem_id):
    require_admin()
    p = Problem.query.get_or_404(problem_id)
    db.session.delete(p)
    db.session.commit()
    return jsonify({'message': 'Problem deleted'}), 200

# ─── Bulk operations ───────────────────────────────────────────────────────────

@cms_bp.route('/problems/bulk-import', methods=['POST'])
@jwt_required()
def bulk_import_problems():
    """Import an array of problems in a single request."""
    require_admin()
    items = request.get_json()
    if not isinstance(items, list):
        return jsonify({'error': 'Expected a JSON array of problems'}), 400
    created = 0
    for data in items:
        if Problem.query.filter_by(slug=data.get('slug', '')).first():
            continue  # Skip duplicates
        p = Problem(
            slug=data.get('slug', f"problem-{data.get('title','').lower().replace(' ', '-')}"),
            title=data['title'],
            description=data.get('description', ''),
            difficulty=data.get('difficulty', 'Easy'),
            tags=data.get('tags', []),
            companies=data.get('companies', []),
            topics=data.get('topics', []),
            xp_reward=data.get('xp_reward', 10),
            coin_reward=data.get('coin_reward', 5),
            supported_languages=data.get('supported_languages', ['python']),
            starter_code=data.get('starter_code', {}),
            sample_tests=data.get('sample_tests', []),
            hidden_tests=data.get('hidden_tests', []),
            status=data.get('status', 'Published'),
        )
        db.session.add(p)
        created += 1
    db.session.commit()
    return jsonify({'message': f'{created} problems imported'}), 201
