using ColorTreasure.Runtime.Gameplay;
using NUnit.Framework;

namespace ColorTreasure.Tests.EditMode
{
    public sealed class SpecialInventoryTests
    {
        [Test]
        public void SetAndGetSpecialIsDeterministic()
        {
            var inventory = new SpecialInventory();
            inventory.Set(new SpecialTile(SpecialKind.LineBurst, 2, 3));

            Assert.That(inventory.Count, Is.EqualTo(1));
            Assert.That(inventory.TryGet(2, 3, out var kind), Is.True);
            Assert.That(kind, Is.EqualTo(SpecialKind.LineBurst));
        }

        [Test]
        public void RemoveSpecialClearsOnlySelectedCell()
        {
            var inventory = new SpecialInventory();
            inventory.Set(new SpecialTile(SpecialKind.LineBurst, 2, 3));
            inventory.Set(new SpecialTile(SpecialKind.AreaBomb, 4, 5));

            Assert.That(inventory.Remove(2, 3), Is.True);
            Assert.That(inventory.Count, Is.EqualTo(1));
            Assert.That(inventory.TryGet(4, 5, out var kind), Is.True);
            Assert.That(kind, Is.EqualTo(SpecialKind.AreaBomb));
        }
    }
}
