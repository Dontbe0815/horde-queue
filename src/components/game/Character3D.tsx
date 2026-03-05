'use client';

import { Suspense, useRef, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useFBX, OrbitControls, Center } from '@react-three/drei';
import * as THREE from 'three';

// FBX Model component with animation support
function FBXModel({ url, baseScale }: { url: string; baseScale: number }) {
  const fbx = useFBX(url);
  const mixerRef = useRef<THREE.AnimationMixer | null>(null);
  const groupRef = useRef<THREE.Group>(null);
  const [scale, setScale] = useState(baseScale);
  
  useEffect(() => {
    if (!fbx) return;
    
    // Calculate optimal scale based on bounding box
    const box = new THREE.Box3().setFromObject(fbx);
    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);
    
    // We want the model to fit in a 2-unit tall space
    const optimalScale = 2 / maxDim;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setScale(optimalScale);
    
    console.log('=== FBX Model Info ===');
    console.log('Model dimensions:', size);
    console.log('Max dimension:', maxDim);
    console.log('Calculated scale:', optimalScale);
    console.log('Animations:', fbx.animations?.length || 0);
    
    // Log animation details
    if (fbx.animations && fbx.animations.length > 0) {
      fbx.animations.forEach((anim, i) => {
        console.log(`Animation ${i}:`, anim.name || 'unnamed', '- Duration:', anim.duration);
      });
    }
    
    // Setup animation mixer
    mixerRef.current = new THREE.AnimationMixer(fbx);
    
    // Play all animations
    if (fbx.animations && fbx.animations.length > 0) {
      fbx.animations.forEach((clip) => {
        const action = mixerRef.current!.clipAction(clip);
        action.reset();
        action.setLoop(THREE.LoopRepeat, Infinity);
        action.play();
        console.log('Playing animation:', clip.name || 'unnamed');
      });
    } else {
      console.warn('No animations found in FBX file');
    }
    
    return () => {
      if (mixerRef.current) {
        mixerRef.current.stopAllAction();
        mixerRef.current = null;
      }
    };
  }, [fbx]);
  
  // Update animation mixer every frame
  useFrame((state, delta) => {
    if (mixerRef.current) {
      mixerRef.current.update(delta);
    }
    
    // Optional: Add subtle idle rotation
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.1;
    }
  });
  
  return (
    <group ref={groupRef}>
      <primitive 
        object={fbx} 
        scale={scale}
        position={[0, 0, 0]}
      />
    </group>
  );
}

// Fallback component while loading
function LoadingFallback() {
  return (
    <mesh position={[0, 1, 0]}>
      <capsuleGeometry args={[0.3, 1.2, 8, 16]} />
      <meshStandardMaterial color="#8C1616" />
    </mesh>
  );
}

// Ground plane for reference
function Ground() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
      <circleGeometry args={[2, 32]} />
      <meshStandardMaterial color="#2a1515" transparent opacity={0.5} />
    </mesh>
  );
}

// Main 3D Character scene
function CharacterScene({ modelPath }: { modelPath: string }) {
  return (
    <Canvas
      camera={{ position: [0, 1.2, 3.5], fov: 50 }}
      style={{ background: 'transparent' }}
      shadows
      onCreated={({ gl }) => {
        gl.setClearColor(0x000000, 0);
        gl.shadowMap.enabled = true;
      }}
    >
      {/* Lighting setup for character */}
      <ambientLight intensity={0.4} />
      <directionalLight 
        position={[5, 8, 5]} 
        intensity={1.5} 
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      <directionalLight position={[-3, 4, -3]} intensity={0.5} />
      <pointLight position={[0, 3, 2]} intensity={0.6} color="#C9A335" />
      <pointLight position={[-2, 1, 2]} intensity={0.3} color="#8C1616" />
      
      {/* Ground */}
      <Ground />
      
      {/* Model */}
      <Suspense fallback={<LoadingFallback />}>
        <Center>
          <FBXModel url={modelPath} baseScale={1} />
        </Center>
      </Suspense>
      
      {/* Controls - disabled for game, but kept for debugging */}
      <OrbitControls 
        enableZoom={false} 
        enablePan={false}
        enableRotate={false}
        target={[0, 1, 0]}
      />
    </Canvas>
  );
}

// Export wrapper component
export function Character3D({ 
  modelPath = '/assets/models/DancingMaraschinoStep.fbx',
  className = ''
}: { 
  modelPath?: string;
  className?: string;
}) {
  return (
    <div className={`w-full h-full ${className}`}>
      <CharacterScene modelPath={modelPath} />
    </div>
  );
}

export default Character3D;
