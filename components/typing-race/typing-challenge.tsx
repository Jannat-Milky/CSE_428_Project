'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { RotateCcw, Volume2, VolumeX, Zap } from 'lucide-react';

interface TypingChallengeProps {
  text: string;
  duration: number;
  onComplete: (stats: ChallengeStats) => void;
}

export interface ChallengeStats {
  wpm: number;
  accuracy: number;
  correctChars: number;
  totalChars: number;
  timeElapsed: number;
  errors: number;
}

const SAMPLE_TEXTS = [
  "The quick brown fox jumps over the lazy dog. This pangram contains every letter of the alphabet at least once.",
  "In the era of information technology, typing speed has become an essential skill for professionals worldwide.",
  "Innovation distinguishes between a leader and a follower. Every keystroke brings you closer to mastery.",
  "The art of programming is the skill of telling another human what one wants the computer to do.",
  "Speed is not the only measure of typing proficiency; accuracy and consistency matter equally in real-world applications.",
];

export function TypingChallenge({ duration, onComplete }: TypingChallengeProps) {
  const [text] = useState(() => SAMPLE_TEXTS[Math.floor(Math.random() * SAMPLE_TEXTS.length)]);
  const [input, setInput] = useState('');
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isActive, setIsActive] = useState(false);
  const [stats, setStats] = useState<ChallengeStats | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const audioRef = useRef<HTMLAudioElement>(null);

  const playSound = (type: 'success' | 'error') => {
    if (!soundEnabled) return;
    
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    if (type === 'success') {
      oscillator.frequency.value = 800;
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.1);
    } else {
      oscillator.frequency.value = 300;
      gainNode.gain.setValueAtTime(0.05, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.05);
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.05);
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      setIsActive(false);
      calculateStats();
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft]);

  const calculateStats = () => {
    const correctChars = input.split('').filter((char, idx) => char === text[idx]).length;
    const totalChars = input.length;
    const errors = totalChars - correctChars;
    const wpm = Math.round((totalChars / 5) / (duration / 60));
    const accuracy = totalChars > 0 ? Math.round((correctChars / totalChars) * 100) : 0;

    const challengeStats: ChallengeStats = {
      wpm: Math.max(0, wpm),
      accuracy: Math.min(100, accuracy),
      correctChars,
      totalChars,
      timeElapsed: duration - timeLeft,
      errors,
    };

    setStats(challengeStats);
    onComplete(challengeStats);
  };

  const handleInputChange = (e: string) => {
    if (!isActive && e.length > 0) {
      setIsActive(true);
    }
    setInput(e);
    
    const lastChar = e[e.length - 1];
    if (lastChar && lastChar === text[e.length - 1]) {
      playSound('success');
    } else if (lastChar) {
      playSound('error');
    }
  };

  const handleReset = () => {
    setInput('');
    setTimeLeft(duration);
    setIsActive(false);
    setStats(null);
    inputRef.current?.focus();
  };

  const displayText = text.split('').map((char, idx) => {
    let charClass = 'text-gray-400';
    
    if (idx < input.length) {
      charClass = input[idx] === char ? 'text-green-500 bg-green-900/20' : 'text-red-500 bg-red-900/20';
    } else if (idx === input.length) {
      charClass = 'text-white bg-blue-500/30 animate-pulse';
    }
    
    return (
      <span key={idx} className={`${charClass} transition-all duration-75`}>
        {char}
      </span>
    );
  });

  const timeColor = timeLeft <= 10 ? 'text-red-500' : timeLeft <= 30 ? 'text-yellow-500' : 'text-green-500';

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8">
      {/* Animated background effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 right-10 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-32 left-20 w-72 h-72 bg-purple-500/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 left-1/3 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl animate-pulse delay-700" />
      </div>

      {/* Top Section with Timer and Controls */}
      <div className="relative z-10 space-y-6">
        <div className="flex justify-between items-center">
          {/* Timer Section */}
          <div className="flex items-center gap-6">
            <div className="relative group">
              <div className={`absolute inset-0 rounded-lg blur-xl opacity-75 transition-all duration-500 ${
                timeLeft <= 10 ? 'bg-red-500' : timeLeft <= 30 ? 'bg-yellow-500' : 'bg-gradient-to-r from-blue-500 to-cyan-500'
              }`} />
              <div className="relative bg-gray-950 border-2 border-gray-800 rounded-lg px-8 py-4">
                <div className={`text-5xl font-black font-mono tracking-wider ${
                  timeLeft <= 10 ? 'text-red-400 animate-pulse' : timeLeft <= 30 ? 'text-yellow-400' : 'text-cyan-400'
                }`}>
                  {String(timeLeft).padStart(2, '0')}s
                </div>
              </div>
            </div>

            {/* Animated Timer Bar */}
            <div className="w-48 h-3 bg-gray-800 rounded-full overflow-hidden border border-gray-700 shadow-lg">
              <div
                className={`h-full transition-all duration-500 rounded-full ${
                  timeLeft <= 10 ? 'bg-gradient-to-r from-red-500 to-red-600 shadow-lg shadow-red-500/50' : 
                  timeLeft <= 30 ? 'bg-gradient-to-r from-yellow-500 to-orange-500 shadow-lg shadow-yellow-500/50' : 
                  'bg-gradient-to-r from-cyan-500 to-blue-600 shadow-lg shadow-blue-500/50'
                }`}
                style={{ width: `${(timeLeft / duration) * 100}%` }}
              />
            </div>
          </div>

          {/* Sound Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="relative group h-12 w-12 hover:bg-gray-700 rounded-lg border border-gray-700 transition-all hover:border-gray-600"
          >
            {soundEnabled ? (
              <>
                <div className="absolute inset-0 bg-green-500/10 rounded-lg group-hover:bg-green-500/20 transition-colors" />
                <Volume2 className="w-6 h-6 text-green-400 relative z-10" />
              </>
            ) : (
              <>
                <div className="absolute inset-0 bg-gray-600/10 rounded-lg group-hover:bg-gray-600/20 transition-colors" />
                <VolumeX className="w-6 h-6 text-gray-400 relative z-10" />
              </>
            )}
          </Button>
        </div>

        {/* Progress Indicator */}
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <Zap className="w-4 h-4 text-yellow-400" />
          <span>Characters typed: <span className="text-blue-400 font-semibold">{input.length}</span> / {text.length}</span>
        </div>
      </div>

      {/* Main Text Display Area with Effects */}
      <div className="relative z-10">
        <div className="relative group">
          {/* Animated Glow Background */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/0 via-purple-600/0 to-cyan-600/0 group-hover:from-blue-600/5 group-hover:via-purple-600/5 group-hover:to-cyan-600/5 rounded-2xl blur-xl transition-all duration-500" />
          
          {/* Main Content Container */}
          <div className="relative bg-gradient-to-b from-gray-900/80 to-gray-950/80 border-2 border-gray-700/50 group-hover:border-gray-600/50 rounded-2xl p-10 min-h-48 space-y-8 backdrop-blur-sm transition-all duration-300 shadow-2xl">
            {/* Typing Text */}
            <div className="text-2xl leading-relaxed font-mono text-center break-words space-y-4">
              {text.split('\n').map((line, lineIdx) => (
                <div key={lineIdx} className="flex flex-wrap justify-center gap-0.5">
                  {line.split('').map((char, charIdx) => {
                    const globalIdx = text.split('\n').slice(0, lineIdx).join('').length + charIdx;
                    let charClass = 'text-gray-500 transition-all duration-75';
                    
                    if (globalIdx < input.length) {
                      if (input[globalIdx] === char) {
                        charClass = 'text-green-400 bg-green-900/30 rounded px-0.5 font-semibold shadow-lg shadow-green-500/20';
                      } else {
                        charClass = 'text-red-400 bg-red-900/30 rounded px-0.5 font-semibold shadow-lg shadow-red-500/20';
                      }
                    } else if (globalIdx === input.length) {
                      charClass = 'text-white bg-gradient-to-r from-blue-500/60 to-cyan-500/60 rounded px-0.5 animate-pulse shadow-lg shadow-blue-500/40 font-semibold';
                    }
                    
                    return (
                      <span key={charIdx} className={charClass}>
                        {char}
                      </span>
                    );
                  })}
                </div>
              ))}
            </div>

            {/* Decorative Bottom Element */}
            <div className="flex justify-center gap-2 opacity-30 pt-4 border-t border-gray-700/30">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="w-1 h-1 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 animate-pulse"
                  style={{ animationDelay: `${i * 0.1}s` }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Input Field with Effects */}
      <div className="relative z-10 group">
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-xl blur-sm group-focus-within:blur-lg group-focus-within:from-blue-600/40 group-focus-within:to-purple-600/40 transition-all duration-300" />
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => handleInputChange(e.target.value)}
          placeholder={!isActive ? '🎯 Click here or start typing...' : '⚡ Keep typing...'}
          className="relative w-full px-6 py-4 bg-gray-900 border-2 border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 transition-all font-mono text-lg shadow-xl"
          disabled={!isActive && input.length === 0 ? false : timeLeft === 0}
        />
      </div>

      {/* Stats Grid with Enhanced Design */}
      <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Characters Stat */}
        <div className="group relative overflow-hidden rounded-xl border border-gray-700/50 hover:border-blue-600/50 transition-all duration-300 cursor-default">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-blue-600/0 opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="relative bg-gray-800/40 backdrop-blur-sm p-5 space-y-3 hover:bg-gray-800/60 transition-colors">
            <div className="text-gray-400 text-xs font-bold uppercase tracking-widest">⌨️ Characters</div>
            <div className="text-4xl font-black text-blue-400">{input.length}</div>
            <div className="text-xs text-gray-500 font-medium">of {text.length}</div>
            <div className="h-1 bg-gray-700 rounded-full overflow-hidden mt-2">
              <div className="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all" style={{ width: `${(input.length / text.length) * 100}%` }} />
            </div>
          </div>
        </div>
        
        {/* Accuracy Stat */}
        <div className="group relative overflow-hidden rounded-xl border border-gray-700/50 hover:border-green-600/50 transition-all duration-300 cursor-default">
          <div className="absolute inset-0 bg-gradient-to-br from-green-600/10 to-green-600/0 opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="relative bg-gray-800/40 backdrop-blur-sm p-5 space-y-3 hover:bg-gray-800/60 transition-colors">
            <div className="text-gray-400 text-xs font-bold uppercase tracking-widest">🎯 Accuracy</div>
            <div className={`text-4xl font-black ${input.length > 0 ? 'text-green-400' : 'text-gray-500'}`}>
              {input.length > 0 ? Math.round((input.split('').filter((c, i) => c === text[i]).length / input.length) * 100) : 0}%
            </div>
            <div className="text-xs text-gray-500 font-medium">Perfect matches</div>
            <div className="h-1 bg-gray-700 rounded-full overflow-hidden mt-2">
              <div 
                className="h-full bg-gradient-to-r from-green-500 to-green-600 transition-all" 
                style={{ width: `${input.length > 0 ? Math.round((input.split('').filter((c, i) => c === text[i]).length / input.length) * 100) : 0}%` }} 
              />
            </div>
          </div>
        </div>

        {/* WPM Stat */}
        <div className="group relative overflow-hidden rounded-xl border border-gray-700/50 hover:border-purple-600/50 transition-all duration-300 cursor-default">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 to-purple-600/0 opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="relative bg-gray-800/40 backdrop-blur-sm p-5 space-y-3 hover:bg-gray-800/60 transition-colors">
            <div className="text-gray-400 text-xs font-bold uppercase tracking-widest">⚡ WPM</div>
            <div className="text-4xl font-black text-purple-400">
              {Math.round((input.length / 5) / ((duration - timeLeft) / 60)) || 0}
            </div>
            <div className="text-xs text-gray-500 font-medium">Words/Min</div>
            <div className="h-1 bg-gray-700 rounded-full overflow-hidden mt-2">
              <div 
                className="h-full bg-gradient-to-r from-purple-500 to-purple-600 transition-all" 
                style={{ width: `${Math.min(100, (Math.round((input.length / 5) / ((duration - timeLeft) / 60)) || 0) / 2)}%` }} 
              />
            </div>
          </div>
        </div>

        {/* Errors Stat */}
        <div className="group relative overflow-hidden rounded-xl border border-gray-700/50 hover:border-red-600/50 transition-all duration-300 cursor-default">
          <div className="absolute inset-0 bg-gradient-to-br from-red-600/10 to-red-600/0 opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="relative bg-gray-800/40 backdrop-blur-sm p-5 space-y-3 hover:bg-gray-800/60 transition-colors">
            <div className="text-gray-400 text-xs font-bold uppercase tracking-widest">❌ Errors</div>
            <div className="text-4xl font-black text-red-400">
              {input.split('').filter((c, i) => c !== text[i]).length}
            </div>
            <div className="text-xs text-gray-500 font-medium">Mistakes made</div>
            <div className="h-1 bg-gray-700 rounded-full overflow-hidden mt-2">
              <div 
                className="h-full bg-gradient-to-r from-red-500 to-red-600 transition-all" 
                style={{ width: `${Math.min(100, ((input.split('').filter((c, i) => c !== text[i]).length) / input.length) * 100 || 0)}%` }} 
              />
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons with Effects */}
      <div className="relative z-10 flex gap-4 justify-center pt-6">
        <Button
          onClick={handleReset}
          className="gap-2 border-gray-600 hover:bg-gray-800 bg-gray-800/50 backdrop-blur-sm border-2 transition-all hover:border-gray-500 group relative overflow-hidden px-8 py-6 rounded-xl font-semibold text-lg"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-gray-700/0 to-gray-700/0 group-hover:from-gray-700/20 group-hover:to-gray-700/20 transition-all" />
          <RotateCcw className="w-5 h-5 relative z-10 group-hover:rotate-180 transition-transform duration-500" />
          <span className="relative z-10">Reset</span>
        </Button>
        
        {isActive && (
          <Button
            onClick={() => {
              setIsActive(false);
              calculateStats();
            }}
            className="gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 shadow-lg hover:shadow-xl hover:shadow-blue-500/50 transition-all group relative overflow-hidden px-8 py-6 rounded-xl font-semibold text-lg"
          >
            <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors" />
            <span className="relative z-10">Finish</span>
          </Button>
        )}
      </div>
    </div>
  );
}
