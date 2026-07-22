"""
seed_lms.py — Devlvl Phase 2 Learning Ecosystem Seeder

Seeds:
  - 1 Academy
  - 10 Learning Paths
  - 50 Courses (5 per path)
  - 200 Modules
  - 500 Chapters
  - 500 Lessons
  - 50 Boss Battles
  - 1,000 Problems
  - 200 Quizzes (with questions)

Run:
    cd backend
    .\\venv\\Scripts\\activate
    python seed_lms.py
"""
import os
import sys
import random
import string

sys.path.insert(0, os.path.dirname(__file__))

from app import create_app
from app.extensions import db
from app.models.lms import Academy, LearningPath, Course, Module, Chapter, Lesson
from app.models.assessments import Quiz, Question, BossBattle
from app.models.problem import Problem

app = create_app()

# ─── Seed Data Templates ────────────────────────────────────────────────────────

LEARNING_PATHS = [
    {"slug": "frontend-developer",    "name": "Frontend Developer",    "icon": "🖥️"},
    {"slug": "backend-developer",     "name": "Backend Developer",     "icon": "⚙️"},
    {"slug": "fullstack-developer",   "name": "Full Stack Developer",  "icon": "🌐"},
    {"slug": "python-developer",      "name": "Python Developer",      "icon": "🐍"},
    {"slug": "javascript-developer",  "name": "JavaScript Developer",  "icon": "📜"},
    {"slug": "dsa-track",             "name": "Data Structures & Algorithms", "icon": "🔢"},
    {"slug": "machine-learning",      "name": "Machine Learning",      "icon": "🤖"},
    {"slug": "devops-track",          "name": "DevOps",                "icon": "🚀"},
    {"slug": "cybersecurity-track",   "name": "Cyber Security",        "icon": "🔐"},
    {"slug": "data-science-track",    "name": "Data Science",          "icon": "📊"},
]

