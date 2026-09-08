using System;
using System.Collections.Generic;

namespace ColorTreasure.Runtime.Board
{
    public sealed class BoardModel
    {
        private readonly TileColor[,] cells;
        private readonly Random random;

        public int Width { get; }
        public int Height { get; }
        public int ColorCount { get; }

        public BoardModel(int width, int height, int colorCount, int seed)
        {
            if (width < 1) throw new ArgumentOutOfRangeException(nameof(width));
            if (height < 1) throw new ArgumentOutOfRangeException(nameof(height));
            if (colorCount < 1 || colorCount > 6) throw new ArgumentOutOfRangeException(nameof(colorCount));

            Width = width;
            Height = height;
            ColorCount = colorCount;
            cells = new TileColor[width, height];
            random = new Random(seed);
            FillEmptyCells();
        }

        public TileColor Get(int x, int y) => cells[x, y];

        public int ClearGroup(int x, int y)
        {
            var color = Get(x, y);
            if (color == TileColor.None) return 0;

            var group = FindGroup(x, y);
            if (group.Count < 2) return 0;

            foreach (var cell in group)
                cells[cell.x, cell.y] = TileColor.None;

            ApplyGravity();
            FillEmptyCells();
            return group.Count;
        }

        public IReadOnlyList<(int x, int y)> FindGroup(int x, int y)
        {
            if (!Inside(x, y) || cells[x, y] == TileColor.None)
                return Array.Empty<(int x, int y)>();

            var color = cells[x, y];
            var result = new List<(int x, int y)>();
            var visited = new bool[Width, Height];
            var queue = new Queue<(int x, int y)>();
            queue.Enqueue((x, y));
            visited[x, y] = true;

            while (queue.Count > 0)
            {
                var current = queue.Dequeue();
                result.Add(current);

                foreach (var next in Neighbours(current.x, current.y))
                {
                    if (visited[next.x, next.y] || cells[next.x, next.y] != color)
                        continue;
                    visited[next.x, next.y] = true;
                    queue.Enqueue(next);
                }
            }

            return result;
        }

        private void ApplyGravity()
        {
            for (var x = 0; x < Width; x++)
            {
                var writeY = 0;
                for (var y = 0; y < Height; y++)
                {
                    if (cells[x, y] == TileColor.None) continue;
                    cells[x, writeY++] = cells[x, y];
                }

                while (writeY < Height)
                    cells[x, writeY++] = TileColor.None;
            }
        }

        private void FillEmptyCells()
        {
            for (var x = 0; x < Width; x++)
            for (var y = 0; y < Height; y++)
                if (cells[x, y] == TileColor.None)
                    cells[x, y] = (TileColor)(random.Next(ColorCount) + 1);
        }

        private bool Inside(int x, int y) => x >= 0 && x < Width && y >= 0 && y < Height;

        private IEnumerable<(int x, int y)> Neighbours(int x, int y)
        {
            if (Inside(x - 1, y)) yield return (x - 1, y);
            if (Inside(x + 1, y)) yield return (x + 1, y);
            if (Inside(x, y - 1)) yield return (x, y - 1);
            if (Inside(x, y + 1)) yield return (x, y + 1);
        }
    }
}
