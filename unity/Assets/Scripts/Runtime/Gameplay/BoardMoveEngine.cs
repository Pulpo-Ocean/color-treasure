using System.Collections.Generic;
using ColorTreasure.Runtime.Board;

namespace ColorTreasure.Runtime.Gameplay
{
    public sealed class BoardMoveEngine
    {
        private readonly BoardModel board;
        private readonly int maxMoves;
        private int movesUsed;
        private int objectiveProgress;
        private readonly int objectiveTarget;

        public BoardMoveEngine(BoardModel board, int maxMoves, int objectiveTarget)
        {
            this.board = board;
            this.maxMoves = maxMoves;
            this.objectiveTarget = objectiveTarget;
        }

        public int MovesRemaining => maxMoves - movesUsed;
        public int ObjectiveProgress => objectiveProgress;

        public MoveResult ClearGroup(int x, int y)
        {
            if (!CanMove(x, y))
                return new MoveResult(false, 0, 0, false, MovesRemaining <= 0);

            var group = board.FindGroup(x, y);
            if (group.Count < 2)
                return new MoveResult(false, 0, 0, false, false);

            var groupSize = group.Count;
            var createdSpecial = SpecialCreationRule.FromGroupSize(groupSize);
            var cleared = board.ClearGroup(x, y);

            if (createdSpecial != SpecialKind.None)
                board.SetSpecial(x, y, createdSpecial);

            movesUsed++;
            objectiveProgress += cleared;

            var won = objectiveProgress >= objectiveTarget;
            var failed = !won && MovesRemaining <= 0;
            return new MoveResult(true, cleared, 0, won, failed, createdSpecial);
        }

        public SpecialActivationResult ActivateSpecial(int x, int y)
        {
            if (!CanMove(x, y))
                return new SpecialActivationResult(SpecialKind.None, x, y, new List<(int x, int y)>());

            var kind = board.GetSpecial(x, y);
            if (kind == SpecialKind.None)
                return new SpecialActivationResult(SpecialKind.None, x, y, new List<(int x, int y)>());

            var affected = SpecialActivation.GetAffectedCells(kind, x, y, board.Width, board.Height);
            board.ClearCells(affected);
            movesUsed++;
            objectiveProgress += affected.Count;

            return new SpecialActivationResult(kind, x, y, affected);
        }

        public SpecialActivationResult ActivateSpecialCombo(int firstX, int firstY, int secondX, int secondY)
        {
            if (!CanMove(firstX, firstY))
                return new SpecialActivationResult(SpecialKind.None, firstX, firstY, new List<(int x, int y)>());

            var first = board.GetSpecial(firstX, firstY);
            var second = board.GetSpecial(secondX, secondY);
            var combined = SpecialComboRule.Resolve(first, second);
            if (combined == SpecialKind.None)
                return new SpecialActivationResult(SpecialKind.None, firstX, firstY, new List<(int x, int y)>());

            var description = ComboResolutionRules.Describe(first, second);
            var affected = BuildComboCells(description, firstX, firstY, board.Width, board.Height);
            board.ClearCells(affected);
            movesUsed++;
            objectiveProgress += affected.Count;

            return new SpecialActivationResult(combined, firstX, firstY, affected);
        }

        private bool CanMove(int x, int y)
        {
            return MovesRemaining > 0 && x >= 0 && x < board.Width && y >= 0 && y < board.Height;
        }

        private static IReadOnlyList<(int x, int y)> BuildComboCells(
            ComboResolution resolution,
            int centerX,
            int centerY,
            int width,
            int height)
        {
            var cells = new HashSet<(int x, int y)>();

            if (resolution.ClearsRow)
            {
                for (var x = 0; x < width; x++)
                    cells.Add((x, centerY));
            }

            if (resolution.ClearsColumn)
            {
                for (var y = 0; y < height; y++)
                    cells.Add((centerX, y));
            }

            if (resolution.Radius > 0)
            {
                for (var x = centerX - resolution.Radius; x <= centerX + resolution.Radius; x++)
                for (var y = centerY - resolution.Radius; y <= centerY + resolution.Radius; y++)
                    if (x >= 0 && x < width && y >= 0 && y < height)
                        cells.Add((x, y));
            }

            return new List<(int x, int y)>(cells);
        }
    }
}
