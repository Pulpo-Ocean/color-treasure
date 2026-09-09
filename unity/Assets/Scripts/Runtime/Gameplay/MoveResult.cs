namespace ColorTreasure.Runtime.Gameplay
{
    public readonly struct MoveResult
    {
        public MoveResult(bool accepted, int clearedCount, int cascades, bool won, bool failed, SpecialKind createdSpecial = SpecialKind.None)
        {
            Accepted = accepted;
            ClearedCount = clearedCount;
            Cascades = cascades;
            Won = won;
            Failed = failed;
            CreatedSpecial = createdSpecial;
        }

        public bool Accepted { get; }
        public int ClearedCount { get; }
        public int Cascades { get; }
        public bool Won { get; }
        public bool Failed { get; }
        public SpecialKind CreatedSpecial { get; }
    }
}