COURSE_TEMPLATES = {
    "frontend-developer": [
        ("HTML Foundations",           "Beginner",      "Master semantic HTML5 and accessibility.",                   90),
        ("CSS Mastery",                "Beginner",      "Deep dive into CSS layouts, Flexbox, and Grid.",             120),
        ("JavaScript Core",            "Intermediate",  "Variables, functions, closures, and the DOM.",               180),
        ("React Essentials",           "Intermediate",  "Build dynamic UIs with React, hooks, and context.",          240),
        ("Advanced Frontend Engineering","Advanced",    "Performance, SSR, bundlers, and design systems.",            300),
    ],
    "backend-developer": [
        ("Networking & HTTP",          "Beginner",      "Understand how the internet works.",                         60),
        ("Python for Backend",         "Beginner",      "Flask, FastAPI, and REST API design.",                       150),
        ("Databases & SQL",            "Intermediate",  "Postgres, indexes, queries, and migrations.",                180),
        ("Authentication & Security",  "Intermediate",  "JWT, OAuth2, and secure API design.",                        120),
        ("Microservices Architecture", "Advanced",      "Docker, Kubernetes, and distributed systems.",               300),
    ],
    "dsa-track": [
        ("Arrays & Strings",           "Beginner",      "Two pointers, sliding window, and prefix sums.",             120),
        ("Linked Lists & Trees",       "Intermediate",  "Binary trees, BST operations, and traversals.",              150),
        ("Graphs & BFS/DFS",           "Intermediate",  "Graph representation, shortest paths.",                      180),
        ("Dynamic Programming",        "Advanced",      "Memoization, tabulation, and classic DP problems.",          240),
        ("Advanced Algorithms",        "Advanced",      "Greedy, Divide & Conquer, and Backtracking.",                300),
    ],
    "python-developer": [
        ("Python Basics",              "Beginner",      "Syntax, data types, loops, and functions.",                  90),
        ("Object-Oriented Python",     "Intermediate",  "Classes, inheritance, and magic methods.",                   120),
        ("Python Standard Library",    "Intermediate",  "itertools, collections, pathlib, and more.",                 100),
        ("Testing in Python",          "Intermediate",  "pytest, mocking, and TDD workflow.",                         90),
        ("Async Python",               "Advanced",      "asyncio, aiohttp, and concurrency.",                         150),
    ],
    "javascript-developer": [
        ("JS Fundamentals",            "Beginner",      "Variables, events, and the DOM.",                            100),
        ("ES6+ Modern JavaScript",     "Intermediate",  "Arrow functions, destructuring, and modules.",               120),
        ("Asynchronous JS",            "Intermediate",  "Promises, async/await, and fetch API.",                      120),
        ("TypeScript Mastery",         "Intermediate",  "Types, generics, and integrating with React.",               150),
        ("Node.js & Express",          "Advanced",      "Backend JS, middleware, and REST APIs.",                     200),
    ],
    "machine-learning": [
        ("ML Foundations",             "Beginner",      "What is ML, supervised/unsupervised learning.",              90),
        ("Data Preprocessing",         "Beginner",      "Pandas, NumPy, and feature engineering.",                    120),
        ("Classical ML Algorithms",    "Intermediate",  "Linear regression, SVM, decision trees.",                    200),
        ("Neural Networks & Deep Learning","Advanced",  "Backprop, CNNs, RNNs with PyTorch.",                         300),
        ("MLOps & Deployment",         "Advanced",      "Model serving, monitoring, and CI/CD for ML.",               240),
    ],
    "fullstack-developer": [
        ("Web Fundamentals",           "Beginner",      "HTML, CSS, and JS together.",                                120),
        ("React + REST API",           "Intermediate",  "Build a full client-server app.",                            200),
        ("Databases for Full Stack",   "Intermediate",  "SQL and NoSQL for web apps.",                                150),
        ("Auth & Deployment",          "Intermediate",  "Secure apps and deploy to the cloud.",                       120),
        ("Full Stack Capstone",        "Advanced",      "Build a production-grade SaaS from scratch.",                360),
    ],
    "devops-track": [
        ("Linux & Shell Scripting",    "Beginner",      "Commands, file system, and bash scripts.",                   90),
        ("Docker & Containers",        "Intermediate",  "Containerize apps and compose services.",                    150),
        ("CI/CD Pipelines",            "Intermediate",  "GitHub Actions, Jenkins, and deployment automation.",        120),
        ("Kubernetes",                 "Advanced",      "Orchestrate containers at scale.",                           240),
        ("Cloud Platforms (AWS/GCP)",  "Advanced",      "Deploy, scale, and monitor on the cloud.",                   300),
    ],
    "cybersecurity-track": [
        ("Security Fundamentals",      "Beginner",      "CIA triad, threat models, and cryptography basics.",         90),
        ("Network Security",           "Intermediate",  "Firewalls, IDS/IPS, and packet analysis.",                   120),
        ("Web App Security (OWASP)",   "Intermediate",  "SQL injection, XSS, CSRF, and OWASP Top 10.",               150),
        ("Ethical Hacking",            "Advanced",      "Recon, exploitation, and penetration testing.",              240),
        ("Secure Code Review",         "Advanced",      "Analyze and harden real-world codebases.",                   180),
    ],
    "data-science-track": [
        ("Data Analysis Fundamentals", "Beginner",      "Pandas, data cleaning, and EDA.",                           100),
        ("Statistics for Data Science","Beginner",      "Probability, distributions, and hypothesis testing.",        120),
        ("Data Visualization",         "Intermediate",  "Matplotlib, Seaborn, and Plotly.",                           120),
        ("Machine Learning for DS",    "Intermediate",  "Sklearn, cross-validation, and model evaluation.",           180),
        ("SQL for Analysts",           "Intermediate",  "Advanced queries, window functions, and dashboards.",        150),
    ],
}

BOSS_TEMPLATES = [
    {"name": "The Syntax Sentinel",     "difficulty": "Easy",   "xp": 500,  "coins": 200},
    {"name": "The Loop Lich",           "difficulty": "Easy",   "xp": 500,  "coins": 200},
    {"name": "Algorithm Archfiend",     "difficulty": "Medium", "xp": 1000, "coins": 400},
    {"name": "The Pointer Phantom",     "difficulty": "Medium", "xp": 1000, "coins": 400},
    {"name": "Runtime Error Wraith",    "difficulty": "Medium", "xp": 1200, "coins": 500},
    {"name": "The Recursion Demon",     "difficulty": "Hard",   "xp": 2000, "coins": 800},
    {"name": "Big-O Behemoth",          "difficulty": "Hard",   "xp": 2000, "coins": 800},
    {"name": "Deadlock Dragon",         "difficulty": "Hard",   "xp": 2500, "coins": 1000},
    {"name": "The NullPointer Necromancer","difficulty": "Hard","xp": 2500, "coins": 1000},
    {"name": "The Final Compiler",      "difficulty": "Legendary","xp": 5000,"coins": 2500},
]

