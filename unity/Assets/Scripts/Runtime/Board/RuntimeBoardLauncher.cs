using UnityEngine;
using ColorTreasure.Runtime.Gameplay;

namespace ColorTreasure.Runtime.Board
{
    public static class RuntimeBoardLauncher
    {
        [RuntimeInitializeOnLoadMethod(RuntimeInitializeLoadType.AfterSceneLoad)]
        private static void Launch()
        {
            if (Object.FindFirstObjectByType<BoardInputController>() != null)
                return;

            var camera = Camera.main;
            if (camera == null)
            {
                var cameraObject = new GameObject("Main Camera");
                camera = cameraObject.AddComponent<Camera>();
                cameraObject.tag = "MainCamera";
            }

            camera.orthographic = true;
            camera.transform.position = new Vector3(0f, 0f, -10f);
            camera.orthographicSize = 4.2f;

            var boardObject = new GameObject("Color Treasure Board");
            boardObject.AddComponent<BoardView>();
            boardObject.AddComponent<BoardInputController>();
        }
    }
}
