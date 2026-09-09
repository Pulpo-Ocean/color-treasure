using ColorTreasure.Runtime.Board;
using ColorTreasure.Runtime.Gameplay;
using NUnit.Framework;

namespace ColorTreasure.Tests.EditMode
{
    public sealed class BoardMoveEngineTests
    {
        [Test]
        public void InvalidGroupDoesNotConsumeMove()
        {
            var board = new BoardModel(6, 6, 5, 1);
            var engine = new BoardMoveEngine(board, 28, 999);

            var foundSingle = false;
            for (var y = 0; y < board.Height && !foundSingle; y++)
            for (var x = 0; x < board.Width && !foundSingle; x++)
            {
                if (board.FindGroup(x, y).Count == 1)
                    foundSingle = true;
            }

            if (!foundSingle)
                Assert.Ignore("Deterministic seed produced no singleton cell.");

            var result = new MoveResult(false, 0, 0, false, false);
            for (var y = 0; y < board.Height && !result.Accepted; y++)
            for (var x = 0; x < board.Width && !result.Accepted; x++)
            {
                if (board.FindGroup(x, y).Count == 1)
                    result = engine.ClearGroup(x, y);
            }

            Assert.That(result.Accepted, Is.False);
            Assert.That(engine.MovesRemaining, Is.EqualTo(28));
        }

        [Test]
        public void LargeGroupProducesExpectedSpecialType()
        {
            for (var seed = 1; seed <= 100; seed++)
            {
                var board = new BoardModel(6, 6, 5, seed);
                var engine = new BoardMoveEngine(board, 28, 999);

                for (var y = 0; y < board.Height; y++)
                for (var x = 0; x < board.Width; x++)
                {
                    var size = board.FindGroup(x, y).Count;
                    if (size < 4) continue;

                    var expected = SpecialCreationRule.FromGroupSize(size);
                    var result = engine.ClearGroup(x, y);
                    Assert.That(result.Accepted, Is.True);
                    Assert.That(result.CreatedSpecial, Is.EqualTo(expected));
                    return;
                }
            }

            Assert.Fail("No deterministic board in seeds 1..100 produced a group of four or more.");
        }
    }
}
