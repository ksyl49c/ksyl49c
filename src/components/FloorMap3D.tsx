import { useRef, useState, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Html, Edges, Grid, ContactShadows } from "@react-three/drei";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import * as THREE from "three";
import { HandHelping, RotateCcw } from "lucide-react";
import clsx from "clsx";
import type { Resident, StaffMember, Wing } from "../lib/mockData";

const SCENE_WIDTH = 22;
const SCENE_DEPTH = 15;

function toWorldX(pct: number) {
  return (pct / 100 - 0.5) * SCENE_WIDTH;
}
function toWorldZ(pct: number) {
  return (pct / 100 - 0.5) * SCENE_DEPTH;
}

interface ZoneDef {
  key: string;
  label: string;
  left: number;
  top: number;
  width: number;
  height: number;
  floor: string;
  edge: string;
  labelColor: string;
}

// Wards sit in a row across the top, connected by a single main corridor,
// with kitchen and canteen service spaces below — a simplified single-corridor
// nursing home floor plan rather than four disconnected pads.
const wardZones: ZoneDef[] = [
  { key: "Magnolia", label: "Magnolia", left: 2, top: 6, width: 22, height: 36, floor: "#dfeada", edge: "#9dbd8f", labelColor: "#2c4424" },
  { key: "Cedar", label: "Cedar", left: 26, top: 6, width: 22, height: 36, floor: "#fdf3d8", edge: "#f2cf6f", labelColor: "#9c6a12" },
  { key: "Birchwood", label: "Birchwood", left: 50, top: 6, width: 22, height: 36, floor: "#e7f1f7", edge: "#a9cbe0", labelColor: "#3d7297" },
  { key: "Willow", label: "Willow", left: 74, top: 6, width: 22, height: 36, floor: "#fdece3", edge: "#f3b892", labelColor: "#9c4d22" },
];

const corridorZone: ZoneDef = {
  key: "corridor",
  label: "Main Corridor",
  left: 2,
  top: 44,
  width: 94,
  height: 12,
  floor: "#ece7da",
  edge: "#c9bfa3",
  labelColor: "#6b7b70",
};

const serviceZones: ZoneDef[] = [
  { key: "kitchen", label: "Kitchen", left: 2, top: 58, width: 45, height: 34, floor: "#ede2d3", edge: "#c9a97e", labelColor: "#7a5a34" },
  { key: "canteen", label: "Canteen", left: 51, top: 58, width: 45, height: 34, floor: "#e6efe0", edge: "#a8c191", labelColor: "#3f5c2c" },
];

// Doorway between each ward and the corridor, keyed by wing so staff patrols
// know which threshold to walk through.
const wardDoorways: Record<Wing, { x: number; z: number }> = {
  Magnolia: { x: 13, z: 42 },
  Cedar: { x: 37, z: 42 },
  Birchwood: { x: 61, z: 42 },
  Willow: { x: 85, z: 42 },
};

const serviceDoorways: { x: number; z: number; rotationY: number }[] = [
  { x: 24.5, z: 58, rotationY: Math.PI / 2 },
  { x: 73.5, z: 58, rotationY: Math.PI / 2 },
];

// Decorative kitchen/canteen presence so those service rooms don't read as
// empty. These are map dressing only — not tied to the real staff/resident
// rosters, so they never touch the capacity tracker or alert lists.
const kitchenStaffFillers: { id: string; name: string; points: [number, number][] }[] = [
  { id: "filler-kitchen-1", name: "Rosa Delgado", points: [[10, 65], [23, 84], [39, 70]] },
  { id: "filler-kitchen-2", name: "Ben Okoro", points: [[41, 88], [16, 78], [30, 62]] },
];

const canteenResidentFillers: { id: string; name: string; x: number; y: number }[] = [
  { id: "filler-canteen-1", name: "Otis Grant", x: 60, y: 68 },
  { id: "filler-canteen-2", name: "Nadia Farouk", x: 76, y: 79 },
  { id: "filler-canteen-3", name: "Wilfred Combe", x: 88, y: 65 },
];

