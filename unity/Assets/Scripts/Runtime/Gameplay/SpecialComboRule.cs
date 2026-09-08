namespace ColorTreasure.Runtime.Gameplay
{
    public static class SpecialComboRule
    {
        public static SpecialKind Resolve(SpecialKind first, SpecialKind second)
        {
            if (first == SpecialKind.None || second == SpecialKind.None)
                return SpecialKind.None;

            if (first == SpecialKind.RainbowShell || second == SpecialKind.RainbowShell)
                return SpecialKind.TreasureBurst;

            if ((first == SpecialKind.LineBurst && second == SpecialKind.CrossBurst) ||
                (first == SpecialKind.CrossBurst && second == SpecialKind.LineBurst))
                return SpecialKind.CrossBurst;

            if (first == SpecialKind.AreaBomb || second == SpecialKind.AreaBomb)
                return SpecialKind.AreaBomb;

            return SpecialKind.AreaBomb;
        }
    }
}
