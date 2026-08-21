import { useRef, useState, useMemo, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Html, Edges, Grid, ContactShadows, useGLTF } from "@react-three/drei";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import * as THREE from "three";
import { HandHelping, User2, RotateCcw, Building2 } from "lucide-react";
import clsx from "clsx";
import type { Resident, StaffMember, Floor } from "../lib/mockData";
import {
  wingZones,
  toWorldX,
  toWorldZ,
  getFloorLayout,
  getRoomCenterPct,
  FLOOR_LABELS,
  FLOOR_SHORT,
  type RoomPlacement,
} from "../lib/floorPlan";

const GROUND_WIDTH = 32;
const GROUND_DEPTH = 24;

const staffStatusHex: Record<StaffMember["status"], string> = {
  available: "#5a8548",
  "with-resident": "#5490b8",
  break: "#93a199",
  handover: "#d9a52a",
  overloaded: "#c2622b",
};

const roomStatusFloorHex: Record<string, string> = {
  "vacant-ready": "#e7f1f7",
  "vacant-turnover": "#fdf3d8",
  maintenance: "#dde3de",
};

function PulseRing({ color, radius = 0.42 }: { color: string; radius?: number }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!ref.current) return;
    const period = 1.8;
    const p = (state.clock.elapsedTime % period) / period;
    const s = 0.5 + p * 1.6;
    ref.current.scale.set(s, s, s);
    const mat = ref.current.material as THREE.MeshBasicMaterial;
    mat.opacity = 0.55 * (1 - p);
  });
  return (
    <mesh ref={ref} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
      <ringGeometry args={[radius * 0.7, radius, 32]} />
      <meshBasicMaterial color={color} transparent opacity={0.5} depthWrite={false} />
    </mesh>
  );
}

function SelectRing({ radius = 0.55 }: { radius?: number }) {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 0]}>
      <ringGeometry args={[radius * 0.82, radius, 40]} />
      <meshBasicMaterial color="#1c2620" transparent opacity={0.55} depthWrite={false} />
    </mesh>
  );
}

function WingLabel({ zone }: { zone: (typeof wingZones)[number] }) {
  const x1 = toWorldX(zone.left);
  const z1 = toWorldZ(zone.top);
  return (
    <Html position={[x1 + 0.1, 0.55, z1 + 0.1]} style={{ pointerEvents: "none" }} zIndexRange={[11, 0]}>
      <div className="whitespace-nowrap text-[12px] font-bold uppercase tracking-wider -translate-y-1/2" style={{ color: zone.label }}>
        {zone.wing}
      </div>
    </Html>
  );
}

// Real, authored glTF furniture — generated once via GLTFExporter and checked
// into public/models, loaded through the standard useGLTF/GLTFLoader pipeline.
const MODEL_URLS = {
  bed: "/models/bed.glb",
  nightstand: "/models/nightstand.glb",
  wardrobe: "/models/wardrobe.glb",
  chair: "/models/chair.glb",
} as const;
Object.values(MODEL_URLS).forEach((url) => useGLTF.preload(url));

// glTF scenes are cached by useGLTF and must be cloned per placement — reusing
// the same Object3D in multiple spots would only render it in the last one.
// Shadow flags aren't part of the glTF spec, so they're set after cloning.
function useFurniture(url: string) {
  const { scene } = useGLTF(url);
  return useMemo(() => {
    const clone = scene.clone(true);
    clone.traverse((obj) => {
      if ((obj as THREE.Mesh).isMesh) {
        obj.castShadow = true;
        obj.receiveShadow = true;
      }
    });
    return clone;
  }, [scene]);
}

const BED_SIZE = { w: 0.85, d: 1.35 };

