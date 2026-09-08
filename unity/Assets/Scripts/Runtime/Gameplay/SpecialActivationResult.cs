using System.Collections.Generic;

namespace ColorTreasure.Runtime.Gameplay
{
    public readonly struct SpecialActivationResult
    {
        public SpecialActivationResult(SpecialKind kind, int centerX, int centerY, IReadOnlyList<(int x, int y)> affectedCells)
        {
            Kind = kind;
            CenterX = centerX;
            CenterY = centerY;
            AffectedCells = affectedCells;
        }

        public SpecialKind Kind { get; }
        public int CenterX { get; }
        public int CenterY { get; }
        public IReadOnlyList<(int x, int y)> AffectedCells { get; }
    }
}
