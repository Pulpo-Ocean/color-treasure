namespace ColorTreasure.Runtime.Gameplay
{
    public readonly struct SpecialTile
    {
        public SpecialTile(SpecialKind kind, int x, int y)
        {
            Kind = kind;
            X = x;
            Y = y;
        }

        public SpecialKind Kind { get; }
        public int X { get; }
        public int Y { get; }
        public bool IsSpecial => Kind != SpecialKind.None;
    }
}
