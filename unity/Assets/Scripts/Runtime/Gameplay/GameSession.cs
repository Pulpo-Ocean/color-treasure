namespace ColorTreasure.Runtime.Gameplay
{
    public sealed class GameSession
    {
        public int LevelId { get; }
        public int MovesLimit { get; }
        public int MovesUsed { get; private set; }
        public int TilesCleared { get; private set; }
        public bool IsFinished { get; private set; }

        public GameSession(int levelId, int movesLimit)
        {
            LevelId = levelId;
            MovesLimit = movesLimit;
        }

        public bool TryConsumeMove(int clearedTiles)
        {
            if (IsFinished || MovesUsed >= MovesLimit || clearedTiles < 2)
                return false;

            MovesUsed++;
            TilesCleared += clearedTiles;
            return true;
        }

        public void Finish() => IsFinished = true;
    }
}
