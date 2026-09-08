using ColorTreasure.Runtime.Gameplay;
using NUnit.Framework;

namespace ColorTreasure.Tests.Runtime
{
    public sealed class GameSessionTests
    {
        [Test]
        public void Move_IsConsumed_OnlyForValidGroup()
        {
            var session = new GameSession(1, 28);

            Assert.That(session.TryConsumeMove(1), Is.False);
            Assert.That(session.MovesUsed, Is.EqualTo(0));
            Assert.That(session.TryConsumeMove(4), Is.True);
            Assert.That(session.MovesUsed, Is.EqualTo(1));
            Assert.That(session.TilesCleared, Is.EqualTo(4));
        }

        [Test]
        public void FinishedSession_RejectsFurtherMoves()
        {
            var session = new GameSession(1, 28);
            session.Finish();

            Assert.That(session.TryConsumeMove(4), Is.False);
            Assert.That(session.MovesUsed, Is.EqualTo(0));
        }
    }
}
