"use client";

import {
  AdaptiveDpr,
  Html,
  PerspectiveCamera,
  PresentationControls,
  RoundedBox,
  useCursor,
  useTexture,
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
import { cn } from "@/lib/cn";
import { deskSceneClassNames as styles } from "./desk-scene.class-names";
import artwork from "./desk-scene.module.css";

const EDITOR_CODE = `import {
  memo, useCallback,
  useMemo, useTransition,
} from "react";
const MetricCard = memo(function MetricCard({ metric }: CardProps) {
  return <Metric value={metric.value} trend={metric.trend} />;
});
export function PerformanceDashboard({ signals }: DashboardProps) {
  const [isPending, startTransition] = useTransition();
  const visibleSignals = useMemo(
    () => signals.filter(isActionable).slice(0, 6),
    [signals],
  );
  const selectSignal = useCallback((id: string) => {
    startTransition(() => setSelectedSignal(id));
  }, []);
  return <MetricGrid busy={isPending} signals={visibleSignals}
    onSelect={selectSignal} />;
}`;

const KEY_UNIT = 0.142;
const KEY_GAP = 0.027;
const KEY_ROWS = [
  Array.from({ length: 14 }, () => 1),
  [1.35, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1.65],
  [1.65, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2.35],
  [2.05, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2.95],
  [1.25, 1.25, 1.25, 6.1, 1.25, 1.25, 1.25],
] as const;
const KEY_LABEL_ROWS = [
  ["esc", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "−", "=", "⌫"],
  ["tab", "Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P", "[", "]"],
  ["caps", "A", "S", "D", "F", "G", "H", "J", "K", "L", ";", "enter"],
  ["shift", "Z", "X", "C", "V", "B", "N", "M", ",", ".", "shift"],
  ["ctrl", "opt", "cmd", "space", "cmd", "opt", "← →"],
] as const;

const KEY_LAYOUT = KEY_ROWS.flatMap((row, rowIndex) => {
  const totalWidth =
    row.reduce<number>((total, units) => total + units * KEY_UNIT, 0) +
    (row.length - 1) * KEY_GAP;
  let cursor = -totalWidth / 2;

  return row.map((units, keyIndex) => {
    const width = units * KEY_UNIT;
    const key = {
      position: [cursor + width / 2, 0.145, (rowIndex - 2) * 0.19] as const,
      scale: [width, 0.095, 0.145] as const,
      accent: rowIndex === 4 && keyIndex === 3,
      label: KEY_LABEL_ROWS[rowIndex][keyIndex],
      typingPhase:
        rowIndex >= 1 && rowIndex <= 3 && keyIndex >= 2 && keyIndex <= 9
          ? rowIndex * 0.73 + keyIndex * 1.17
          : null,
    };
    cursor += width + KEY_GAP;
    return key;
  });
});

const PAINTING_URL = "/assets/hero/senior-engineer-systems-painting.webp";

type DeskSceneProps = {
  active: boolean;
  pullLabel: string;
  reducedMotion: boolean;
  theme: Theme;
  onOpenResume: () => void;
  onReady: () => void;
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

function paintCodeLine(
  context: CanvasRenderingContext2D,
  line: string,
  x: number,
  y: number,
  isLight: boolean,
) {
  const tokens = line.split(
    /(\b(?:import|from|const|function|return|export|true|false)\b|\b(?:memo|useMemo|useCallback|useTransition|startTransition)\b|"[^"]*"|<\/?[A-Z][A-Za-z]*|\b(?:string|Props)\b)/g,
  );
  let cursor = x;

  tokens.forEach((token) => {
    if (!token) return;
    context.fillStyle =
      /^(import|from|const|function|return|export|true|false)$/.test(token)
        ? "#ff9b8b"
        : /^(memo|useMemo|useCallback|useTransition|startTransition)$/.test(
              token,
            )
          ? "#d7ff83"
          : token.startsWith('"')
            ? "#f4c86a"
            : token.startsWith("<")
              ? "#a98cff"
              : /^(string|Props)$/.test(token)
                ? "#7ed8ce"
                : isLight
                  ? "#e4e9e1"
                  : "#eef4eb";
    context.fillText(token, cursor, y);
    cursor += context.measureText(token).width;
  });
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
  context.fillRect(0, 0, width, 68);
  context.fillStyle = "#ff7e67";
  context.beginPath();
  context.arc(32, 34, 8, 0, Math.PI * 2);
  context.fill();
  context.fillStyle = "#e9bf55";
  context.beginPath();
  context.arc(58, 34, 8, 0, Math.PI * 2);
  context.fill();
  context.fillStyle = "#b8ff45";
  context.beginPath();
  context.arc(84, 34, 8, 0, Math.PI * 2);
  context.fill();

  context.fillStyle = isLight ? "#4d7a12" : "#b8ff45";
  context.font = "700 21px ui-monospace, SFMono-Regular, Menlo, monospace";
  context.fillText("REACT 19 · PERFORMANCE", 124, 41);
  context.fillStyle = isLight ? "#a8b0a5" : "#97a395";
  context.font = "500 17px ui-monospace, SFMono-Regular, Menlo, monospace";
  context.fillText("PerformanceDashboard.tsx", width - 330, 41);

  context.fillStyle = isLight ? "#232a23" : "#111612";
  context.fillRect(0, 68, 72, height - 100);
  context.fillStyle = isLight ? "#697168" : "#899287";
  context.font = "22px ui-monospace, SFMono-Regular, Menlo, monospace";
  ["◇", "⌘", "⑂", "⚙"].forEach((icon, index) => {
    context.fillText(icon, 23, 122 + index * 62);
  });

  context.font = "32px ui-monospace, SFMono-Regular, Menlo, monospace";
  const lineHeight = 33;
  const top = 100;
  lines.slice(0, 19).forEach((line, index) => {
    const y = top + index * lineHeight;
    context.fillStyle = isLight ? "#697168" : "#667066";
    context.fillText(String(index + 1).padStart(2, "0"), 84, y);
    paintCodeLine(context, line, 136, y, isLight);
  });

  const lastLine = lines.at(-1) ?? "";
  const cursorLine = Math.min(lines.length - 1, 18);
  const cursorX = 136 + context.measureText(lastLine).width + 2;
  const cursorY = top + cursorLine * lineHeight - 21;
  context.fillStyle = "#b8ff45";
  context.fillRect(cursorX, cursorY, 3, 25);

  context.fillStyle = isLight ? "#4d7a12" : "#315b08";
  context.fillRect(0, height - 32, width, 32);
  context.fillStyle = "#eef6e8";
  context.font = "600 17px ui-monospace, SFMono-Regular, Menlo, monospace";
  context.fillText(
    "memo ✓   useMemo ✓   useCallback ✓   transition ✓",
    20,
    height - 10,
  );
}

function createEditorTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 1280;
  canvas.height = 768;
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.generateMipmaps = false;
  return texture;
}

function createArtworkPlaqueTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 180;
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.generateMipmaps = false;
  return texture;
}

function createKeyboardLegendTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 420;
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.generateMipmaps = false;
  return texture;
}

function paintKeyboardLegends(texture: THREE.CanvasTexture, color: string) {
  const context = texture.image.getContext("2d");
  if (!context) return;

  context.clearRect(0, 0, 1024, 420);
  context.fillStyle = color;
  context.textAlign = "center";
  context.textBaseline = "middle";

  KEY_LAYOUT.forEach((key) => {
    const x = ((key.position[0] + 1.25) / 2.5) * 1024;
    const y = ((key.position[2] + 0.51) / 1.02) * 420;
    const label = key.label === "space" ? "—" : key.label;
    context.font = `${label.length > 2 ? 600 : 700} ${
      label.length > 3 ? 18 : label.length > 1 ? 23 : 30
    }px ui-sans-serif, system-ui, sans-serif`;
    context.fillText(label, x, y);
  });

  texture.needsUpdate = true;
}

function paintArtworkPlaque(texture: THREE.CanvasTexture, theme: Theme) {
  const context = texture.image.getContext("2d");
  if (!context) return;
  const isLight = theme === "light";

  context.clearRect(0, 0, 1024, 180);
  context.fillStyle = isLight ? "#f4f0e4" : "#101410";
  context.fillRect(0, 0, 1024, 180);
  context.fillStyle = isLight ? "#4d7a12" : "#b8ff45";
  context.fillRect(0, 0, 18, 180);
  context.fillStyle = isLight ? "#161b16" : "#f1f4ec";
  context.font = "700 48px ui-sans-serif, system-ui, sans-serif";
  context.fillText("SENIOR SOFTWARE ENGINEER", 58, 78);
  context.fillStyle = isLight ? "#526052" : "#aeb9ac";
  context.font = "600 24px ui-monospace, SFMono-Regular, Menlo, monospace";
  context.fillText("SYSTEMS · PERFORMANCE · PRODUCT ENGINEERING", 60, 128);
  texture.needsUpdate = true;
}

