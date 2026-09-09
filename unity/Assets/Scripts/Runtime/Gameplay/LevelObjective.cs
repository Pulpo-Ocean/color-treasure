namespace ColorTreasure.Runtime.Gameplay
{
    public sealed class LevelObjective
    {
        public int TargetTiles { get; }
        public int Progress { get; private set; }
        public bool IsComplete => Progress >= TargetTiles;

        public LevelObjective(int targetTiles)
        {
            TargetTiles = targetTiles < 1 ? 1 : targetTiles;
        }

        public void AddProgress(int amount)
        {
            if (amount > 0)
                Progress += amount;
        }
    }
}
