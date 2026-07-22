"""
CMS Quiz Engine — CRUD for Quizzes and Questions.
"""
from flask import request, jsonify
from flask_jwt_extended import jwt_required
from app.extensions import db
from app.models.assessments import Quiz, Question
from . import cms_bp
from .courses import require_admin

@cms_bp.route('/quizzes', methods=['POST'])
@jwt_required()
def create_quiz():
    require_admin()
    data = request.get_json()
    quiz = Quiz(
        title=data['title'],
        description=data.get('description'),
        is_adaptive=data.get('is_adaptive', False),
        time_limit_sec=data.get('time_limit_sec'),
        xp_reward=data.get('xp_reward', 50),
        lesson_id=data.get('lesson_id'),
    )
    db.session.add(quiz)
    db.session.flush()

    # Allow creating questions inline
    for i, q in enumerate(data.get('questions', [])):
        question = Question(
            quiz_id=quiz.id,
            type=q.get('type', 'MCQ'),
            content=q['content'],
            options=q.get('options', []),
            explanation=q.get('explanation'),
            order=q.get('order', i + 1),
        )
        db.session.add(question)

    db.session.commit()
    return jsonify({'message': 'Quiz created', 'id': quiz.id}), 201

@cms_bp.route('/quizzes/<int:quiz_id>', methods=['GET'])
@jwt_required()
def get_quiz(quiz_id):
    quiz = Quiz.query.get_or_404(quiz_id)
    return jsonify({
        'id': quiz.id, 'title': quiz.title, 'description': quiz.description,
        'is_adaptive': quiz.is_adaptive, 'time_limit_sec': quiz.time_limit_sec,
        'xp_reward': quiz.xp_reward,
        'questions': [
            {'id': q.id, 'type': q.type, 'content': q.content,
             'options': q.options, 'explanation': q.explanation, 'order': q.order}
            for q in sorted(quiz.questions, key=lambda x: x.order)
        ]
    }), 200

@cms_bp.route('/quizzes/<int:quiz_id>/questions', methods=['POST'])
@jwt_required()
def add_question(quiz_id):
    require_admin()
    Quiz.query.get_or_404(quiz_id)
    data = request.get_json()
    q = Question(
        quiz_id=quiz_id,
        type=data.get('type', 'MCQ'),
        content=data['content'],
        options=data.get('options', []),
        explanation=data.get('explanation'),
        order=data.get('order', 1),
    )
    db.session.add(q)
    db.session.commit()
    return jsonify({'message': 'Question added', 'id': q.id}), 201

@cms_bp.route('/quizzes/<int:quiz_id>/submit', methods=['POST'])
@jwt_required()
def submit_quiz(quiz_id):
    """Grade a student's quiz submission and return score + XP."""
    from flask_jwt_extended import get_jwt_identity
    user_id = get_jwt_identity()
    quiz = Quiz.query.get_or_404(quiz_id)
    answers = request.get_json()  # {question_id: selected_option_id}

    correct = 0
    total = len(quiz.questions)
    feedback = []
    for question in quiz.questions:
        user_answer = answers.get(str(question.id))
        correct_option = next((o for o in (question.options or []) if o.get('is_correct')), None)
        is_correct = correct_option and user_answer == correct_option.get('id')
        if is_correct:
            correct += 1
        feedback.append({
            'question_id': question.id,
            'correct': is_correct,
            'explanation': question.explanation
        })

    score_pct = round((correct / total) * 100, 1) if total > 0 else 0
    earned_xp = int(quiz.xp_reward * (score_pct / 100))

    # Award XP
    if earned_xp > 0:
        from app.services.xp_service import award_xp
        award_xp(user_id, earned_xp, reason=f'quiz_{quiz_id}')

    return jsonify({
        'correct': correct,
        'total': total,
        'score_pct': score_pct,
        'xp_earned': earned_xp,
        'feedback': feedback
    }), 200
