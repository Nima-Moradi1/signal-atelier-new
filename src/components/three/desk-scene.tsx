"use client";

import {
  AdaptiveDpr,
  Html,
  PerspectiveCamera,
  PresentationControls,
  RoundedBox,
  useCursor,
} from "@react-three/drei";
import {
  Canvas,
  useFrame,
  useThree,
  type ThreeEvent,
} from "@react-three/fiber";
import { Pointer } from "lucide-react";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import type { Theme } from "@/components/theme/theme-provider";

const EDITOR_CODE = `type SignalProps = {
  accountId: string;
};

export function SignalDashboard({ accountId }: SignalProps) {
  const { data, isPending } = useQuery({
    queryKey: ["signal", accountId],
    queryFn: () => getSignal(accountId),
    staleTime: 30_000,
  });

  const metrics = useMemo(
    () => normalizeSignal(data),
    [data],
  );

  if (isPending) return <DashboardSkeleton />;

  return <MetricGrid metrics={metrics} />;
}`;

const KEY_POSITIONS = Array.from({ length: 60 }, (_, index) => {
  const row = Math.floor(index / 12);
  const column = index % 12;
  return [
    (column - 5.5) * 0.205 + (row % 2) * 0.04,
    0.055,
    (row - 2) * 0.19,
  ] as const;
});

type DeskSceneProps = {
  active: boolean;
  reducedMotion: boolean;
  theme: Theme;
  onOpenResume: () => void;
  onToggleTheme: () => void;
};

type Palette = {
  ink: string;
  surface: string;
  surfaceLift: string;
  paper: string;
  signal: string;
  signalSoft: string;
  violet: string;
  coral: string;
};

function getPalette(theme: Theme): Palette {
  if (theme === "light") {
    return {
      ink: "#d9d5c8",
      surface: "#353a31",
      surfaceLift: "#f6f1e5",
      paper: "#fffdf2",
      signal: "#4d7a12",
      signalSoft: "#7da83d",
      violet: "#6948c8",
      coral: "#bd4f3e",
    };
  }

  return {
    ink: "#090b0a",
    surface: "#171c17",
    surfaceLift: "#293128",
    paper: "#f1f4ec",
    signal: "#b8ff45",
    signalSoft: "#ddff9f",
    violet: "#a98cff",
    coral: "#ff7e67",
  };
}

function paintEditor(
  context: CanvasRenderingContext2D,
  visibleCharacters: number,
  theme: Theme,
) {
  const width = context.canvas.width;
  const height = context.canvas.height;
  const source = EDITOR_CODE.slice(0, visibleCharacters);
  const lines = source.split("\n");
  const isLight = theme === "light";

  context.clearRect(0, 0, width, height);
  context.fillStyle = isLight ? "#171b17" : "#0d110e";
  context.fillRect(0, 0, width, height);

  context.fillStyle = isLight ? "#30372f" : "#171d18";
  context.fillRect(0, 0, width, 58);
  context.fillStyle = "#ff7e67";
  context.beginPath();
  context.arc(30, 29, 8, 0, Math.PI * 2);
  context.fill();
  context.fillStyle = "#e9bf55";
  context.beginPath();
  context.arc(56, 29, 8, 0, Math.PI * 2);
  context.fill();
  context.fillStyle = "#b8ff45";
  context.beginPath();
  context.arc(82, 29, 8, 0, Math.PI * 2);
  context.fill();

  context.fillStyle = isLight ? "#4d7a12" : "#b8ff45";
  context.font = "600 18px ui-monospace, SFMono-Regular, Menlo, monospace";
  context.fillText("app/dashboard.tsx", 124, 36);

  context.fillStyle = isLight ? "#232a23" : "#111612";
  context.fillRect(0, 58, 64, height - 82);
  context.fillStyle = isLight ? "#697168" : "#899287";
  context.font = "20px ui-monospace, SFMono-Regular, Menlo, monospace";
  ["◇", "⌘", "⑂", "⚙"].forEach((icon, index) => {
    context.fillText(icon, 20, 112 + index * 58);
  });

  context.font = "20px ui-monospace, SFMono-Regular, Menlo, monospace";
  const lineHeight = 28;
  const top = 94;
  lines.slice(0, 18).forEach((line, index) => {
    const y = top + index * lineHeight;
    context.fillStyle = isLight ? "#697168" : "#667066";
    context.fillText(String(index + 1).padStart(2, "0"), 78, y);

    const trimmed = line.trim();
    context.fillStyle =
      trimmed.startsWith("type") ||
      trimmed.startsWith("export") ||
      trimmed.startsWith("return") ||
      trimmed.startsWith("if")
        ? "#ff9b8b"
        : trimmed.startsWith("const")
          ? "#a98cff"
          : trimmed.includes("queryKey") || trimmed.includes("staleTime")
            ? "#ddff9f"
            : "#dce4d9";
    context.fillText(line, 122, y);
  });

  const lastLine = lines.at(-1) ?? "";
  const cursorLine = Math.min(lines.length - 1, 17);
  const cursorX = 122 + context.measureText(lastLine).width + 2;
  const cursorY = top + cursorLine * lineHeight - 19;
  context.fillStyle = "#b8ff45";
  context.fillRect(cursorX, cursorY, 3, 23);

  context.fillStyle = isLight ? "#4d7a12" : "#315b08";
  context.fillRect(0, height - 24, width, 24);
  context.fillStyle = "#eef6e8";
  context.font = "14px ui-monospace, SFMono-Regular, Menlo, monospace";
  context.fillText("main*   TypeScript React   UTF-8", 18, height - 7);
}

function createEditorTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 640;
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.generateMipmaps = false;
  return texture;
}

function ResponsiveCamera() {
  const camera = useRef<THREE.PerspectiveCamera>(null);
  const size = useThree((state) => state.size);
  const compact = size.width < 640;

  useLayoutEffect(() => {
    const node = camera.current;
    if (!node) return;
    const position: [number, number, number] = compact
      ? [9.8, 7.2, 17.2]
      : [6.4, 5.4, 11.8];
    node.position.set(position[0], position[1], position[2]);
    node.lookAt(0, 0.65, 0);
    node.updateProjectionMatrix();
  }, [compact]);

  return (
    <PerspectiveCamera
      ref={camera}
      makeDefault
      fov={compact ? 48 : 42}
      near={0.1}
      far={60}
    />
  );
}

function CodeMonitor({
  active,
  reducedMotion,
  theme,
  palette,
}: {
  active: boolean;
  reducedMotion: boolean;
  theme: Theme;
  palette: Palette;
}) {
  const lastCharacter = useRef(-1);
  const [editor] = useState(createEditorTexture);
  const editorRef = useRef(editor);

  useEffect(() => {
    const texture = editorRef.current;
    return () => texture?.dispose();
  }, []);

  useEffect(() => {
    const texture = editorRef.current;
    const context = texture?.image.getContext("2d");
    if (!texture || !context) return;
    const count = reducedMotion
      ? EDITOR_CODE.length
      : Math.max(lastCharacter.current, 0);
    paintEditor(context, count, theme);
    texture.needsUpdate = true;
  }, [reducedMotion, theme]);

  useFrame(({ clock }) => {
    if (!active || reducedMotion) return;
    const cycle = clock.elapsedTime % 20;
    const progress = Math.min(cycle / 16.5, 1);
    const rawCharacter = Math.floor(progress * EDITOR_CODE.length);
    const character =
      progress === 1 ? EDITOR_CODE.length : Math.floor(rawCharacter / 2) * 2;
    if (character === lastCharacter.current) return;
    lastCharacter.current = character;
    const texture = editorRef.current;
    const context = texture?.image.getContext("2d");
    if (!texture || !context) return;
    paintEditor(context, character, theme);
    texture.needsUpdate = true;
  });

  return (
    <group position={[0, 0.2, -0.42]}>
      <RoundedBox
        args={[3.55, 2.35, 0.24]}
        radius={0.14}
        smoothness={3}
        position={[0, 1.5, 0]}
      >
        <meshStandardMaterial
          color={palette.surface}
          metalness={0.5}
          roughness={0.28}
        />
      </RoundedBox>
      <mesh position={[0, 1.5, 0.13]}>
        <planeGeometry args={[3.18, 1.92]} />
        <meshBasicMaterial map={editor} toneMapped={false} />
      </mesh>
      <mesh position={[0, 0.47, 0]}>
        <boxGeometry args={[0.24, 0.72, 0.2]} />
        <meshStandardMaterial color={palette.surfaceLift} metalness={0.55} />
      </mesh>
      <mesh position={[0, 0.12, 0.08]}>
        <cylinderGeometry args={[0.75, 0.92, 0.1, 32]} />
        <meshStandardMaterial
          color={palette.surface}
          metalness={0.48}
          roughness={0.32}
        />
      </mesh>
      <pointLight
        color={palette.violet}
        intensity={theme === "dark" ? 4.2 : 2.2}
        distance={4.5}
        decay={2}
        position={[0, 1.5, 0.75]}
      />
    </group>
  );
}

