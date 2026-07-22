import time
from flask import request, jsonify
from flask_jwt_extended import jwt_required
from . import ai_bp

MOCK_RESPONSES = {
    'hint': "Here's a hint without spoiling the solution: Think about what data structure gives you **O(1) lookup time**. If you need to find a pair that sums to a target, could you store what you've already seen?",
    'complexity': "For this problem, an optimal solution runs in **O(n) time** and **O(n) space**. If your current approach is O(n²), you're probably using nested loops — try replacing the inner loop with a hash map lookup!",
    'stuck': "It happens to everyone! Let's break it down:\n\n1. **Understand the problem** — Can you explain it back to me in your own words?\n2. **Think of examples** — Start with the smallest possible input.\n3. **Brute force first** — A slow solution is better than no solution.\n4. **Optimize** — What's the bottleneck? Can you cache repeated work?",
    'approach': "The key insight is: instead of searching the whole array for the complement, **precompute** it.\n\nThis is the classic hash map pattern. Learn it — you'll use it constantly! 🧠",
}

@ai_bp.route('/ask', methods=['POST'])
@jwt_required()
def ask_mentor():
    data = request.get_json()
    message = data.get('message', '').lower()
    
    # Simulate thinking delay
    time.sleep(1.5)
    
    response = "Great question! As your AI Mentor, I'm here to guide you. Let's think through this step by step. What have you tried so far?"
    
    for key, res in MOCK_RESPONSES.items():
        if key in message:
            response = res
            break
            
    return jsonify({
        'role': 'mentor',
        'content': response
    }), 200