function EngineerGalleryWall({
  palette,
  theme,
}: {
  palette: Palette;
  theme: Theme;
}) {
  const sourcePainting = useTexture(PAINTING_URL);
  const maxAnisotropy = useThree((state) =>
    state.gl.capabilities.getMaxAnisotropy(),
  );
  const painting = useMemo(() => {
    const texture = sourcePainting.clone();
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = Math.min(maxAnisotropy, 8);
    texture.needsUpdate = true;
    return texture;
  }, [maxAnisotropy, sourcePainting]);
  const [plaque] = useState(createArtworkPlaqueTexture);

  useEffect(() => {
    paintArtworkPlaque(plaque, theme);
  }, [plaque, theme]);

  useEffect(() => () => painting.dispose(), [painting]);
  useEffect(() => () => plaque.dispose(), [plaque]);

  return (
    <group position={[-4.05, 0.34, -0.72]} rotation={[0, Math.PI / 2, 0]}>
      <RoundedBox args={[4.5, 4.36, 0.16]} radius={0.08} smoothness={3}>
        <meshStandardMaterial
          color={palette.paper}
          metalness={0.04}
          roughness={0.94}
        />
      </RoundedBox>

      {[-1.5, 0, 1.5].map((x) => (
        <mesh key={x} position={[x, 0, 0.086]}>
          <boxGeometry args={[0.018, 4.1, 0.01]} />
          <meshStandardMaterial
            color={palette.ink}
            transparent
            opacity={0.08}
            roughness={1}
          />
        </mesh>
      ))}

      <group position={[0, 0.48, 0.13]}>
        <CylinderBetween
          start={[-1.42, 1.12, 0]}
          end={[0, 1.62, 0]}
          radius={0.018}
          color={palette.surface}
        />
        <CylinderBetween
          start={[1.42, 1.12, 0]}
          end={[0, 1.62, 0]}
          radius={0.018}
          color={palette.surface}
        />
        <mesh position={[0, 1.65, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.065, 0.065, 0.055, 18]} />
          <meshStandardMaterial
            color={palette.signal}
            metalness={0.58}
            roughness={0.3}
          />
        </mesh>

        <RoundedBox
          args={[3.52, 2.36, 0.16]}
          radius={0.045}
          smoothness={3}
          position={[0, 0, 0.035]}
        >
          <meshStandardMaterial
            color={palette.surface}
            metalness={0.48}
            roughness={0.3}
          />
        </RoundedBox>
        <mesh position={[0, 0, 0.126]}>
          <planeGeometry args={[3.2, 2.04]} />
          <meshBasicMaterial map={painting} toneMapped={false} />
        </mesh>

        <RoundedBox
          args={[2.84, 0.46, 0.08]}
          radius={0.045}
          smoothness={3}
          position={[0, -1.45, 0.04]}
        >
          <meshStandardMaterial
            color={palette.surface}
            metalness={0.4}
            roughness={0.34}
          />
        </RoundedBox>
        <mesh position={[0, -1.45, 0.086]}>
          <planeGeometry args={[2.68, 0.32]} />
          <meshBasicMaterial map={plaque} toneMapped={false} />
        </mesh>
      </group>

      {[-2.06, 2.06].map((x) => (
        <mesh key={x} position={[x, -1.86, 0.04]}>
          <boxGeometry args={[0.14, 0.48, 0.34]} />
          <meshStandardMaterial
            color={palette.surface}
            metalness={0.3}
            roughness={0.48}
          />
        </mesh>
      ))}
    </group>
  );
}

