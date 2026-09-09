using ColorTreasure.Runtime.Board;
using ColorTreasure.Runtime.Gameplay;
using NUnit.Framework;

namespace ColorTreasure.Tests.EditMode
{
    public sealed class BoardMoveEngineGuardTests
    {
        [Test]
        public void InvalidSecondSpecialCoordinateDoesNotConsumeMove()
        {
            var board = new BoardModel(6, 6, 4, 9101);
            board.SetSpecial(2, 3, SpecialKind.LineBurst);
            var engine = new BoardMoveEngine(board, 10, 999);

            var result = engine.ActivateSpecialCombo(2, 3, 99, 99);

            Assert.That(result.Kind, Is.EqualTo(SpecialKind.None));
            Assert.That(result.AffectedCells.Count, Is.EqualTo(0));
            Assert.That(engine.MovesRemaining, Is.EqualTo(10));
            Assert.That(board.GetSpecial(2, 3), Is.EqualTo(SpecialKind.LineBurst));
        }

        [Test]
        public void MissingSecondSpecialDoesNotConsumeMove()
        {
            var board = new BoardModel(6, 6, 4, 9102);
            board.SetSpecial(2, 3, SpecialKind.LineBurst);
            var engine = new BoardMoveEngine(board, 10, 999);

            var result = engine.ActivateSpecialCombo(2, 3, 4, 3);

            Assert.That(result.Kind, Is.EqualTo(SpecialKind.None));
            Assert.That(engine.MovesRemaining, Is.EqualTo(10));
            Assert.That(board.GetSpecial(2, 3), Is.EqualTo(SpecialKind.LineBurst));
        }

        [Test]
        public void MoveIsRejectedAfterMoveBudgetIsConsumed()
        {
            var board = new BoardModel(6, 6, 4, 9103);
            var engine = new BoardMoveEngine(board, 0, 999);

            var result = engine.ClearGroup(0, 0);

            Assert.That(result.Accepted, Is.False);
            Assert.That(engine.MovesRemaining, Is.EqualTo(0));
        }
    }
}
