"""
CMS Lessons API — full CRUD for Chapters and Lessons (content blocks).
"""
import uuid
from flask import request, jsonify
from flask_jwt_extended import jwt_required
from app.extensions import db
from app.models.lms import Chapter, Lesson, Module
from . import cms_bp
from .courses import require_admin

# ─── Chapters ──────────────────────────────────────────────────────────────────

@cms_bp.route('/chapters', methods=['POST'])
@jwt_required()
def create_chapter():
    require_admin()
    data = request.get_json()
    ch = Chapter(
        module_id=data['module_id'],
        title=data['title'],
        order=data.get('order', 1),
    )
    db.session.add(ch)
    db.session.commit()
    return jsonify({'message': 'Chapter created', 'id': ch.id}), 201

# ─── Lessons ───────────────────────────────────────────────────────────────────

@cms_bp.route('/lessons', methods=['GET'])
@jwt_required()
def list_lessons():
    chapter_id = request.args.get('chapter_id', type=int)
    if chapter_id:
        lessons = Lesson.query.filter_by(chapter_id=chapter_id).order_by(Lesson.order).all()
    else:
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 20, type=int)
        lessons = Lesson.query.paginate(page=page, per_page=per_page, error_out=False).items
    return jsonify({'lessons': [lesson_to_dict(l) for l in lessons]}), 200

def lesson_to_dict(l):
    return {
        'id': l.id, 'slug': l.slug, 'title': l.title,
        'order': l.order, 'status': l.status,
        'chapter_id': l.chapter_id, 'problem_id': l.problem_id,
    }

@cms_bp.route('/lessons/<int:lesson_id>', methods=['GET'])
@jwt_required()
def get_lesson(lesson_id):
    l = Lesson.query.get_or_404(lesson_id)
    return jsonify({
        **lesson_to_dict(l),
        'content_blocks': l.content_blocks or []
    }), 200

@cms_bp.route('/lessons', methods=['POST'])
@jwt_required()
def create_lesson():
    require_admin()
    data = request.get_json()
    slug = data.get('slug') or f"lesson-{uuid.uuid4().hex[:8]}"
    lesson = Lesson(
        chapter_id=data['chapter_id'],
        slug=slug,
        title=data['title'],
        content_blocks=data.get('content_blocks', []),
        order=data.get('order', 1),
        status=data.get('status', 'Draft'),
        problem_id=data.get('problem_id'),
    )
    db.session.add(lesson)
    db.session.commit()
    return jsonify({'message': 'Lesson created', 'id': lesson.id}), 201

@cms_bp.route('/lessons/<int:lesson_id>', methods=['PATCH'])
@jwt_required()
def update_lesson(lesson_id):
    require_admin()
    lesson = Lesson.query.get_or_404(lesson_id)
    data = request.get_json()
    for field in ('title', 'content_blocks', 'order', 'status', 'problem_id', 'slug'):
        if field in data:
            setattr(lesson, field, data[field])
    db.session.commit()
    return jsonify({'message': 'Lesson updated'}), 200

@cms_bp.route('/lessons/<int:lesson_id>', methods=['DELETE'])
@jwt_required()
def delete_lesson(lesson_id):
    require_admin()
    lesson = Lesson.query.get_or_404(lesson_id)
    db.session.delete(lesson)
    db.session.commit()
    return jsonify({'message': 'Lesson deleted'}), 200

# ─── Publish / Archive (versioning state machine) ──────────────────────────────

@cms_bp.route('/lessons/<int:lesson_id>/publish', methods=['POST'])
@jwt_required()
def publish_lesson(lesson_id):
    require_admin()
    lesson = Lesson.query.get_or_404(lesson_id)
    lesson.status = 'Published'
    db.session.commit()
    return jsonify({'message': f'Lesson {lesson.id} published'}), 200

@cms_bp.route('/lessons/<int:lesson_id>/archive', methods=['POST'])
@jwt_required()
def archive_lesson(lesson_id):
    require_admin()
    lesson = Lesson.query.get_or_404(lesson_id)
    lesson.status = 'Archived'
    db.session.commit()
    return jsonify({'message': f'Lesson {lesson.id} archived'}), 200
