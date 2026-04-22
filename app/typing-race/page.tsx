'use client';

import { useState } from 'react';
import { SettingsPanel } from '@/components/typing-race/settings-panel';
import { TypingChallenge, ChallengeStats } from '@/components/typing-race/typing-challenge';
import { ResultsScreen } from '@/components/typing-race/results-screen';
import { FailureScreen } from '@/components/typing-race/failure-screen';
import { Leaderboard } from '@/components/typing-race/leaderboard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

type GameState = 'settings' | 'playing' | 'results' | 'leaderboard';

export default function TypingRacePage() {
  const [gameState, setGameState] = useState<GameState>('settings');
  const [duration, setDuration] = useState(60);
  const [stats, setStats] = useState<ChallengeStats | null>(null);
  const [isFailed, setIsFailed] = useState(false);

  const handleStartChallenge = (selectedDuration: number) => {
    setDuration(selectedDuration);
    setGameState('playing');
  };

  const handleChallengeComplete = (challengeStats: ChallengeStats) => {
    // Determine if the challenge was failed
    // Failure conditions:
    // - Accuracy below 60%
    // - WPM below 20
    // - Less than 20% of text typed correctly
    const minCharactersForPass = 50;
    const isFailed =
      challengeStats.accuracy < 60 ||
      challengeStats.wpm < 20 ||
      challengeStats.correctChars < minCharactersForPass;

    setStats(challengeStats);
    setIsFailed(isFailed);
    setGameState('results');
  };

  const handleRetry = () => {
    setGameState('settings');
    setStats(null);
    setIsFailed(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-black text-white overflow-hidden relative">
      {/* Animated background effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-500" />
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/3 right-10 w-80 h-80 bg-pink-500/5 rounded-full blur-3xl animate-pulse delay-700" />
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.02)_1px,transparent_1px)] bg-[size:50px_50px] opacity-40" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-16">
        {/* Header Section */}
        <div className="mb-16 text-center space-y-6">
          {/* Badge */}
          <div className="inline-flex items-center justify-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-900/50 to-purple-900/50 border border-blue-700/50 rounded-full backdrop-blur-sm group hover:border-blue-600 transition-all hover:shadow-xl hover:shadow-blue-500/20">
            <span className="text-3xl group-hover:animate-spin">⌨️</span>
            <span className="text-sm font-bold text-blue-300 uppercase tracking-widest">Typing Race Challenge</span>
          </div>

          {/* Main Title */}
          <div className="space-y-3">
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-black bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent drop-shadow-xl">
              Speed Racing
            </h1>
            <h2 className="text-4xl md:text-5xl font-bold text-transparent bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text">
              Game
            </h2>
          </div>

          {/* Subtitle */}
          <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            Test your typing speed and accuracy. Compete on the leaderboard and become a master typist! ⚡
          </p>

          {/* Animated CTA Line */}
          <div className="flex items-center justify-center gap-2 text-sm text-cyan-400 font-semibold">
            <span className="w-8 h-px bg-gradient-to-r from-transparent to-cyan-400" />
            <span>Race Against Time</span>
            <span className="w-8 h-px bg-gradient-to-l from-transparent to-cyan-400" />
          </div>
        </div>

        {/* Tabs Navigation */}
        <Tabs defaultValue="race" className="w-full space-y-12">
          <div className="flex justify-center w-full">
            <TabsList className="grid grid-cols-2 bg-transparent p-0 rounded-xl">
              <TabsTrigger
                value="race"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-purple-500/30 rounded-lg font-bold text-lg transition-all duration-300 py-3 px-8 data-[state=inactive]:text-gray-400 data-[state=inactive]:hover:text-white"
              >
                🏎️ Race
              </TabsTrigger>
              <TabsTrigger
                value="leaderboard"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-purple-500/30 rounded-lg font-bold text-lg transition-all duration-300 py-3 px-8 data-[state=inactive]:text-gray-400 data-[state=inactive]:hover:text-white"
              >
                🏆 Leaderboard
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Race Tab */}
          <TabsContent value="race" className="space-y-8">
            {gameState === 'settings' && (
              <SettingsPanel onStart={handleStartChallenge} />
            )}

            {gameState === 'playing' && (
              <div className="space-y-6 animate-in fade-in duration-500">
                <TypingChallenge
                  text=""
                  duration={duration}
                  onComplete={handleChallengeComplete}
                />
              </div>
            )}

            {gameState === 'results' && stats && (
              isFailed ? (
                <FailureScreen stats={stats} onRetry={handleRetry} />
              ) : (
                <ResultsScreen stats={stats} onRetry={handleRetry} />
              )
            )}
          </TabsContent>

          {/* Leaderboard Tab */}
          <TabsContent value="leaderboard" className="space-y-8 animate-in fade-in duration-500">
            <Leaderboard />
          </TabsContent>
        </Tabs>

        {/* Footer Section with Tips */}
        <div className="mt-20 pt-12 border-t border-gray-700/50">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              { 
                icon: '🎯', 
                title: 'Focus on Accuracy', 
                desc: 'Mistakes will cost you. Quality over speed always wins the race.',
                color: 'from-blue-600/20 to-blue-600/0',
                borderColor: 'border-blue-600/30'
              },
              { 
                icon: '⚡', 
                title: 'Build Muscle Memory', 
                desc: 'Regular practice improves your reflexes and typing flow.',
                color: 'from-purple-600/20 to-purple-600/0',
                borderColor: 'border-purple-600/30'
              },
              { 
                icon: '🏆', 
                title: 'Climb the Ranks', 
                desc: 'Beat others and reach the top of the leaderboard today.',
                color: 'from-pink-600/20 to-pink-600/0',
                borderColor: 'border-pink-600/30'
              },
            ].map((tip, i) => (
              <div
                key={i}
                className={`group relative overflow-hidden rounded-xl border-2 ${tip.borderColor} hover:border-opacity-100 transition-all hover:shadow-2xl hover:shadow-opacity-50`}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${tip.color} opacity-50 group-hover:opacity-100 transition-opacity`} />
                <div className="relative bg-gray-900/50 backdrop-blur-sm p-8 space-y-4 group-hover:bg-gray-900/70 transition-colors">
                  <div className="text-5xl group-hover:scale-125 transition-transform duration-300">{tip.icon}</div>
                  <h3 className="font-bold text-white text-lg group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-white group-hover:bg-clip-text transition-all">{tip.title}</h3>
                  <p className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors leading-relaxed">{tip.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Stats */}
          <div className="mt-12 grid grid-cols-3 gap-4 max-w-2xl mx-auto">
            {[
              { label: 'Total Players', value: '50K+', emoji: '👥' },
              { label: 'Races Completed', value: '500K+', emoji: '🏁' },
              { label: 'Avg WPM', value: '85 WPM', emoji: '⚡' },
            ].map((stat, i) => (
              <div key={i} className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-lg blur opacity-50 group-hover:opacity-100 transition" />
                <div className="relative bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-4 text-center">
                  <div className="text-3xl mb-2">{stat.emoji}</div>
                  <div className="text-2xl font-bold text-transparent bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text">{stat.value}</div>
                  <div className="text-xs text-gray-400 mt-1">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        .delay-500 { animation-delay: 500ms; }
        .delay-700 { animation-delay: 700ms; }
        .delay-1000 { animation-delay: 1000ms; }
      `}</style>
    </div>
  );
}