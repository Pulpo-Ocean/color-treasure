using UnityEngine;

namespace ColorTreasure.Runtime.Board
{
    public sealed class BoardView : MonoBehaviour
    {
        [SerializeField] private float tileSize = 1f;
        [SerializeField] private float spacing = 0.08f;
        [SerializeField] private float tileScale = 0.92f;

        private BoardModel model;
        private Transform root;
        private Sprite squareSprite;
        private SpriteRenderer[,] renderers;

        public void Build(BoardModel board)
        {
            model = board;
            Clear();
            root = new GameObject("BoardTiles").transform;
            root.SetParent(transform, false);
            squareSprite = CreateSquareSprite();
            renderers = new SpriteRenderer[model.Width, model.Height];

            for (var x = 0; x < model.Width; x++)
            for (var y = 0; y < model.Height; y++)
            {
                var tile = new GameObject($"Tile_{x}_{y}");
                tile.transform.SetParent(root, false);
                tile.transform.localPosition = CellToLocal(x, y);
                tile.transform.localScale = Vector3.one * tileScale * tileSize;
                var renderer = tile.AddComponent<SpriteRenderer>();
                renderer.sprite = squareSprite;
                renderer.color = ColorFor(model.Get(x, y));
                renderers[x, y] = renderer;
            }
        }

        public Vector3 CellToLocal(int x, int y)
        {
            var step = tileSize + spacing;
            var offsetX = (model.Width - 1) * step * 0.5f;
            var offsetY = (model.Height - 1) * step * 0.5f;
            return new Vector3(x * step - offsetX, y * step - offsetY, 0f);
        }

        public void Refresh()
        {
            if (model == null || renderers == null) return;
            for (var x = 0; x < model.Width; x++)
            for (var y = 0; y < model.Height; y++)
                renderers[x, y].color = ColorFor(model.Get(x, y));
        }

        private void Clear()
        {
            if (root == null) return;
            Destroy(root.gameObject);
            root = null;
        }

        private static Sprite CreateSquareSprite()
        {
            var texture = new Texture2D(1, 1, TextureFormat.RGBA32, false);
            texture.SetPixel(0, 0, Color.white);
            texture.Apply();
            return Sprite.Create(texture, new Rect(0, 0, 1, 1), new Vector2(0.5f, 0.5f), 1f);
        }

        private static Color ColorFor(TileColor color)
        {
            switch (color)
            {
                case TileColor.Red: return new Color(0.94f, 0.24f, 0.30f);
                case TileColor.Blue: return new Color(0.18f, 0.55f, 0.95f);
                case TileColor.Green: return new Color(0.20f, 0.76f, 0.48f);
                case TileColor.Yellow: return new Color(0.98f, 0.78f, 0.20f);
                case TileColor.Purple: return new Color(0.63f, 0.35f, 0.88f);
                case TileColor.Orange: return new Color(1.00f, 0.49f, 0.18f);
                default: return Color.clear;
            }
        }
    }
}