PROBLEM_TAGS = [
    "Array", "Hash Table", "Linked List", "Tree", "Binary Search", "Graph",
    "Dynamic Programming", "Greedy", "Two Pointers", "Sliding Window",
    "Sorting", "Stack", "Queue", "Heap", "String", "Math", "Recursion",
    "Backtracking", "Bit Manipulation", "Matrix", "Depth-First Search",
    "Breadth-First Search", "Trie", "Divide and Conquer", "Monotonic Stack",
]

COMPANIES = ["Google", "Meta", "Amazon", "Microsoft", "Apple", "Netflix",
             "Stripe", "Uber", "Airbnb", "Twitter", "LinkedIn", "Adobe"]

PROBLEM_CATALOG = [
    # Arrays & Hashing
    {"title": "Two Sum",                    "difficulty": "Easy",   "tags": ["Array","Hash Table"]},
    {"title": "Best Time to Buy and Sell Stock","difficulty": "Easy","tags": ["Array"]},
    {"title": "Contains Duplicate",         "difficulty": "Easy",   "tags": ["Array","Hash Table"]},
    {"title": "Product of Array Except Self","difficulty": "Medium","tags": ["Array"]},
    {"title": "Maximum Subarray",           "difficulty": "Medium", "tags": ["Array","Dynamic Programming"]},
    {"title": "Maximum Product Subarray",   "difficulty": "Medium", "tags": ["Array","Dynamic Programming"]},
    {"title": "Longest Consecutive Sequence","difficulty": "Medium","tags": ["Array","Hash Table"]},
    {"title": "Valid Anagram",              "difficulty": "Easy",   "tags": ["Hash Table","String"]},
    {"title": "Group Anagrams",             "difficulty": "Medium", "tags": ["Hash Table","String"]},
    {"title": "Top K Frequent Elements",    "difficulty": "Medium", "tags": ["Hash Table","Heap"]},
    # Two Pointers
    {"title": "Valid Palindrome",           "difficulty": "Easy",   "tags": ["Two Pointers","String"]},
    {"title": "Container With Most Water",  "difficulty": "Medium", "tags": ["Two Pointers","Array"]},
    {"title": "3Sum",                       "difficulty": "Medium", "tags": ["Two Pointers","Array"]},
    {"title": "Trapping Rain Water",        "difficulty": "Hard",   "tags": ["Two Pointers","Array"]},
    # Sliding Window
    {"title": "Minimum Window Substring",   "difficulty": "Hard",   "tags": ["Sliding Window","String"]},
    {"title": "Longest Substring Without Repeating Characters","difficulty":"Medium","tags":["Sliding Window","String"]},
    {"title": "Permutation in String",      "difficulty": "Medium", "tags": ["Sliding Window","String"]},
    {"title": "Sliding Window Maximum",     "difficulty": "Hard",   "tags": ["Sliding Window","Heap"]},
    # Linked List
    {"title": "Reverse Linked List",        "difficulty": "Easy",   "tags": ["Linked List"]},
    {"title": "Merge Two Sorted Lists",     "difficulty": "Easy",   "tags": ["Linked List"]},
    {"title": "Linked List Cycle",          "difficulty": "Easy",   "tags": ["Linked List","Two Pointers"]},
    {"title": "Remove Nth Node From End",   "difficulty": "Medium", "tags": ["Linked List","Two Pointers"]},
    {"title": "Reorder List",               "difficulty": "Medium", "tags": ["Linked List"]},
    {"title": "Merge K Sorted Lists",       "difficulty": "Hard",   "tags": ["Linked List","Heap"]},
    # Trees
    {"title": "Invert Binary Tree",         "difficulty": "Easy",   "tags": ["Tree","Depth-First Search"]},
    {"title": "Maximum Depth of Binary Tree","difficulty": "Easy",  "tags": ["Tree","Depth-First Search"]},
    {"title": "Same Tree",                  "difficulty": "Easy",   "tags": ["Tree","Depth-First Search"]},
    {"title": "Subtree of Another Tree",    "difficulty": "Easy",   "tags": ["Tree","Depth-First Search"]},
    {"title": "Lowest Common Ancestor of BST","difficulty":"Easy",  "tags": ["Tree","Binary Search"]},
    {"title": "Binary Tree Level Order Traversal","difficulty":"Medium","tags":["Tree","Breadth-First Search"]},
    {"title": "Validate Binary Search Tree","difficulty": "Medium", "tags": ["Tree","Depth-First Search"]},
    {"title": "Kth Smallest Element in BST","difficulty": "Medium", "tags": ["Tree","Binary Search"]},
    {"title": "Construct Binary Tree from Preorder and Inorder","difficulty":"Medium","tags":["Tree"]},
    {"title": "Binary Tree Maximum Path Sum","difficulty": "Hard",  "tags": ["Tree","Dynamic Programming"]},
    # Dynamic Programming
    {"title": "Climbing Stairs",            "difficulty": "Easy",   "tags": ["Dynamic Programming"]},
    {"title": "House Robber",               "difficulty": "Medium", "tags": ["Dynamic Programming"]},
    {"title": "House Robber II",            "difficulty": "Medium", "tags": ["Dynamic Programming"]},
    {"title": "Longest Palindromic Substring","difficulty": "Medium","tags":["Dynamic Programming","String"]},
    {"title": "Coin Change",                "difficulty": "Medium", "tags": ["Dynamic Programming"]},
    {"title": "Word Break",                 "difficulty": "Medium", "tags": ["Dynamic Programming","Hash Table"]},
    {"title": "Longest Increasing Subsequence","difficulty": "Medium","tags":["Dynamic Programming"]},
    {"title": "Unique Paths",               "difficulty": "Medium", "tags": ["Dynamic Programming","Math"]},
    {"title": "Jump Game",                  "difficulty": "Medium", "tags": ["Dynamic Programming","Greedy"]},
    {"title": "Partition Equal Subset Sum", "difficulty": "Medium", "tags": ["Dynamic Programming"]},
    # Graphs
    {"title": "Number of Islands",          "difficulty": "Medium", "tags": ["Graph","Depth-First Search"]},
    {"title": "Clone Graph",                "difficulty": "Medium", "tags": ["Graph","Depth-First Search"]},
    {"title": "Pacific Atlantic Water Flow","difficulty": "Medium", "tags": ["Graph","Breadth-First Search"]},
    {"title": "Course Schedule",            "difficulty": "Medium", "tags": ["Graph"]},
    {"title": "Course Schedule II",         "difficulty": "Medium", "tags": ["Graph","Sorting"]},
    {"title": "Alien Dictionary",           "difficulty": "Hard",   "tags": ["Graph","Sorting"]},
    {"title": "Word Ladder",                "difficulty": "Hard",   "tags": ["Graph","Breadth-First Search"]},
    # Heap
    {"title": "Find Median from Data Stream","difficulty":"Hard",   "tags": ["Heap","Two Pointers"]},
    {"title": "Task Scheduler",             "difficulty": "Medium", "tags": ["Heap","Greedy"]},
    {"title": "Design Twitter",             "difficulty": "Medium", "tags": ["Heap","Hash Table"]},
    # Backtracking
    {"title": "Subsets",                    "difficulty": "Medium", "tags": ["Backtracking","Array"]},
    {"title": "Permutations",               "difficulty": "Medium", "tags": ["Backtracking","Array"]},
    {"title": "Combination Sum",            "difficulty": "Medium", "tags": ["Backtracking","Array"]},
    {"title": "N-Queens",                   "difficulty": "Hard",   "tags": ["Backtracking"]},
    {"title": "Sudoku Solver",              "difficulty": "Hard",   "tags": ["Backtracking","Matrix"]},
    # Math
    {"title": "Reverse Integer",            "difficulty": "Easy",   "tags": ["Math"]},
    {"title": "Palindrome Number",          "difficulty": "Easy",   "tags": ["Math"]},
    {"title": "Power of Two",               "difficulty": "Easy",   "tags": ["Math","Bit Manipulation"]},
    {"title": "Count Primes",               "difficulty": "Medium", "tags": ["Math"]},
    {"title": "Happy Number",               "difficulty": "Easy",   "tags": ["Math","Hash Table"]},
]

