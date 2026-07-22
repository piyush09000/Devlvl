"""
CMS Courses API — full CRUD for Learning Paths, Courses, and Modules.
Admin-only endpoints for content management.
"""
from flask import request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.extensions import db
from app.models.lms import LearningPath, Course, Module, Academy
from app.models.user import User
from . import cms_bp

def require_admin():
    """Returns 403 if caller is not an admin."""
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if not user or getattr(user, 'role', 'student') not in ('admin', 'instructor'):
        from flask import abort
        abort(403, description="Admin access required.")

# ─── Learning Paths ────────────────────────────────────────────────────────────

@cms_bp.route('/learning-paths', methods=['GET'])
@jwt_required()
def list_learning_paths():
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 20, type=int)
    paths = LearningPath.query.paginate(page=page, per_page=per_page, error_out=False)
    return jsonify({
        'items': [{'id': p.id, 'slug': p.slug, 'name': p.name, 'description': p.description, 'icon': p.icon} for p in paths.items],
        'total': paths.total,
        'pages': paths.pages,
        'page': page
    }), 200

@cms_bp.route('/learning-paths', methods=['POST'])
@jwt_required()
def create_learning_path():
    require_admin()
    data = request.get_json()
    # Auto-create default Academy if missing
    academy = Academy.query.first()
    if not academy:
        academy = Academy(slug='devlvl-academy', name='Devlvl Academy')
        db.session.add(academy)
        db.session.flush()
    path = LearningPath(
        academy_id=academy.id,
        slug=data['slug'],
        name=data['name'],
        description=data.get('description'),
        icon=data.get('icon')
    )
    db.session.add(path)
    db.session.commit()
    return jsonify({'message': 'Learning path created', 'id': path.id}), 201

# ─── Courses ───────────────────────────────────────────────────────────────────

@cms_bp.route('/courses', methods=['GET'])
@jwt_required()
def list_courses():
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 20, type=int)
    difficulty = request.args.get('difficulty')
    status = request.args.get('status')
    search = request.args.get('search')

    q = Course.query
    if difficulty:
        q = q.filter_by(difficulty=difficulty)
    if status:
        q = q.filter_by(status=status)
    if search:
        q = q.filter(Course.title.ilike(f'%{search}%'))

    courses = q.paginate(page=page, per_page=per_page, error_out=False)
    return jsonify({
        'items': [course_to_dict(c) for c in courses.items],
        'total': courses.total,
        'pages': courses.pages,
        'page': page
    }), 200

def course_to_dict(c):
    return {
        'id': c.id, 'slug': c.slug, 'title': c.title,
        'description': c.description, 'difficulty': c.difficulty,
        'estimated_duration': c.estimated_duration, 'thumbnail': c.thumbnail,
        'status': c.status, 'xp_reward': c.xp_reward, 'coin_reward': c.coin_reward,
        'version': c.version, 'learning_path_id': c.learning_path_id
    }

@cms_bp.route('/courses/<int:course_id>', methods=['GET'])
@jwt_required()
def get_course(course_id):
    c = Course.query.get_or_404(course_id)
    data = course_to_dict(c)
    data['modules'] = [
        {'id': m.id, 'slug': m.slug, 'title': m.title, 'order': m.order}
        for m in sorted(c.modules, key=lambda m: m.order)
    ]
    return jsonify(data), 200

@cms_bp.route('/courses', methods=['POST'])
@jwt_required()
def create_course():
    require_admin()
    data = request.get_json()
    course = Course(
        learning_path_id=data['learning_path_id'],
        slug=data['slug'],
        title=data['title'],
        description=data.get('description'),
        difficulty=data.get('difficulty', 'Beginner'),
        estimated_duration=data.get('estimated_duration'),
        thumbnail=data.get('thumbnail'),
        banner=data.get('banner'),
        prerequisites=data.get('prerequisites', []),
        learning_outcomes=data.get('learning_outcomes', []),
        xp_reward=data.get('xp_reward', 500),
        coin_reward=data.get('coin_reward', 100),
        status=data.get('status', 'Draft'),
        language=data.get('language', 'en'),
        seo_metadata=data.get('seo_metadata', {}),
    )
    db.session.add(course)
    db.session.commit()
    return jsonify({'message': 'Course created', 'id': course.id}), 201

@cms_bp.route('/courses/<int:course_id>', methods=['PATCH'])
@jwt_required()
def update_course(course_id):
    require_admin()
    course = Course.query.get_or_404(course_id)
    data = request.get_json()
    for field in ('title', 'description', 'difficulty', 'estimated_duration',
                  'thumbnail', 'banner', 'status', 'xp_reward', 'coin_reward',
                  'prerequisites', 'learning_outcomes', 'seo_metadata', 'version'):
        if field in data:
            setattr(course, field, data[field])
    db.session.commit()
    return jsonify({'message': 'Course updated'}), 200

@cms_bp.route('/courses/<int:course_id>', methods=['DELETE'])
@jwt_required()
def delete_course(course_id):
    require_admin()
    course = Course.query.get_or_404(course_id)
    db.session.delete(course)
    db.session.commit()
    return jsonify({'message': 'Course deleted'}), 200

# ─── Modules ───────────────────────────────────────────────────────────────────

@cms_bp.route('/modules', methods=['POST'])
@jwt_required()
def create_module():
    require_admin()
    data = request.get_json()
    mod = Module(
        course_id=data['course_id'],
        slug=data['slug'],
        title=data['title'],
        summary=data.get('summary'),
        difficulty=data.get('difficulty', 'Beginner'),
        estimated_time=data.get('estimated_time'),
        unlock_requirement=data.get('unlock_requirement'),
        xp_reward=data.get('xp_reward', 100),
        order=data.get('order', 1),
    )
    db.session.add(mod)
    db.session.commit()
    return jsonify({'message': 'Module created', 'id': mod.id}), 201

@cms_bp.route('/modules/<int:module_id>', methods=['PATCH'])
@jwt_required()
def update_module(module_id):
    require_admin()
    mod = Module.query.get_or_404(module_id)
    data = request.get_json()
    for field in ('title', 'summary', 'difficulty', 'estimated_time',
                  'unlock_requirement', 'xp_reward', 'order'):
        if field in data:
            setattr(mod, field, data[field])
    db.session.commit()
    return jsonify({'message': 'Module updated'}), 200
