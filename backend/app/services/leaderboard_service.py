from app.extensions import redis_client
from app.models.user import User

class LeaderboardService:
    GLOBAL_KEY = "leaderboard:global:weekly"
    
    def _guild_key(self, guild_id):
        return f"leaderboard:guild:{guild_id}:weekly"

    def add_xp(self, user_id, xp_amount, guild_id=None):
        """
        Increment the user's XP in the Redis sorted set for the weekly leaderboard.
        """
        if not redis_client:
            return
            
        redis_client.zincrby(self.GLOBAL_KEY, xp_amount, user_id)
        
        if guild_id:
            redis_client.zincrby(self._guild_key(guild_id), xp_amount, user_id)

    def get_global_leaderboard(self, top_n=100):
        """
        Retrieve the top users from the global leaderboard.
        """
        if not redis_client:
            return []
            
        # ZREVRANGE to get highest scores first (withscores=True)
        results = redis_client.zrevrange(self.GLOBAL_KEY, 0, top_n - 1, withscores=True)
        return self._format_results(results)
        
    def get_guild_leaderboard(self, guild_id, top_n=100):
        if not redis_client:
            return []
            
        results = redis_client.zrevrange(self._guild_key(guild_id), 0, top_n - 1, withscores=True)
        return self._format_results(results)

    def _format_results(self, redis_results):
        formatted = []
        for rank, (user_id, score) in enumerate(redis_results, 1):
            user_id = int(user_id)
            user = User.query.get(user_id)
            if user:
                formatted.append({
                    'rank': rank,
                    'user_id': user.id,
                    'username': user.username,
                    'avatar_url': user.avatar_url,
                    'weekly_xp': int(score)
                })
        return formatted

leaderboard_service = LeaderboardService()
