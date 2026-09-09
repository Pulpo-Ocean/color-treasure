using UnityEngine;

namespace ColorTreasure.Runtime.Board
{
    [CreateAssetMenu(fileName = "BoardConfig", menuName = "Color Treasure/Board Config")]
    public sealed class BoardConfig : ScriptableObject
    {
        [Min(1)] public int width = 6;
        [Min(1)] public int height = 6;
        [Range(2, 6)] public int colors = 5;
        [Min(1)] public int seed = 1;
        [Min(1)] public int moves = 28;
    }
}
