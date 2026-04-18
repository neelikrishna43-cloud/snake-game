/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import SnakeGame from "./components/SnakeGame";
import MusicPlayer from "./components/MusicPlayer";
import { Trophy, Activity, Radio } from "lucide-react";
import { motion } from "motion/react";

export default function App() {
  const [score, setScore] = useState(0);

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 md:p-8 overflow-hidden relative">
      {/* Background Glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-[120px] pointer-events-none" />
      
      <header className="mb-12 text-center relative z-10 w-full max-w-4xl flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="flex flex-col items-center md:items-start">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 mb-2"
          >
            <div className="p-2 bg-cyan-500/10 rounded-lg border border-cyan-500/20">
              <Activity className="w-5 h-5 text-cyan-400" />
            </div>
            <span className="text-cyan-400 font-mono text-xs uppercase tracking-[0.3em] font-bold">System Status: Active</span>
          </motion.div>
          <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">
            NEON<span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-pink-500">SNAKE</span>
          </h1>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex flex-col items-center p-6 bg-slate-900/50 backdrop-blur border border-slate-800 rounded-2xl min-w-[160px]">
            <Trophy className="w-5 h-5 text-yellow-500 mb-1" />
            <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-2">Score</span>
            <span className="text-6xl font-mono font-black text-white animate-glitch tracking-tighter">
              {score}
            </span>
          </div>
          <div className="flex flex-col items-center p-6 bg-slate-900/50 backdrop-blur border border-slate-800 rounded-2xl min-w-[160px]">
            <Radio className="w-5 h-5 text-pink-500 mb-1" />
            <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-2">Station</span>
            <span className="text-3xl font-mono font-bold text-white tracking-widest text-center">AI-01</span>
          </div>
        </div>
      </header>

      <main className="relative z-10 w-full max-w-6xl grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-12 items-start">
        <section className="flex flex-col items-center justify-center">
          <SnakeGame onScoreChange={setScore} />
          
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-[400px]">
            {["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].map((key) => (
              <div 
                key={key}
                className="p-3 bg-slate-900/50 border border-slate-800 rounded-xl flex items-center justify-center text-[10px] font-mono text-slate-500 uppercase tracking-tighter"
              >
                {key.replace("Arrow", "")}
              </div>
            ))}
          </div>
        </section>

        <aside className="flex flex-col gap-8 items-center lg:items-end h-full justify-center">
          <div className="w-full max-w-md">
            <h2 className="text-sm font-mono text-slate-500 uppercase tracking-[0.3em] mb-4 text-center lg:text-left">Now Streaming</h2>
            <MusicPlayer />
          </div>

          <div className="p-6 bg-slate-900/30 border border-slate-800/50 rounded-3xl w-full max-w-md">
            <h3 className="text-white font-bold mb-2 flex items-center gap-2">
              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
              Neural Patch v2.4
            </h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Experience the symbiosis of low-latency arcade movement and high-fidelity algorithmic synthesis. 
              The snake consumes neural data to optimize the stream.
            </p>
          </div>
        </aside>
      </main>

      <footer className="mt-12 text-slate-600 font-mono text-[10px] uppercase tracking-[0.4em] relative z-10">
        &copy; 2026 NEON SNAKE ARCHIVE // ALL RIGHTS RESERVED
      </footer>
    </div>
  );
}