function Keyboard({ palette }: { palette: Palette }) {
  const keys = useRef<THREE.InstancedMesh>(null);

  useLayoutEffect(() => {
    const mesh = keys.current;
    if (!mesh) return;
    const dummy = new THREE.Object3D();
    KEY_POSITIONS.forEach((position, index) => {
      dummy.position.set(...position);
      dummy.updateMatrix();
      mesh.setMatrixAt(index, dummy.matrix);
    });
    mesh.instanceMatrix.needsUpdate = true;
  }, []);

  return (
    <group position={[0, 0.31, 0.86]} rotation={[-0.035, 0, 0]}>
      <RoundedBox args={[2.75, 0.16, 1.12]} radius={0.1} smoothness={2}>
        <meshStandardMaterial color={palette.surface} roughness={0.4} />
      </RoundedBox>
      <instancedMesh
        ref={keys}
        args={[undefined, undefined, KEY_POSITIONS.length]}
      >
        <boxGeometry args={[0.16, 0.07, 0.14]} />
        <meshStandardMaterial
          color={palette.surfaceLift}
          roughness={0.45}
          metalness={0.15}
        />
      </instancedMesh>
      <mesh position={[0, 0.1, 0.32]}>
        <boxGeometry args={[1.05, 0.045, 0.14]} />
        <meshStandardMaterial color={palette.signal} />
      </mesh>
    </group>
  );
}

function CylinderBetween({
  start,
  end,
  radius,
  color,
}: {
  start: [number, number, number];
  end: [number, number, number];
  radius: number;
  color: string;
}) {
  const startPoint = new THREE.Vector3(...start);
  const endPoint = new THREE.Vector3(...end);
  const midpoint = startPoint.clone().add(endPoint).multiplyScalar(0.5);
  const direction = endPoint.clone().sub(startPoint);
  const length = direction.length();
  const quaternion = new THREE.Quaternion().setFromUnitVectors(
    new THREE.Vector3(0, 1, 0),
    direction.normalize(),
  );

  return (
    <mesh position={midpoint} quaternion={quaternion}>
      <cylinderGeometry args={[radius, radius * 1.04, length, 12]} />
      <meshStandardMaterial color={color} roughness={0.72} />
    </mesh>
  );
}