// A single room: floor plate, three walls (south side left open as the doorway), and
// glTF-modeled furniture (bed, nightstand, wardrobe, chair) for occupied rooms.
function RoomBox({ placement, wingEdge, wingFloorColor }: { placement: RoomPlacement; wingEdge: string; wingFloorColor: string }) {
  const bedModel = useFurniture(MODEL_URLS.bed);
  const nightstandModel = useFurniture(MODEL_URLS.nightstand);
  const wardrobeModel = useFurniture(MODEL_URLS.wardrobe);
  const chairModel = useFurniture(MODEL_URLS.chair);

  const { room, rectPct } = placement;
  const x1 = toWorldX(rectPct.left);
  const x2 = toWorldX(rectPct.left + rectPct.width);
  const z1 = toWorldZ(rectPct.top);
  const z2 = toWorldZ(rectPct.top + rectPct.height);
  const width = x2 - x1;
  const depth = z2 - z1;
  const centerX = (x1 + x2) / 2;
  const centerZ = (z1 + z2) / 2;
  const wallHeight = 0.82;
  const wallThickness = 0.06;

  const floorColor = room.status === "occupied" ? wingFloorColor : roomStatusFloorHex[room.status] ?? wingFloorColor;
  const showBed = room.status === "occupied";

  const furnitureScale = Math.min(1, (width * 0.85) / BED_SIZE.w, (depth * 0.55) / BED_SIZE.d);
  const bedX = centerX - width * 0.14;
  const bedZ = z1 + (BED_SIZE.d * furnitureScale) / 2 + 0.14;
  const wardrobeFits = width > 1.5 && depth > 1.8;
  const chairFits = wardrobeFits && depth > 2.2;

  return (
    <group>
      <mesh receiveShadow position={[centerX, 0.05, centerZ]}>
        <boxGeometry args={[width, 0.1, depth]} />
        <meshStandardMaterial color={floorColor} roughness={0.95} />
        <Edges scale={1} threshold={15}>
          <lineBasicMaterial color={wingEdge} />
        </Edges>
      </mesh>

      <mesh castShadow receiveShadow position={[centerX, wallHeight / 2 + 0.1, z1]}>
        <boxGeometry args={[width, wallHeight, wallThickness]} />
        <meshStandardMaterial color={wingEdge} roughness={0.85} />
      </mesh>
      <mesh castShadow receiveShadow position={[x1, wallHeight / 2 + 0.1, centerZ]}>
        <boxGeometry args={[wallThickness, wallHeight, depth]} />
        <meshStandardMaterial color={wingEdge} roughness={0.85} />
      </mesh>
      <mesh castShadow receiveShadow position={[x2, wallHeight / 2 + 0.1, centerZ]}>
        <boxGeometry args={[wallThickness, wallHeight, depth]} />
        <meshStandardMaterial color={wingEdge} roughness={0.85} />
      </mesh>

      {showBed && (
        <group position={[bedX, 0, bedZ]} scale={furnitureScale}>
          <primitive object={bedModel} />
          <primitive object={nightstandModel} position={[BED_SIZE.w / 2 + 0.19, 0, -BED_SIZE.d / 2 + 0.14]} />
        </group>
      )}
      {showBed && wardrobeFits && (
        <primitive object={wardrobeModel} position={[x2 - 0.28, 0, z2 - 0.42]} rotation={[0, -Math.PI / 2, 0]} />
      )}
      {showBed && chairFits && <primitive object={chairModel} position={[centerX + width * 0.08, 0, z2 - 0.32]} />}

      {!room.isFiller && (
        <Html position={[x1 + 0.12, 0.12, z2 - 0.12]} style={{ pointerEvents: "none" }} zIndexRange={[8, 0]}>
          <div className="whitespace-nowrap text-[8px] font-semibold uppercase tracking-wide text-ink-400/80 bg-white/70 rounded px-1">
            {room.label}
          </div>
        </Html>
      )}
    </group>
  );
}

