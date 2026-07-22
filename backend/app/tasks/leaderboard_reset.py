from app.extensions import celery, db, redis_client
from app.models.guild import Guild
from datetime import datetime

@celery.task
def reset_weekly_leaderboards():
    """
    Called weekly. Persists snapshots to DB (if we implemented Snapshot model),
    and clears the Redis sorted sets for the new week.
    """
    if not redis_client:
        return "Redis not configured"
        
    # In a full app, we would query the set and save to `leaderboard_snapshots`
    # For MVP we just clear the keys to start the new week
    
    redis_client.delete("leaderboard:global:weekly")
    
    # Also delete all guild leaderboards
    guilds = Guild.query.all()
    for g in guilds:
        redis_client.delete(f"leaderboard:guild:{g.id}:weekly")
        
    return "Weekly leaderboards reset."