function DeveloperPersona({
  palette,
  reducedMotion,
}: {
  palette: Palette;
  reducedMotion: boolean;
}) {
  const leftHand = useRef<THREE.Group>(null);
  const rightHand = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (reducedMotion) return;
    const left = leftHand.current;
    const right = rightHand.current;
    if (!left || !right) return;
    left.position.y = 0.48 + Math.sin(clock.elapsedTime * 7.8) * 0.018;
    right.position.y =
      0.48 + Math.sin(clock.elapsedTime * 7.8 + Math.PI) * 0.018;
    left.rotation.x = Math.sin(clock.elapsedTime * 7.8) * 0.035;
    right.rotation.x =
      Math.sin(clock.elapsedTime * 7.8 + Math.PI) * 0.035;
  });

  const skin = "#c78664";
  const hair = "#171713";
  const shirt = themeAwareShirt(palette);

  return (
    <group
      position={[0.78, 0, 0]}
      rotation={[0, Math.PI, 0]}
      scale={[0.9, 1, 0.9]}
    >
      <group position={[0, 0, -1.82]}>
        <RoundedBox
          args={[1.72, 2.1, 0.34]}
          radius={0.34}
          smoothness={3}
          position={[0, 0.2, 0]}
        >
          <meshStandardMaterial color={palette.surface} roughness={0.48} />
        </RoundedBox>
        <mesh position={[0, 0.42, 0.22]}>
          <boxGeometry args={[1.35, 0.08, 0.06]} />
          <meshStandardMaterial color={palette.signal} />
        </mesh>
        <RoundedBox
          args={[1.8, 0.3, 1.5]}
          radius={0.2}
          smoothness={2}
          position={[0, -1.12, 0.55]}
        >
          <meshStandardMaterial color={palette.surfaceLift} roughness={0.58} />
        </RoundedBox>
      </group>

      <RoundedBox
        args={[1.42, 1.75, 0.76]}
        radius={0.35}
        smoothness={3}
        position={[0, 1.1, -1.42]}
      >
        <meshStandardMaterial color={shirt} roughness={0.78} />
      </RoundedBox>
      <mesh position={[0, 2.08, -1.32]}>
        <cylinderGeometry args={[0.22, 0.25, 0.38, 16]} />
        <meshStandardMaterial color={skin} roughness={0.72} />
      </mesh>

      <mesh position={[0, 2.72, -1.24]} scale={[0.55, 0.66, 0.52]}>
        <sphereGeometry args={[1, 28, 20]} />
        <meshStandardMaterial color={skin} roughness={0.64} />
      </mesh>
      <mesh position={[0, 3.08, -1.34]} scale={[0.57, 0.3, 0.53]}>
        <sphereGeometry args={[1, 24, 16]} />
        <meshStandardMaterial color={hair} roughness={0.92} />
      </mesh>
      <mesh position={[0, 2.52, -0.79]} scale={[0.42, 0.28, 0.09]}>
        <sphereGeometry args={[1, 20, 12]} />
        <meshStandardMaterial color={hair} roughness={0.9} />
      </mesh>
      {[-0.18, 0.18].map((x) => (
        <mesh key={x} position={[x, 2.79, -0.74]} scale={[0.045, 0.032, 0.025]}>
          <sphereGeometry args={[1, 12, 10]} />
          <meshBasicMaterial color="#171713" />
        </mesh>
      ))}
      <mesh position={[0, 2.67, -0.7]} scale={[0.06, 0.1, 0.08]}>
        <sphereGeometry args={[1, 12, 10]} />
        <meshStandardMaterial color="#b8785d" roughness={0.74} />
      </mesh>

      <CylinderBetween
        start={[-0.58, 1.57, -1.34]}
        end={[-0.48, 0.88, -1.18]}
        radius={0.19}
        color={shirt}
      />
      <CylinderBetween
        start={[-0.48, 0.88, -1.18]}
        end={[-0.36, 0.48, -1]}
        radius={0.15}
        color={skin}
      />
      <CylinderBetween
        start={[0.58, 1.57, -1.34]}
        end={[0.48, 0.88, -1.18]}
        radius={0.19}
        color={shirt}
      />
      <CylinderBetween
        start={[0.48, 0.88, -1.18]}
        end={[0.36, 0.48, -1]}
        radius={0.15}
        color={skin}
      />
      <group ref={leftHand} position={[-0.36, 0.48, -1]}>
        <mesh scale={[0.2, 0.075, 0.24]}>
          <sphereGeometry args={[1, 16, 12]} />
          <meshStandardMaterial color={skin} roughness={0.7} />
        </mesh>
      </group>
      <group ref={rightHand} position={[0.36, 0.48, -1]}>
        <mesh scale={[0.2, 0.075, 0.24]}>
          <sphereGeometry args={[1, 16, 12]} />
          <meshStandardMaterial color={skin} roughness={0.7} />
        </mesh>
      </group>

      <CylinderBetween
        start={[-0.38, 0.38, -1.45]}
        end={[-0.46, -1.5, -1.05]}
        radius={0.24}
        color={palette.surface}
      />
      <CylinderBetween
        start={[0.38, 0.38, -1.45]}
        end={[0.46, -1.5, -1.05]}
        radius={0.24}
        color={palette.surface}
      />
    </group>
  );
}

