using UnityEngine;

namespace ColorTreasure.Runtime
{
    public sealed class ColorTreasureGameBootstrap : MonoBehaviour
    {
        [SerializeField] private bool dontDestroyOnLoad = true;

        private void Awake()
        {
            if (dontDestroyOnLoad)
            {
                DontDestroyOnLoad(gameObject);
            }
        }
    }
}
