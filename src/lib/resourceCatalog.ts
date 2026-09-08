export const RESOURCE_CATALOG = [
  { key: 'coins', label: 'Coins', icon: '◆' },
  { key: 'gems', label: 'Gems', icon: '◇' },
  { key: 'lives', label: 'Lives', icon: '♥' },
  { key: 'boosters', label: 'Boosters', icon: '✦' },
  { key: 'stars', label: 'Stars', icon: '★' },
  { key: 'fragments', label: 'Fragments', icon: '◈' },
] as const;

export type ResourceKey = (typeof RESOURCE_CATALOG)[number]['key'];