function ResidentMarker({
  resident,
  worldPos,
  selected,
  onSelect,
}: {
  resident: Resident;
  worldPos: [number, number];
  selected: boolean;
  onSelect: (id: string, kind: "resident" | "staff") => void;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const phase = useMemo(() => worldPos[0] * 3.1, [worldPos]);

  useFrame((state) => {
    if (!groupRef.current) return;
    groupRef.current.position.y = 0.5 + Math.sin(state.clock.elapsedTime * 1.3 + phase) * 0.03;
  });

  const color = resident.needsHelp ? "#d9645a" : resident.deteriorationRisk > 65 ? "#c2622b" : "#6b7b70";

  return (
    <group position={[worldPos[0], 0, worldPos[1]]}>
      {resident.needsHelp && <PulseRing color="#d9645a" />}
      {selected && <SelectRing />}
      <group
        ref={groupRef}
        position={[0, 0.5, 0]}
        onClick={(e) => {
          e.stopPropagation();
          onSelect(resident.id, "resident");
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          setHovered(false);
          document.body.style.cursor = "auto";
        }}
        scale={hovered || selected ? 1.15 : 1}
      >
        <mesh castShadow position={[0, -0.27, 0]}>
          <cylinderGeometry args={[0.045, 0.045, 0.46, 8]} />
          <meshStandardMaterial color={color} roughness={0.6} />
        </mesh>
        <mesh castShadow>
          <sphereGeometry args={[0.2, 20, 20]} />
          <meshStandardMaterial color={color} roughness={0.35} metalness={0.05} />
        </mesh>
        <Html position={[0, 0.42, 0]} center zIndexRange={[10, 0]}>
          <div
            onClick={(e) => {
              e.stopPropagation();
              onSelect(resident.id, "resident");
            }}
            onPointerEnter={() => {
              setHovered(true);
              document.body.style.cursor = "pointer";
            }}
            onPointerLeave={() => {
              setHovered(false);
              document.body.style.cursor = "auto";
            }}
            className={clsx(
              "flex cursor-pointer items-center gap-1 rounded-full border-2 border-white pl-1 pr-2 py-0.5 text-[10px] font-bold text-white shadow-md transition-transform",
              hovered && "scale-110",
              resident.needsHelp ? "bg-rose-500" : resident.deteriorationRisk > 65 ? "bg-clay-600" : "bg-ink-500"
            )}
          >
            {resident.needsHelp ? <HandHelping size={11} /> : <span className="h-4 w-4 flex items-center justify-center">{resident.photoInitials.slice(0, 1)}</span>}
            {resident.needsHelp && <span className="whitespace-nowrap">Help</span>}
          </div>
        </Html>
      </group>
    </group>
  );
}

// Deterministic pseudo-random float in [0,1) from a string seed, so each staff
// member's patrol pattern is stable across re-renders and floor round-trips.
function seededFloat(seed: string): number {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return (h % 10000) / 10000;
}

// A patrol loop of 2-4 room centers within the staff member's own wing, so
// movement reads as "walking between resident rooms" rather than wandering.
function buildPatrolWaypoints(staffMember: StaffMember): [number, number][] {
  const centers = getFloorLayout(staffMember.floor)
    .filter((p) => p.room.wing === staffMember.wing)
    .map((p): [number, number] => [
      toWorldX(p.rectPct.left + p.rectPct.width / 2),
      toWorldZ(p.rectPct.top + p.rectPct.height / 2),
    ]);

  if (centers.length < 2) {
    const zone = wingZones.find((z) => z.wing === staffMember.wing)!;
    return [
      [toWorldX(zone.left + zone.width * 0.25), toWorldZ(zone.top + zone.height * 0.25)],
      [toWorldX(zone.left + zone.width * 0.75), toWorldZ(zone.top + zone.height * 0.75)],
    ];
  }

  const seed = seededFloat(staffMember.id);
  const start = Math.floor(seed * centers.length);
  const count = Math.min(4, centers.length);
  const picked: [number, number][] = [];
  for (let i = 0; i < count; i++) picked.push(centers[(start + i * 2) % centers.length]);
  return picked;
}

const WALK_SPEED = 1.25; // world units / second

function StaffMarker({
  staffMember,
  selected,
  onSelect,
}: {
  staffMember: StaffMember;
  selected: boolean;
  onSelect: (id: string, kind: "resident" | "staff") => void;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const color = staffStatusHex[staffMember.status];
  const isOverloaded = staffMember.status === "overloaded";

  const waypoints = useMemo(() => buildPatrolWaypoints(staffMember), [staffMember]);
  const motion = useRef({ target: 1, pause: seededFloat(staffMember.id + "p") * 3 });

  useFrame((state, delta) => {
    const group = groupRef.current;
    if (!group || waypoints.length < 2) return;

    if (motion.current.pause > 0) {
      motion.current.pause -= delta;
      group.position.y = 0;
      return;
    }

    const [tx, tz] = waypoints[motion.current.target % waypoints.length];
    const dx = tx - group.position.x;
    const dz = tz - group.position.z;
    const dist = Math.hypot(dx, dz);

    if (dist < 0.08) {
      motion.current.target += 1;
      motion.current.pause = 1.5 + seededFloat(staffMember.id + motion.current.target) * 2.5;
      group.position.y = 0;
      return;
    }

    const nx = dx / dist;
    const nz = dz / dist;
    const step = Math.min(dist, WALK_SPEED * delta);
    group.position.x += nx * step;
    group.position.z += nz * step;
    group.position.y = Math.abs(Math.sin(state.clock.elapsedTime * 9)) * 0.035;
  });

  return (
    <group ref={groupRef} position={[waypoints[0][0], 0, waypoints[0][1]]}>
      {isOverloaded && <PulseRing color="#c2622b" radius={0.32} />}
      {selected && <SelectRing radius={0.4} />}
      <mesh
        castShadow
        position={[0, 0.24, 0]}
        scale={hovered || selected ? 1.2 : 1}
        onClick={(e) => {
          e.stopPropagation();
          onSelect(staffMember.id, "staff");
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          setHovered(false);
          document.body.style.cursor = "auto";
        }}
      >
        <sphereGeometry args={[0.15, 18, 18]} />
        <meshStandardMaterial color={color} roughness={0.4} />
      </mesh>
      <Html position={[0, 0.24, 0]} center zIndexRange={[9, 0]}>
        <div
          onClick={(e) => {
            e.stopPropagation();
            onSelect(staffMember.id, "staff");
          }}
          onPointerEnter={() => {
            setHovered(true);
            document.body.style.cursor = "pointer";
          }}
          onPointerLeave={() => {
            setHovered(false);
            document.body.style.cursor = "auto";
          }}
          className={clsx(
            "flex h-5 w-5 cursor-pointer items-center justify-center rounded-full border-2 border-white shadow-sm transition-transform",
            hovered && "scale-125"
          )}
          style={{ backgroundColor: color }}
        >
          <User2 size={10} className="text-white" />
        </div>
      </Html>
    </group>
  );
}

function SceneContents({
  floor,
  residents,
  staffList,
  selectedId,
  onSelect,
}: {
  floor: Floor;
  residents: Resident[];
  staffList: StaffMember[];
  selectedId: string | null;
  onSelect: (id: string, kind: "resident" | "staff") => void;
}) {
  const layout = useMemo(() => getFloorLayout(floor), [floor]);

  return (
    <>
      <ambientLight intensity={0.65} color="#eef1ec" />
      <directionalLight
        position={[9, 15, 7]}
        intensity={1.15}
        color="#fff8ec"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-14}
        shadow-camera-right={14}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
        shadow-camera-near={1}
        shadow-camera-far={40}
      />
      <hemisphereLight args={["#f3ede0", "#38473e", 0.25]} />

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
        <planeGeometry args={[GROUND_WIDTH, GROUND_DEPTH]} />
        <meshStandardMaterial color="#f3ede0" roughness={1} />
      </mesh>
      <Grid
        position={[0, 0, 0]}
        args={[GROUND_WIDTH, GROUND_DEPTH]}
        cellSize={1}
        cellThickness={0.4}
        cellColor="#dde3de"
        sectionSize={5}
        sectionThickness={0.7}
        sectionColor="#bcc5bd"
        fadeDistance={26}
        fadeStrength={1.5}
        followCamera={false}
        infiniteGrid={false}
      />

      {wingZones.map((z) => (
        <WingLabel key={z.wing} zone={z} />
      ))}

      {layout.map((placement) => {
        const zone = wingZones.find((z) => z.wing === placement.room.wing)!;
        return <RoomBox key={placement.room.id} placement={placement} wingEdge={zone.edge} wingFloorColor={zone.floor} />;
      })}

      {residents.map((r) => {
        const center = getRoomCenterPct(floor, r.room);
        const worldPos: [number, number] = center ? [toWorldX(center.x), toWorldZ(center.y)] : [toWorldX(r.x), toWorldZ(r.y)];
        return <ResidentMarker key={r.id} resident={r} worldPos={worldPos} selected={selectedId === r.id} onSelect={onSelect} />;
      })}
      {staffList.map((s) => (
        <StaffMarker key={s.id} staffMember={s} selected={selectedId === s.id} onSelect={onSelect} />
      ))}

      <ContactShadows position={[0, 0.001, 0]} opacity={0.3} scale={30} blur={2.6} far={6} />
    </>
  );
}

function Minimap({
  activeFloor,
  onChange,
  floorStats,
}: {
  activeFloor: Floor;
  onChange: (f: Floor) => void;
  floorStats: Record<Floor, { residents: number; staff: number; alerts: number }>;
}) {
  const order: Floor[] = [3, 2, 1];
  return (
    <div className="absolute top-3 left-3 rounded-2xl bg-white/90 backdrop-blur px-2.5 py-2.5 shadow-[var(--shadow-soft)]">
      <div className="flex items-center gap-1.5 px-1 mb-2 text-[10px] font-semibold uppercase tracking-wide text-ink-400">
        <Building2 size={11} /> Building
      </div>
      <div className="flex flex-col-reverse gap-1">
        {order
          .slice()
          .reverse()
          .map((f) => {
            const stats = floorStats[f];
            const active = f === activeFloor;
            return (
              <button
                key={f}
                onClick={() => onChange(f)}
                className={clsx(
                  "relative flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-left transition-colors w-[124px]",
                  active ? "bg-moss-600" : "bg-ink-100 hover:bg-ink-200"
                )}
              >
                <span className={clsx("flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold", active ? "bg-white text-moss-700" : "bg-white text-ink-500")}>
                  {FLOOR_SHORT[f]}
                </span>
                <span className={clsx("text-[11px] font-medium leading-tight", active ? "text-white" : "text-ink-600")}>
                  {FLOOR_LABELS[f]}
                </span>
                {stats.alerts > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[9px] font-bold text-white">
                    {stats.alerts}
                  </span>
                )}
              </button>
            );
          })}
      </div>
      <div className="mt-2 px-1 text-[10px] text-ink-400 leading-tight">
        {floorStats[activeFloor].residents} residents &middot; {floorStats[activeFloor].staff} staff
      </div>
    </div>
  );
}