function themeAwareShirt(palette: Palette) {
  return palette.paper;
}

function ResumePaper({
  palette,
  onOpen,
}: {
  palette: Palette;
  onOpen: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  useCursor(hovered, "pointer", "auto");

  function open(event: ThreeEvent<MouseEvent>) {
    event.stopPropagation();
    if (event.delta < 5) onOpen();
  }

  return (
    <group position={[-2.35, 0.34, 0.75]} rotation={[0, -0.16, 0]}>
      <mesh
        onClick={open}
        onPointerOver={(event) => {
          event.stopPropagation();
          setHovered(true);
        }}
        onPointerOut={() => setHovered(false)}
      >
        <boxGeometry args={[1.42, 0.045, 1.78]} />
        <meshStandardMaterial
          color={palette.paper}
          emissive={palette.signal}
          emissiveIntensity={hovered ? 0.24 : 0.03}
          roughness={0.9}
        />
      </mesh>
      <mesh position={[-0.3, 0.03, -0.48]}>
        <boxGeometry args={[0.55, 0.015, 0.08]} />
        <meshBasicMaterial color={palette.signal} />
      </mesh>
      {[0, 1, 2, 3, 4].map((line) => (
        <mesh key={line} position={[0, 0.032, -0.18 + line * 0.22]}>
          <boxGeometry args={[0.92 - (line % 2) * 0.22, 0.012, 0.035]} />
          <meshBasicMaterial color={line === 0 ? palette.violet : "#858b80"} />
        </mesh>
      ))}
      <mesh position={[0.42, 0.032, 0.62]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.16, 24]} />
        <meshBasicMaterial color={palette.signal} />
      </mesh>
      <Html
        center
        position={[0.42, 0.16, 0.62]}
        zIndexRange={[4, 3]}
        style={{ pointerEvents: "none" }}
      >
        <span className="resume-touch-hint" aria-hidden="true">
          <Pointer aria-hidden="true" size={12} strokeWidth={1.8} />
        </span>
      </Html>
    </group>
  );
}

