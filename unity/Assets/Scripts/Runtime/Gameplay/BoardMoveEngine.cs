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
            if (MovesRemaining <= 0 || x < 0 || x >= board.Width || y < 0 || y >= board.Height)
                return new MoveResult(false, 0, 0, false, MovesRemaining <= 0);

            var group = board.FindGroup(x, y);
            if (group.Count < 2)
                return new MoveResult(false, 0, 0, false, false);

            var groupSize = group.Count;
            var createdSpecial = SpecialCreationRule.FromGroupSize(groupSize);
            var cleared = board.ClearGroup(x, y);

            movesUsed++;
            objectiveProgress += cleared;

            var won = objectiveProgress >= objectiveTarget;
            var failed = !won && MovesRemaining <= 0;
            return new MoveResult(true, cleared, 0, won, failed, createdSpecial);
        }
    }
}