function initialsOf(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

const staffStatusHex: Record<StaffMember["status"], string> = {
  available: "#5a8548",
  "with-resident": "#5490b8",
  break: "#93a199",
  handover: "#d9a52a",
  overloaded: "#c2622b",
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

// A classic floor-plan door symbol: a short leaf plus its quarter-circle swing arc.
function DoorSwing({ x, z, rotationY = 0 }: { x: number; z: number; rotationY?: number }) {
  const color = "#8a9187";
  return (
    <group position={[toWorldX(x), 0.14, toWorldZ(z)]} rotation={[0, rotationY, 0]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.36, 0.4, 24, 1, 0, Math.PI / 2]} />
        <meshBasicMaterial color={color} transparent opacity={0.6} side={THREE.DoubleSide} depthWrite={false} />
      </mesh>
      <mesh position={[0.2, 0, 0]}>
        <boxGeometry args={[0.4, 0.05, 0.035]} />
        <meshStandardMaterial color={color} roughness={0.6} />
      </mesh>
    </group>
  );
}

function ZonePad({ zone, showStripe = false, sublabel }: { zone: ZoneDef; showStripe?: boolean; sublabel?: string }) {
  const x1 = toWorldX(zone.left);
  const x2 = toWorldX(zone.left + zone.width);
  const z1 = toWorldZ(zone.top);
  const z2 = toWorldZ(zone.top + zone.height);
  const width = x2 - x1;
  const depth = z2 - z1;
  const centerX = (x1 + x2) / 2;
  const centerZ = (z1 + z2) / 2;

  return (
    <group>
      <mesh receiveShadow position={[centerX, 0.06, centerZ]}>
        <boxGeometry args={[width, 0.12, depth]} />
        <meshStandardMaterial color={zone.floor} roughness={0.95} />
        <Edges scale={1} threshold={15}>
          <lineBasicMaterial color={zone.edge} linewidth={1.5} />
        </Edges>
      </mesh>
      {showStripe && (
        <mesh position={[centerX, 0.13, centerZ]}>
          <boxGeometry args={[width * 0.96, 0.01, depth * 0.12]} />
          <meshStandardMaterial color="#9dbd8f" roughness={0.8} />
        </mesh>
      )}
      <Html position={[x1 + 0.35, 0.15, z1 + 0.35]} style={{ pointerEvents: "none" }} zIndexRange={[10, 0]}>
        <div className="-translate-y-1/2">
          <div className="whitespace-nowrap text-[11px] font-bold uppercase tracking-wider" style={{ color: zone.labelColor }}>
            {zone.label}
          </div>
          {sublabel && (
            <div className="whitespace-nowrap text-[8px] font-semibold uppercase tracking-wider opacity-60" style={{ color: zone.labelColor }}>
              {sublabel}
            </div>
          )}
        </div>
      </Html>
    </group>
  );
}

function ResidentMarker({
  resident,
  selected,
  onSelect,
}: {
  resident: Resident;
  selected: boolean;
  onSelect: (id: string, kind: "resident" | "staff") => void;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const worldX = toWorldX(resident.x);
  const worldZ = toWorldZ(resident.y);
  const phase = useMemo(() => worldX * 3.1, [worldX]);

  useFrame((state) => {
    if (!groupRef.current) return;
    groupRef.current.position.y = 0.5 + Math.sin(state.clock.elapsedTime * 1.3 + phase) * 0.03;
  });

  const color = resident.needsHelp ? "#d9645a" : resident.deteriorationRisk > 65 ? "#c2622b" : "#6b7b70";

  return (
    <group position={[worldX, 0, worldZ]}>
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
            title={`${resident.name} · Resident`}
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
              "flex cursor-pointer items-center justify-center rounded-full border-2 border-white shadow-md transition-transform text-[10px] font-bold text-white",
              resident.needsHelp ? "gap-1 pl-1.5 pr-2.5 py-1" : "h-6 w-6",
              hovered && "scale-110",
              resident.needsHelp ? "bg-rose-500" : resident.deteriorationRisk > 65 ? "bg-clay-600" : "bg-ink-500"
            )}
          >
            {resident.needsHelp ? (
              <>
                <HandHelping size={11} />
                <span className="whitespace-nowrap">Help</span>
              </>
            ) : (
              resident.photoInitials.slice(0, 2)
            )}
          </div>
        </Html>
      </group>
    </group>
  );
}

