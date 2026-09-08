using ColorTreasure.Runtime.Board;
using UnityEngine;
using UnityEngine.InputSystem;

namespace ColorTreasure.Runtime.Gameplay
{
    public sealed class BoardInputController : MonoBehaviour
    {
        [SerializeField] private Camera targetCamera;
        [SerializeField] private BoardView boardView;
        [SerializeField] private BoardConfig boardConfig;
        [SerializeField] private int objectiveTarget = 20;

        private BoardModel model;
        private BoardMoveEngine engine;
        private float boardStep;

        private void Awake()
        {
            if (targetCamera == null) targetCamera = Camera.main;
            if (boardView == null) boardView = GetComponent<BoardView>();
            if (boardConfig == null) boardConfig = ScriptableObject.CreateInstance<BoardConfig>();

            model = new BoardModel(boardConfig.width, boardConfig.height, boardConfig.colors, boardConfig.seed);
            engine = new BoardMoveEngine(model, boardConfig.moves, objectiveTarget);
            boardStep = boardView.TileSize + boardView.Spacing;
            boardView.Build(model);
        }

        private void Update()
        {
            if (Mouse.current != null && Mouse.current.leftButton.wasPressedThisFrame)
                TrySelect(Mouse.current.position.ReadValue());

            if (Touchscreen.current != null && Touchscreen.current.primaryTouch.press.wasPressedThisFrame)
                TrySelect(Touchscreen.current.primaryTouch.position.ReadValue());
        }

        private void TrySelect(Vector2 screenPosition)
        {
            if (targetCamera == null || boardView == null || engine == null) return;

            var world = targetCamera.ScreenToWorldPoint(new Vector3(screenPosition.x, screenPosition.y, -targetCamera.transform.position.z));
            var local = boardView.transform.InverseTransformPoint(world);
            var x = Mathf.RoundToInt((local.x + (model.Width - 1) * boardStep * 0.5f) / boardStep);
            var y = Mathf.RoundToInt((local.y + (model.Height - 1) * boardStep * 0.5f) / boardStep);
            if (x < 0 || x >= model.Width || y < 0 || y >= model.Height) return;

            var special = model.GetSpecial(x, y);
            if (special != SpecialKind.None)
            {
                var specialResult = engine.ActivateSpecial(x, y);
                if (specialResult.Kind != SpecialKind.None)
                    boardView.Refresh();
                return;
            }

            var result = engine.ClearGroup(x, y);
            if (result.Accepted)
                boardView.Refresh();
        }
    }
}