function ResponsiveCamera() {
  const camera = useRef<THREE.PerspectiveCamera>(null);
  const size = useThree((state) => state.size);
  const compact = size.width < 640;

  useLayoutEffect(() => {
    const node = camera.current;
    if (!node) return;
    const position: [number, number, number] = compact
      ? [8.5, 6.35, 14.9]
      : [4.9, 4.35, 9.25];
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
    <group position={[0.08, 0.2, -0.42]} rotation={[0, 0.2, 0]}>
      <RoundedBox
        args={[3.55, 2.35, 0.24]}
        radius={0.14}
        smoothness={3}
        position={[0, 1.77, 0]}
      >
        <meshStandardMaterial
          color={palette.surface}
          metalness={0.5}
          roughness={0.28}
        />
      </RoundedBox>
      <mesh position={[0, 1.77, 0.13]}>
        <planeGeometry args={[3.18, 1.92]} />
        <meshBasicMaterial map={editor} toneMapped={false} />
      </mesh>
      <mesh position={[0, 0.58, 0]}>
        <boxGeometry args={[0.24, 0.94, 0.2]} />
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
        position={[0, 1.77, 0.75]}
      />
    </group>
  );
}

function Keyboard({
  palette,
  reducedMotion,
}: {
  palette: Palette;
  reducedMotion: boolean;
}) {
  const keys = useRef<Array<THREE.Mesh | null>>([]);
  const [legends] = useState(createKeyboardLegendTexture);
  const keyGeometry = useMemo(() => new THREE.BoxGeometry(1, 1, 1), []);
  const keyMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        roughness: 0.34,
        metalness: 0.12,
        emissiveIntensity: 0.22,
      }),
    [],
  );
  const accentKeyMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        roughness: 0.3,
        metalness: 0.14,
        emissiveIntensity: 0.28,
      }),
    [],
  );

  useEffect(() => {
    paintKeyboardLegends(legends, palette.surface);
  }, [legends, palette.surface]);

  useEffect(() => {
    keyMaterial.color.set(palette.paper);
    keyMaterial.emissive.set(palette.paper);
    accentKeyMaterial.color.set(palette.signal);
    accentKeyMaterial.emissive.set(palette.signal);
  }, [accentKeyMaterial, keyMaterial, palette.paper, palette.signal]);

  useEffect(
    () => () => {
      legends.dispose();
      keyGeometry.dispose();
      keyMaterial.dispose();
      accentKeyMaterial.dispose();
    },
    [accentKeyMaterial, keyGeometry, keyMaterial, legends],
  );

  useFrame(({ clock }) => {
    keys.current.forEach((keyMesh, index) => {
      if (!keyMesh) return;
      const key = KEY_LAYOUT[index];
      const press =
        !reducedMotion && key.typingPhase !== null
          ? Math.max(0, Math.sin(clock.elapsedTime * 6.4 + key.typingPhase)) **
              5 *
            0.034
          : 0;
      keyMesh.position.y = key.position[1] - press;
    });
  });

  return (
    <group position={[0.36, 0.3, 0.86]} rotation={[-0.045, 0.2, 0]}>
      <RoundedBox args={[2.75, 0.16, 1.18]} radius={0.1} smoothness={3}>
        <meshStandardMaterial
          color={palette.surface}
          roughness={0.34}
          metalness={0.38}
        />
      </RoundedBox>
      <RoundedBox
        args={[2.61, 0.025, 1.02]}
        radius={0.06}
        smoothness={2}
        position={[0, 0.087, 0]}
      >
        <meshStandardMaterial
          color={palette.ink}
          roughness={0.52}
          metalness={0.15}
        />
      </RoundedBox>
      {KEY_LAYOUT.map((key, index) => (
        <mesh
          key={`${key.position[0]}-${key.position[2]}`}
          ref={(node) => {
            keys.current[index] = node;
          }}
          geometry={keyGeometry}
          material={key.accent ? accentKeyMaterial : keyMaterial}
          position={key.position}
          scale={key.scale}
        />
      ))}
      <mesh position={[0, 0.198, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[2.5, 1.02]} />
        <meshBasicMaterial
          map={legends}
          transparent
          toneMapped={false}
          depthWrite={false}
          polygonOffset
          polygonOffsetFactor={-2}
        />
      </mesh>
      {[0, 1, 2].map((light) => (
        <mesh key={light} position={[1.05 + light * 0.12, 0.2, -0.49]}>
          <sphereGeometry args={[0.018, 10, 8]} />
          <meshBasicMaterial
            color={light === 0 ? palette.signal : palette.violet}
          />
        </mesh>
      ))}
      <mesh position={[1.38, 0, 0.24]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.035, 0.035, 0.02, 16]} />
        <meshStandardMaterial color={palette.ink} metalness={0.7} />
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

function TypingHand({
  side,
  skin,
  reducedMotion,
  phaseOffset,
}: {
  side: "left" | "right";
  skin: string;
  reducedMotion: boolean;
  phaseOffset: number;
}) {
  const innerDirection = side === "left" ? 1 : -1;
  const fingerGroups = useRef<Array<THREE.Group | null>>([]);
  const fingers = [
    { x: -0.145, lengths: [0.15, 0.13, 0.105], radius: 0.036 },
    { x: -0.05, lengths: [0.18, 0.15, 0.12], radius: 0.041 },
    { x: 0.05, lengths: [0.19, 0.155, 0.12], radius: 0.041 },
    { x: 0.145, lengths: [0.165, 0.135, 0.105], radius: 0.035 },
  ] as const;

  useFrame(({ clock }) => {
    fingerGroups.current.forEach((finger, index) => {
      if (!finger) return;
      if (reducedMotion) {
        finger.rotation.x = -0.035;
        return;
      }

      const press =
        Math.max(
          0,
          Math.sin(clock.elapsedTime * 6.4 + phaseOffset + index * 1.37),
        ) ** 4;
      finger.rotation.x = 0.075 - press * 0.17;
    });
  });

  return (
    <group rotation={[0.03, side === "left" ? -0.06 : 0.06, 0]}>
      <CylinderBetween
        start={[0, 0.01, 0.19]}
        end={[0, 0.005, 0.02]}
        radius={0.085}
        color={skin}
      />
      <mesh position={[0, 0.005, -0.13]} scale={[0.22, 0.085, 0.265]}>
        <sphereGeometry args={[1, 24, 18]} />
        <meshStandardMaterial color={skin} roughness={0.62} />
      </mesh>

      {fingers.map(({ x, lengths, radius }, index) => {
        const [proximal, middle, distal] = lengths;
        const middleJoint: [number, number, number] = [0, -0.026, -proximal];
        const distalJoint: [number, number, number] = [
          0,
          -0.066,
          -(proximal + middle),
        ];
        const tip: [number, number, number] = [
          0,
          -0.105,
          -(proximal + middle + distal),
        ];

        return (
          <group
            key={x}
            ref={(node) => {
              fingerGroups.current[index] = node;
            }}
            position={[x, -0.002, -0.3]}
          >
            <CylinderBetween
              start={[0, 0, 0]}
              end={middleJoint}
              radius={radius}
              color={skin}
            />
            <CylinderBetween
              start={middleJoint}
              end={distalJoint}
              radius={radius * 0.91}
              color={skin}
            />
            <CylinderBetween
              start={distalJoint}
              end={tip}
              radius={radius * 0.78}
              color={skin}
            />
            {[middleJoint, distalJoint].map((joint, jointIndex) => (
              <mesh
                key={jointIndex}
                position={joint}
                scale={radius * (jointIndex === 0 ? 1.02 : 0.91)}
              >
                <sphereGeometry args={[1, 14, 10]} />
                <meshStandardMaterial color={skin} roughness={0.64} />
              </mesh>
            ))}
            <mesh
              position={tip}
              scale={[radius * 0.82, radius * 0.68, radius * 1.05]}
            >
              <sphereGeometry args={[1, 16, 12]} />
              <meshStandardMaterial color={skin} roughness={0.58} />
            </mesh>
            <RoundedBox
              args={[radius * 1.18, 0.008, radius * 1.5]}
              radius={0.006}
              smoothness={2}
              position={[0, -0.079, tip[2] - 0.004]}
              rotation={[-0.2, 0, 0]}
            >
              <meshStandardMaterial color="#e9b09b" roughness={0.48} />
            </RoundedBox>
          </group>
        );
      })}
      <CylinderBetween
        start={[innerDirection * 0.16, 0.005, -0.08]}
        end={[innerDirection * 0.26, -0.025, -0.22]}
        radius={0.052}
        color={skin}
      />
      <CylinderBetween
        start={[innerDirection * 0.26, -0.025, -0.22]}
        end={[innerDirection * 0.3, -0.075, -0.35]}
        radius={0.043}
        color={skin}
      />
      <mesh
        position={[innerDirection * 0.3, -0.075, -0.35]}
        scale={[0.04, 0.032, 0.052]}
      >
        <sphereGeometry args={[1, 14, 10]} />
        <meshStandardMaterial color={skin} roughness={0.6} />
      </mesh>
    </group>
  );
}

function HumanFace({ skin, hair }: { skin: string; hair: string }) {
  return (
    <group>
      {[-0.52, 0.52].map((x) => (
        <mesh key={x} position={[x, 2.7, -1.25]} scale={[0.08, 0.13, 0.065]}>
          <sphereGeometry args={[1, 18, 14]} />
          <meshStandardMaterial color={skin} roughness={0.62} />
        </mesh>
      ))}

      {[-0.19, 0.19].map((x) => (
        <group key={x}>
          <mesh position={[x, 2.8, -1.745]} scale={[0.105, 0.062, 0.025]}>
            <sphereGeometry args={[1, 18, 12]} />
            <meshStandardMaterial color="#f5f1e8" roughness={0.42} />
          </mesh>
          <mesh position={[x, 2.8, -1.774]} scale={[0.041, 0.041, 0.018]}>
            <sphereGeometry args={[1, 16, 12]} />
            <meshStandardMaterial color="#4a2d1f" roughness={0.34} />
          </mesh>
          <mesh position={[x - 0.012, 2.817, -1.794]} scale={0.011}>
            <sphereGeometry args={[1, 10, 8]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
          <mesh position={[x, 2.8, -1.79]} scale={[0.18, 0.115, 1]}>
            <torusGeometry args={[0.55, 0.045, 8, 28]} />
            <meshStandardMaterial
              color="#574337"
              metalness={0.52}
              roughness={0.28}
            />
          </mesh>
        </group>
      ))}
      <CylinderBetween
        start={[-0.08, 2.81, -1.79]}
        end={[0.08, 2.81, -1.79]}
        radius={0.012}
        color="#574337"
      />

      <CylinderBetween
        start={[0, 2.77, -1.73]}
        end={[0, 2.62, -1.82]}
        radius={0.043}
        color={skin}
      />
      <mesh position={[0, 2.59, -1.82]} scale={[0.07, 0.045, 0.06]}>
        <sphereGeometry args={[1, 16, 12]} />
        <meshStandardMaterial color="#b96f54" roughness={0.62} />
      </mesh>

      {[-0.19, 0.19].map((x) => (
        <CylinderBetween
          key={`brow-${x}`}
          start={[x - 0.09, 2.91, -1.75]}
          end={[x + 0.08, 2.93, -1.76]}
          radius={0.018}
          color={hair}
        />
      ))}

      {[-0.31, 0.31].map((x) => (
        <mesh
          key={`cheek-${x}`}
          position={[x, 2.59, -1.69]}
          scale={[0.14, 0.1, 0.045]}
        >
          <sphereGeometry args={[1, 16, 12]} />
          <meshStandardMaterial
            color="#db8c72"
            transparent
            opacity={0.42}
            roughness={0.7}
          />
        </mesh>
      ))}

      <mesh position={[0, 2.5, -1.775]} rotation={[0, 0, Math.PI]}>
        <torusGeometry args={[0.115, 0.014, 8, 28, Math.PI]} />
        <meshStandardMaterial color="#743f37" roughness={0.58} />
      </mesh>
      <mesh position={[0, 2.41, -1.68]} scale={[0.24, 0.14, 0.055]}>
        <sphereGeometry args={[1, 20, 14]} />
        <meshStandardMaterial color={hair} roughness={0.9} />
      </mesh>
      {[-0.34, 0.34].map((x) => (
        <mesh
          key={`beard-${x}`}
          position={[x * 0.84, 2.49, -1.68]}
          scale={[0.09, 0.16, 0.055]}
        >
          <sphereGeometry args={[1, 18, 12]} />
          <meshStandardMaterial color={hair} roughness={0.92} />
        </mesh>
      ))}
    </group>
  );
}

function DeveloperPersona({
  palette,
  reducedMotion,
}: {
  palette: Palette;
  reducedMotion: boolean;
}) {
  const skin = "#c78664";
  const hair = "#28211c";
  const shirt = themeAwareShirt(palette);

  return (
    <group
      position={[0.78, 0, 2.4]}
      rotation={[0, 0.28, 0]}
      scale={[0.9, 1, 0.9]}
    >
      <group position={[0, 0, -0.78]}>
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
      {[-0.63, 0.63].map((x) => (
        <mesh
          key={`shoulder-${x}`}
          position={[x, 1.5, -1.4]}
          scale={[0.3, 0.36, 0.38]}
        >
          <sphereGeometry args={[1, 18, 14]} />
          <meshStandardMaterial color={shirt} roughness={0.78} />
        </mesh>
      ))}
      <mesh position={[0, 2.08, -1.32]}>
        <cylinderGeometry args={[0.22, 0.25, 0.38, 16]} />
        <meshStandardMaterial color={skin} roughness={0.72} />
      </mesh>
      {[-0.18, 0.18].map((x) => (
        <mesh
          key={`collar-${x}`}
          position={[x, 2.04, -1.7]}
          rotation={[0.1, 0, x < 0 ? -0.34 : 0.34]}
        >
          <coneGeometry args={[0.22, 0.46, 3]} />
          <meshStandardMaterial color={palette.surfaceLift} roughness={0.7} />
        </mesh>
      ))}

      <mesh position={[0, 2.72, -1.24]} scale={[0.55, 0.66, 0.52]}>
        <sphereGeometry args={[1, 36, 28]} />
        <meshStandardMaterial color={skin} roughness={0.57} />
      </mesh>
      <mesh position={[0, 3.15, -1.31]} scale={[0.52, 0.22, 0.51]}>
        <sphereGeometry args={[1, 32, 20]} />
        <meshStandardMaterial color={hair} roughness={0.92} />
      </mesh>
      {[-0.38, -0.19, 0, 0.19, 0.38].map((x, index) => (
        <mesh
          key={`hair-${x}`}
          position={[x, 3.1 + (index % 2) * 0.055, -1.57]}
          scale={[0.135, 0.13, 0.13]}
        >
          <sphereGeometry args={[1, 18, 14]} />
          <meshStandardMaterial color={hair} roughness={0.94} />
        </mesh>
      ))}
      <HumanFace skin={skin} hair={hair} />

      <CylinderBetween
        start={[-0.58, 1.57, -1.34]}
        end={[-0.48, 0.88, -1.36]}
        radius={0.19}
        color={shirt}
      />
      <CylinderBetween
        start={[-0.48, 0.88, -1.36]}
        end={[-0.36, 0.6, -1.5]}
        radius={0.15}
        color={skin}
      />
      <CylinderBetween
        start={[0.58, 1.57, -1.34]}
        end={[0.48, 0.88, -1.31]}
        radius={0.19}
        color={shirt}
      />
      <CylinderBetween
        start={[0.48, 0.88, -1.31]}
        end={[0.36, 0.6, -1.4]}
        radius={0.15}
        color={skin}
      />
      <group position={[-0.36, 0.6, -1.5]}>
        <TypingHand
          side="left"
          skin={skin}
          reducedMotion={reducedMotion}
          phaseOffset={0.5}
        />
      </group>
      <group position={[0.36, 0.6, -1.4]}>
        <TypingHand
          side="right"
          skin={skin}
          reducedMotion={reducedMotion}
          phaseOffset={Math.PI}
        />
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
        <span
          className={cn(styles.resumeHint, artwork.resumeHint)}
          aria-hidden="true"
        >
          <Pointer aria-hidden="true" size={12} strokeWidth={1.8} />
        </span>
      </Html>
    </group>
  );
}

function PullHandHint({ label, visible }: { label: string; visible: boolean }) {
  if (!visible) return null;

  const skin = "#d3916e";
  const fingers = [-0.095, -0.032, 0.032, 0.095] as const;

  return (
    <group
      position={[0, 0.1, 0.08]}
      rotation={[0.08, -0.08, -0.04]}
      scale={0.68}
    >
      <RoundedBox
        args={[0.29, 0.31, 0.13]}
        radius={0.065}
        smoothness={3}
        position={[0, 0.17, 0.055]}
      >
        <meshStandardMaterial color={skin} roughness={0.6} />
      </RoundedBox>
      <CylinderBetween
        start={[0, 0.3, 0.06]}
        end={[0.02, 0.62, 0.1]}
        radius={0.075}
        color={skin}
      />
      {fingers.map((x, index) => {
        const joint: [number, number, number] = [x, 0.035, 0.02];
        const tip: [number, number, number] = [
          x * 0.86,
          -0.07 + index * 0.004,
          -0.045,
        ];

        return (
          <group key={x}>
            <CylinderBetween
              start={[x, 0.12, 0.045]}
              end={joint}
              radius={0.027 - index * 0.0015}
              color={skin}
            />
            <CylinderBetween
              start={joint}
              end={tip}
              radius={0.024 - index * 0.0015}
              color={skin}
            />
            <mesh position={tip} scale={[0.025, 0.023, 0.025]}>
              <sphereGeometry args={[1, 12, 9]} />
              <meshStandardMaterial color={skin} roughness={0.58} />
            </mesh>
          </group>
        );
      })}
      <CylinderBetween
        start={[-0.13, 0.22, 0.06]}
        end={[-0.19, 0.07, -0.005]}
        radius={0.034}
        color={skin}
      />
      <CylinderBetween
        start={[-0.19, 0.07, -0.005]}
        end={[-0.1, -0.035, -0.055]}
        radius={0.029}
        color={skin}
      />
      <Html
        center
        position={[0.48, 0.22, 0.08]}
        zIndexRange={[4, 3]}
        style={{ pointerEvents: "none" }}
      >
        <span
          className={styles.pullHandCopy}
          data-lamp-hand-hint
          aria-hidden="true"
        >
          {label}
        </span>
      </Html>
    </group>
  );
}

function DeskLamp({
  pullLabel,
  theme,
  palette,
  reducedMotion,
  onToggle,
}: {
  pullLabel: string;
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
  const [hasInteracted, setHasInteracted] = useState(false);
  useCursor(hovered, "grab", "auto");
  const lit = theme === "dark";

  useFrame(({ clock }) => {
    const cordPivot = pivot.current;
    const cordMesh = cord.current;
    const pullHandle = handle.current;
    if (!cordPivot || !cordMesh || !pullHandle) return;

    const baseLength = 0.76;
    const demonstrationPhase = (clock.elapsedTime % 3.4) / 3.4;
    const demonstrationPull =
      !hasInteracted && !reducedMotion && demonstrationPhase < 0.34
        ? Math.sin((demonstrationPhase / 0.34) * Math.PI) * 0.2
        : 0;
    const length = baseLength + pullDistance.current + demonstrationPull;
    cordPivot.rotation.z =
      dragStart.current === null && !reducedMotion
        ? Math.sin(clock.elapsedTime * 1.75) * 0.12
        : 0;
    cordMesh.scale.y = length;
    cordMesh.position.y = -length / 2;
    pullHandle.position.y = -length;
  });

  function beginPull(clientY: number) {
    setHasInteracted(true);
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
        <group
          ref={handle}
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
          <PullHandHint label={pullLabel} visible={!hasInteracted} />
          <mesh>
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
              className={styles.pullTarget}
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
  pullLabel,
  reducedMotion,
  theme,
  onOpenResume,
  onReady,
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

      <EngineerGalleryWall palette={palette} theme={theme} />
      <DeveloperPersona palette={palette} reducedMotion={reducedMotion} />
      <CodeMonitor
        active={active}
        reducedMotion={reducedMotion}
        theme={theme}
        palette={palette}
      />
      <Keyboard palette={palette} reducedMotion={reducedMotion} />
      <ResumePaper palette={palette} onOpen={onOpenResume} />
      <DeskLamp
        pullLabel={pullLabel}
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
      <FirstUsableFrame onReady={onReady} />
    </group>
  );
}

function FirstUsableFrame({ onReady }: { onReady: () => void }) {
  const invalidate = useThree((state) => state.invalidate);
  const reported = useRef(false);
  const readyFrame = useRef(0);

  useLayoutEffect(() => {
    reported.current = false;
    invalidate();
    return () => {
      window.cancelAnimationFrame(readyFrame.current);
      reported.current = false;
    };
  }, [invalidate]);

  useFrame(() => {
    if (reported.current) return;
    reported.current = true;

    // Fiber renders the canvas after frame subscribers run. Reporting on the
    // following browser frame guarantees that the first composed frame exists.
    readyFrame.current = window.requestAnimationFrame(() => {
      readyFrame.current = 0;
      onReady();
    });
  }, -1000);

  return null;
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
        speed={1.25}
        zoom={0.92}
        rotation={[0.03, -0.28, 0]}
        polar={[-0.16, 0.28]}
        azimuth={[-Infinity, Infinity]}
        damping={0.16}
      >
        <Workstation {...props} />
      </PresentationControls>
      <AdaptiveDpr pixelated />
    </Canvas>
  );
}
