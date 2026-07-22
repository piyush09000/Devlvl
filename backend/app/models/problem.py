from datetime import datetime
from app.extensions import db

class Problem(db.Model):
    __tablename__ = 'problems'

    id = db.Column(db.Integer, primary_key=True)
    slug = db.Column(db.String(150), unique=True, nullable=False, index=True)
    title = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text, nullable=False)     # Markdown

    # Categorization
    difficulty = db.Column(db.String(50), nullable=False, default='Easy')  # Easy, Medium, Hard
    tags = db.Column(db.JSON, nullable=True, default=list)           # ["Array", "Hash Table"]
    companies = db.Column(db.JSON, nullable=True, default=list)      # ["Google", "Meta"]
    topics = db.Column(db.JSON, nullable=True, default=list)         # structured topic refs
    source = db.Column(db.String(100), nullable=True)                # Interview, Contest, LMS, etc.

    # Content Enhancements
    input_format = db.Column(db.Text, nullable=True)
    output_format = db.Column(db.Text, nullable=True)
    constraints = db.Column(db.Text, nullable=True)                  # Markdown
    hints = db.Column(db.JSON, nullable=True, default=list)
    editorial = db.Column(db.Text, nullable=True)                    # Full markdown editorial
    video_explanation_url = db.Column(db.String(500), nullable=True)
    related_problem_ids = db.Column(db.JSON, nullable=True, default=list)

    # Status & Visibility
    status = db.Column(db.String(50), default='Published')           # Draft, Published, Archived

    # Rewards
    xp_reward = db.Column(db.Integer, default=10)
    coin_reward = db.Column(db.Integer, default=5)

    # Execution (Judge0)
    supported_languages = db.Column(db.JSON, nullable=False, default=lambda: ["python", "javascript"])
    starter_code = db.Column(db.JSON, nullable=True)  # {"python": "def solve():\n    pass"}
    time_limit_ms = db.Column(db.Integer, default=2000)
    memory_limit_kb = db.Column(db.Integer, default=128000)
    custom_checker = db.Column(db.Text, nullable=True)               # Custom judge code if needed

    # Test Cases
    sample_tests = db.Column(db.JSON, nullable=False, default=list)  # [{"input": ..., "output": ...}]
    hidden_tests = db.Column(db.JSON, nullable=False, default=list)

    # Engagement Metrics (denormalized for performance)
    total_submissions = db.Column(db.Integer, default=0)
    accepted_submissions = db.Column(db.Integer, default=0)
    likes = db.Column(db.Integer, default=0)
    bookmarks = db.Column(db.Integer, default=0)

    # LMS linkage (which course/module this problem belongs to)
    course_id = db.Column(db.Integer, db.ForeignKey('courses.id'), nullable=True)
    module_id = db.Column(db.Integer, db.ForeignKey('modules.id'), nullable=True)

    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    @property
    def acceptance_rate(self):
        if self.total_submissions == 0:
            return 0
        return round((self.accepted_submissions / self.total_submissions) * 100, 2)

    def to_dict(self, include_hidden=False, include_editorial=False):
        data = {
            'id': self.id,
            'slug': self.slug,
            'title': self.title,
            'description': self.description,
            'difficulty': self.difficulty,
            'tags': self.tags,
            'companies': self.companies,
            'topics': self.topics,
            'input_format': self.input_format,
            'output_format': self.output_format,
            'constraints': self.constraints,
            'hints': self.hints,
            'video_explanation_url': self.video_explanation_url,
            'related_problem_ids': self.related_problem_ids,
            'xp_reward': self.xp_reward,
            'coin_reward': self.coin_reward,
            'supported_languages': self.supported_languages,
            'starter_code': self.starter_code,
            'time_limit_ms': self.time_limit_ms,
            'memory_limit_kb': self.memory_limit_kb,
            'sample_tests': self.sample_tests,
            'acceptance_rate': self.acceptance_rate,
            'total_submissions': self.total_submissions,
            'likes': self.likes,
            'bookmarks': self.bookmarks,
            'status': self.status,
        }
        if include_hidden:
            data['hidden_tests'] = self.hidden_tests
        if include_editorial:
            data['editorial'] = self.editorial
        return data