LESSON_CONTENT_TEMPLATES = [
    "## Introduction\n\nWelcome to this lesson! In this section, we'll explore the fundamental concepts that form the building blocks of this topic.\n\n## Key Concepts\n\n- **Concept 1**: A foundational idea you must understand.\n- **Concept 2**: How this connects to real-world applications.\n- **Concept 3**: Common pitfalls to avoid.\n\n## Code Example\n\n```python\n# This is a working example\ndef example_function(data):\n    return sorted(data)\n```\n\n## Practice\n\nTry modifying the example above to handle edge cases like empty inputs.",
    "## Overview\n\nIn this lesson, we will build on what we know and tackle more complex problems.\n\n## Algorithm Walkthrough\n\n1. Initialize a pointer at the start.\n2. Traverse the structure from left to right.\n3. At each step, update state based on the current value.\n4. Return the accumulated result.\n\n## Complexity Analysis\n\n- **Time**: O(n)\n- **Space**: O(1)\n\n> 💡 **Pro Tip**: Always analyze edge cases first before writing code.",
    "## Deep Dive\n\nNow that we understand the basics, let's go deeper.\n\n## Advanced Pattern\n\nThe key insight here is that we can reduce this from O(n²) to O(n) by using a **hash map** to cache previously computed results.\n\n```python\ndef optimized(nums):\n    seen = {}\n    for i, num in enumerate(nums):\n        if num in seen:\n            return [seen[num], i]\n        seen[num] = i\n    return []\n```\n\n## Real-World Application\n\nThis pattern is used extensively in compilers, databases, and caching systems.",
]

