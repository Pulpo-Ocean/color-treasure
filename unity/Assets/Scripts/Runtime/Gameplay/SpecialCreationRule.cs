namespace ColorTreasure.Runtime.Gameplay
{
    public static class SpecialCreationRule
    {
        public static SpecialKind FromGroupSize(int groupSize)
        {
            if (groupSize >= 8) return SpecialKind.RainbowShell;
            if (groupSize >= 6) return SpecialKind.AreaBomb;
            if (groupSize == 5) return SpecialKind.CrossBurst;
            if (groupSize == 4) return SpecialKind.LineBurst;
            return SpecialKind.None;
        }
    }
}
