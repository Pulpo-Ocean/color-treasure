using System;
using System.Collections.Generic;

namespace ColorTreasure.Runtime.Gameplay
{
    public static class SpecialActivation
    {
        public static IReadOnlyList<(int x, int y)> GetAffectedCells(SpecialKind kind, int centerX, int centerY, int width, int height)
        {
            if (kind == SpecialKind.None || width < 1 || height < 1)
                return Array.Empty<(int x, int y)>();

            var cells = new HashSet<(int x, int y)>();
            void Add(int x, int y)
            {
                if (x >= 0 && x < width && y >= 0 && y < height)
                    cells.Add((x, y));
            }

            if (kind == SpecialKind.LineBurst || kind == SpecialKind.CrossBurst || kind == SpecialKind.TreasureBurst)
            {
                for (var x = 0; x < width; x++) Add(x, centerY);
                if (kind == SpecialKind.CrossBurst || kind == SpecialKind.TreasureBurst)
                    for (var y = 0; y < height; y++) Add(centerX, y);
            }

            if (kind == SpecialKind.AreaBomb || kind == SpecialKind.TreasureBurst)
            {
                var radius = kind == SpecialKind.TreasureBurst ? 2 : 1;
                for (var x = centerX - radius; x <= centerX + radius; x++)
                for (var y = centerY - radius; y <= centerY + radius; y++)
                    Add(x, y);
            }

            return new List<(int x, int y)>(cells);
        }
    }
}
