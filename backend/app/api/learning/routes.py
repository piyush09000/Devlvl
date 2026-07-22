"""
Learning / RPG World Map API — public-facing routes for exploring worlds and regions.
"""
from flask import request, jsonify
from flask_jwt_extended import jwt_required
from app.extensions import db
from app.models.rpg import World, Region, Village, Dungeon
from . import learning_bp

# ─── Worlds (RPG Map) ─────────────────────────────────────────────────────────

@learning_bp.route('/worlds', methods=['GET'])
def get_worlds():
    worlds = World.query.order_by(World.tier.asc()).all()
    return jsonify([{
        'id': w.id, 'slug': w.slug, 'name': w.name,
        'description': w.description, 'icon': w.icon,
        'tier': w.tier, 'course_id': w.course_id,
    } for w in worlds]), 200

@learning_bp.route('/worlds/<slug>', methods=['GET'])
def get_world(slug):
    world = World.query.filter_by(slug=slug).first_or_404()
    return jsonify({
        'id': world.id, 'slug': world.slug, 'name': world.name,
        'description': world.description, 'icon': world.icon,
        'tier': world.tier, 'course_id': world.course_id,
        'regions': [
            {'id': r.id, 'slug': r.slug, 'name': r.name, 'order': r.order}
            for r in sorted(world.regions, key=lambda r: r.order)
        ]
    }), 200

@learning_bp.route('/worlds', methods=['POST'])
@jwt_required()
def create_world():
    data = request.get_json()
    world = World(
        slug=data.get('slug'),
        name=data.get('name'),
        description=data.get('description'),
        icon=data.get('icon'),
        tier=data.get('tier', 1),
        course_id=data.get('course_id'),
    )
    db.session.add(world)
    db.session.commit()
    return jsonify({'id': world.id, 'slug': world.slug, 'name': world.name}), 201

# ─── Regions ─────────────────────────────────────────────────────────────────

@learning_bp.route('/worlds/<world_slug>/regions', methods=['POST'])
@jwt_required()
def create_region(world_slug):
    world = World.query.filter_by(slug=world_slug).first_or_404()
    data = request.get_json()
    region = Region(
        world_id=world.id,
        slug=data.get('slug'),
        name=data.get('name'),
        description=data.get('description'),
        order=data.get('order', 1),
        module_id=data.get('module_id'),
    )
    db.session.add(region)
    db.session.commit()
    return jsonify({'id': region.id, 'name': region.name}), 201
