"""
CMS Boss Battle Engine — CRUD for Bosses + Battle Submission Logic.
"""
from flask import request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.extensions import db
from app.models.assessments import BossBattle
from app.models.problem import Problem
from . import cms_bp
from .courses import require_admin

@cms_bp.route('/bosses', methods=['GET'])
@jwt_required()
def list_bosses():
    bosses = BossBattle.query.all()
    return jsonify({'bosses': [boss_to_dict(b) for b in bosses]}), 200

def boss_to_dict(b):
    return {
        'id': b.id, 'name': b.name, 'avatar': b.avatar, 'story': b.story,
        'difficulty': b.difficulty, 'max_lives': b.max_lives,
        'time_limit_sec': b.time_limit_sec, 'xp_reward': b.xp_reward,
        'coin_reward': b.coin_reward, 'problems': b.problems or [],
        'module_id': b.module_id,
    }

@cms_bp.route('/bosses', methods=['POST'])
@jwt_required()
def create_boss():
    require_admin()
    data = request.get_json()
    boss = BossBattle(
        name=data['name'],
        avatar=data.get('avatar'),
        story=data.get('story'),
        difficulty=data.get('difficulty', 'Hard'),
        max_lives=data.get('max_lives', 3),
        time_limit_sec=data.get('time_limit_sec', 3600),
        xp_reward=data.get('xp_reward', 1000),
        coin_reward=data.get('coin_reward', 500),
        unlock_condition=data.get('unlock_condition'),
        animation_config=data.get('animation_config'),
        module_id=data.get('module_id'),
        problems=data.get('problems', []),
    )
    db.session.add(boss)
    db.session.commit()
    return jsonify({'message': 'Boss created', 'id': boss.id}), 201

@cms_bp.route('/bosses/<int:boss_id>', methods=['PATCH'])
@jwt_required()
def update_boss(boss_id):
    require_admin()
    boss = BossBattle.query.get_or_404(boss_id)
    data = request.get_json()
    for field in ('name', 'avatar', 'story', 'difficulty', 'max_lives',
                  'time_limit_sec', 'xp_reward', 'coin_reward',
                  'unlock_condition', 'problems', 'module_id'):
        if field in data:
            setattr(boss, field, data[field])
    db.session.commit()
    return jsonify({'message': 'Boss updated'}), 200

@cms_bp.route('/bosses/<int:boss_id>/attack', methods=['POST'])
@jwt_required()
def attack_boss(boss_id):
    """
    Student attacks the boss by submitting an answer to a problem.
    On correct answer, boss loses HP. On wrong answer, player loses a life.
    """
    user_id = get_jwt_identity()
    boss = BossBattle.query.get_or_404(boss_id)
    data = request.get_json()

    problem_id = data.get('problem_id')
    is_correct = data.get('is_correct', False)   # Determined by submission result

    if is_correct:
        problem = Problem.query.get(problem_id)
        # Award XP fragment (full reward when boss dies)
        xp_fragment = int((boss.xp_reward / max(len(boss.problems or [1]), 1)))
        from app.services.xp_service import award_xp
        award_xp(user_id, xp_fragment, reason=f'boss_{boss_id}_attack')
        return jsonify({
            'result': 'hit',
            'xp_fragment': xp_fragment,
            'message': f'Hit {boss.name}! Keep going!'
        }), 200
    else:
        return jsonify({
            'result': 'miss',
            'message': 'Wrong answer! You lost a life.'
        }), 200
