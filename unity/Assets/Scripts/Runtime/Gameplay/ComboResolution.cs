namespace ColorTreasure.Runtime.Gameplay
{
    public readonly struct ComboResolution
    {
        public ComboResolution(SpecialKind result, int radius, bool clearsRow, bool clearsColumn)
        {
            Result = result;
            Radius = radius;
            ClearsRow = clearsRow;
            ClearsColumn = clearsColumn;
        }

        public SpecialKind Result { get; }
        public int Radius { get; }
        public bool ClearsRow { get; }
        public bool ClearsColumn { get; }
    }

    public static class ComboResolutionRules
    {
        public static ComboResolution Describe(SpecialKind first, SpecialKind second)
        {
            if (first == SpecialKind.None || second == SpecialKind.None)
                return new ComboResolution(SpecialKind.None, 0, false, false);

            if (first == SpecialKind.RainbowShell || second == SpecialKind.RainbowShell)
                return new ComboResolution(SpecialKind.TreasureBurst, 2, true, true);

            if ((first == SpecialKind.LineBurst && second == SpecialKind.CrossBurst) ||
                (first == SpecialKind.CrossBurst && second == SpecialKind.LineBurst))
                return new ComboResolution(SpecialKind.CrossBurst, 0, true, true);

            if (first == SpecialKind.AreaBomb || second == SpecialKind.AreaBomb)
                return new ComboResolution(SpecialKind.AreaBomb, 2, false, false);

            return new ComboResolution(SpecialKind.AreaBomb, 1, false, false);
        }
    }
}
