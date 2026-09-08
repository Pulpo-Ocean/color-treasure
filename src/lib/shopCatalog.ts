export const GEM_PACKS = [
  { productId: 'gems_099', title: 'Pocket Gems', gems: 90, price: '€0.99', featured: false },
  { productId: 'gems_299', title: 'Gem Dive', gems: 300, price: '€2.99', featured: false },
  { productId: 'gems_599', title: 'Treasure Stack', gems: 650, price: '€5.99', featured: true },
  { productId: 'gems_999', title: 'Pearl Vault', gems: 1200, price: '€9.99', featured: false },
  { productId: 'gems_1999', title: 'Deep Sea Chest', gems: 2600, price: '€19.99', featured: false },
  { productId: 'gems_4999', title: 'Legendary Hoard', gems: 7000, price: '€49.99', featured: false },
] as const;

export type GemPack = (typeof GEM_PACKS)[number];
