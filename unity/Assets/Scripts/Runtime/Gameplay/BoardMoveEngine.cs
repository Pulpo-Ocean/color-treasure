using System.Collections.Generic;
using ColorTreasure.Runtime.Gameplay;

namespace ColorTreasure.Runtime.Gameplay
{
    public sealed class BoardMoveEngine
    {
        private readonly BoardState board;
        private readonly int maxMoves;
        private int movesUsed;
        private int objectiveProgress;
        private readonly int objectiveTarget;

        public BoardMoveEngine(BoardState board, int maxMoves, int objectiveTarget)
        {
            this.board = board;
            this.maxMoves = maxMoves;
            this.objectiveTarget = objectiveTarget;
        }

        public int MovesRemaining => maxMoves - movesUsed;
        public int ObjectiveProgress => objectiveProgress;

        public MoveResult ClearGroup(int x, int y)
        {
            if (MovesRemaining <= 0 || !board.InBounds(x, y))
                return new MoveResult(false, 0, 0, false, MovesRemaining <= 0);

            var group = board.FindGroup(x, y);
            if (group.Count < 2)
                return new MoveResult(false, 0, 0, false, false);

            foreach (var cell in group)
                board.Clear(cell.x, cell.y);

            board.ApplyGravityAndRefill();
            movesUsed++;
            objectiveProgress += group.Count;

            var cascades = board.ResolveCascades();
            objectiveProgress += cascades.ClearedByCascade;

            var won = objectiveProgress >= objectiveTarget;
            var failed = !won && MovesRemaining <= 0;
            return new MoveResult(true, group.Count + cascades.ClearedByCascade, cascades.Count, won, failed);
        }
    }
}
