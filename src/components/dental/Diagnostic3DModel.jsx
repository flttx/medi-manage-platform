import React, { Suspense, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment, ContactShadows, Float } from '@react-three/drei';
import { RefreshCcw, Box as BoxIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Tooth = ({ position, rotation, scale = 1, color = "#f8fafc" }) => (
  <mesh position={position} rotation={rotation} scale={scale}>
    <capsuleGeometry args={[0.3, 0.4, 4, 8]} />
    <meshStandardMaterial 
        color={color} 
        roughness={0.2} 
        metalness={0.1} 
    />
  </mesh>
);

const DentalArch = ({ yOffset = 0, teethCount = 14, isUpper = true }) => {
  const teeth = [];
  const radiusX = 3.5;
  const radiusY = 4.5;
  
  for (let i = 0; i < teethCount; i++) {
    const angle = (i / (teethCount - 1)) * Math.PI;
    const x = Math.cos(angle) * radiusX;
    const z = Math.sin(angle) * radiusY - 2;
    const y = yOffset;
    
    // Rotation to face inward and align with curve
    const rotation = [isUpper ? Math.PI : 0, -angle + Math.PI / 2, 0];
    
    teeth.push(
      <Tooth 
        key={i} 
        position={[x, y, z]} 
        rotation={rotation} 
        scale={0.7 + Math.random() * 0.2}
        color={isUpper ? "#f8fafc" : "#f1f5f9"} 
      />
    );
  }
  
  return (
    <group>
      {/* Arch Base / Gum visualization - semi-circle torus */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, yOffset - (isUpper ? -0.1 : 0.1), -2]}>
        <torusGeometry args={[4, 0.25, 16, 32, Math.PI]} />
        <meshStandardMaterial color="#fecaca" roughness={0.6} />
      </mesh>
      {teeth}
    </group>
  );
};

export const Diagnostic3DModel = ({ activeToothId = 36, status = 'healthy' }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="w-full h-full min-h-[500px] flex items-center justify-center bg-slate-50 relative overflow-hidden group">
        <Suspense fallback={null}>
            <Canvas shadows gl={{ antialias: true }}>
                <PerspectiveCamera makeDefault position={[10, 8, 12]} fov={40} />
                <OrbitControls 
                    enableDamping 
                    dampingFactor={0.05} 
                    minDistance={5} 
                    maxDistance={25}
                    autoRotate={!loading}
                    autoRotateSpeed={0.5}
                />
                
                <ambientLight intensity={0.8} />
                <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1.5} castShadow />
                <pointLight position={[-10, -10, -10]} intensity={1} />
                <directionalLight position={[0, 10, 0]} intensity={0.5} />
                
                <Float speed={2} rotationIntensity={0.3} floatIntensity={0.3}>
                    <group position={[0, 0, 0]} rotation={[0.1, 0, 0]}>
                        <DentalArch yOffset={1.2} isUpper={true} />
                        <DentalArch yOffset={-1.2} isUpper={false} />
                    </group>
                </Float>

                <ContactShadows 
                    position={[0, -4, 0]} 
                    opacity={0.3} 
                    scale={15} 
                    blur={2.5} 
                    far={4.5} 
                />
                
                <Environment preset="studio" />
            </Canvas>
        </Suspense>

        {/* HUD / Scanning Overlay */}
        <AnimatePresence>
            {loading && (
                <motion.div 
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8 }}
                    className="absolute inset-0 z-10 flex items-center justify-center bg-white/90 backdrop-blur-md"
                >
                    <div className="text-center">
                        <motion.div 
                            animate={{ rotate: 360 }}
                            transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                            className="w-20 h-20 rounded-[1.8rem] border-2 border-dashed border-primary/20 flex items-center justify-center mx-auto mb-6 relative"
                        >
                            <div className="absolute inset-2 rounded-[1.4rem] border border-primary/10 animate-pulse" />
                            <BoxIcon size={28} className="text-primary/40" strokeWidth={1.5} />
                        </motion.div>
                        <h3 className="text-sm font-black text-slate-800 tracking-tight mb-2">3D 数字化建模解析中</h3>
                        <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.2em] flex items-center justify-center gap-2">
                            <RefreshCcw size={10} className="animate-spin" />
                            Initializing neural rendering...
                        </p>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>

        {/* Floating tech UI elements */}
        <div className="absolute top-10 left-10 flex flex-col gap-4 pointer-events-none">
            <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Digital Impression #K-0294</span>
            </div>
            <div className="w-48 h-1 bg-slate-100/50 rounded-full overflow-hidden">
                <motion.div 
                    animate={{ x: [-192, 192] }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
                    className="w-full h-full bg-primary/20"
                />
            </div>
        </div>

        <div className="absolute top-10 right-10 flex gap-2 pointer-events-none">
            {['X-RAY', 'MODEL', 'AI'].map(tag => (
                <span key={tag} className="px-2 py-1 rounded-md bg-white/50 border border-slate-100 text-[8px] font-black text-slate-400 uppercase tracking-tighter">
                    {tag}
                </span>
            ))}
        </div>

        {/* Bottom Status UI */}
        <div className="absolute bottom-10 left-10 right-10 flex items-center justify-between pointer-events-none">
            <div className="flex gap-8">
                <div>
                    <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest mb-1">Density</p>
                    <p className="text-xs font-black text-slate-600 tabular-nums">High Res (8K)</p>
                </div>
                <div>
                    <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest mb-1">Status</p>
                    <p className="text-xs font-black text-emerald-500 tabular-nums font-mono">STABLE</p>
                </div>
            </div>
            <div className="flex items-center gap-3">
                <div className="text-right">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Points Cloud</p>
                    <p className="text-xs font-black text-slate-700 font-mono">1.28M pts</p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 shadow-lg flex items-center justify-center">
                    <div className="w-5 h-5 rounded-md border-2 border-primary/20 animate-spin" />
                </div>
            </div>
        </div>

        <div className="absolute inset-0 pointer-events-none border-[24px] border-slate-50/50" />
    </div>
  );
};
