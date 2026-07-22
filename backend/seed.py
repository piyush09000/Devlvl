import os
from app import create_app
from app.extensions import db
from app.models.user import User
from app.models.rpg import World, Region, Chapter, Lesson
from app.models.problem import Problem
from app.models.marketplace import StoreItem

WORLD_DATA = [
    {
        "id": "code_village",
        "name": "Code Village",
        "icon": "🏡",
        "tier": 1,
        "description": "Where every developer begins. Learn the basics of syntax, variables, and output.",
        "prerequisites": []
    },
    {
        "id": "loop_forest",
        "name": "Loop Forest",
        "icon": "🌲",
        "tier": 2,
        "description": "An endless forest of iterations. Master for, while, and do-while loops.",
        "prerequisites": ["code_village"]
    },
    {
        "id": "function_castle",
        "name": "Function Castle",
        "icon": "🏰",
        "tier": 3,
        "description": "A towering fortress of reusable logic. Functions, closures, and callbacks await.",
        "prerequisites": ["loop_forest"]
    }
]

def seed_database():
    app = create_app()
    with app.app_context():
        # Create all tables first to ensure they exist
        print("Creating tables...")
        db.create_all()
        
        # Clean existing data
        print("Cleaning old data...")
        db.session.query(Lesson).delete()
        db.session.query(Chapter).delete()
        db.session.query(Region).delete()
        db.session.query(World).delete()
        db.session.query(StoreItem).delete()
        db.session.query(Problem).delete()
        db.session.commit()
        
        print("Seeding Worlds...")
        for w_data in WORLD_DATA:
            # We skip proper prerequisite links for the simple seed, just mapping slug to name
            world = World(
                slug=w_data['id'],
                name=w_data['name'],
                description=w_data['description'],
                icon=w_data['icon'],
                tier=w_data['tier']
            )
            db.session.add(world)
            db.session.commit()
            
            # Create a dummy region, chapter, lesson for each world
            region = Region(world_id=world.id, slug=f"{world.slug}-region-1", name="The Outskirts", order=1)
            db.session.add(region)
            db.session.commit()
            
            chapter = Chapter(region_id=region.id, slug=f"{region.slug}-ch-1", name="Introduction", order=1)
            db.session.add(chapter)
            db.session.commit()
            
            # Seed a problem
            problem = Problem(
                slug=f"{chapter.slug}-prob",
                title=f"Challenge of {world.name}",
                description=f"Welcome to {world.name}. Solve this challenge.",
                difficulty="Easy",
                tags=["Basic"],
                supported_languages=["python", "javascript"],
                starter_code={"python": "def solve():\n    return 'Hello World'"},
                sample_tests=[{"input": "", "output": "Hello World"}],
                hidden_tests=[{"input": "", "output": "Hello World"}]
            )
            db.session.add(problem)
            db.session.commit()
            
            lesson = Lesson(chapter_id=chapter.id, slug=f"{chapter.slug}-lesson-1", name="First Steps", order=1, problem_id=problem.id)
            db.session.add(lesson)
            db.session.commit()
        
        print("Seeding Store Items...")
        store_items_data = [
            # Avatars
            {'category': 'avatars', 'name': 'Cyber Samurai', 'emoji': '🥷', 'rarity': 'epic', 'price_bp': 800, 'price_dev_coins': None, 'is_new': True},
            {'category': 'avatars', 'name': 'Dragon Mage', 'emoji': '🐉', 'rarity': 'legendary', 'price_bp': None, 'price_dev_coins': 2500, 'is_new': False},
            {'category': 'avatars', 'name': 'Space Hacker', 'emoji': '👾', 'rarity': 'rare', 'price_bp': 400, 'price_dev_coins': None, 'is_new': False},
            {'category': 'avatars', 'name': 'Neon Witch', 'emoji': '🧙‍♀️', 'rarity': 'epic', 'price_bp': 700, 'price_dev_coins': None, 'is_new': False},
            # Pets
            {'category': 'pets', 'name': 'AI Robot', 'emoji': '🤖', 'rarity': 'legendary', 'price_bp': None, 'price_dev_coins': 3000, 'is_new': False},
            {'category': 'pets', 'name': 'Code Serpent', 'emoji': '🐍', 'rarity': 'epic', 'price_bp': 900, 'price_dev_coins': None, 'is_new': True},
            {'category': 'pets', 'name': 'Debug Bunny', 'emoji': '🐰', 'rarity': 'rare', 'price_bp': 350, 'price_dev_coins': None, 'is_new': False},
            {'category': 'pets', 'name': 'Matrix Cat', 'emoji': '😸', 'rarity': 'uncommon', 'price_bp': 200, 'price_dev_coins': None, 'is_new': False},
            # Titles
            {'category': 'titles', 'name': 'The Unbugable', 'emoji': '🛡️', 'rarity': 'legendary', 'price_bp': None, 'price_dev_coins': 4000, 'is_new': False},
            {'category': 'titles', 'name': 'Stack Sorcerer', 'emoji': '📚', 'rarity': 'epic', 'price_bp': 600, 'price_dev_coins': None, 'is_new': True},
            {'category': 'titles', 'name': 'Loop Slayer', 'emoji': '🔄', 'rarity': 'rare', 'price_bp': 300, 'price_dev_coins': None, 'is_new': False},
            # Boosts
            {'category': 'boosts', 'name': 'XP Surge (24h)', 'emoji': '⚡', 'rarity': 'common', 'price_bp': 100, 'price_dev_coins': None, 'is_new': False},
            {'category': 'boosts', 'name': 'Hint Shield', 'emoji': '🛡️', 'rarity': 'uncommon', 'price_bp': 150, 'price_dev_coins': None, 'is_new': False},
            {'category': 'boosts', 'name': 'Streak Freeze', 'emoji': '🧊', 'rarity': 'rare', 'price_bp': 250, 'price_dev_coins': None, 'is_new': False},
        ]
        
        for item_data in store_items_data:
            item = StoreItem(**item_data)
            db.session.add(item)
            
        db.session.commit()
        
        print("Database seeded successfully!")

if __name__ == '__main__':
    seed_database()
