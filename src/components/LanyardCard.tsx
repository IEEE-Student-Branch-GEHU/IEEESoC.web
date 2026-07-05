/* eslint-disable @typescript-eslint/no-explicit-any */
import * as THREE from 'three';
import { useEffect, useRef, useState, useMemo } from 'react';
import { Canvas, extend, useThree, useFrame } from '@react-three/fiber';
import { useGLTF, useTexture, Environment, Lightformer } from '@react-three/drei';
import { BallCollider, CuboidCollider, Physics, RigidBody, useRopeJoint, useSphericalJoint } from '@react-three/rapier';
import { MeshLineGeometry, MeshLineMaterial } from 'meshline';

extend({ MeshLineGeometry, MeshLineMaterial });

const GLTF_PATH = '/assets/kartu.glb';
const TEXTURE_PATH = '/assets/bandd.png';

useGLTF.preload(GLTF_PATH);
useTexture.preload(TEXTURE_PATH);

export interface LanyardCardProps {
  userName?: string;
  userEmail?: string;
  userRole?: 'contributor' | 'admin' | string;
  githubUsername?: string;
  score?: number;
}

export default function LanyardCard({ userName, userEmail, userRole, githubUsername, score }: LanyardCardProps) {
  return (
    <div className="w-full h-[400px] md:h-[500px] flex justify-center items-center relative overflow-hidden select-none bg-black rounded-xl notched-card outline-1 outline-on-surface/10">
      <div className="absolute top-4 left-4 z-10 font-mono text-[9px] uppercase tracking-widest text-white/50 bg-black/40 px-2.5 py-1 rounded-full backdrop-blur-xs">
        Archivist ID Badge // Interactive 3D
      </div>
      <Canvas camera={{ position: [0, 0, 13], fov: 25 }}>
        <ambientLight intensity={Math.PI} />
        <Physics interpolate gravity={[0, -40, 0]} timeStep={1 / 60}>
          <Band
            userName={userName}
            userEmail={userEmail}
            userRole={userRole}
            githubUsername={githubUsername}
            score={score}
          />
        </Physics>
        <Environment background blur={0.75}>
          <color attach="background" args={['#1c1c16']} />
          <Lightformer intensity={2} color="white" position={[0, -1, 5]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
          <Lightformer intensity={3} color="white" position={[-1, -1, 1]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
          <Lightformer intensity={3} color="white" position={[1, 1, 1]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
          <Lightformer intensity={10} color="white" position={[-10, 0, 14]} rotation={[0, Math.PI / 2, Math.PI / 3]} scale={[100, 10, 1]} />
        </Environment>
      </Canvas>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Utility: build a CanvasTexture with the user's details drawn onto it
// ---------------------------------------------------------------------------
function buildCardTexture(
  userName: string,
  userEmail: string,
  userRole: string,
  githubUsername: string,
  score: number,
  ieeeImg: HTMLImageElement | null,
  gehuImg: HTMLImageElement | null,
  baseImg: HTMLImageElement | HTMLCanvasElement | ImageBitmap | null,
): THREE.CanvasTexture {
  const W = 2048;
  const H = 2048;
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d')!;

  // Scale context by 2 to support high-DPI rendering on the 1024x1024 coordinate system
  ctx.scale(2, 2);

  // Logical coordinate system bounds: W_logical = 1024, H_logical = 1024
  const W_logical = 1024;
  const H_logical = 1024;

  // 1. Draw original background texture across the full logical canvas first
  // This preserves the card back ornament on the right half (U: 0.5 to 1.0)
  if (baseImg) {
    ctx.drawImage(baseImg, 0, 0, W_logical, H_logical);
  } else {
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(0, 0, W_logical, H_logical);
  }

  // 2. Clear only the front face area on the left half of the texture
  // Front face maps to U: [0, 0.5] and V: [0, 0.75]
  const cardW = 512;
  const cardH = 770;
  ctx.fillStyle = '#f5f0e8';
  ctx.fillRect(0, 0, cardW, cardH);

  // --- Ornamental border on front face ---
  const borderInset = 14;
  ctx.strokeStyle = '#8b7d5e';
  ctx.lineWidth = 2.5;
  roundRect(ctx, borderInset, borderInset, cardW - borderInset * 2, cardH - borderInset * 2, 8);
  ctx.stroke();

  // Inner double border
  const innerInset = 22;
  ctx.strokeStyle = '#c4b899';
  ctx.lineWidth = 1;
  roundRect(ctx, innerInset, innerInset, cardW - innerInset * 2, cardH - innerInset * 2, 6);
  ctx.stroke();

  // --- Corner ornaments ---
  drawCornerOrnaments(ctx, cardW, cardH, borderInset);

  // --- Logos ---
  const logoY = 40;
  const logoSize = 52;

  if (ieeeImg) {
    const aspect = ieeeImg.width / ieeeImg.height;
    const drawW = logoSize * aspect;
    ctx.drawImage(ieeeImg, 40, logoY, drawW, logoSize);
  } else {
    // Fallback text
    ctx.fillStyle = '#2b5797';
    ctx.font = 'bold 16px "EB Garamond", Georgia, serif';
    ctx.textAlign = 'left';
    ctx.fillText('IEEE', 46, logoY + 34);
  }

  if (gehuImg) {
    const aspect = gehuImg.width / gehuImg.height;
    const drawW = logoSize * aspect;
    ctx.drawImage(gehuImg, cardW - 40 - drawW, logoY, drawW, logoSize);
  } else {
    ctx.fillStyle = '#c0392b';
    ctx.font = 'bold 14px "EB Garamond", Georgia, serif';
    ctx.textAlign = 'right';
    ctx.fillText('GEHU', cardW - 46, logoY + 34);
  }

  // --- Photo placeholder area ---
  const photoW = 120;
  const photoH = 140;
  const photoX = (cardW - photoW) / 2;
  const photoY = 110;
  ctx.fillStyle = '#2c2c2c';
  ctx.strokeStyle = '#8b7d5e';
  ctx.lineWidth = 2;
  roundRect(ctx, photoX, photoY, photoW, photoH, 4);
  ctx.fill();
  ctx.stroke();

  // User initial in photo area
  ctx.fillStyle = '#f5f0e8';
  ctx.font = 'bold 48px "EB Garamond", Georgia, serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  const initial = userName ? userName.charAt(0).toUpperCase() : '?';
  ctx.fillText(initial, photoX + photoW / 2, photoY + photoH / 2);

  // --- Title ---
  const titleY = 290;
  ctx.fillStyle = '#1a1a1a';
  ctx.font = 'bold 22px "EB Garamond", Georgia, serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  ctx.fillText('IEEESoC \'26', cardW / 2, titleY);

  ctx.font = '13px "EB Garamond", Georgia, serif';
  ctx.fillStyle = '#5c5240';
  ctx.fillText('ARCHIVIST IDENTIFICATION', cardW / 2, titleY + 28);

  // --- Divider line ---
  const divY = titleY + 52;
  ctx.strokeStyle = '#c4b899';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(50, divY);
  ctx.lineTo(cardW - 50, divY);
  ctx.stroke();

  // --- User details ---
  const detailStartY = divY + 18;
  const labelX = 50;
  const valueX = 170;
  const lineH = 34;

  const fields = [
    { label: 'NAME', value: userName || 'Unknown' },
    { label: 'EMAIL', value: truncateText(userEmail || 'N/A', 24) },
    { label: 'ROLE', value: userRole ? userRole.toUpperCase() : 'CONTRIBUTOR' },
    { label: 'GITHUB', value: githubUsername ? `@${githubUsername}` : '—' },
    { label: 'SCORE', value: String(score ?? 0) },
  ];

  fields.forEach((field, i) => {
    const y = detailStartY + i * lineH;

    // Label
    ctx.fillStyle = '#8b7d5e';
    ctx.font = 'bold 9px "JetBrains Mono", Courier, monospace';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillText(field.label, labelX, y);

    // Value
    ctx.fillStyle = '#1a1a1a';
    ctx.font = '13px "EB Garamond", Georgia, serif';
    ctx.textAlign = 'left';
    ctx.fillText(field.value, valueX, y - 1);

    // Underline
    ctx.strokeStyle = '#d5cdb8';
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    ctx.moveTo(valueX, y + 16);
    ctx.lineTo(cardW - 50, y + 16);
    ctx.stroke();
  });

  // --- Role badge ---
  const badgeY = detailStartY + 2 * lineH - 3;
  const badgeText = userRole === 'admin' ? 'ADMIN' : 'CONTRIBUTOR';
  const badgeColor = userRole === 'admin' ? '#c0392b' : '#2b5797';
  const badgeW = ctx.measureText(badgeText).width + 16;
  ctx.fillStyle = badgeColor;
  roundRect(ctx, valueX - 2, badgeY - 2, badgeW + 4, 17, 3);
  ctx.fill();
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 9px "JetBrains Mono", Courier, monospace';
  ctx.fillText(badgeText, valueX + 6, badgeY + 3);

  // --- Barcode-style decoration at bottom ---
  const barcodeY = cardH - 85;
  ctx.fillStyle = '#1a1a1a';
  const barcodeX = 80;
  const barcodeW = cardW - 160;
  for (let x = 0; x < barcodeW; x += 3) {
    const barH = 20 + Math.random() * 12;
    const barW = Math.random() > 0.4 ? 2 : 1;
    ctx.fillRect(barcodeX + x, barcodeY, barW, barH);
  }

  // ID code text below barcode
  const idCode = `*ISOC-${(userName || 'USR').substring(0, 3).toUpperCase()}${String(score ?? 0).padStart(4, '0')}*`;
  ctx.fillStyle = '#5c5240';
  ctx.font = '10px "JetBrains Mono", Courier, monospace';
  ctx.textAlign = 'center';
  ctx.fillText(idCode, cardW / 2, barcodeY + 42);

  // --- Bottom accent line ---
  ctx.fillStyle = '#8b7d5e';
  ctx.fillRect(borderInset, cardH - 18, cardW - borderInset * 2, 3);

  const tex = new THREE.CanvasTexture(canvas);
  tex.flipY = false;
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.needsUpdate = true;
  return tex;
}

// Helper: rounded rectangle path
function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

// Helper: draw decorative corner ornaments
function drawCornerOrnaments(ctx: CanvasRenderingContext2D, W: number, H: number, inset: number) {
  ctx.strokeStyle = '#8b7d5e';
  ctx.lineWidth = 1.5;
  const ornLen = 18;
  const oi = inset + 4;

  // Top-left
  ctx.beginPath();
  ctx.moveTo(oi, oi + ornLen); ctx.lineTo(oi, oi); ctx.lineTo(oi + ornLen, oi);
  ctx.stroke();
  // Top-right
  ctx.beginPath();
  ctx.moveTo(W - oi - ornLen, oi); ctx.lineTo(W - oi, oi); ctx.lineTo(W - oi, oi + ornLen);
  ctx.stroke();
  // Bottom-left
  ctx.beginPath();
  ctx.moveTo(oi, H - oi - ornLen); ctx.lineTo(oi, H - oi); ctx.lineTo(oi + ornLen, H - oi);
  ctx.stroke();
  // Bottom-right
  ctx.beginPath();
  ctx.moveTo(W - oi - ornLen, H - oi); ctx.lineTo(W - oi, H - oi); ctx.lineTo(W - oi, H - oi - ornLen);
  ctx.stroke();
}

// Helper: truncate text with ellipsis
function truncateText(text: string, maxLen: number): string {
  if (text.length <= maxLen) return text;
  return text.substring(0, maxLen - 1) + '…';
}

// ---------------------------------------------------------------------------
// Band component — physics + 3D card with dynamic texture
// ---------------------------------------------------------------------------
function Band({
  maxSpeed = 50,
  minSpeed = 10,
  userName,
  userEmail,
  userRole,
  githubUsername,
  score,
}: {
  maxSpeed?: number;
  minSpeed?: number;
  userName?: string;
  userEmail?: string;
  userRole?: string;
  githubUsername?: string;
  score?: number;
}) {
  const band = useRef<any>(null), fixed = useRef<any>(null), j1 = useRef<any>(null), j2 = useRef<any>(null), j3 = useRef<any>(null), card = useRef<any>(null); // prettier-ignore
  const vec = new THREE.Vector3(), ang = new THREE.Vector3(), rot = new THREE.Vector3(), dir = new THREE.Vector3(); // prettier-ignore
  const segmentProps = { type: 'dynamic' as any, canSleep: true, colliders: false as any, angularDamping: 4, linearDamping: 4 };
  const { nodes, materials } = useGLTF(GLTF_PATH) as any; 
  const texture = useTexture(TEXTURE_PATH); 
  const { width, height } = useThree((state) => state.size);
  const [curve] = useState(() => new THREE.CatmullRomCurve3([new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()]));
  const [dragged, drag] = useState<any>(false);
  const [hovered, hover] = useState(false);

  // Load logo images and build dynamic card texture
  const [ieeeImg, setIeeeImg] = useState<HTMLImageElement | null>(null);
  const [gehuImg, setGehuImg] = useState<HTMLImageElement | null>(null);

  useEffect(() => {
    const loadImg = (src: string): Promise<HTMLImageElement> =>
      new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
      });

    Promise.all([
      loadImg('/assets/logo-ieee.png').catch(() => null),
      loadImg('/assets/logo-gehu.png').catch(() => null),
    ]).then(([ieee, gehu]) => {
      setIeeeImg(ieee);
      setGehuImg(gehu);
    });
  }, []);

  const cardTexture = useMemo(() => {
    const baseImage = materials.base?.map?.image || null;
    return buildCardTexture(
      userName || 'Archivist',
      userEmail || '',
      userRole || 'contributor',
      githubUsername || '',
      score ?? 0,
      ieeeImg,
      gehuImg,
      baseImage,
    );
  }, [userName, userEmail, userRole, githubUsername, score, ieeeImg, gehuImg, materials]);

  useRopeJoint(fixed, j1, [[0, 0, 0], [0, 0, 0], 1]); // prettier-ignore
  useRopeJoint(j1, j2, [[0, 0, 0], [0, 0, 0], 1]); // prettier-ignore
  useRopeJoint(j2, j3, [[0, 0, 0], [0, 0, 0], 1]); // prettier-ignore
  useSphericalJoint(j3, card, [[0, 0, 0], [0, 1.45, 0]]); // prettier-ignore

  useEffect(() => {
    if (hovered) {
      document.body.style.cursor = dragged ? 'grabbing' : 'grab';
      return () => void (document.body.style.cursor = 'auto');
    }
  }, [hovered, dragged]);

  useFrame((state, delta) => {
    if (dragged) {
      vec.set(state.pointer.x, state.pointer.y, 0.5).unproject(state.camera);
      dir.copy(vec).sub(state.camera.position).normalize();
      vec.add(dir.multiplyScalar(state.camera.position.length()));
      [card, j1, j2, j3, fixed].forEach((ref) => ref.current?.wakeUp());
      card.current?.setNextKinematicTranslation({ x: vec.x - dragged.x, y: vec.y - dragged.y, z: vec.z - dragged.z });
    }
    if (fixed.current) {
      [j1, j2].forEach((ref) => {
        if (!ref.current.lerped) ref.current.lerped = new THREE.Vector3().copy(ref.current.translation());
        const clampedDistance = Math.max(0.1, Math.min(1, ref.current.lerped.distanceTo(ref.current.translation())));
        ref.current.lerped.lerp(ref.current.translation(), delta * (minSpeed + clampedDistance * (maxSpeed - minSpeed)));
      });
      curve.points[0].copy(j3.current.translation());
      curve.points[1].copy(j2.current.lerped);
      curve.points[2].copy(j1.current.lerped);
      curve.points[3].copy(fixed.current.translation());
      band.current.geometry.setPoints(curve.getPoints(32));
      ang.copy(card.current.angvel());
      rot.copy(card.current.rotation());
      card.current.setAngvel({ x: ang.x, y: ang.y - rot.y * 0.25, z: ang.z });
    }
  });

  curve.curveType = 'chordal';
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;

  const RB = RigidBody as any;
  const MeshLineGeom = 'meshLineGeometry' as any;
  const MeshLineMat = 'meshLineMaterial' as any;

  return (
    <>
      <group position={[0, 4, 0]}>
        <RB ref={fixed} {...segmentProps} type="fixed" />
        <RB position={[0.5, 0, 0]} ref={j1} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RB>
        <RB position={[1, 0, 0]} ref={j2} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RB>
        <RB position={[1.5, 0, 0]} ref={j3} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RB>
        <RB position={[2, 0, 0]} ref={card} {...segmentProps} type={dragged ? 'kinematicPosition' : 'dynamic'}>
          <CuboidCollider args={[0.8, 1.125, 0.01]} />
          <group
            scale={2.25}
            position={[0, -1.2, -0.05]}
            onPointerOver={() => hover(true)}
            onPointerOut={() => hover(false)}
            onPointerUp={(e) => {
              (e.target as any).releasePointerCapture(e.pointerId);
              drag(false);
            }}
            onPointerDown={(e) => {
              (e.target as any).setPointerCapture(e.pointerId);
              drag(new THREE.Vector3().copy(e.point).sub(vec.copy(card.current.translation())));
            }}
          >
            <mesh geometry={nodes.card.geometry}>
              <meshPhysicalMaterial
                map={cardTexture}
                map-anisotropy={16}
                clearcoat={1}
                clearcoatRoughness={0.15}
                roughness={0.3}
                metalness={0.5}
              />
            </mesh>
            <mesh geometry={nodes.clip.geometry} material={materials.metal} material-roughness={0.3} />
            <mesh geometry={nodes.clamp.geometry} material={materials.metal} />
          </group>
        </RB>
      </group>
      <mesh ref={band}>
        <MeshLineGeom />
        <MeshLineMat color="white" depthTest={false} resolution={[width, height]} useMap map={texture} repeat={[-4, 1]} lineWidth={1} />
      </mesh>
    </>
  );
}
