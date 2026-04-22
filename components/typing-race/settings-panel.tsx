'use client';

import { Button } from '@/components/ui/button';
import { Clock, Zap, Keyboard, Target, Flame } from 'lucide-react';
import { useState } from 'react';

interface SettingsPanelProps {
  onStart: (duration: number) => void;
}

export function SettingsPanel({ onStart }: SettingsPanelProps) {
  const [selectedDuration, setSelectedDuration] = useState(60);

  const durations = [
    { value: 30, label: '30s', description: 'Quick burst', icon: Zap, difficulty: 'Easy' },
    { value: 60, label: '1 min', description: 'Standard', icon: Flame, difficulty: 'Medium' },
    { value: 120, label: '2 min', description: 'Endurance', icon: Target, difficulty: 'Hard' },
    { value: 300, label: '5 min', description: 'Marathon', icon: Keyboard, difficulty: 'Extreme' },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto space-y-12 animate-in fade-in duration-700">
      {/* Animated background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse delay-700" />
        <div className="absolute -bottom-32 right-1/3 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      {/* Header */}
      <div className="text-center space-y-6 relative z-10">
        <div className="inline-flex items-center justify-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-900/50 to-purple-900/50 border border-blue-700/50 rounded-full backdrop-blur-sm group hover:border-blue-600/50 transition-all hover:shadow-lg hover:shadow-blue-500/20">
          <Zap className="w-5 h-5 text-blue-400 group-hover:rotate-12 transition-transform" />
          <span className="text-sm font-semibold text-blue-300">Challenge Awaits</span>
        </div>
        
        <div className="space-y-3">
          <h2 className="text-5xl md:text-6xl font-black bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Choose Your Challenge
          </h2>
          <p className="text-gray-400 text-lg">Select the duration and test your typing speed against the clock ⏱️</p>
        </div>
      </div>

      {/* Duration Selection */}
      <div className="relative z-10 space-y-6">
        <label className="text-sm font-bold uppercase tracking-widest text-transparent bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text flex items-center gap-2">
          <Clock className="w-4 h-4 text-blue-400" />
          Challenge Duration
        </label>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {durations.map((duration) => {
            const Icon = duration.icon;
            return (
              <button
                key={duration.value}
                onClick={() => setSelectedDuration(duration.value)}
                className={`group relative overflow-hidden rounded-xl transition-all duration-300 transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                  selectedDuration === duration.value
                    ? 'scale-105'
                    : 'hover:scale-105'
                }`}
              >
                {/* Animated Border Gradient */}
                <div
                  className={`absolute inset-0 rounded-xl transition-all duration-300 ${
                    selectedDuration === duration.value
                      ? 'bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 p-1'
                      : 'bg-gradient-to-br from-gray-700 to-gray-700 p-1'
                  }`}
                />

                {/* Content */}
                <div
                  className={`relative rounded-lg p-8 text-center space-y-3 transition-all duration-300 ${
                    selectedDuration === duration.value
                      ? 'bg-gray-950'
                      : 'bg-gray-900 group-hover:bg-gray-800'
                  }`}
                >
                  {/* Icon */}
                  <div className={`flex justify-center ${selectedDuration === duration.value ? 'animate-bounce' : ''}`}>
                    <Icon className={`w-8 h-8 transition-all duration-300 ${
                      selectedDuration === duration.value
                        ? 'text-transparent bg-gradient-to-r from-blue-400 to-pink-400 bg-clip-text'
                        : 'text-gray-400 group-hover:text-white'
                    }`} />
                  </div>

                  {/* Duration */}
                  <div className={`text-3xl font-black transition-all duration-300 ${
                    selectedDuration === duration.value
                      ? 'text-transparent bg-gradient-to-r from-blue-400 to-pink-400 bg-clip-text text-3xl'
                      : 'text-white group-hover:text-blue-300'
                  }`}>
                    {duration.label}
                  </div>

                  {/* Description */}
                  <div className="text-xs opacity-75 font-medium">{duration.description}</div>

                  {/* Difficulty Badge */}
                  <div className={`text-xs font-bold uppercase tracking-widest mt-2 px-3 py-1 rounded-full inline-block transition-all duration-300 ${
                    selectedDuration === duration.value
                      ? 'bg-gradient-to-r from-blue-600/50 to-pink-600/50 text-white shadow-lg shadow-blue-500/50'
                      : 'bg-gray-800 text-gray-400 group-hover:text-gray-300'
                  }`}>
                    {duration.difficulty}
                  </div>
                </div>

                {/* Shine Effect */}
                {selectedDuration === duration.value && (
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse rounded-xl" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Features Grid */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { icon: '⚡', title: 'Real-time Feedback', desc: 'Instant visual feedback for every keystroke' },
          { icon: '🎯', title: 'Sound Effects', desc: 'Optional audio cues for correct/incorrect typing' },
          { icon: '📊', title: 'Detailed Stats', desc: 'Comprehensive analysis of your performance' },
        ].map((feature, i) => (
          <div
            key={i}
            className="group relative overflow-hidden rounded-xl border border-gray-700 hover:border-gray-600 transition-all"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-gray-800/50 to-gray-900/50 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative bg-gray-800/30 backdrop-blur-sm p-6 space-y-3 hover:bg-gray-800/50 transition-colors">
              <div className="text-4xl group-hover:scale-125 transition-transform duration-300">{feature.icon}</div>
              <div className="font-bold text-white text-lg">{feature.title}</div>
              <div className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">{feature.desc}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Info Box */}
      <div className="relative z-10 group">
        <div className="absolute -inset-1 bg-gradient-to-r from-purple-600/30 to-blue-600/30 rounded-2xl blur-lg opacity-50 group-hover:opacity-100 transition duration-500" />
        <div className="relative bg-gradient-to-r from-purple-900/20 to-blue-900/20 border-2 border-purple-700/50 rounded-2xl p-8 space-y-4 backdrop-blur-sm hover:border-purple-600/50 transition-all group-hover:shadow-2xl group-hover:shadow-purple-500/20">
          <h3 className="font-bold text-white text-lg flex items-center gap-2">
            <span className="text-2xl">🎓</span>
            How Scoring Works
          </h3>
          <div className="grid grid-cols-3 gap-6 text-center">
            <div className="space-y-2">
              <div className="text-3xl font-black text-purple-400">WPM</div>
              <div className="text-xs text-gray-400 leading-relaxed">Words Per Minute<br />Based on characters</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-black text-blue-400">%</div>
              <div className="text-xs text-gray-400 leading-relaxed">Accuracy Rate<br />Correct vs total</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-black text-pink-400">🏆</div>
              <div className="text-xs text-gray-400 leading-relaxed">Achievement<br />Rank & badge</div>
            </div>
          </div>
        </div>
      </div>

      {/* Start Button */}
      <div className="relative z-10 flex flex-col gap-4 items-center">
        <div className="w-full max-w-md relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-2xl blur-xl opacity-75 group-hover:opacity-100 transition duration-300 animate-pulse" />
          <Button
            onClick={() => onStart(selectedDuration)}
            className="relative w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-black py-8 text-xl rounded-xl shadow-2xl hover:shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 group-hover:scale-105"
          >
            <Keyboard className="w-6 h-6 mr-2" />
            Start Challenge Now
          </Button>
        </div>
        <p className="text-center text-xs text-gray-500 font-medium">
          Click to begin • First keystroke will start the timer
        </p>
      </div>

      <style>{`
        .delay-700 { animation-delay: 700ms; }
        .delay-1000 { animation-delay: 1000ms; }
      `}</style>
    </div>
  );
}
