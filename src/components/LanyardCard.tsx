/* eslint-disable @typescript-eslint/no-explicit-any */
import * as THREE from 'three';
import { useEffect, useRef, useState } from 'react';
import { Canvas, extend, useThree, useFrame } from '@react-three/fiber';
import { useGLTF, useTexture, Environment, Lightformer } from '@react-three/drei';
import { BallCollider, CuboidCollider, Physics, RigidBody, useRopeJoint, useSphericalJoint } from '@react-three/rapier';
import { MeshLineGeometry, MeshLineMaterial } from 'meshline';

extend({ MeshLineGeometry, MeshLineMaterial });

import { useAuth } from '../hooks/useAuth';

const GLTF_PATH = '/assets/kartu.glb';
const TEXTURE_PATH = '/assets/bandd.png';

useGLTF.preload(GLTF_PATH);
useTexture.preload(TEXTURE_PATH);

function drawCard(
  canvas: HTMLCanvasElement, 
  user: any, 
  stats: any, 
  ieeeLogo: HTMLImageElement | null, 
  gehuLogo: HTMLImageElement | null, 
  avatarImg: HTMLImageElement | null
) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Clear canvas
  ctx.fillStyle = '#fcf9ef'; // Renaissance Putty background
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Outer border
  ctx.lineWidth = 12;
  ctx.strokeStyle = '#1c1c16';
  ctx.strokeRect(6, 6, canvas.width - 12, canvas.height - 12);

  // Inner border
  ctx.lineWidth = 2;
  ctx.strokeStyle = '#1c1c16';
  ctx.strokeRect(20, 20, canvas.width - 40, canvas.height - 40);

  // Draw Logos
  if (ieeeLogo && ieeeLogo.complete && ieeeLogo.naturalWidth !== 0) {
    ctx.drawImage(ieeeLogo, 32, 32, 100, 50);
  }
  if (gehuLogo && gehuLogo.complete && gehuLogo.naturalWidth !== 0) {
    ctx.drawImage(gehuLogo, canvas.width - 152, 32, 120, 50);
  }

  // Draw Title Header
  ctx.fillStyle = '#1c1c16';
  ctx.font = 'bold 20px serif';
  ctx.textAlign = 'center';
  ctx.fillText('HALL OF CHRONICLES', canvas.width / 2, 120);
  ctx.font = 'bold 10px monospace';
  ctx.fillText('ACCESS REGISTER // LEVEL B-12', canvas.width / 2, 138);

  // Divider line
  ctx.beginPath();
  ctx.moveTo(30, 155);
  ctx.lineTo(canvas.width - 30, 155);
  ctx.lineWidth = 1.5;
  ctx.strokeStyle = '#1c1c16';
  ctx.stroke();

  // Draw User Avatar
  const avatarSize = 160;
  const avatarX = canvas.width / 2 - avatarSize / 2;
  const avatarY = 180;

  ctx.save();
  ctx.beginPath();
  ctx.arc(canvas.width / 2, avatarY + avatarSize / 2, avatarSize / 2, 0, Math.PI * 2);
  ctx.closePath();
  ctx.clip();

  if (avatarImg && avatarImg.complete && avatarImg.naturalWidth !== 0) {
    try {
      ctx.drawImage(avatarImg, avatarX, avatarY, avatarSize, avatarSize);
    } catch {
      // CORS fallback
      ctx.fillStyle = '#ebe8de';
      ctx.fillRect(avatarX, avatarY, avatarSize, avatarSize);
      ctx.fillStyle = '#1c1c16';
      ctx.font = 'bold 64px serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(user?.name?.charAt(0) || '?', canvas.width / 2, avatarY + avatarSize / 2);
    }
  } else {
    ctx.fillStyle = '#ebe8de';
    ctx.fillRect(avatarX, avatarY, avatarSize, avatarSize);
    ctx.fillStyle = '#1c1c16';
    ctx.font = 'bold 64px serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(user?.name?.charAt(0) || '?', canvas.width / 2, avatarY + avatarSize / 2);
  }
  ctx.restore();

  // Avatar Border
  ctx.beginPath();
  ctx.arc(canvas.width / 2, avatarY + avatarSize / 2, avatarSize / 2, 0, Math.PI * 2);
  ctx.lineWidth = 4;
  ctx.strokeStyle = '#1c1c16';
  ctx.stroke();

  // Draw User Name
  ctx.fillStyle = '#1c1c16';
  ctx.textBaseline = 'alphabetic';
  ctx.font = 'bold 26px serif';
  ctx.textAlign = 'center';
  ctx.fillText((user?.name || 'ARCHIVIST').toUpperCase(), canvas.width / 2, 385);

  // User Email
  ctx.font = 'normal 13px monospace';
  ctx.fillStyle = '#474740';
  ctx.fillText(user?.email || 'unknown@ieeesoc.com', canvas.width / 2, 410);

  // Draw Role Badge
  const roleText = (user?.role || 'CONTRIBUTOR').toUpperCase();
  ctx.font = 'bold 10px monospace';
  const roleWidth = ctx.measureText(roleText).width + 20;
  const badgeX = canvas.width / 2 - roleWidth / 2;
  const badgeY = 430;

  ctx.fillStyle = user?.role === 'admin' ? '#fef3c7' : '#ebe8de';
  ctx.fillRect(badgeX, badgeY, roleWidth, 24);
  ctx.lineWidth = 1.5;
  ctx.strokeStyle = '#1c1c16';
  ctx.strokeRect(badgeX, badgeY, roleWidth, 24);

  ctx.fillStyle = '#1c1c16';
  ctx.textAlign = 'center';
  ctx.fillText(roleText, canvas.width / 2, badgeY + 16);

  // Draw Stats
  ctx.font = 'bold 12px monospace';
  ctx.fillText(`SCORE: ${stats?.score || 0} // PRs: ${stats?.mergedPRs || 0}`, canvas.width / 2, 490);

  // Barcode at bottom
  const barcodeX = canvas.width / 2 - 120;
  const barcodeY = 525;
  const barcodeHeight = 35;

  ctx.fillStyle = '#1c1c16';
  let currX = barcodeX;
  const strips = [2, 4, 1, 3, 5, 2, 1, 4, 2, 3, 1, 5, 2, 3, 4, 1, 2, 3, 1, 4, 2, 5];
  for (let i = 0; i < strips.length; i++) {
    const w = strips[i];
    if (i % 2 === 0) {
      ctx.fillRect(currX, barcodeY, w, barcodeHeight);
    }
    currX += w + 2;
  }

  // ID serial code
  ctx.font = 'normal 9px monospace';
  ctx.fillText(`ID-${user?.id?.substring(0, 8) || 'SOC-2026'}`, canvas.width / 2, barcodeY + barcodeHeight + 15);
}

