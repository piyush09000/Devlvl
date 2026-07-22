from flask import request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.extensions import db
from app.models.skill_node import SkillNode, UserSkillProgress
from . import skills_bp

@skills_bp.route('/', methods=['GET'])
@jwt_required(optional=True)
def get_skill_tree():
    current_user_id = get_jwt_identity()
    
    # In a real MVP, we'd fetch all nodes and the user's progress.
    # For now, if the table is empty, we can return a static/mock tree.
    nodes = SkillNode.query.order_by(SkillNode.tier, SkillNode.id).all()
    
    # If no nodes exist in DB, return a hardcoded structure (MVP fallback)
    if not nodes:
        mock_tree = [
            {"id": 1, "title": "Arrays & Hashing", "tier": 1, "prerequisites": [], "completion_threshold": 3},
            {"id": 2, "title": "Two Pointers", "tier": 2, "prerequisites": [1], "completion_threshold": 3},
            {"id": 3, "title": "Sliding Window", "tier": 2, "prerequisites": [1], "completion_threshold": 3},
            {"id": 4, "title": "Stack", "tier": 2, "prerequisites": [1], "completion_threshold": 2},
            {"id": 5, "title": "Binary Search", "tier": 3, "prerequisites": [2], "completion_threshold": 3},
            {"id": 6, "title": "Linked List", "tier": 3, "prerequisites": [2], "completion_threshold": 3},
        ]
        
        progress_dict = {}
        if current_user_id:
            # Mock progress: Arrays completed, Two Pointers unlocked
            progress_dict = {
                1: {"problems_solved": 3, "is_completed": True},
                2: {"problems_solved": 1, "is_completed": False}
            }
            
        return jsonify({
            "nodes": mock_tree,
            "progress": progress_dict
        }), 200

    nodes_data = [n.to_dict() for n in nodes]
    progress_dict = {}
    
    if current_user_id:
        progress = UserSkillProgress.query.filter_by(user_id=current_user_id).all()
        progress_dict = {p.skill_node_id: p.to_dict() for p in progress}
        
    return jsonify({
        "nodes": nodes_data,
        "progress": progress_dict
    }), 200
