'use client';

import { Button } from '@/components/ui/button';
import { RotateCcw, Share2, Trophy, Zap, TrendingUp } from 'lucide-react';
import { ChallengeStats } from './typing-challenge';

interface ResultsScreenProps {
  stats: ChallengeStats;
  onRetry: () => void;
}

export function ResultsScreen({ stats, onRetry }: ResultsScreenProps) {
  const getRank = (wpm: number) => {
    if (wpm >= 100) return { rank: 'Master Typist', color: 'text-yellow-400', icon: Trophy };
    if (wpm >= 80) return { rank: 'Expert', color: 'text-purple-400', icon: Zap };
    if (wpm >= 60) return { rank: 'Advanced', color: 'text-blue-400', icon: TrendingUp };
    if (wpm >= 40) return { rank: 'Intermediate', color: 'text-green-400', icon: TrendingUp };
    return { rank: 'Beginner', color: 'text-gray-400', icon: TrendingUp };
  };

  const rankInfo = getRank(stats.wpm);
  const RankIcon = rankInfo.icon;

  const handleShare = () => {
    const text = `I just finished a typing race challenge! 🚀\n\nWPM: ${stats.wpm}\nAccuracy: ${stats.accuracy}%\nCharacters: ${stats.correctChars}/${stats.totalChars}\n\nCan you beat my score?`;
    if (navigator.share) {
      navigator.share({ title: 'Typing Race Score', text });
    } else {
      navigator.clipboard.writeText(text);
      alert('Score copied to clipboard!');
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 animate-in fade-in duration-700">
      {/* Animated background elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/3 left-10 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        
        {/* Animated particles */}
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-blue-500 rounded-full opacity-0 animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${3 + Math.random() * 2}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      {/* Success Confetti Animation */}
      <div className="fixed inset-0 pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute text-2xl animate-bounce"
            style={{
              left: `${Math.random() * 100}%`,
              top: '-20px',
              animation: `fall ${2 + Math.random()}s linear forwards`,
              animationDelay: `${Math.random() * 0.5}s`,
            }}
          >
            {['🎉', '✨', '⭐', '🏆', '🎯'][Math.floor(Math.random() * 5)]}
          </div>
        ))}
      </div>

      {/* Header with Icon */}
      <div className="text-center space-y-4 relative z-10 pt-8">
        <div className="inline-block relative">
          {/* Animated glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-600 to-purple-600 rounded-full blur-2xl opacity-75 animate-pulse" />
          <div className="absolute inset-4 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full blur-xl opacity-50 animate-pulse delay-300" />
          
          {/* Trophy Icon */}
          <div className={`relative flex items-center justify-center w-24 h-24 rounded-full bg-gray-950 border-4 border-gray-700 shadow-2xl`}>
            <RankIcon className={`w-12 h-12 ${rankInfo.color}`} />
          </div>
        </div>

        <h2 className="text-5xl font-black bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-pulse">
          Challenge Complete! 🎊
        </h2>
        <p className={`text-3xl font-bold ${rankInfo.color} drop-shadow-lg`}>{rankInfo.rank}</p>
      </div>

      {/* Main Stats Grid with Enhanced Design */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 relative z-10">
        {/* WPM Card */}
        <div className="group relative">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-blue-400 rounded-xl blur opacity-50 group-hover:opacity-100 transition duration-500 animate-pulse" />
          <div className="relative bg-gradient-to-br from-blue-900/40 to-blue-900/10 border-2 border-blue-700/50 rounded-xl p-6 text-center space-y-3 backdrop-blur-sm hover:border-blue-600 transition-all">
            <div className="text-gray-300 text-sm font-bold uppercase tracking-widest">🚀 WPM</div>
            <div className="text-5xl font-black text-blue-300 drop-shadow-lg">{stats.wpm}</div>
            <div className="text-xs text-gray-400">Words Per Minute</div>
            <div className="h-2 bg-blue-900/50 rounded-full overflow-hidden mt-3">
              <div className="h-full bg-gradient-to-r from-blue-500 to-blue-400 shadow-lg shadow-blue-500/50" style={{ width: `${Math.min(100, (stats.wpm / 150) * 100)}%` }} />
            </div>
          </div>
        </div>

        {/* Accuracy Card */}
        <div className="group relative">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-green-600 to-emerald-400 rounded-xl blur opacity-50 group-hover:opacity-100 transition duration-500 animate-pulse" />
          <div className="relative bg-gradient-to-br from-green-900/40 to-green-900/10 border-2 border-green-700/50 rounded-xl p-6 text-center space-y-3 backdrop-blur-sm hover:border-green-600 transition-all">
            <div className="text-gray-300 text-sm font-bold uppercase tracking-widest">✅ Accuracy</div>
            <div className="text-5xl font-black text-green-300 drop-shadow-lg">{stats.accuracy}%</div>
            <div className="text-xs text-gray-400">Perfect matches</div>
            <div className="h-2 bg-green-900/50 rounded-full overflow-hidden mt-3">
              <div className="h-full bg-gradient-to-r from-green-500 to-emerald-400 shadow-lg shadow-green-500/50" style={{ width: `${stats.accuracy}%` }} />
            </div>
          </div>
        </div>

        {/* Characters Card */}
        <div className="group relative">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-purple-400 rounded-xl blur opacity-50 group-hover:opacity-100 transition duration-500 animate-pulse" />
          <div className="relative bg-gradient-to-br from-purple-900/40 to-purple-900/10 border-2 border-purple-700/50 rounded-xl p-6 text-center space-y-3 backdrop-blur-sm hover:border-purple-600 transition-all">
            <div className="text-gray-300 text-sm font-bold uppercase tracking-widest">⌨️ Characters</div>
            <div className="text-5xl font-black text-purple-300 drop-shadow-lg">{stats.correctChars}</div>
            <div className="text-xs text-gray-400">Typed correctly</div>
            <div className="h-2 bg-purple-900/50 rounded-full overflow-hidden mt-3">
              <div className="h-full bg-gradient-to-r from-purple-500 to-purple-400 shadow-lg shadow-purple-500/50" style={{ width: `${Math.min(100, (stats.correctChars / stats.totalChars) * 100)}%` }} />
            </div>
          </div>
        </div>

        {/* Errors Card */}
        <div className="group relative">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-600 to-red-400 rounded-xl blur opacity-50 group-hover:opacity-100 transition duration-500 animate-pulse" />
          <div className="relative bg-gradient-to-br from-orange-900/40 to-orange-900/10 border-2 border-orange-700/50 rounded-xl p-6 text-center space-y-3 backdrop-blur-sm hover:border-orange-600 transition-all">
            <div className="text-gray-300 text-sm font-bold uppercase tracking-widest">❌ Errors</div>
            <div className="text-5xl font-black text-orange-300 drop-shadow-lg">{stats.errors}</div>
            <div className="text-xs text-gray-400">Mistakes made</div>
            <div className="h-2 bg-orange-900/50 rounded-full overflow-hidden mt-3">
              <div className="h-full bg-gradient-to-r from-orange-500 to-red-400 shadow-lg shadow-orange-500/50" style={{ width: `${Math.min(100, (stats.errors / stats.totalChars) * 100)}%` }} />
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Stats */}
      <div className="relative z-10 group">
        <div className="absolute -inset-1 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-2xl blur-lg opacity-50 group-hover:opacity-100 transition duration-500" />
        <div className="relative bg-gray-800/50 border-2 border-gray-700 rounded-2xl p-8 space-y-6 backdrop-blur-sm">
          <h3 className="text-2xl font-bold text-white flex items-center gap-2">
            <span className="text-2xl">📊</span>
            Challenge Statistics
          </h3>
          
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-300 font-medium">Total Characters Typed</span>
                <span className="text-white font-bold text-lg">{stats.totalChars}</span>
              </div>
              <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-blue-500 via-blue-400 to-cyan-500 shadow-lg shadow-blue-500/50 w-3/4" />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-300 font-medium">Error Rate</span>
                <span className="text-white font-bold text-lg">{Math.round((stats.errors / stats.totalChars) * 100) || 0}%</span>
              </div>
              <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-red-500 via-red-400 to-orange-500 shadow-lg shadow-red-500/50"
                  style={{ width: `${Math.round((stats.errors / stats.totalChars) * 100)}%` }}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-gray-400 text-sm font-medium">⏱️ Time Spent</div>
              <div className="text-3xl font-bold text-cyan-400">{stats.timeElapsed}s</div>
            </div>

            <div className="space-y-2">
              <div className="text-gray-400 text-sm font-medium">💪 Adjusted WPM</div>
              <div className="text-3xl font-bold text-purple-400">{Math.round(stats.wpm * 0.85)}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Achievement Badge */}
      <div className="relative z-10 group">
        <div className="absolute -inset-1 bg-gradient-to-r from-yellow-600 to-orange-600 rounded-2xl blur-lg opacity-30 group-hover:opacity-60 transition duration-500 animate-pulse" />
        <div className="relative bg-gradient-to-r from-yellow-900/40 to-orange-900/40 border-2 border-yellow-700/50 rounded-2xl p-8 text-center space-y-3 backdrop-blur-sm">
          <div className="text-4xl">🏆</div>
          <p className="text-white font-bold text-lg">
            {stats.accuracy === 100 
              ? '✨ FLAWLESS PERFORMANCE!' 
              : stats.accuracy >= 95 
              ? '⭐ EXCELLENT ACCURACY' 
              : stats.accuracy >= 90
              ? '👍 GREAT JOB'
              : '🎯 GOOD EFFORT'}
          </p>
          <p className="text-gray-300 text-sm">
            {stats.accuracy === 100 
              ? 'Perfect typing - zero mistakes!' 
              : stats.accuracy >= 95 
              ? 'Exceptional accuracy on this run!' 
              : stats.accuracy >= 90
              ? 'You\'re on your way to mastery!'
              : 'Keep practicing to improve your accuracy'}
          </p>
        </div>
      </div>

      {/* Action Buttons - Fixed positioning */}
      <div className="relative z-10 flex flex-col sm:flex-row gap-4 justify-center w-full">
        <Button
          onClick={onRetry}
          className="gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-xl hover:shadow-2xl hover:shadow-blue-500/50 sm:flex-1 rounded-xl font-bold text-lg py-6 transition-all hover:scale-105"
        >
          <RotateCcw className="w-5 h-5" />
          Try Again
        </Button>
        
        <Button
          onClick={handleShare}
          variant="outline"
          className="gap-2 border-gray-600 hover:bg-gray-800/50 border-2 sm:flex-1 rounded-xl font-bold text-lg py-6 transition-all hover:border-gray-500"
        >
          <Share2 className="w-5 h-5" />
          Share Score
        </Button>
      </div>

      {/* Tips Section */}
      <div className="relative z-10 group">
        <div className="absolute -inset-1 bg-gradient-to-r from-green-600/10 to-cyan-600/10 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition duration-500" />
        <div className="relative bg-gray-800/40 border border-gray-700 rounded-xl p-6 text-sm text-gray-300 space-y-4 backdrop-blur-sm">
          <p className="font-bold text-gray-200 flex items-center gap-2">
            <span>💡</span>
            Tips to improve:
          </p>
          <ul className="space-y-2 text-xs">
            <li className="flex items-start gap-3">
              <span className="text-green-400 mt-1">→</span>
              <span>Focus on accuracy first, speed will follow naturally</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-green-400 mt-1">→</span>
              <span>Practice proper finger positioning and posture</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-green-400 mt-1">→</span>
              <span>Take breaks to avoid fatigue and maintain concentration</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-green-400 mt-1">→</span>
              <span>Challenge yourself with longer texts and higher difficulty</span>
            </li>
          </ul>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes fall {
          to { transform: translateY(100vh); opacity: 0; }
        }
        .delay-300 { animation-delay: 300ms; }
        .delay-700 { animation-delay: 700ms; }
        .delay-1000 { animation-delay: 1000ms; }
      `}</style>
    </div>
  );
}