export default function LanyardCard() {
  const { user, stats } = useAuth();
  const [texture, setTexture] = useState<THREE.CanvasTexture | null>(null);

  useEffect(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 682;

    const ieeeImg = new Image();
    const gehuImg = new Image();
    const avatarImg = new Image();

    let isDisposed = false;

    const redraw = () => {
      if (isDisposed) return;
      drawCard(canvas, user, stats, ieeeImg, gehuImg, user?.avatarUrl ? avatarImg : null);
      const tex = new THREE.CanvasTexture(canvas);
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.flipY = false;
      tex.wrapS = THREE.RepeatWrapping;
      tex.repeat.x = -1;
      tex.offset.x = 1;
      setTexture(tex);
    };

    ieeeImg.onload = redraw;
    gehuImg.onload = redraw;
    avatarImg.onload = redraw;
    avatarImg.onerror = redraw;

    ieeeImg.src = '/assets/logo-ieee.png';
    gehuImg.src = '/assets/logo-gehu.png';
    
    if (user?.avatarUrl) {
      avatarImg.crossOrigin = 'anonymous';
      avatarImg.src = user.avatarUrl;
    } else {
      redraw();
    }

    return () => {
      isDisposed = true;
    };
  }, [user, stats]);

  return (
    <div className="w-full h-[400px] md:h-[500px] flex justify-center items-center relative overflow-hidden select-none bg-black rounded-xl notched-card outline-1 outline-on-surface/10">
      <div className="absolute top-4 left-4 z-10 font-mono text-[9px] uppercase tracking-widest text-white/50 bg-black/40 px-2.5 py-1 rounded-full backdrop-blur-xs">
        Archivist ID Badge // Interactive 3D
      </div>
      <Canvas camera={{ position: [0, 0, 13], fov: 25 }}>
        <ambientLight intensity={Math.PI} />
        <Physics interpolate gravity={[0, -40, 0]} timeStep={1 / 60}>
          <Band cardTexture={texture} />
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

function Band({ cardTexture, maxSpeed = 50, minSpeed = 10 }: { cardTexture: THREE.CanvasTexture | null; maxSpeed?: number; minSpeed?: number }) {
  const band = useRef<any>(null), fixed = useRef<any>(null), j1 = useRef<any>(null), j2 = useRef<any>(null), j3 = useRef<any>(null), card = useRef<any>(null); // prettier-ignore
  const vec = new THREE.Vector3(), ang = new THREE.Vector3(), rot = new THREE.Vector3(), dir = new THREE.Vector3(); // prettier-ignore
  const segmentProps = { type: 'dynamic' as any, canSleep: true, colliders: false as any, angularDamping: 4, linearDamping: 4 };
  const { nodes, materials } = useGLTF(GLTF_PATH) as any; 
  const ribbonTexture = useTexture(TEXTURE_PATH); 
  const { width, height } = useThree((state) => state.size);
  const [curve] = useState(() => new THREE.CatmullRomCurve3([new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()]));
  const [dragged, drag] = useState<any>(false);
  const [hovered, hover] = useState(false);

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
  ribbonTexture.wrapS = ribbonTexture.wrapT = THREE.RepeatWrapping;

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
              <meshPhysicalMaterial map={cardTexture || materials.base.map} map-anisotropy={16} clearcoat={1} clearcoatRoughness={0.15} roughness={0.3} metalness={0.5} />
            </mesh>
            <mesh geometry={nodes.clip.geometry} material={materials.metal} material-roughness={0.3} />
            <mesh geometry={nodes.clamp.geometry} material={materials.metal} />
          </group>
        </RB>
      </group>
      <mesh ref={band}>
        <MeshLineGeom />
        <MeshLineMat color="white" depthTest={false} resolution={[width, height]} useMap map={ribbonTexture} repeat={[-4, 1]} lineWidth={1} />
      </mesh>
    </>
  );
}
