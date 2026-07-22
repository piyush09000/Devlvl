import requests
import base64
import time
from flask import current_app

class JudgeService:
    def __init__(self):
        pass
        
    def _get_api_url(self):
        return current_app.config.get('JUDGE0_API_URL', 'http://localhost:2358')

    def submit_code(self, source_code, language_id, expected_output, stdin=None):
        url = f"{self._get_api_url()}/submissions?base64_encoded=true&wait=false"
        
        payload = {
            "source_code": base64.b64encode(source_code.encode('utf-8')).decode('utf-8'),
            "language_id": language_id,
            "expected_output": base64.b64encode(expected_output.encode('utf-8')).decode('utf-8') if expected_output else None
        }
        
        if stdin:
            payload["stdin"] = base64.b64encode(stdin.encode('utf-8')).decode('utf-8')

        response = requests.post(url, json=payload)
        response.raise_for_status()
        
        return response.json()['token']

    def get_submission_result(self, token):
        url = f"{self._get_api_url()}/submissions/{token}?base64_encoded=true"
        
        # Poll for result
        for _ in range(10): # Try 10 times
            response = requests.get(url)
            response.raise_for_status()
            result = response.json()
            
            # Status > 2 means finished (3=Accepted, 4=Wrong Answer, etc)
            if result['status']['id'] > 2:
                return result
                
            time.sleep(1) # wait 1 second before polling again
            
        return {"error": "Timeout waiting for Judge0"}
        
judge_service = JudgeService()