// Deterministic pseudo-random float in [0,1) from a string seed, so each staff
// member's patrol pattern is stable across re-renders.
function seededFloat(seed: string): number {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return (h % 10000) / 10000;
}

function clamp(v: number, lo: number, hi: number) {
  return Math.min(hi, Math.max(lo, v));
}

// A patrol loop that keeps a nurse mostly in her own ward but sends her out
// through the doorway into the corridor and back — visiting a second spot in
// the ward each time, mimicking rounds between residents.
function buildStaffPatrol(staff: StaffMember): [number, number][] {
  const ward = wardZones.find((w) => w.key === staff.wing);
  const doorway = wardDoorways[staff.wing];
  if (!ward || !doorway) return [[staff.x, staff.y]];

  const seedB = seededFloat(staff.id + "b");
  const pointA: [number, number] = [staff.x, staff.y];
  const pointB: [number, number] = [
    clamp(staff.x + (seedB - 0.5) * ward.width * 0.7, ward.left + 1.5, ward.left + ward.width - 1.5),
    clamp(staff.y + (seedB - 0.5) * ward.height * 0.7, ward.top + 1.5, ward.top + ward.height - 1.5),
  ];

  const corridorMidZ = corridorZone.top + corridorZone.height / 2;
  const corridorOffset = (seededFloat(staff.id + "c") - 0.5) * 6;
  const corridorPoint: [number, number] = [clamp(doorway.x + corridorOffset, corridorZone.left + 1, corridorZone.left + corridorZone.width - 1), corridorMidZ];
  const doorwayPoint: [number, number] = [doorway.x, doorway.z];

  return [pointA, doorwayPoint, corridorPoint, doorwayPoint, pointB];
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

  const waypoints = useMemo(
    () => buildStaffPatrol(staffMember).map(([x, y]): [number, number] => [toWorldX(x), toWorldZ(y)]),
    [staffMember]
  );
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
      motion.current.pause = 1.2 + seededFloat(staffMember.id + motion.current.target) * 2.2;
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
          title={`${staffMember.name} · ${staffMember.role}`}
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
            "flex h-6 w-6 cursor-pointer items-center justify-center rounded-md border-2 border-white shadow-sm transition-transform text-[9px] font-bold text-white",
            hovered && "scale-125"
          )}
          style={{ backgroundColor: color }}
        >
          {initialsOf(staffMember.name)}
        </div>
      </Html>
    </group>
  );
}

function KitchenStaffFillerMarker({ filler }: { filler: (typeof kitchenStaffFillers)[number] }) {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const waypoints = useMemo(() => filler.points.map(([x, y]): [number, number] => [toWorldX(x), toWorldZ(y)]), [filler]);
  const motion = useRef({ target: 1, pause: seededFloat(filler.id + "p") * 3 });

  useFrame((state, delta) => {
    const group = groupRef.current;
    if (!group) return;
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
      motion.current.pause = 1.5 + seededFloat(filler.id + motion.current.target) * 2.5;
      group.position.y = 0;
      return;
    }
    const nx = dx / dist;
    const nz = dz / dist;
    const step = Math.min(dist, WALK_SPEED * 0.85 * delta);
    group.position.x += nx * step;
    group.position.z += nz * step;
    group.position.y = Math.abs(Math.sin(state.clock.elapsedTime * 9)) * 0.035;
  });

  return (
    <group ref={groupRef} position={[waypoints[0][0], 0, waypoints[0][1]]}>
      <mesh
        position={[0, 0.24, 0]}
        scale={hovered ? 1.2 : 1}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = "default";
        }}
        onPointerOut={() => setHovered(false)}
      >
        <sphereGeometry args={[0.15, 18, 18]} />
        <meshStandardMaterial color={staffStatusHex.available} roughness={0.4} />
      </mesh>
      <Html position={[0, 0.24, 0]} center zIndexRange={[9, 0]}>
        <div
          title={`${filler.name} · Kitchen`}
          className={clsx(
            "flex h-6 w-6 items-center justify-center rounded-md border-2 border-white shadow-sm transition-transform text-[9px] font-bold text-white",
            hovered && "scale-125"
          )}
          style={{ backgroundColor: staffStatusHex.available }}
        >
          {initialsOf(filler.name)}
        </div>
      </Html>
    </group>
  );
}

