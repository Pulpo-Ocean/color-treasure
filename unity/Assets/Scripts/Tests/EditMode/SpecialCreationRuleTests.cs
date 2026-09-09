using ColorTreasure.Runtime.Gameplay;
using NUnit.Framework;

namespace ColorTreasure.Tests.EditMode
{
    public sealed class SpecialCreationRuleTests
    {
        [TestCase(1, SpecialKind.None)]
        [TestCase(2, SpecialKind.None)]
        [TestCase(3, SpecialKind.None)]
        [TestCase(4, SpecialKind.LineBurst)]
        [TestCase(5, SpecialKind.CrossBurst)]
        [TestCase(6, SpecialKind.AreaBomb)]
        [TestCase(7, SpecialKind.AreaBomb)]
        [TestCase(8, SpecialKind.RainbowShell)]
        [TestCase(12, SpecialKind.RainbowShell)]
        public void GroupSizeMapsToExpectedSpecial(int size, SpecialKind expected)
        {
            Assert.That(SpecialCreationRule.FromGroupSize(size), Is.EqualTo(expected));
        }

        [Test]
        public void RainbowComboProducesTreasureBurst()
        {
            Assert.That(
                SpecialComboRule.Resolve(SpecialKind.RainbowShell, SpecialKind.LineBurst),
                Is.EqualTo(SpecialKind.TreasureBurst));
        }

        [Test]
        public void InvalidComboProducesNone()
        {
            Assert.That(
                SpecialComboRule.Resolve(SpecialKind.None, SpecialKind.LineBurst),
                Is.EqualTo(SpecialKind.None));
        }
    }
}