export default function FloorMap3D({
  residents,
  staffList,
  selectedId,
  onSelect,
}: {
  residents: Resident[];
  staffList: StaffMember[];
  selectedId: string | null;
  onSelect: (id: string, kind: "resident" | "staff") => void;
}) {
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const [activeFloor, setActiveFloor] = useState<Floor>(1);

  const floorStats = useMemo(() => {
    const stats = {} as Record<Floor, { residents: number; staff: number; alerts: number }>;
    ([1, 2, 3] as Floor[]).forEach((f) => {
      const rOnFloor = residents.filter((r) => r.floor === f);
      const sOnFloor = staffList.filter((s) => s.floor === f);
      stats[f] = {
        residents: rOnFloor.length,
        staff: sOnFloor.length,
        alerts: rOnFloor.filter((r) => r.needsHelp).length + sOnFloor.filter((s) => s.status === "overloaded").length,
      };
    });
    return stats;
  }, [residents, staffList]);

  const floorResidents = useMemo(() => residents.filter((r) => r.floor === activeFloor), [residents, activeFloor]);
  const floorStaff = useMemo(() => staffList.filter((s) => s.floor === activeFloor), [staffList, activeFloor]);

  return (
    <div className="relative w-full aspect-[16/10] overflow-hidden rounded-2xl bg-gradient-to-b from-ink-100 to-ink-50">
      <Canvas shadows camera={{ position: [0, 13, 13], fov: 42 }} dpr={[1, 2]}>
        <Suspense fallback={null}>
          <SceneContents floor={activeFloor} residents={floorResidents} staffList={floorStaff} selectedId={selectedId} onSelect={onSelect} />
        </Suspense>
        <OrbitControls
          ref={controlsRef}
          makeDefault
          enableDamping
          dampingFactor={0.08}
          minDistance={6}
          maxDistance={24}
          maxPolarAngle={1.15}
          minPolarAngle={0.35}
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.35}
          target={[0, 0, 0]}
        />
      </Canvas>

      <Minimap activeFloor={activeFloor} onChange={setActiveFloor} floorStats={floorStats} />

      <button
        onClick={() => controlsRef.current?.reset()}
        className="absolute top-3 right-3 flex items-center gap-1.5 rounded-full bg-white/90 backdrop-blur px-3 py-1.5 text-[11px] font-semibold text-ink-600 shadow-[var(--shadow-soft)] hover:bg-white transition-colors"
      >
        <RotateCcw size={12} /> Reset view
      </button>
      <div className="absolute bottom-3 left-3 rounded-full bg-white/80 backdrop-blur px-3 py-1.5 text-[11px] text-ink-400 shadow-[var(--shadow-soft)]">
        Drag to orbit &middot; Scroll to zoom
      </div>
    </div>
  );
}
