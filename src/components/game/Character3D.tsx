'use client';

import { Suspense, useRef, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useFBX, Environment, OrbitControls, Center } from '@react-three/drei';
import * as THREE from 'three';

// FBX Model component
function FBXModel({ url, scale = 0.01 }: { url: string; scale?: number }) {
  const fbx = useFBX(url);
  const mixerRef = useRef<THREE.AnimationMixer | null>(null);
  const { scene } = useThree();
  
  useEffect(() => {
    if (fbx && fbx.animations && fbx.animations.length > 0) {
      mixerRef.current = new THREE.AnimationMixer(fbx);
      const action = mixerRef.current.clipAction(fbx.animations[0]);
      action.play();
    }
    
    return () => {
      if (mixerRef.current) {
        mixerRef.current.stopAllAction();
      }
    };
  }, [fbx]);
  
  useFrame((_, delta) => {
    if (mixerRef.current) {
      mixerRef.current.update(delta);
    }
  });
  
  // Clone and adjust the model
  const clonedScene = fbx.clone();
  
  return (
    <primitive 
      object={clonedScene} 
      scale={scale}
      rotation={[0, 0, 0]}
    />
  );
}

// Fallback component while loading
function LoadingFallback() {
  return (
    <mesh>
      <boxGeometry args={[1, 2, 1]} />
      <meshStandardMaterial color="#8C1616" wireframe />
    </mesh>
  );
}

// Error fallback
function ErrorFallback() {
  return (
    <mesh>
      <boxGeometry args={[1.5, 1.5, 1.5]} />
      <meshStandardMaterial color="#5C0A0A" />
    </mesh>
  );
}

// Main 3D Character component
function CharacterScene({ modelPath, scale = 0.01 }: { modelPath: string; scale?: number }) {
  const [hasError, setHasError] = useState(false);
  
  return (
    <Canvas
      camera={{ position: [0, 1.5, 4], fov: 50 }}
      style={{ background: 'transparent' }}
      onError={() => setHasError(true)}
    >
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={1} castShadow />
      <directionalLight position={[-5, 3, -5]} intensity={0.3} />
      <pointLight position={[0, 3, 0]} intensity={0.5} color="#C9A335" />
      
      <Suspense fallback={<LoadingFallback />}>
        {hasError ? (
          <ErrorFallback />
        ) : (
          <Center>
            <FBXModel url={modelPath} scale={scale} />
          </Center>
        )}
      </Suspense>
      
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
  scale = 0.01,
  className = ''
}: { 
  modelPath?: string;
  scale?: number;
  className?: string;
}) {
  return (
    <div className={`w-full h-full ${className}`}>
      <CharacterScene modelPath={modelPath} scale={scale} />
    </div>
  );
}

export default Character3D;
