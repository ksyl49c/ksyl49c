// Procedural room-grid layout shared between the 3D floor map and its minimap.
// Real rooms come from mockData; each wing is padded up to MIN_ROOMS_PER_WING
// with generated filler rooms so every floor reads as a fully built-out plan.

import { rooms as allRooms, type Floor, type RoomInfo, type Wing } from "./mockData";

export const SCENE_WIDTH = 22;
export const SCENE_DEPTH = 14;

export function toWorldX(pct: number) {
  return (pct / 100 - 0.5) * SCENE_WIDTH;
}
export function toWorldZ(pct: number) {
  return (pct / 100 - 0.5) * SCENE_DEPTH;
}

export interface WingZone {
  wing: Wing;
  left: number;
  top: number;
  width: number;
  height: number;
  floor: string;
  edge: string;
  label: string;
}

export const wingZones: WingZone[] = [
  { wing: "Magnolia", left: 4, top: 22, width: 26, height: 46, floor: "#dfeada", edge: "#9dbd8f", label: "#2c4424" },
  { wing: "Cedar", left: 32, top: 40, width: 20, height: 44, floor: "#fdf3d8", edge: "#f2cf6f", label: "#9c6a12" },
  { wing: "Birchwood", left: 54, top: 10, width: 20, height: 58, floor: "#e7f1f7", edge: "#a9cbe0", label: "#3d7297" },
  { wing: "Willow", left: 76, top: 18, width: 20, height: 58, floor: "#fdece3", edge: "#f3b892", label: "#9c4d22" },
];

const wingPrefix: Record<Wing, string> = { Magnolia: "M", Cedar: "C", Birchwood: "B", Willow: "W" };

const MIN_ROOMS_PER_WING = 4;

export type PlacedRoom = RoomInfo & { isFiller?: boolean };

export interface RectPct {
  left: number;
  top: number;
  width: number;
  height: number;
}

export interface RoomPlacement {
  room: PlacedRoom;
  rectPct: RectPct;
}

function makeFiller(wing: Wing, floor: Floor, index: number): PlacedRoom {
  const number = floor * 100 + 50 + index * 4;
  return {
    id: `filler-${wing}-${floor}-${index}`,
    label: `${wingPrefix[wing]}-${number}`,
    wing,
    floor,
    occupant: null,
    status: index % 2 === 0 ? "vacant-ready" : "vacant-turnover",
    bedType: "Single",
    isFiller: true,
  };
}

function layoutWing(zone: WingZone, floor: Floor): RoomPlacement[] {
  const real = allRooms.filter((r) => r.wing === zone.wing && r.floor === floor);
  const fillerCount = Math.max(0, MIN_ROOMS_PER_WING - real.length);
  const combined: PlacedRoom[] = [...real, ...Array.from({ length: fillerCount }, (_, i) => makeFiller(zone.wing, floor, i))];

  const count = combined.length;
  const columns = Math.max(1, Math.ceil(Math.sqrt(count)));
  const rows = Math.max(1, Math.ceil(count / columns));
  const cellW = zone.width / columns;
  const cellH = zone.height / rows;
  const gutter = Math.min(cellW, cellH) * 0.16;

  return combined.map((room, i) => {
    const col = i % columns;
    const row = Math.floor(i / columns);
    return {
      room,
      rectPct: {
        left: zone.left + col * cellW + gutter / 2,
        top: zone.top + row * cellH + gutter / 2,
        width: cellW - gutter,
        height: cellH - gutter,
      },
    };
  });
}

const layoutCache = new Map<Floor, RoomPlacement[]>();

export function getFloorLayout(floor: Floor): RoomPlacement[] {
  const cached = layoutCache.get(floor);
  if (cached) return cached;
  const placements = wingZones.flatMap((zone) => layoutWing(zone, floor));
  layoutCache.set(floor, placements);
  return placements;
}

export function getRoomCenterPct(floor: Floor, label: string): { x: number; y: number } | undefined {
  const placement = getFloorLayout(floor).find((p) => p.room.label === label);
  if (!placement) return undefined;
  return {
    x: placement.rectPct.left + placement.rectPct.width / 2,
    y: placement.rectPct.top + placement.rectPct.height / 2,
  };
}

export const FLOOR_LABELS: Record<Floor, string> = { 1: "Ground Floor", 2: "Floor 2", 3: "Floor 3" };
export const FLOOR_SHORT: Record<Floor, string> = { 1: "G", 2: "2", 3: "3" };
