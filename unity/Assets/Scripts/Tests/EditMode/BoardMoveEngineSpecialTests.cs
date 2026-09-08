using ColorTreasure.Runtime.Board;
using ColorTreasure.Runtime.Gameplay;
using NUnit.Framework;

namespace ColorTreasure.Tests.EditMode
{
    public sealed class BoardMoveEngineSpecialTests
    {
        [Test]
        public void ActivateLineBurstClearsExpectedRowAndConsumesMove()
        {
            var board = new BoardModel(6, 6, 4, 1234);
            board.SetSpecial(2, 3, SpecialKind.LineBurst);
            var engine = new BoardMoveEngine(board, 10, 999);

            var result = engine.ActivateSpecial(2, 3);

            Assert.That(result.Kind, Is.EqualTo(SpecialKind.LineBurst));
            Assert.That(result.AffectedCells.Count, Is.EqualTo(6));
            Assert.That(engine.MovesRemaining, Is.EqualTo(9));
            Assert.That(board.GetSpecial(2, 3), Is.EqualTo(SpecialKind.None));
        }

        [Test]
        public void ActivateCrossAndLineComboBuildsUnionOfRowAndColumn()
        {
            var board = new BoardModel(6, 6, 4, 5678);
            board.SetSpecial(2, 3, SpecialKind.LineBurst);
            board.SetSpecial(2, 3, SpecialKind.CrossBurst);
            var engine = new BoardMoveEngine(board, 10, 999);

            var result = engine.ActivateSpecialCombo(2, 3, 2, 3);

            Assert.That(result.Kind, Is.EqualTo(SpecialKind.CrossBurst));
            Assert.That(result.AffectedCells.Count, Is.EqualTo(11));
            Assert.That(engine.MovesRemaining, Is.EqualTo(9));
        }

        [Test]
        public void SpecialSurvivesGravityWhenItsTileIsNotCleared()
        {
            var board = new BoardModel(4, 4, 4, 2468);
            board.SetSpecial(1, 3, SpecialKind.AreaBomb);
            var affected = new[] { (1, 0), (1, 1) };

            board.ClearCells(affected);

            Assert.That(board.GetSpecial(1, 1), Is.EqualTo(SpecialKind.AreaBomb));
        }
    }
}
