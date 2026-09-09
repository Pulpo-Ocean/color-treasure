using System.Collections.Generic;

namespace ColorTreasure.Runtime.Gameplay
{
    public sealed class SpecialInventory
    {
        private readonly Dictionary<(int x, int y), SpecialKind> specials = new();

        public int Count => specials.Count;

        public void Set(SpecialTile tile)
        {
            if (!tile.IsSpecial) return;
            specials[(tile.X, tile.Y)] = tile.Kind;
        }

        public bool TryGet(int x, int y, out SpecialKind kind) => specials.TryGetValue((x, y), out kind);

        public bool Remove(int x, int y) => specials.Remove((x, y));

        public void Clear() => specials.Clear();
    }
}
