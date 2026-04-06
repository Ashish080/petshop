'use client';

import { motion } from 'framer-motion';
import { MapPin, Navigation, Zap, Compass, Activity, Target } from 'lucide-react';
import { useState, useEffect } from 'react';

const SECTORS = [
    { id: 'S1', name: 'Gomti Nagar', x: '70%', y: '40%', missions: 5 },
    { id: 'S2', name: 'Hazratganj', x: '45%', y: '35%', missions: 8 },
    { id: 'S3', name: 'Indira Nagar', x: '65%', y: '25%', missions: 3 },
    { id: 'S4', name: 'Alambagh', x: '30%', y: '65%', missions: 6 },
    { id: 'S5', name: 'Ashiyana', x: '40%', y: '80%', missions: 4 },
];

export function TacticalFleetMap() {
    const [scrolled, setScrolled] = useState(0);

    return (
        <div className="relative w-full h-[600px] bg-[#050510] rounded-[40px] border border-white/5 overflow-hidden group shadow-2xl">
            {/* Grid Overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
            
            {/* Radar Sweep Effect */}
            <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-tr from-brand/10 via-transparent to-transparent rounded-full pointer-events-none origin-center"
                style={{ borderRight: '1px solid rgba(255,107,0,0.1)' }}
            />

            {/* Simulated Lucknow Hub Map (Abstract SVG) */}
            <div className="absolute inset-20 opacity-20 pointer-events-none">
                <svg viewBox="0 0 100 100" className="w-full h-full text-white/5">
                    <path d="M10,10 L90,10 L90,90 L10,90 Z" fill="none" stroke="currentColor" strokeWidth="0.5" />
                    <path d="M50,10 L50,90 M10,50 L90,50" fill="none" stroke="currentColor" strokeWidth="0.5" />
                    <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 2" />
                    {/* Abstract Road Network */}
                    <path d="M20,20 Q50,40 80,20 M10,60 L90,40 M40,10 Q60,50 40,90" fill="none" stroke="white" strokeWidth="0.2" />
                </svg>
            </div>

            {/* Interactive Sector Nodes */}
            {SECTORS.map((sector) => (
                <motion.div 
                    key={sector.id}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    style={{ left: sector.x, top: sector.y }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-2 group/node"
                >
                    <div className="relative">
                        <div className="w-4 h-4 bg-brand rounded-full shadow-[0_0_20px_rgba(255,107,0,0.5)] border-2 border-white/20 group-hover/node:scale-125 transition-transform" />
                        <div className="absolute -inset-2 bg-brand/20 rounded-full animate-ping" />
                    </div>
                    
                    <div className="px-3 py-1.5 glass rounded-xl border border-white/10 opacity-0 group-hover/node:opacity-100 transition-all -translate-y-2 group-hover/node:translate-y-0 backdrop-blur-2xl">
                        <p className="text-[9px] font-black uppercase text-white tracking-widest">{sector.name}</p>
                        <p className="text-[8px] font-bold text-brand mt-0.5 uppercase tracking-tighter italic">{sector.missions} Priority Missions</p>
                    </div>
                </motion.div>
            ))}

            {/* Strategic Overlays (Top Left) */}
            <div className="absolute top-8 left-8 space-y-4">
                <div className="p-5 glass rounded-3xl border border-white/10 bg-[#0A0A10]/60 backdrop-blur-3xl shadow-2xl">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 rounded-lg bg-brand/10 border border-brand/20">
                            <Navigation size={16} className="text-brand" />
                        </div>
                        <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-white">Lucknow Ops Hub</h4>
                    </div>
                    <div className="grid grid-cols-2 gap-8">
                        <div>
                            <p className="text-2xl font-black text-white italic tracking-tighter leading-none">1.2km</p>
                            <p className="text-[8px] font-bold text-white/30 uppercase mt-2 tracking-widest">Avg ETA</p>
                        </div>
                        <div>
                            <p className="text-2xl font-black text-success italic tracking-tighter leading-none">99.8%</p>
                            <p className="text-[8px] font-bold text-white/30 uppercase mt-2 tracking-widest">Routing Acc.</p>
                        </div>
                    </div>
                </div>

                <div className="p-4 glass rounded-2xl border border-white/5 flex items-center gap-4 bg-white/[0.02]">
                    <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
                    <span className="text-[9px] font-black uppercase tracking-[0.4em] text-white/40 italic">Live Telemetry Synchronized</span>
                </div>
            </div>

            {/* Tactical Grid Compass (Bottom Right) */}
            <div className="absolute bottom-8 right-8">
                <div className="w-20 h-20 rounded-full border border-white/10 flex items-center justify-center relative rotate-45">
                    <Compass size={24} className="text-white/20" />
                    <div className="absolute inset-0 border-t-2 border-brand/30 rounded-full animate-spin-slow" />
                </div>
            </div>

            {/* Operational Pulse Line */}
            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-brand/20 to-transparent overflow-hidden">
                <motion.div 
                    animate={{ x: ['-100%', '100%'] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    className="w-1/2 h-full bg-brand shadow-[0_0_20px_rgba(255,107,0,1)]"
                />
            </div>
        </div>
    );
}
