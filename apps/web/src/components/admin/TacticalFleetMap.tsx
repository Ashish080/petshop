'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Navigation, Zap, Compass, Activity, Target, ShieldAlert, Cpu } from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';

interface TacticalFleetMapProps {
    fleet?: any[];
}

export function TacticalFleetMap({ fleet = [] }: TacticalFleetMapProps) {
    const activeRiders = useMemo(() => fleet.filter(r => r.status === 'active' || r.status === 'online'), [fleet]);
    
    return (
        <div className="relative w-full h-[600px] bg-[#050510] rounded-[48px] border border-white/5 overflow-hidden group shadow-2xl backdrop-blur-3xl">
            {/* 1. AGGRESSIVE 3D PERSPECTIVE BASE */}
            <div className="absolute inset-0 preserve-3d" style={{ perspective: '1200px' }}>
                <div 
                    className="absolute inset-0 border border-white/5 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]"
                    style={{ 
                        transform: 'rotateX(60deg) scale(1.8) translateY(-150px)', 
                        transformOrigin: 'center bottom',
                        maskImage: 'radial-gradient(circle at center, black 40%, transparent 90%)'
                    }}
                />
            </div>

            {/* 2. PREDICTIVE HEATMAP LAYER */}
            <div className="absolute inset-0 pointer-events-none opacity-30 mix-blend-screen overflow-hidden">
                <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-[#F04438] blur-[120px] rounded-full animate-pulse" />
                <div className="absolute bottom-1/3 right-1/4 w-[500px] h-[500px] bg-brand blur-[140px] rounded-full animate-pulse" style={{ animationDelay: '1.5s' }} />
                <div className="absolute top-1/2 left-2/3 w-64 h-64 bg-brand/40 blur-[100px] rounded-full animate-pulse px-10" style={{ animationDelay: '3s' }} />
            </div>

            {/* 3. RADAR SCANNER SWEEP */}
            <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 pointer-events-none z-10 origin-center scale-[1.5]"
                style={{ 
                    background: 'conic-gradient(from 0deg, rgba(255,107,0,0.1) 0deg, transparent 45deg)',
                }}
            />

            {/* 4. CROSSHAIR & SECTOR OVERLAY */}
            <div className="absolute inset-0 flex items-center justify-center opacity-[0.05] pointer-events-none z-20">
                <div className="w-px h-full bg-white" />
                <div className="h-px w-full bg-white absolute" />
                <div className="w-[300px] h-[300px] border border-white rounded-full absolute" />
                <div className="w-[600px] h-[600px] border border-white rounded-full absolute" />
            </div>

            {/* 5. LIVE RIDER NODES */}
            <div className="absolute inset-0 z-30">
                <AnimatePresence>
                    {activeRiders.map((rider, i) => {
                        const x = ((rider.location?.lng || 80.94) - 80.90) * 10000 % 100;
                        const y = ((rider.location?.lat || 26.84) - 26.80) * 10000 % 100;

                        return (
                            <motion.div 
                                key={rider._id || rider.id}
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1, left: `${x}%`, top: `${y}%` }}
                                exit={{ scale: 0, opacity: 0 }}
                                className="absolute -translate-x-1/2 -translate-y-1/2 group cursor-pointer"
                            >
                                {/* Glow Halo */}
                                <div className="absolute inset-0 w-12 h-12 -ml-5 -mt-5 bg-brand/20 blur-2xl rounded-full group-hover:bg-brand/40 transition-all scale-0 group-hover:scale-100 duration-500" />
                                
                                <div className="relative">
                                    {/* The Asset Marker */}
                                    <div className="w-3 h-3 bg-brand rounded-full border-2 border-white shadow-[0_0_20px_#FF6B00] relative z-10 group-hover:scale-125 transition-transform">
                                        <div className="absolute inset-0 bg-brand rounded-full animate-ping opacity-75" />
                                    </div>

                                    {/* Tactical Data Label */}
                                    <div className="absolute top-6 left-6 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all translate-x-2 pointer-events-none">
                                        <div className="glass px-5 py-3 border border-brand/40 rounded-2xl flex items-center gap-4 backdrop-blur-3xl shadow-2xl relative overflow-hidden">
                                            <div className="absolute top-0 left-0 w-full h-1 bg-brand/20" />
                                            <div className="w-10 h-10 rounded-xl bg-brand/10 border border-brand/20 flex items-center justify-center">
                                                <Navigation size={16} className="text-brand rotate-45" />
                                            </div>
                                            <div>
                                                <p className="text-[11px] font-black text-white italic uppercase tracking-tighter leading-none">{rider.name}</p>
                                                <p className="text-[9px] font-bold text-white/30 uppercase mt-2 tracking-widest italic flex items-center gap-2">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                                                    SIGNAL REQUISITIONED
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Telemetry Tag */}
                                    <div className="absolute -top-12 -left-4 opacity-20 pointer-events-none group-hover:opacity-40 transition-opacity">
                                        <div className="text-[9px] font-mono text-white tracking-[0.2em] italic uppercase">NODE::{ (rider._id || rider.id).slice(-4).toUpperCase() }</div>
                                        <div className="h-px w-8 bg-white/20 mt-1" />
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>

            {/* 6. STRATEGIC OVERLAY (Top Left) */}
            <div className="absolute top-12 left-12 space-y-6 z-40">
                <div className="p-10 glass rounded-[40px] border border-white/5 bg-[#050510]/60 backdrop-blur-3xl shadow-2xl min-w-[300px]">
                    <div className="flex items-center gap-4 mb-10">
                        <div className="p-3 rounded-2xl bg-brand/10 border border-brand/20 shadow-inner">
                            <Activity size={22} className="text-brand animate-pulse" />
                        </div>
                        <div>
                            <h4 className="text-[11px] font-black uppercase tracking-[0.4em] text-white italic">Asset Flux Control</h4>
                            <p className="text-[9px] font-bold text-success uppercase tracking-widest mt-2 italic flex items-center gap-2">
                                <div className="w-1.5 h-1.5 bg-success rounded-full" />
                                All Nodes Optimized
                            </p>
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-10 mb-10">
                        <div className="group cursor-default">
                            <p className="text-4xl font-black text-white italic tracking-tighter leading-none group-hover:text-brand transition-colors">{activeRiders.length}</p>
                            <p className="text-[10px] font-black text-white/20 uppercase mt-4 tracking-widest italic">Live Signals</p>
                        </div>
                        <div className="group cursor-default">
                            <p className="text-4xl font-black text-brand italic tracking-tighter leading-none">04</p>
                            <p className="text-[10px] font-black text-white/20 uppercase mt-4 tracking-widest italic">Critical Loads</p>
                        </div>
                    </div>

                    <div className="py-4 px-6 bg-white/[0.03] border border-white/5 rounded-2xl flex items-center justify-between">
                         <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 italic">System Guard</span>
                         <div className="flex items-center gap-1.5">
                            <div className="w-1.5 h-4 bg-brand rounded-full" />
                            <div className="w-1.5 h-4 bg-brand rounded-full" />
                            <div className="w-1.5 h-4 bg-brand rounded-full opacity-30" />
                         </div>
                    </div>
                </div>
            </div>

            {/* 7. WATERMARKS & SCALES */}
            <div className="absolute bottom-12 right-12 text-right opacity-30 z-40">
                <p className="text-[11px] font-black text-white uppercase italic tracking-[0.3em]">Telemetry Command 5.0</p>
                <p className="text-[9px] font-bold text-white/30 uppercase tracking-[0.5em] mt-3 italic">Autonomous Grid Verification</p>
            </div>

            <div className="absolute bottom-12 left-12 flex items-center gap-8 z-40 opacity-40">
                {['GEO-1', 'UNIT-4', 'V-SCAN'].map((label) => (
                    <div key={label} className="flex flex-col gap-2">
                        <div className="text-[9px] font-black text-white uppercase tracking-[0.4em] italic leading-none">{label}</div>
                        <div className="w-12 h-1 bg-white/10 rounded-full overflow-hidden">
                            <motion.div 
                                animate={{ x: ['-100%', '100%'] }}
                                transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                                className="w-1/2 h-full bg-brand"
                            />
                        </div>
                    </div>
                ))}
            </div>

            {/* 8. GRID CROSSING LINE */}
            <div className="absolute bottom-0 left-0 w-full h-1 bg-white/5 overflow-hidden z-20">
                <motion.div 
                    animate={{ x: ['-100%', '100%'] }}
                    transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                    className="w-[40%] h-full bg-gradient-to-r from-transparent via-brand to-transparent"
                />
            </div>
        </div>
    );
}
