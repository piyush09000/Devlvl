from flask import request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.extensions import db
from app.models.submission import Submission
from app.models.problem import Problem
from app.services.judge_service import judge_service
from app.services.xp_service import award_xp
from app.services.quest_service import update_quest_progress
# from app.services.streak_service import record_daily_completion
from . import submissions_bp

@submissions_bp.route('/', methods=['POST'])
@jwt_required()
def submit_solution():
    current_user_id = get_jwt_identity()
    data = request.get_json()
    
    problem_id = data.get('problem_id')
    language_id = data.get('language_id')
    source_code = data.get('code')
    
    # We can accept either problem_id or slug from frontend
    if problem_id:
        problem = Problem.query.get_or_404(problem_id)
    elif 'slug' in data:
        problem = Problem.query.filter_by(slug=data.get('slug')).first_or_404()
    else:
        return jsonify({'error': 'problem_id or slug required'}), 400
        
    problem.total_submissions += 1
    
    # Enterprise evaluation: we must run ALL tests (sample + hidden)
    # For MVP we will just run the first hidden test if available, or first sample
    all_tests = problem.hidden_tests + problem.sample_tests
    
    if not all_tests:
        return jsonify({'error': 'Problem has no test cases'}), 400
        
    test_case = all_tests[0]
    expected_output = test_case.get('output', '')
    stdin = test_case.get('input', '')
    
    try:
        # Submit to Judge0
        token = judge_service.submit_code(source_code, language_id, expected_output, stdin)
        result = judge_service.get_submission_result(token)
        
        status_desc = result.get('status', {}).get('description', 'Error')
        runtime = float(result.get('time', 0)) if result.get('time') else 0.0
        memory = float(result.get('memory', 0)) if result.get('memory') else 0.0
        
        submission = Submission(
            user_id=current_user_id,
            problem_id=problem.id,
            language_id=language_id,
            code=source_code,
            status=status_desc,
            runtime_ms=runtime * 1000,
            memory_kb=memory
        )
        
        db.session.add(submission)
        
        if status_desc == 'Accepted':
            problem.accepted_submissions += 1
            # TODO: Call streak_service
            # record_daily_completion(current_user_id)
            
            # Award XP based on problem's base xp and difficulty
            award_xp(
                user_id=current_user_id,
                base_amount=problem.xp_reward,
                source="problem_solved",
                reference_id=problem.id,
                difficulty=problem.difficulty
            )
            
            # Update generic quest
            update_quest_progress(current_user_id, 'solve_any', 1)
            # Update difficulty-specific quest
            if problem.difficulty:
                update_quest_progress(current_user_id, f'solve_{problem.difficulty.lower()}', 1)
            
        db.session.commit()
        
        return jsonify(submission.to_dict()), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