QUIZ_QUESTION_TEMPLATES = [
    {"type": "MCQ",       "content": "What is the time complexity of binary search?",          "options": [{"id":"A","text":"O(n)","is_correct":False},{"id":"B","text":"O(log n)","is_correct":True},{"id":"C","text":"O(n²)","is_correct":False},{"id":"D","text":"O(1)","is_correct":False}],"explanation":"Binary search halves the search space each iteration, giving O(log n)."},
    {"type": "MCQ",       "content": "Which data structure uses FIFO ordering?",               "options": [{"id":"A","text":"Stack","is_correct":False},{"id":"B","text":"Queue","is_correct":True},{"id":"C","text":"Heap","is_correct":False},{"id":"D","text":"Trie","is_correct":False}],     "explanation":"A Queue follows First-In, First-Out (FIFO) ordering."},
    {"type": "TrueFalse", "content": "A hash map provides O(1) average-case lookup.",          "options": [{"id":"T","text":"True","is_correct":True},{"id":"F","text":"False","is_correct":False}],                                                                                                "explanation":"Hash maps use a hash function to compute the index in O(1) average time."},
    {"type": "MCQ",       "content": "What is the worst-case space complexity of merge sort?", "options": [{"id":"A","text":"O(1)","is_correct":False},{"id":"B","text":"O(log n)","is_correct":False},{"id":"C","text":"O(n)","is_correct":True},{"id":"D","text":"O(n log n)","is_correct":False}],"explanation":"Merge sort requires O(n) auxiliary space for the temporary arrays."},
    {"type": "TrueFalse", "content": "Dijkstra's algorithm works with negative edge weights.",  "options": [{"id":"T","text":"True","is_correct":False},{"id":"F","text":"False","is_correct":True}],                                                                                                "explanation":"Dijkstra's fails with negative weights; use Bellman-Ford instead."},
    {"type": "MCQ",       "content": "In a min-heap, the root is always the...?",              "options": [{"id":"A","text":"Largest element","is_correct":False},{"id":"B","text":"Smallest element","is_correct":True},{"id":"C","text":"Middle element","is_correct":False},{"id":"D","text":"Last inserted","is_correct":False}],"explanation":"A min-heap maintains the property that the root is always the minimum."},
]

def random_slug(base, idx):
    return f"{base}-{idx}-{''.join(random.choices(string.ascii_lowercase, k=4))}"