function DeskLamp({
  theme,
  palette,
  reducedMotion,
  onToggle,
}: {
  theme: Theme;
  palette: Palette;
  reducedMotion: boolean;
  onToggle: () => void;
}) {
  const pivot = useRef<THREE.Group>(null);
  const cord = useRef<THREE.Mesh>(null);
  const handle = useRef<THREE.Group>(null);
  const dragStart = useRef<number | null>(null);
  const pullDistance = useRef(0);
  const [hovered, setHovered] = useState(false);
  useCursor(hovered, "grab", "auto");
  const lit = theme === "dark";

  useFrame(({ clock }) => {
    const cordPivot = pivot.current;
    const cordMesh = cord.current;
    const pullHandle = handle.current;
    if (!cordPivot || !cordMesh || !pullHandle) return;

    const baseLength = 0.76;
    const length = baseLength + pullDistance.current;
    cordPivot.rotation.z =
      dragStart.current === null && !reducedMotion
        ? Math.sin(clock.elapsedTime * 1.75) * 0.12
        : 0;
    cordMesh.scale.y = length;
    cordMesh.position.y = -length / 2;
    pullHandle.position.y = -length;
  });

  function beginPull(clientY: number) {
    dragStart.current = clientY;
    pullDistance.current = 0;
  }

  function updatePull(clientY: number) {
    if (dragStart.current === null) return;
    pullDistance.current = THREE.MathUtils.clamp(
      (clientY - dragStart.current) / 160,
      0,
      0.46,
    );
  }

  function resetPull(toggle: boolean) {
    const shouldToggle = toggle && pullDistance.current >= 0.17;
    dragStart.current = null;
    pullDistance.current = 0;
    if (shouldToggle) onToggle();
  }

  function handlePointerDown(event: ThreeEvent<PointerEvent>) {
    if (event.nativeEvent.button !== 0) return;
    event.stopPropagation();
    beginPull(event.nativeEvent.clientY);
    (event.target as Element | null)?.setPointerCapture(event.pointerId);
  }

  function handlePointerMove(event: ThreeEvent<PointerEvent>) {
    if (dragStart.current === null) return;
    event.stopPropagation();
    updatePull(event.nativeEvent.clientY);
  }

  function finishPull(event: ThreeEvent<PointerEvent>, toggle = true) {
    if (dragStart.current === null) return;
    event.stopPropagation();
    const target = event.target as Element | null;
    if (target?.hasPointerCapture(event.pointerId)) {
      target.releasePointerCapture(event.pointerId);
    }
    resetPull(toggle);
  }

  return (
    <group position={[2.68, 0.32, -0.2]}>
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.54, 0.68, 0.14, 28]} />
        <meshStandardMaterial
          color={palette.surface}
          metalness={0.62}
          roughness={0.28}
        />
      </mesh>
      <CylinderBetween
        start={[0, 0.05, 0]}
        end={[0, 1.02, 0]}
        radius={0.08}
        color={palette.signal}
      />
      <CylinderBetween
        start={[0, 1.02, 0]}
        end={[0.38, 1.52, 0.03]}
        radius={0.075}
        color={palette.signal}
      />
      <mesh position={[0.45, 1.5, 0.05]} rotation={[0, 0, -0.14]}>
        <coneGeometry args={[0.49, 0.68, 28, 1, true]} />
        <meshStandardMaterial
          color={palette.signal}
          emissive={palette.signal}
          emissiveIntensity={lit ? 0.38 : 0.04}
          metalness={0.18}
          roughness={0.42}
          side={THREE.DoubleSide}
        />
      </mesh>
      <mesh position={[0.49, 1.26, 0.08]}>
        <sphereGeometry args={[0.18, 20, 14]} />
        <meshStandardMaterial
          color={lit ? "#fff4bd" : "#8b8d80"}
          emissive={lit ? "#ffd777" : "#000000"}
          emissiveIntensity={lit ? 3.2 : 0}
        />
      </mesh>
      <pointLight
        color="#ffd777"
        intensity={lit ? 13 : 0}
        distance={5.2}
        decay={2}
        position={[0.49, 1.19, 0.2]}
      />

      <group ref={pivot} position={[0.74, 1.33, 0.16]}>
        <mesh ref={cord}>
          <cylinderGeometry args={[0.018, 0.018, 1, 8]} />
          <meshStandardMaterial
            color={palette.signalSoft}
            emissive={palette.signal}
            emissiveIntensity={0.32}
          />
        </mesh>
        <group ref={handle}>
          <mesh
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={finishPull}
            onPointerCancel={(event) => finishPull(event, false)}
            onPointerOver={(event) => {
              event.stopPropagation();
              setHovered(true);
            }}
            onPointerOut={() => setHovered(false)}
          >
            <sphereGeometry args={[0.13, 18, 14]} />
            <meshStandardMaterial
              color={palette.surfaceLift}
              emissive={palette.signal}
              emissiveIntensity={hovered ? 0.35 : 0.08}
              metalness={0.34}
              roughness={0.38}
            />
          </mesh>
          <Html center zIndexRange={[4, 3]}>
            <span
              className="desk-lamp__pull-target"
              aria-hidden="true"
              onPointerDown={(event) => {
                if (event.button !== 0) return;
                event.stopPropagation();
                beginPull(event.clientY);
                event.currentTarget.setPointerCapture(event.pointerId);
              }}
              onPointerMove={(event) => {
                if (dragStart.current === null) return;
                event.stopPropagation();
                updatePull(event.clientY);
              }}
              onPointerUp={(event) => {
                if (dragStart.current === null) return;
                event.stopPropagation();
                if (event.currentTarget.hasPointerCapture(event.pointerId)) {
                  event.currentTarget.releasePointerCapture(event.pointerId);
                }
                resetPull(true);
              }}
              onPointerCancel={(event) => {
                event.stopPropagation();
                resetPull(false);
              }}
            />
          </Html>
        </group>
      </group>
    </group>
  );
}

