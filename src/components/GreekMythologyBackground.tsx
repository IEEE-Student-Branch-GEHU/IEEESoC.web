import { useEffect, useRef, memo } from "react";
import * as THREE from "three";

interface GreekMythologyBackgroundProps {
  isActive: boolean;
}

export default memo(function GreekMythologyBackground({ isActive }: GreekMythologyBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollYRef = useRef(0);
  const targetScrollYRef = useRef(0);
  const mouseXRef = useRef(0);
  const mouseYRef = useRef(0);
  const targetMouseXRef = useRef(0);
  const targetMouseYRef = useRef(0);

  // Keep track of active state using refs so the WebGL closure can access current values
  const isActiveRef = useRef(isActive);
  const startLoopRef = useRef<(() => void) | null>(null);
  const stopLoopRef = useRef<(() => void) | null>(null);
  const isLoopRunning = useRef(false);

  useEffect(() => {
    isActiveRef.current = isActive;
    if (isActive) {
      if (startLoopRef.current) startLoopRef.current();
    } else {
      if (stopLoopRef.current) stopLoopRef.current();
    }
  }, [isActive]);

  useEffect(() => {
    if (!containerRef.current) return;

    // --- SETUP RENDERER & SCENE ---
    const container = containerRef.current;
    const width = window.innerWidth;
    const height = window.innerHeight;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });

    // Detect mobile/tablet to adjust performance
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    ) || width < 768;

    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.0 : 1.5));
    renderer.shadowMap.enabled = false; // Disabled for performance
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();

    // Soft beige/putty atmospheric fog
    const fogColor = new THREE.Color(0xebe8de); // Matches --color-surface-container-high
    scene.fog = new THREE.FogExp2(fogColor.getHex(), 0.018);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    // Position camera slightly elevated
    camera.position.set(0, 3, 20);

    // --- LIGHTS ---
    const ambientLight = new THREE.AmbientLight(0xfffdf6, 0.72);
    scene.add(ambientLight);

    // Warm golden directional light simulating classical sun rays
    const sunLight = new THREE.DirectionalLight(0xfff6e0, 1.1);
    sunLight.position.set(10, 15, 10);
    scene.add(sunLight);

    // Subtle blue fill light from the opposite side for shadow depth
    const skyLight = new THREE.DirectionalLight(0xdbe9f6, 0.4);
    skyLight.position.set(-10, -5, -10);
    scene.add(skyLight);

    // Divine glow point light behind the statue
    const divineLight = new THREE.PointLight(0xffd700, 2.5, 30);
    divineLight.position.set(0, 5, -8);
    scene.add(divineLight);

    // --- MATERIALS ---
    // Beautiful marble texture standard material
    const marbleMaterial = new THREE.MeshStandardMaterial({
      color: 0xfbf9f3, // Elegant light beige marble
      roughness: 0.35,
      metalness: 0.05,
      flatShading: true, // Gives a clean, chiseled architectural look
    });

    const goldenMaterial = new THREE.MeshStandardMaterial({
      color: 0xe6b800, // Rich warm gold
      roughness: 0.15,
      metalness: 0.85,
      emissive: 0x5a4500,
    });

    const glowingGoldMaterial = new THREE.MeshBasicMaterial({
      color: 0xffd700,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
    });

    // Parent group to apply global subtle rotation and shifts
    const worldGroup = new THREE.Group();
    scene.add(worldGroup);

    // --- PROCEDURAL GENERATION ---

    // 1. Column Generator (Doric/Ionic hybrid style)
    const createColumn = (height: number, isBroken = false, tiltAngle = 0) => {
      const columnGroup = new THREE.Group();

      // Column Base (tiered plinth)
      const baseGeo = new THREE.BoxGeometry(1.6, 0.25, 1.6);
      const base = new THREE.Mesh(baseGeo, marbleMaterial);
      base.position.y = 0.125;
      columnGroup.add(base);

      const baseRingGeo = new THREE.CylinderGeometry(0.7, 0.7, 0.15, 12);
      const baseRing = new THREE.Mesh(baseRingGeo, marbleMaterial);
      baseRing.position.y = 0.3;
      columnGroup.add(baseRing);

      // Shaft segments (Doric drums look with flatShading)
      const shaftHeight = isBroken ? height * 0.55 : height;
      const shaftGeo = new THREE.CylinderGeometry(0.5, 0.6, shaftHeight, 10);
      const shaft = new THREE.Mesh(shaftGeo, marbleMaterial);
      shaft.position.y = 0.3 + shaftHeight / 2;
      columnGroup.add(shaft);

      // Capital (Ionic scroll block and Doric abacus)
      if (!isBroken) {
        const capitalRingGeo = new THREE.CylinderGeometry(0.68, 0.55, 0.2, 12);
        const capitalRing = new THREE.Mesh(capitalRingGeo, marbleMaterial);
        capitalRing.position.y = 0.3 + shaftHeight + 0.1;
        columnGroup.add(capitalRing);

        const abacusGeo = new THREE.BoxGeometry(1.4, 0.3, 1.4);
        const abacus = new THREE.Mesh(abacusGeo, marbleMaterial);
        abacus.position.y = 0.3 + shaftHeight + 0.25;
        columnGroup.add(abacus);
      } else {
        // Add a fallen column drum next to the broken column
        const drumGeo = new THREE.CylinderGeometry(0.5, 0.52, height * 0.3, 10);
        const fallenDrum = new THREE.Mesh(drumGeo, marbleMaterial);
        fallenDrum.position.set(0.9, 0.3, 0.5);
        fallenDrum.rotation.set(Math.PI / 2, 0.2, 0.8);
        columnGroup.add(fallenDrum);
      }

      if (tiltAngle !== 0) {
        columnGroup.rotation.z = tiltAngle;
        columnGroup.rotation.x = tiltAngle * 0.5;
      }

      return columnGroup;
    };

    // Colonnade Placement (two rows creating depth)
    const colonnade = new THREE.Group();
    const colCount = isMobile ? 3 : 5;
    const colSpacing = isMobile ? 8.5 : 11.0;
    const colOffsetZ = -2;
    const posX = isMobile ? 6.5 : 10.5;

    for (let i = 0; i < colCount; i++) {
      const zPos = colOffsetZ - (i * colSpacing);
      const leftBroken = i === 1 || i === 4;
      const rightBroken = i === 2;

      // Left column
      const leftCol = createColumn(6, leftBroken, leftBroken ? 0.05 : 0);
      leftCol.position.set(-posX, -2.5, zPos);
      colonnade.add(leftCol);

      // Right column
      const rightCol = createColumn(6, rightBroken, rightBroken ? -0.06 : 0);
      rightCol.position.set(posX, -2.5, zPos);
      colonnade.add(rightCol);
    }
    worldGroup.add(colonnade);

    // 2. Grand Temple Ruin Pediment (far back behind the statue)
    const ruinBackdrop = new THREE.Group();
    ruinBackdrop.position.set(0, -1, -44);

    const pedimentBaseGeo = new THREE.BoxGeometry(14, 0.8, 4);
    const pedimentBase = new THREE.Mesh(pedimentBaseGeo, marbleMaterial);
    ruinBackdrop.add(pedimentBase);

    // Background columns
    for (let i = -3; i <= 3; i++) {
      if (i === 0) continue; // Leave center open for statue view
      const bgCol = createColumn(5, Math.abs(i) === 3);
      bgCol.position.set(i * 2.0, 0.4, 0);
      bgCol.scale.set(0.7, 0.7, 0.7);
      ruinBackdrop.add(bgCol);
    }
    worldGroup.add(ruinBackdrop);

    // 3. Floating Rocky Islands
    const floatingIslands: THREE.Group[] = [];
    const createFloatingIsland = (radius: number, detail = 1) => {
      const island = new THREE.Group();
      
      // Top flat surface mesh
      const topGeo = new THREE.CylinderGeometry(radius, radius * 1.1, 0.4, 8);
      const topMesh = new THREE.Mesh(topGeo, marbleMaterial);
      topMesh.position.y = 0.2;
      island.add(topMesh);

      // Bottom craggy rock (deformed icosahedron)
      const rockGeo = new THREE.IcosahedronGeometry(radius, detail);
      const posAttr = rockGeo.attributes.position;
      const v = new THREE.Vector3();
      
      // Displace vertices to create organic downward peaks
      for (let i = 0; i < posAttr.count; i++) {
        v.fromBufferAttribute(posAttr, i);
        if (v.y < 0) {
          // Pull lower vertices further down to form a floating mountain root
          v.y *= 1.6 + Math.random() * 0.4;
          v.x *= 0.8 + Math.random() * 0.2;
          v.z *= 0.8 + Math.random() * 0.2;
        } else {
          // Flatten top vertices
          v.y *= 0.15;
        }
        posAttr.setXYZ(i, v.x, v.y, v.z);
      }
      rockGeo.computeVertexNormals();

      const rockMesh = new THREE.Mesh(rockGeo, marbleMaterial);
      rockMesh.position.y = 0;
      island.add(rockMesh);

      return island;
    };

    // Instantiate floating islands
    const islandLeft = createFloatingIsland(3.2, 2);
    islandLeft.position.set(-16.5, 3.2, -15);
    islandLeft.userData = { yBase: 3.2 };
    worldGroup.add(islandLeft);
    floatingIslands.push(islandLeft);

    // Add minor ruins on the left island
    const miniCol1 = createColumn(2.5, false);
    miniCol1.scale.set(0.4, 0.4, 0.4);
    miniCol1.position.set(-1, 0.4, 0);
    islandLeft.add(miniCol1);

    const miniCol2 = createColumn(2.5, true);
    miniCol2.scale.set(0.4, 0.4, 0.4);
    miniCol2.position.set(1, 0.4, 0.5);
    islandLeft.add(miniCol2);

    const islandRight = createFloatingIsland(2.5, 1);
    islandRight.position.set(16.0, 4.8, -13);
    islandRight.userData = { yBase: 4.8 };
    worldGroup.add(islandRight);
    floatingIslands.push(islandRight);

    const miniCol3 = createColumn(2, false);
    miniCol3.scale.set(0.4, 0.4, 0.4);
    miniCol3.position.set(0, 0.4, 0);
    islandRight.add(miniCol3);

    // Far background high island
    const islandFar = createFloatingIsland(4.5, 2);
    islandFar.position.set(-6, 9.5, -38);
    islandFar.userData = { yBase: 9.5 };
    worldGroup.add(islandFar);
    floatingIslands.push(islandFar);

    const miniColFarLeft = createColumn(4, false);
    miniColFarLeft.scale.set(0.4, 0.4, 0.4);
    miniColFarLeft.position.set(-1.2, 0.4, 0);
    islandFar.add(miniColFarLeft);

    const miniColFarRight = createColumn(4, false);
    miniColFarRight.scale.set(0.4, 0.4, 0.4);
    miniColFarRight.position.set(1.2, 0.4, 0);
    islandFar.add(miniColFarRight);

    // Triangular Pediment on top of far mini pillars
    const architraveGeo = new THREE.BoxGeometry(3.2, 0.2, 0.8);
    const architrave = new THREE.Mesh(architraveGeo, marbleMaterial);
    architrave.position.set(0, 2.05, 0);
    islandFar.add(architrave);

    const pedimentGeo = new THREE.ConeGeometry(1.8, 0.6, 4);
    const pediment = new THREE.Mesh(pedimentGeo, marbleMaterial);
    pediment.rotation.y = Math.PI / 4;
    pediment.scale.set(1, 1, 0.45);
    pediment.position.set(0, 2.45, 0);
    islandFar.add(pediment);

    // 4. Stylized Greek Deity Statue (Zeus / Apollo hybrid)
    const statueGroup = new THREE.Group();
    statueGroup.position.set(0, -2.5, -16);
    worldGroup.add(statueGroup);

    // Statue Steps / Pedestal
    const step1 = new THREE.Mesh(new THREE.BoxGeometry(4.5, 0.4, 4.5), marbleMaterial);
    step1.position.y = 0.2;
    statueGroup.add(step1);

    const step2 = new THREE.Mesh(new THREE.BoxGeometry(3.5, 0.4, 3.5), marbleMaterial);
    step2.position.y = 0.6;
    statueGroup.add(step2);

    const baseDie = new THREE.Mesh(new THREE.BoxGeometry(2.4, 1.4, 2.4), marbleMaterial);
    baseDie.position.y = 1.5;
    statueGroup.add(baseDie);

    // Large marble throne
    const throneGroup = new THREE.Group();
    throneGroup.position.set(0, 2.2, 0);

    const seat = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.3, 1.6), marbleMaterial);
    seat.position.y = 0.55;
    throneGroup.add(seat);

    const backrest = new THREE.Mesh(new THREE.BoxGeometry(1.8, 2.8, 0.3), marbleMaterial);
    backrest.position.set(0, 1.95, -0.65);
    throneGroup.add(backrest);

    const armLeft = new THREE.Mesh(new THREE.BoxGeometry(0.25, 1.0, 1.4), marbleMaterial);
    armLeft.position.set(-0.9, 1.0, 0.1);
    throneGroup.add(armLeft);

    const armRight = new THREE.Mesh(new THREE.BoxGeometry(0.25, 1.0, 1.4), marbleMaterial);
    armRight.position.set(0.9, 1.0, 0.1);
    throneGroup.add(armRight);

    statueGroup.add(throneGroup);

    // The God Figure (highly stylized, architectural marble figure)
    const figureGroup = new THREE.Group();
    figureGroup.position.set(0, 2.9, 0.1);

    // Torso (capsule structure)
    const torso = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.55, 1.5, 12), marbleMaterial);
    torso.position.y = 0.75;
    figureGroup.add(torso);

    // Shoulders
    const shoulders = new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.3, 0.6), marbleMaterial);
    shoulders.position.y = 1.4;
    figureGroup.add(shoulders);

    // Head
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.32, 12, 12), marbleMaterial);
    head.position.y = 1.85;
    figureGroup.add(head);

    // Laurel Wreath
    const wreathGeo = new THREE.TorusGeometry(0.26, 0.05, 8, 16);
    const wreath = new THREE.Mesh(wreathGeo, goldenMaterial);
    wreath.rotation.x = Math.PI / 2 - 0.2;
    wreath.position.set(0, 1.95, 0.03);
    figureGroup.add(wreath);

    // Legs (draped in classical robes)
    const legLeft = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.38, 1.2, 10), marbleMaterial);
    legLeft.rotation.x = Math.PI / 2;
    legLeft.position.set(-0.4, 0.3, 0.5);
    figureGroup.add(legLeft);

    const legRight = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.38, 1.2, 10), marbleMaterial);
    legRight.rotation.x = Math.PI / 2;
    legRight.position.set(0.4, 0.3, 0.5);
    figureGroup.add(legRight);

    // Draped cloak (toga) sweep around shoulders and lap
    const cloakGeo = new THREE.TorusGeometry(0.65, 0.15, 8, 12);
    const cloak = new THREE.Mesh(cloakGeo, marbleMaterial);
    cloak.position.set(0, 0.8, 0.25);
    cloak.scale.set(1.1, 0.7, 0.9);
    figureGroup.add(cloak);

    // Left Arm resting on armrest
    const armLeftMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.15, 1.1, 8), marbleMaterial);
    armLeftMesh.rotation.x = Math.PI / 4;
    armLeftMesh.position.set(-0.95, 1.0, 0.3);
    figureGroup.add(armLeftMesh);

    // Right Arm raised holding the golden scepter
    const armRightUpper = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.18, 0.8, 8), marbleMaterial);
    armRightUpper.rotation.z = -Math.PI / 6;
    armRightUpper.position.set(0.85, 1.2, 0.2);
    figureGroup.add(armRightUpper);

    const armRightFore = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.12, 0.8, 8), marbleMaterial);
    armRightFore.rotation.x = -Math.PI / 4;
    armRightFore.position.set(1.05, 1.5, 0.5);
    figureGroup.add(armRightFore);

    // Golden Staff / Thunderbolt
    const staffGroup = new THREE.Group();
    staffGroup.position.set(1.1, 1.9, 0.7);
    staffGroup.rotation.x = -0.15;
    staffGroup.rotation.z = 0.1;

    const staffShaftGeo = new THREE.CylinderGeometry(0.04, 0.04, 4.2, 8);
    const staffShaft = new THREE.Mesh(staffShaftGeo, goldenMaterial);
    staffGroup.add(staffShaft);

    // Glowing staff tips
    const staffTipTopGeo = new THREE.ConeGeometry(0.15, 0.4, 4);
    const staffTipTop = new THREE.Mesh(staffTipTopGeo, goldenMaterial);
    staffTipTop.position.y = 2.2;
    staffGroup.add(staffTipTop);

    const staffTipBottomGeo = new THREE.ConeGeometry(0.12, 0.3, 4);
    const staffTipBottom = new THREE.Mesh(staffTipBottomGeo, goldenMaterial);
    staffTipBottom.position.y = -2.25;
    staffTipBottom.rotation.x = Math.PI;
    staffGroup.add(staffTipBottom);

    // Glowing crystal sphere at the staff head
    const crystalOrbGeo = new THREE.SphereGeometry(0.2, 8, 8);
    const crystalOrb = new THREE.Mesh(crystalOrbGeo, glowingGoldMaterial);
    crystalOrb.position.y = 1.9;
    staffGroup.add(crystalOrb);

    figureGroup.add(staffGroup);
    statueGroup.add(figureGroup);

    // 5. Celestial Ring with Canvas-drawn Greek Letters
    const createCelestialRingTexture = () => {
      const canvas = document.createElement("canvas");
      canvas.width = 512;
      canvas.height = 512;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        // Clear transparent
        ctx.clearRect(0, 0, 512, 512);

        // Draw outer ring
        ctx.strokeStyle = "rgba(212, 175, 55, 0.75)"; // Golden
        ctx.lineWidth = 6;
        ctx.beginPath();
        ctx.arc(256, 256, 230, 0, Math.PI * 2);
        ctx.stroke();

        // Draw inner concentric ring
        ctx.strokeStyle = "rgba(212, 175, 55, 0.35)";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(256, 256, 210, 0, Math.PI * 2);
        ctx.stroke();

        // Draw Greek letters along the ring
        const letters = ["Ω", "Φ", "Σ", "Δ", "Ψ", "Θ", "Λ", "Ξ", "Π", "Γ"];
        ctx.fillStyle = "rgba(230, 184, 0, 0.95)";
        ctx.font = "bold 32px serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        letters.forEach((letter, i) => {
          const angle = (i / letters.length) * Math.PI * 2;
          const x = 256 + Math.cos(angle) * 220;
          const y = 256 + Math.sin(angle) * 220;

          ctx.save();
          ctx.translate(x, y);
          ctx.rotate(angle + Math.PI / 2); // Align perpendicular to radius
          ctx.fillText(letter, 0, 0);
          ctx.restore();
        });
      }
      return new THREE.CanvasTexture(canvas);
    };

    const celestialRingGroup = new THREE.Group();
    celestialRingGroup.position.set(0, 4.5, -17.5);
    worldGroup.add(celestialRingGroup);

    const ringTexture = createCelestialRingTexture();
    const ringPlateGeo = new THREE.PlaneGeometry(11, 11);
    const ringPlateMat = new THREE.MeshBasicMaterial({
      map: ringTexture,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
      depthWrite: false,
    });

    const celestialRing1 = new THREE.Mesh(ringPlateGeo, ringPlateMat);
    celestialRingGroup.add(celestialRing1);

    // Inner secondary ring rotating opposite direction
    const createInnerCelestialRingTexture = () => {
      const canvas = document.createElement("canvas");
      canvas.width = 512;
      canvas.height = 512;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, 512, 512);
        ctx.strokeStyle = "rgba(212, 175, 55, 0.4)";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(256, 256, 175, 0, Math.PI * 2);
        ctx.stroke();

        ctx.strokeStyle = "rgba(212, 175, 55, 0.15)";
        ctx.setLineDash([8, 12]);
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(256, 256, 155, 0, Math.PI * 2);
        ctx.stroke();
      }
      return new THREE.CanvasTexture(canvas);
    };

    const innerRingTexture = createInnerCelestialRingTexture();
    const innerRingMat = new THREE.MeshBasicMaterial({
      map: innerRingTexture,
      transparent: true,
      opacity: 0.5,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
    const celestialRing2 = new THREE.Mesh(ringPlateGeo, innerRingMat);
    celestialRing2.scale.set(0.76, 0.76, 1);
    celestialRingGroup.add(celestialRing2);

    // 6. Ambient Light Rays (God Rays)
    const raysGroup = new THREE.Group();
    raysGroup.position.set(-2, 12, -26);
    raysGroup.rotation.z = -Math.PI / 10; // angled down-right
    worldGroup.add(raysGroup);

    const createRayMesh = (radiusTop: number, radiusBottom: number, height: number) => {
      const rayGeo = new THREE.CylinderGeometry(radiusTop, radiusBottom, height, 8, 1, true);
      
      // Material with gradient simulation via soft glow blending
      const rayMat = new THREE.MeshBasicMaterial({
        color: 0xfff6dd,
        transparent: true,
        opacity: 0.12,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
        depthWrite: false,
      });

      return new THREE.Mesh(rayGeo, rayMat);
    };

    const ray1 = createRayMesh(0.5, 2.5, 25);
    ray1.position.set(-3, 0, 0);
    raysGroup.add(ray1);

    const ray2 = createRayMesh(0.3, 1.8, 20);
    ray2.position.set(2, 2, -2);
    raysGroup.add(ray2);

    const ray3 = createRayMesh(0.8, 3.5, 30);
    ray3.position.set(6, -2, -5);
    raysGroup.add(ray3);

    // 7. Soft Volumetric Cloud Cards
    const createCloudTexture = () => {
      const canvas = document.createElement("canvas");
      canvas.width = 256;
      canvas.height = 256;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, 256, 256);
        // Radial gradient representing soft puffy mist
        const grad = ctx.createRadialGradient(128, 128, 0, 128, 128, 120);
        grad.addColorStop(0, "rgba(251, 249, 243, 0.6)"); // Putty color cloud
        grad.addColorStop(0.3, "rgba(251, 249, 243, 0.45)");
        grad.addColorStop(0.7, "rgba(251, 249, 243, 0.12)");
        grad.addColorStop(1, "rgba(251, 249, 243, 0)");
        
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 256, 256);
      }
      return new THREE.CanvasTexture(canvas);
    };

    const cloudTexture = createCloudTexture();
    const cloudMat = new THREE.MeshBasicMaterial({
      map: cloudTexture,
      transparent: true,
      opacity: isMobile ? 0.35 : 0.6,
      depthWrite: false,
      blending: THREE.NormalBlending,
    });

    const clouds: THREE.Mesh[] = [];
    const cloudCount = isMobile ? 6 : 14;

    for (let i = 0; i < cloudCount; i++) {
      const size = 10 + Math.random() * 12;
      const cloudGeo = new THREE.PlaneGeometry(size, size);
      const cloudMesh = new THREE.Mesh(cloudGeo, cloudMat);
      
      // Scatter throughout the depth of the ruins
      cloudMesh.position.set(
        (Math.random() - 0.5) * 24, // x
        -1 + Math.random() * 8,     // y
        5 - Math.random() * 32      // z
      );
      cloudMesh.rotation.z = Math.random() * Math.PI * 2;
      
      // Store custom speeds inside the mesh userData
      cloudMesh.userData = {
        driftSpeed: 0.005 + Math.random() * 0.008,
        rotSpeed: (Math.random() - 0.5) * 0.001,
        yAmplitude: 0.2 + Math.random() * 0.3,
        ySpeed: 0.2 + Math.random() * 0.4,
        yBase: cloudMesh.position.y,
        xLimit: 15,
      };

      worldGroup.add(cloudMesh);
      clouds.push(cloudMesh);
    }

    // 8. Golden Sparkle Particles
    const particleCount = isMobile ? 120 : 350;
    const particleGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const particleSpeeds = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      // Spawn in a box surrounding the columns
      positions[i * 3] = (Math.random() - 0.5) * 20; // x
      positions[i * 3 + 1] = -3 + Math.random() * 18; // y
      positions[i * 3 + 2] = 10 - Math.random() * 35; // z

      particleSpeeds[i] = 0.015 + Math.random() * 0.025;
    }

    particleGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    // Custom circle dot texture for particles
    const createParticleTexture = () => {
      const canvas = document.createElement("canvas");
      canvas.width = 64;
      canvas.height = 64;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, 64, 64);
        const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 30);
        grad.addColorStop(0, "rgba(255, 223, 110, 1.0)"); // Core gold
        grad.addColorStop(0.3, "rgba(230, 184, 0, 0.8)");
        grad.addColorStop(0.7, "rgba(230, 184, 0, 0.15)");
        grad.addColorStop(1, "rgba(230, 184, 0, 0)");
        
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(32, 32, 30, 0, Math.PI * 2);
        ctx.fill();
      }
      return new THREE.CanvasTexture(canvas);
    };

    const particleTexture = createParticleTexture();
    const particleMaterial = new THREE.PointsMaterial({
      size: isMobile ? 0.22 : 0.35,
      map: particleTexture,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const particleSystem = new THREE.Points(particleGeometry, particleMaterial);
    worldGroup.add(particleSystem);

    // --- INTERACTIVE EVENT LISTENERS ---
    const handleScroll = () => {
      targetScrollYRef.current = window.scrollY;
    };

    const handleMouseMove = (e: MouseEvent) => {
      const currentWidth = window.innerWidth;
      const currentHeight = window.innerHeight;
      targetMouseXRef.current = (e.clientX / currentWidth - 0.5) * 2.0; // range [-1.0, 1.0]
      targetMouseYRef.current = (e.clientY / currentHeight - 0.5) * 2.0;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    if (!isMobile) {
      window.addEventListener("mousemove", handleMouseMove);
    }

    // --- SUSPENSION & ACCESSIBILITY CONTROLLER ---
    const targetLookAt = new THREE.Vector3();
    const clock = new THREE.Clock();

    // Respect user preferred motion settings
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let prefersReducedMotion = mediaQuery.matches;

    // --- ANIMATION LOOP ---
    let animationFrameId = 0;

    const startLoop = () => {
      if (isLoopRunning.current) return;
      if (document.visibilityState !== "visible" || !isActiveRef.current) return;

      isLoopRunning.current = true;
      clock.getDelta(); // reset clock delta to prevent jump offsets
      
      if (prefersReducedMotion) {
        renderer.render(scene, camera);
        isLoopRunning.current = false;
        return;
      }

      animate();
    };

    const stopLoop = () => {
      isLoopRunning.current = false;
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = 0;
      }
    };

    startLoopRef.current = startLoop;
    stopLoopRef.current = stopLoop;

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        if (isActiveRef.current) {
          startLoop();
        }
      } else {
        stopLoop();
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    const handleMotionQueryChange = (e: MediaQueryListEvent) => {
      prefersReducedMotion = e.matches;
      if (prefersReducedMotion) {
        stopLoop();
        renderer.render(scene, camera);
      } else {
        startLoop();
      }
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handleMotionQueryChange);
    }

    const animate = () => {
      if (document.visibilityState !== "visible" || !isActiveRef.current) {
        isLoopRunning.current = false;
        return;
      }

      if (prefersReducedMotion) {
        renderer.render(scene, camera);
        isLoopRunning.current = false;
        return;
      }

      animationFrameId = requestAnimationFrame(animate);

      // Get frame delta time safely
      const delta = Math.min(clock.getDelta(), 0.1);
      const time = clock.elapsedTime;

      // Lerp Scroll Parallax using delta-time based exponential decay
      scrollYRef.current += (targetScrollYRef.current - scrollYRef.current) * (1 - Math.exp(-4.5 * delta));
      // Lerp Mouse Parallax using delta-time based exponential decay
      mouseXRef.current += (targetMouseXRef.current - mouseXRef.current) * (1 - Math.exp(-3.5 * delta));
      mouseYRef.current += (targetMouseYRef.current - mouseYRef.current) * (1 - Math.exp(-3.5 * delta));

      // Camera positioning
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const scrollPercent = scrollYRef.current / maxScroll;

      // Base camera positioning
      camera.position.y = 3 - scrollPercent * 4.5 + mouseYRef.current * 0.5;
      camera.position.x = mouseXRef.current * 1.5;
      
      // Look slightly at the statue pedestal
      targetLookAt.set(0, 0.5 - scrollPercent * 1.5, -12);
      camera.lookAt(targetLookAt);

      // Slow bobbing of floating islands
      floatingIslands.forEach((island, index) => {
        const speed = 0.45 + index * 0.15;
        const amplitude = 0.12 + index * 0.04;
        island.position.y = island.userData.yBase + Math.sin(time * speed + index) * amplitude;
        
        // Very slow drift rotation
        island.rotation.y = Math.sin(time * 0.04 + index) * 0.05;
      });

      // Slowly rotate celestial ring plates in opposite directions
      celestialRing1.rotation.z = time * 0.025;
      celestialRing2.rotation.z = -time * 0.038;

      // Rotate staff crystal glow
      crystalOrb.scale.setScalar(1.0 + Math.sin(time * 3) * 0.1);

      // Animate drifting cloud planes
      clouds.forEach((cloud) => {
        const data = cloud.userData;
        cloud.position.x += data.driftSpeed * 60 * delta;
        cloud.rotation.z += data.rotSpeed * 60 * delta;
        
        // Slow float bobbing
        cloud.position.y = data.yBase + Math.sin(time * data.ySpeed) * data.yAmplitude;

        // Wrap around boundary bounds
        if (cloud.position.x > data.xLimit) {
          cloud.position.x = -data.xLimit;
        }
      });

      // Animate golden particles rising
      const pos = particleGeometry.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        // Vertical rising drift
        pos[i * 3 + 1] += particleSpeeds[i] * 90 * delta; // y speed
        
        // Slight horizontal sway
        pos[i * 3] += Math.sin(time * 0.6 + i) * 0.18 * delta;

        // Wrap around bottom if too high
        if (pos[i * 3 + 1] > 18) {
          pos[i * 3 + 1] = -4;
          pos[i * 3] = (Math.random() - 0.5) * 20;
        }
      }
      particleGeometry.attributes.position.needsUpdate = true;

      // Slowly pulse the divine spotlight intensity
      divineLight.intensity = 2.5 + Math.sin(time * 1.5) * 0.5;

      // Subtly rotate the main statue pedestal to create responsive depth
      statueGroup.rotation.y = Math.sin(time * 0.08) * 0.03 + mouseXRef.current * 0.05;

      renderer.render(scene, camera);
    };

    // Kickstart the loop
    startLoop();

    // --- RESIZE HANDLER ---
    const handleResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      
      camera.aspect = w / h;
      camera.updateProjectionMatrix();

      renderer.setSize(w, h);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.0 : 1.5));

      // Force a single render check if the loop is currently paused
      if (!isLoopRunning.current) {
        renderer.render(scene, camera);
      }
    };

    window.addEventListener("resize", handleResize);

    // --- CLEANUP ---
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener("change", handleMotionQueryChange);
      }
      stopLoop();
      startLoopRef.current = null;
      stopLoopRef.current = null;
      
      // Traverse scene hierarchy to release WebGL assets on cleanup
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh || object instanceof THREE.Points || object instanceof THREE.Line) {
          if (object.geometry) {
            object.geometry.dispose();
          }
          if (object.material) {
            if (Array.isArray(object.material)) {
              object.material.forEach((mat) => {
                mat.dispose();
                if (mat.map) mat.map.dispose();
              });
            } else {
              object.material.dispose();
              if (object.material.map) object.material.map.dispose();
            }
          }
        }
      });

      // Dispose top-level materials & geometries & textures explicitly
      marbleMaterial.dispose();
      goldenMaterial.dispose();
      glowingGoldMaterial.dispose();
      ringTexture.dispose();
      ringPlateMat.dispose();
      innerRingTexture.dispose();
      innerRingMat.dispose();
      cloudTexture.dispose();
      cloudMat.dispose();
      particleTexture.dispose();
      particleMaterial.dispose();
      
      scene.clear();
      
      if (renderer && renderer.domElement) {
        renderer.dispose();
        if (container.contains(renderer.domElement)) {
          container.removeChild(renderer.domElement);
        }
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none w-full h-full"
      style={{
        zIndex: 0,
        overflow: "hidden",
        backgroundColor: "transparent",
        opacity: isActive ? 0.45 : 0, // 45% visual intensity on Gallery page, hidden elsewhere
        transition: "opacity 0.4s ease-in-out",
      }}
    />
  );
});