function CanteenResidentFillerMarker({ filler }: { filler: (typeof canteenResidentFillers)[number] }) {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const worldX = toWorldX(filler.x);
  const worldZ = toWorldZ(filler.y);
  const phase = useMemo(() => worldX * 3.1, [worldX]);

  useFrame((state) => {
    if (!groupRef.current) return;
    groupRef.current.position.y = 0.5 + Math.sin(state.clock.elapsedTime * 1.3 + phase) * 0.03;
  });

  return (
    <group position={[worldX, 0, worldZ]}>
      <group ref={groupRef} position={[0, 0.5, 0]} scale={hovered ? 1.15 : 1}>
        <mesh
          castShadow
          position={[0, -0.27, 0]}
          onPointerOver={(e) => {
            e.stopPropagation();
            setHovered(true);
            document.body.style.cursor = "default";
          }}
          onPointerOut={() => setHovered(false)}
        >
          <cylinderGeometry args={[0.045, 0.045, 0.46, 8]} />
          <meshStandardMaterial color="#6b7b70" roughness={0.6} />
        </mesh>
        <mesh castShadow>
          <sphereGeometry args={[0.2, 20, 20]} />
          <meshStandardMaterial color="#6b7b70" roughness={0.35} metalness={0.05} />
        </mesh>
        <Html position={[0, 0.42, 0]} center zIndexRange={[10, 0]}>
          <div
            title={`${filler.name} · Canteen`}
            className={clsx(
              "flex h-6 w-6 items-center justify-center rounded-full border-2 border-white shadow-md transition-transform text-[10px] font-bold text-white bg-ink-500",
              hovered && "scale-110"
            )}
          >
            {initialsOf(filler.name)}
          </div>
        </Html>
      </group>
    </group>
  );
}

function SceneContents({
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
        <planeGeometry args={[SCENE_WIDTH + 10, SCENE_DEPTH + 10]} />
        <meshStandardMaterial color="#f3ede0" roughness={1} />
      </mesh>
      <Grid
        position={[0, 0, 0]}
        args={[SCENE_WIDTH + 10, SCENE_DEPTH + 10]}
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

      {wardZones.map((z) => (
        <ZonePad key={z.key} zone={z} sublabel="Ward" />
      ))}
      <ZonePad zone={corridorZone} showStripe />
      {serviceZones.map((z) => (
        <ZonePad key={z.key} zone={z} />
      ))}

      {Object.entries(wardDoorways).map(([wing, d]) => (
        <DoorSwing key={wing} x={d.x} z={d.z} rotationY={-Math.PI / 2} />
      ))}
      {serviceDoorways.map((d, i) => (
        <DoorSwing key={i} x={d.x} z={d.z} rotationY={d.rotationY} />
      ))}

      {residents.map((r) => (
        <ResidentMarker key={r.id} resident={r} selected={selectedId === r.id} onSelect={onSelect} />
      ))}
      {staffList.map((s) => (
        <StaffMarker key={s.id} staffMember={s} selected={selectedId === s.id} onSelect={onSelect} />
      ))}
      {kitchenStaffFillers.map((f) => (
        <KitchenStaffFillerMarker key={f.id} filler={f} />
      ))}
      {canteenResidentFillers.map((f) => (
        <CanteenResidentFillerMarker key={f.id} filler={f} />
      ))}

      <ContactShadows position={[0, 0.001, 0]} opacity={0.3} scale={30} blur={2.6} far={6} />
    </>
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

  return (
    <div className="relative w-full aspect-[16/10] overflow-hidden rounded-2xl bg-gradient-to-b from-ink-100 to-ink-50">
      <Canvas shadows camera={{ position: [0, 16, 16], fov: 40 }} dpr={[1, 2]}>
        <SceneContents residents={residents} staffList={staffList} selectedId={selectedId} onSelect={onSelect} />
        <OrbitControls
          ref={controlsRef}
          makeDefault
          enableDamping
          dampingFactor={0.08}
          minDistance={9}
          maxDistance={28}
          maxPolarAngle={1.15}
          minPolarAngle={0.35}
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.35}
          target={[0, 0, 0]}
        />
      </Canvas>

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