function Workstation({
  active,
  reducedMotion,
  theme,
  onOpenResume,
  onToggleTheme,
}: DeskSceneProps) {
  const palette = useMemo(() => getPalette(theme), [theme]);

  return (
    <group position={[0, -0.82, 0]}>
      <mesh position={[0, -1.84, 0]}>
        <cylinderGeometry args={[4.85, 5.2, 0.2, 64]} />
        <meshStandardMaterial
          color={palette.ink}
          roughness={0.82}
          metalness={0.08}
        />
      </mesh>
      <mesh position={[0, -1.72, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[3.75, 4.7, 64]} />
        <meshBasicMaterial
          color={palette.signal}
          transparent
          opacity={0.28}
          side={THREE.DoubleSide}
        />
      </mesh>

      <RoundedBox
        args={[7.5, 0.28, 3.15]}
        radius={0.16}
        smoothness={3}
        position={[0, 0.08, 0]}
      >
        <meshStandardMaterial
          color={palette.surfaceLift}
          metalness={0.22}
          roughness={0.48}
        />
      </RoundedBox>
      {[-2.85, 2.85].flatMap((x) =>
        [-1.02, 1.02].map((z) => (
          <mesh key={`${x}-${z}`} position={[x, -0.84, z]}>
            <cylinderGeometry args={[0.12, 0.17, 1.72, 16]} />
            <meshStandardMaterial
              color={palette.surface}
              metalness={0.42}
              roughness={0.36}
            />
          </mesh>
        )),
      )}

      <DeveloperPersona palette={palette} reducedMotion={reducedMotion} />
      <CodeMonitor
        active={active}
        reducedMotion={reducedMotion}
        theme={theme}
        palette={palette}
      />
      <Keyboard palette={palette} />
      <ResumePaper palette={palette} onOpen={onOpenResume} />
      <DeskLamp
        theme={theme}
        palette={palette}
        reducedMotion={reducedMotion}
        onToggle={onToggleTheme}
      />

      <mesh position={[2.05, 0.35, 0.95]}>
        <cylinderGeometry args={[0.34, 0.29, 0.52, 24]} />
        <meshStandardMaterial color={palette.coral} roughness={0.68} />
      </mesh>
      <mesh position={[2.05, 0.63, 0.95]}>
        <torusGeometry args={[0.22, 0.055, 12, 24, Math.PI]} />
        <meshStandardMaterial color={palette.coral} roughness={0.68} />
      </mesh>
    </group>
  );
}

export function DeskScene(props: DeskSceneProps) {
  const palette = getPalette(props.theme);
  const isDark = props.theme === "dark";

  return (
    <Canvas
      aria-hidden="true"
      dpr={[1, 1.5]}
      frameloop={props.active ? "always" : "demand"}
      style={{ touchAction: "pan-y" }}
      gl={{
        alpha: true,
        antialias: true,
        depth: true,
        powerPreference: "high-performance",
        stencil: false,
      }}
      performance={{ min: 0.55 }}
      shadows={false}
    >
      <ResponsiveCamera />
      <ambientLight intensity={isDark ? 1.35 : 2.6} />
      <directionalLight
        color={isDark ? "#f0ffe1" : "#fff6df"}
        intensity={isDark ? 3.2 : 4.8}
        position={[4, 7, 6]}
      />
      <pointLight
        color={palette.violet}
        intensity={isDark ? 7 : 3.2}
        distance={12}
        decay={2}
        position={[-4, 1.5, 4]}
      />
      <PresentationControls
        enabled
        global
        cursor
        snap={false}
        speed={1.05}
        zoom={0.92}
        rotation={[0.03, -0.28, 0]}
        polar={[-0.16, 0.28]}
        azimuth={[-0.82, 0.82]}
        damping={0.16}
      >
        <Workstation {...props} />
      </PresentationControls>
      <AdaptiveDpr pixelated />
    </Canvas>
  );
}
