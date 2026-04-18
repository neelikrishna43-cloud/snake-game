import { useState, useRef, useEffect, ChangeEvent } from "react";
import { Play, Pause, SkipForward, SkipBack, Volume2, Music } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { TRACKS } from "../constants";

export default function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => console.error("Playback failed", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateProgress = () => {
      setProgress((audio.currentTime / audio.duration) * 100);
    };

    const handleEnded = () => {
      handleNext();
    };

    audio.addEventListener("timeupdate", updateProgress);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", updateProgress);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [currentTrackIndex]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const handleNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setIsPlaying(true);
  };

  const handlePrev = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setIsPlaying(true);
  };

  const handleProgressChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newTime = (parseFloat(e.target.value) / 100) * (audioRef.current?.duration || 0);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  return (
    <div className="w-full max-w-md bg-slate-900/80 backdrop-blur-xl border border-cyan-500/30 rounded-3xl p-6 shadow-2xl shadow-cyan-500/20">
      <audio ref={audioRef} src={currentTrack.url} />
      
      <div className="flex items-center gap-6">
        <div className="relative group">
          <motion.div
            animate={{ rotate: isPlaying ? 360 : 0 }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            className="w-24 h-24 rounded-full overflow-hidden border-2 border-pink-500/50 shadow-lg shadow-pink-500/30"
          >
            <img 
              src={currentTrack.cover} 
              alt={currentTrack.title} 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </motion.div>
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-6 h-6 bg-slate-900 rounded-full border-2 border-pink-500/50" />
          </div>
        </div>

        <div className="flex-1 overflow-hidden">
          <h3 className="text-xl font-bold text-white truncate drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]">
            {currentTrack.title}
          </h3>
          <p className="text-cyan-400 font-mono text-sm uppercase tracking-widest mt-1">
            {currentTrack.artist}
          </p>
          <div className="flex items-center gap-2 mt-2 text-slate-500">
            <Music className="w-3 h-3" />
            <span className="text-[10px] uppercase font-bold tracking-tighter">AI Generated Neural Audio</span>
          </div>
        </div>
      </div>

      <div className="mt-8 space-y-4">
        <div className="relative group">
          <input
            type="range"
            min="0"
            max="100"
            value={progress || 0}
            onChange={handleProgressChange}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400 group-hover:accent-pink-500 transition-colors"
          />
          <div 
            className="absolute top-0 left-0 h-1.5 bg-gradient-to-r from-cyan-400 to-pink-500 rounded-lg pointer-events-none transition-all duration-100"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={handlePrev}
              className="p-2 text-slate-400 hover:text-cyan-400 transition-colors"
            >
              <SkipBack className="w-6 h-6" />
            </button>
            <button 
              onClick={togglePlay}
              className="p-4 bg-white text-slate-950 rounded-full hover:scale-110 active:scale-95 transition-all shadow-lg shadow-white/20"
            >
              {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current ml-1" />}
            </button>
            <button 
              onClick={handleNext}
              className="p-2 text-slate-400 hover:text-cyan-400 transition-colors"
            >
              <SkipForward className="w-6 h-6" />
            </button>
          </div>
          
          <div className="flex items-center gap-2 text-slate-500">
            <Volume2 className="w-4 h-4" />
            <div className="w-20 h-1 bg-slate-800 rounded-full overflow-hidden">
              <div className="w-3/4 h-full bg-slate-500" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