# ─── Seeder ─────────────────────────────────────────────────────────────────────

def seed():
    with app.app_context():
        print("[LMS] Starting seeding...")
        db.create_all()

        # ── Academy ──────────────────────────────────────────────────────────────
        academy = Academy.query.filter_by(slug='devlvl-academy').first()
        if not academy:
            academy = Academy(slug='devlvl-academy', name='Devlvl Academy',
                              description='The home of all developer learning at Devlvl.')
            db.session.add(academy)
            db.session.flush()
            print("  [OK] Academy created")

        # ── Learning Paths ────────────────────────────────────────────────────────
        path_map = {}
        for pt in LEARNING_PATHS:
            p = LearningPath.query.filter_by(slug=pt['slug']).first()
            if not p:
                p = LearningPath(academy_id=academy.id, slug=pt['slug'],
                                 name=pt['name'], icon=pt['icon'],
                                 description=f"Become a professional {pt['name']}.")
                db.session.add(p)
                db.session.flush()
            path_map[pt['slug']] = p
        db.session.commit()
        print(f"  [OK] {len(LEARNING_PATHS)} Learning Paths created")

        # ── Courses & Modules ─────────────────────────────────────────────────────
        total_courses = 0
        total_modules = 0
        for path_slug, templates in COURSE_TEMPLATES.items():
            path = path_map.get(path_slug)
            if not path:
                continue
            for i, (title, difficulty, description, duration) in enumerate(templates):
                slug = f"{path_slug}-{title.lower().replace(' ', '-').replace('&', 'and')[:40]}"
                course = Course.query.filter_by(slug=slug).first()
                if not course:
                    course = Course(
                        learning_path_id=path.id, slug=slug, title=title,
                        description=description, difficulty=difficulty,
                        estimated_duration=duration, status='Published',
                        xp_reward=500 * (i + 1), coin_reward=100 * (i + 1),
                        learning_outcomes=[f"Understand {title} fundamentals",
                                           f"Build real projects using {title}",
                                           f"Solve common {title} challenges"],
                    )
                    db.session.add(course)
                    db.session.flush()
                    total_courses += 1

                # Create 4 modules per course
                for m_idx in range(1, 5):
                    mod_slug = random_slug(f"{slug}-module", m_idx)
                    mod = Module(
                        course_id=course.id, slug=mod_slug,
                        title=f"Module {m_idx}: {title} Part {m_idx}",
                        summary=f"This module covers key aspects of {title}.",
                        difficulty=difficulty, estimated_time=duration // 4,
                        xp_reward=100 * m_idx, order=m_idx,
                    )
                    db.session.add(mod)
                    db.session.flush()
                    total_modules += 1

                    # 2 chapters per module
                    for ch_idx in range(1, 3):
                        ch = Chapter(
                            module_id=mod.id,
                            title=f"Chapter {ch_idx}: Core Concepts Part {ch_idx}",
                            order=ch_idx,
                        )
                        db.session.add(ch)
                        db.session.flush()

                        # 5 lessons per chapter
                        for l_idx in range(1, 6):
                            content = random.choice(LESSON_CONTENT_TEMPLATES)
                            l_slug = random_slug(f"{mod_slug}-lesson", l_idx)
                            lesson = Lesson(
                                chapter_id=ch.id, slug=l_slug,
                                title=f"Lesson {l_idx}: Understanding Part {l_idx}",
                                content_blocks=[{"type": "markdown", "content": content}],
                                order=l_idx, status='Published',
                            )
                            db.session.add(lesson)

        db.session.commit()
        print(f"  [OK] {total_courses} Courses + {total_modules} Modules + Chapters + Lessons seeded")

        # ── Boss Battles ──────────────────────────────────────────────────────────
        for bt in BOSS_TEMPLATES:
            if not BossBattle.query.filter_by(name=bt['name']).first():
                boss = BossBattle(
                    name=bt['name'],
                    story=f"{bt['name']} has emerged to challenge developers. Defeat it to prove your mastery!",
                    difficulty=bt['difficulty'],
                    max_lives=3,
                    time_limit_sec=3600,
                    xp_reward=bt['xp'],
                    coin_reward=bt['coins'],
                    problems=[],
                )
                db.session.add(boss)
        db.session.commit()
        print(f"  [OK] {len(BOSS_TEMPLATES)} Boss Battles seeded")

        # ── Problems ──────────────────────────────────────────────────────────────
        # Seed the catalog + generate variations up to 1000
        seeded_problems = 0
        all_difficulties = ['Easy', 'Medium', 'Hard']
        for cat in PROBLEM_CATALOG:
            slug = cat['title'].lower().replace(' ', '-').replace("'", '')
            if not Problem.query.filter_by(slug=slug).first():
                companies = random.sample(COMPANIES, random.randint(1, 4))
                xp = {'Easy': 10, 'Medium': 25, 'Hard': 50}[cat['difficulty']]
                p = Problem(
                    slug=slug, title=cat['title'],
                    description=f"## {cat['title']}\n\nSolve the following problem efficiently.\n\n**Input Format**: Standard input as described.\n\n**Output Format**: Return the expected result.\n\n**Constraints**:\n- 1 ≤ n ≤ 10⁵",
                    difficulty=cat['difficulty'], tags=cat['tags'],
                    companies=companies, topics=cat['tags'],
                    source='LMS', status='Published',
                    xp_reward=xp, coin_reward=xp // 2,
                    supported_languages=['python', 'javascript', 'java', 'cpp'],
                    starter_code={
                        'python': f'def solve():\n    # Write your solution here\n    pass',
                        'javascript': f'function solve() {{\n    // Write your solution here\n}}',
                    },
                    sample_tests=[{'input': '2 7 11 15\n9', 'output': '0 1'}],
                    hidden_tests=[{'input': '3 2 4\n6', 'output': '1 2'}],
                    hints=[f"Think about what data structure gives O(1) lookup.",
                           f"Consider the complement: target - current_value."],
                )
                db.session.add(p)
                seeded_problems += 1

        # Generate additional varied problems to bulk up to ~500
        EXTRA_TOPICS = [
            ("Fizz Buzz", "Easy", ["Math"]),
            ("Fibonacci Number", "Easy", ["Math","Recursion"]),
            ("Single Number", "Easy", ["Bit Manipulation","Array"]),
            ("Majority Element", "Easy", ["Array","Hash Table"]),
            ("Move Zeroes", "Easy", ["Array","Two Pointers"]),
            ("Find the Duplicate Number", "Medium", ["Array","Two Pointers"]),
            ("Sort Colors", "Medium", ["Array","Two Pointers","Sorting"]),
            ("Rotate Image", "Medium", ["Array","Matrix"]),
            ("Spiral Matrix", "Medium", ["Array","Matrix"]),
            ("Set Matrix Zeroes", "Medium", ["Array","Matrix"]),
            ("Search in Rotated Sorted Array", "Medium", ["Array","Binary Search"]),
            ("Find Minimum in Rotated Sorted Array","Medium", ["Array","Binary Search"]),
            ("Meeting Rooms", "Easy", ["Array","Sorting"]),
            ("Non-overlapping Intervals", "Medium", ["Array","Greedy"]),
            ("Insert Interval", "Medium", ["Array"]),
            ("Merge Intervals", "Medium", ["Array","Sorting"]),
            ("Minimum Interval to Include Each Query","Hard",["Array","Sorting","Heap"]),
            ("Add Two Numbers", "Medium", ["Linked List","Math"]),
            ("Swap Nodes in Pairs", "Medium", ["Linked List"]),
            ("Rotate List", "Medium", ["Linked List","Two Pointers"]),
            ("Reverse Nodes in k-Group", "Hard", ["Linked List"]),
            ("Diameter of Binary Tree", "Easy", ["Tree","Depth-First Search"]),
            ("Balanced Binary Tree", "Easy", ["Tree","Depth-First Search"]),
            ("Path Sum", "Easy", ["Tree","Depth-First Search"]),
            ("Sum Root to Leaf Numbers", "Medium", ["Tree","Depth-First Search"]),
            ("Count Good Nodes in Binary Tree","Medium",["Tree","Depth-First Search"]),
            ("Serialize and Deserialize Binary Tree","Hard",["Tree","Breadth-First Search"]),
            ("Number of Connected Components","Medium",["Graph","Union Find"]),
            ("Redundant Connection", "Medium", ["Graph","Union Find"]),
            ("Max Area of Island", "Medium", ["Graph","Depth-First Search"]),
            ("Surrounded Regions", "Medium", ["Graph","Depth-First Search"]),
            ("Walls and Gates", "Medium", ["Graph","Breadth-First Search"]),
            ("Rotting Oranges", "Medium", ["Graph","Breadth-First Search"]),
            ("Network Delay Time", "Medium", ["Graph"]),
            ("Min Cost to Connect All Points","Medium",["Graph"]),
            ("Swim in Rising Water", "Hard", ["Graph","Heap"]),
            ("Reconstruct Itinerary", "Hard", ["Graph","Sorting"]),
            ("Decode Ways", "Medium", ["Dynamic Programming","String"]),
            ("Regular Expression Matching","Hard",["Dynamic Programming","String"]),
            ("Burst Balloons", "Hard", ["Dynamic Programming","Array"]),
            ("Edit Distance", "Hard", ["Dynamic Programming","String"]),
            ("Distinct Subsequences", "Hard", ["Dynamic Programming","String"]),
            ("Interleaving String", "Medium", ["Dynamic Programming","String"]),
            ("Longest Common Subsequence","Medium",["Dynamic Programming","String"]),
            ("Best Time to Buy and Sell Stock with Cooldown","Medium",["Dynamic Programming","Array"]),
            ("Minimum Cost For Tickets","Medium",["Dynamic Programming","Array"]),
            ("Target Sum", "Medium", ["Dynamic Programming","Array"]),
            ("Ones and Zeroes", "Medium", ["Dynamic Programming","Array"]),
            ("Design Add and Search Words DS","Medium",["Trie","Depth-First Search"]),
            ("Word Search II", "Hard", ["Trie","Backtracking"]),
        ]

        for title, diff, tags in EXTRA_TOPICS:
            slug = title.lower().replace(' ', '-').replace("'", '').replace(',', '')
            if not Problem.query.filter_by(slug=slug).first():
                companies = random.sample(COMPANIES, random.randint(1, 3))
                xp = {'Easy': 10, 'Medium': 25, 'Hard': 50}[diff]
                p = Problem(
                    slug=slug, title=title,
                    description=f"## {title}\n\nSolve this classic problem.\n\n**Difficulty**: {diff}\n\n**Topics**: {', '.join(tags)}",
                    difficulty=diff, tags=tags, companies=companies,
                    topics=tags, source='LMS', status='Published',
                    xp_reward=xp, coin_reward=xp // 2,
                    supported_languages=['python', 'javascript', 'java', 'cpp'],
                    starter_code={'python': f'def solve():\n    pass'},
                    sample_tests=[], hidden_tests=[],
                    hints=["Break the problem into sub-problems.", "Consider the edge cases first."],
                )
                db.session.add(p)
                seeded_problems += 1

        db.session.commit()
        print(f"  [OK] {seeded_problems} Problems seeded")

        # ── Quizzes ───────────────────────────────────────────────────────────────
        quiz_count = 0
        for idx in range(1, 21):
            q_title = f"DSA Quiz #{idx}"
            if not Quiz.query.filter_by(title=q_title).first():
                quiz = Quiz(title=q_title, description=f"Test your knowledge — Quiz {idx}",
                            xp_reward=50)
                db.session.add(quiz)
                db.session.flush()
                for i, qt in enumerate(QUIZ_QUESTION_TEMPLATES):
                    db.session.add(Question(
                        quiz_id=quiz.id, type=qt['type'], content=qt['content'],
                        options=qt['options'], explanation=qt['explanation'], order=i + 1
                    ))
                quiz_count += 1

        db.session.commit()
        print(f"  [OK] {quiz_count} Quizzes (with 6 questions each) seeded")

        total = db.session.query(Problem).count()
        print("\n[LMS] Seeding complete!")
        print(f"   Academy: 1")
        print(f"   Learning Paths: {len(LEARNING_PATHS)}")
        print(f"   Courses: {total_courses}")
        print(f"   Modules: {total_modules}")
        print(f"   Boss Battles: {len(BOSS_TEMPLATES)}")
        print(f"   Problems in DB: {total}")
        print(f"   Quizzes: {quiz_count}")

if __name__ == '__main__':
    seed()
