import { useRef, useState, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Html, Edges, Grid, ContactShadows } from "@react-three/drei";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import * as THREE from "three";
import { HandHelping, User2, RotateCcw } from "lucide-react";
import clsx from "clsx";
import type { Resident, StaffMember, Wing } from "../lib/mockData";

const SCENE_WIDTH = 22;
const SCENE_DEPTH = 14;

function toWorldX(pct: number) {
  return (pct / 100 - 0.5) * SCENE_WIDTH;
}
function toWorldZ(pct: number) {
  return (pct / 100 - 0.5) * SCENE_DEPTH;
}

const wingZones: { wing: Wing; left: number; top: number; width: number; height: number; floor: string; edge: string; label: string }[] = [
  { wing: "Magnolia", left: 4, top: 22, width: 26, height: 46, floor: "#dfeada", edge: "#9dbd8f", label: "#2c4424" },
  { wing: "Cedar", left: 32, top: 40, width: 20, height: 44, floor: "#fdf3d8", edge: "#f2cf6f", label: "#9c6a12" },
  { wing: "Birchwood", left: 54, top: 10, width: 20, height: 58, floor: "#e7f1f7", edge: "#a9cbe0", label: "#3d7297" },
  { wing: "Willow", left: 76, top: 18, width: 20, height: 58, floor: "#fdece3", edge: "#f3b892", label: "#9c4d22" },
];

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

function WingPad({ zone }: { zone: (typeof wingZones)[number] }) {
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
      <Html position={[x1 + 0.35, 0.15, z1 + 0.35]} style={{ pointerEvents: "none" }} zIndexRange={[10, 0]}>
        <div
          className="whitespace-nowrap text-[11px] font-bold uppercase tracking-wider -translate-y-1/2"
          style={{ color: zone.label }}
        >
          {zone.wing}
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

function StaffMarker({
  staffMember,
  selected,
  onSelect,
}: {
  staffMember: StaffMember;
  selected: boolean;
  onSelect: (id: string, kind: "resident" | "staff") => void;
}) {
  const [hovered, setHovered] = useState(false);
  const worldX = toWorldX(staffMember.x);
  const worldZ = toWorldZ(staffMember.y);
  const color = staffStatusHex[staffMember.status];
  const isOverloaded = staffMember.status === "overloaded";

  return (
    <group position={[worldX, 0, worldZ]}>
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

      {wingZones.map((z) => (
        <WingPad key={z.wing} zone={z} />
      ))}

      {residents.map((r) => (
        <ResidentMarker key={r.id} resident={r} selected={selectedId === r.id} onSelect={onSelect} />
      ))}
      {staffList.map((s) => (
        <StaffMarker key={s.id} staffMember={s} selected={selectedId === s.id} onSelect={onSelect} />
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
      <Canvas shadows camera={{ position: [0, 15.5, 15.5], fov: 40 }} dpr={[1, 2]}>
        <SceneContents residents={residents} staffList={staffList} selectedId={selectedId} onSelect={onSelect} />
        <OrbitControls
          ref={controlsRef}
          makeDefault
          enableDamping
          dampingFactor={0.08}
          minDistance={9}
          maxDistance={26}
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
