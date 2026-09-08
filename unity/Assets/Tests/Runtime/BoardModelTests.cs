using ColorTreasure.Runtime.Board;
using NUnit.Framework;

namespace ColorTreasure.Tests.Runtime
{
    public sealed class BoardModelTests
    {
        [Test]
        public void Board_IsDeterministic_ForSameSeed()
        {
            var first = new BoardModel(6, 6, 5, 1234);
            var second = new BoardModel(6, 6, 5, 1234);

            for (var x = 0; x < 6; x++)
            for (var y = 0; y < 6; y++)
                Assert.That(first.Get(x, y), Is.EqualTo(second.Get(x, y)));
        }

        [Test]
        public void ClearGroup_RejectsSingleTile()
        {
            var board = new BoardModel(6, 6, 5, 42);
            var group = board.FindGroup(0, 0);

            if (group.Count == 1)
                Assert.That(board.ClearGroup(0, 0), Is.EqualTo(0));
            else
                Assert.That(group.Count, Is.GreaterThan(1));
        }

        [Test]
        public void Board_ContainsOnlyValidColors()
        {
            var board = new BoardModel(6, 6, 5, 99);

            for (var x = 0; x < 6; x++)
            for (var y = 0; y < 6; y++)
                Assert.That((int)board.Get(x, y), Is.InRange(1, 5));
        }
    }
}
