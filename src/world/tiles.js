export const TILES = {
  AIR: {
    id: 0,
    name: "air",
    solid: false,
    visible: false,
  },
  DIRT: {
    id: 1,
    name: "dirt",
    solid: true,
    visible: true,
    color: 0xa15c2a,
    border: 0x4e2a12,
  },
};

export const TILE_BY_ID = Object.fromEntries(
  Object.values(TILES).map((tile) => [tile.id, tile]),
);

export function getTileDef(id) {
  return TILE_BY_ID[id] ?? TILES.AIR;
}
