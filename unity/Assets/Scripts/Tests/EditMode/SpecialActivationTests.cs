using ColorTreasure.Runtime.Gameplay;
using NUnit.Framework;

namespace ColorTreasure.Tests.EditMode
{
    public sealed class SpecialActivationTests
    {
        [Test]
        public void LineBurstClearsWholeRow()
        {
            var cells = SpecialActivation.GetAffectedCells(SpecialKind.LineBurst, 2, 3, 6, 6);
            Assert.That(cells.Count, Is.EqualTo(6));
        }

        [Test]
        public void CrossBurstClearsRowAndColumnWithoutDuplicateCenter()
        {
            var cells = SpecialActivation.GetAffectedCells(SpecialKind.CrossBurst, 2, 3, 6, 6);
            Assert.That(cells.Count, Is.EqualTo(11));
        }

        [Test]
        public void AreaBombIsBoundedAtEdges()
        {
            var cells = SpecialActivation.GetAffectedCells(SpecialKind.AreaBomb, 0, 0, 6, 6);
            Assert.That(cells.Count, Is.EqualTo(4));
        }

        [Test]
        public void TreasureBurstCombinesCrossAndAreaEffects()
        {
            var cells = SpecialActivation.GetAffectedCells(SpecialKind.TreasureBurst, 2, 2, 6, 6);
            Assert.That(cells.Count, Is.GreaterThan(11));
        }
    }
}
