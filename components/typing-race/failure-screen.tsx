'use client';

import { Button } from '@/components/ui/button';
import { RotateCcw, Share2, TrendingUp } from 'lucide-react';
import { ChallengeStats } from './typing-challenge';

interface FailureScreenProps {
  stats: ChallengeStats;
  onRetry: () => void;
}

export function FailureScreen({ stats, onRetry }: FailureScreenProps) {
  const handleShare = () => {
    const text = `I'm working on my typing skills! 💪\n\nWPM: ${stats.wpm}\nAccuracy: ${stats.accuracy}%\nCharacters: ${stats.correctChars}/${stats.totalChars}\n\nHelp me beat this score!`;
    if (navigator.share) {
      navigator.share({ title: 'Typing Race Score', text });
    } else {
      navigator.clipboard.writeText(text);
      alert('Score copied to clipboard!');
    }
  };

  const getTips = () => {
    if (stats.accuracy < 70) {
      return [
        "Your accuracy needs work - slow down and focus on getting letters right",
        "Take time to practice proper finger positioning",
        "Try typing at a comfortable pace rather than rushing",
      ];
    }
    if (stats.wpm < 30) {
      return [
        "Your speed is low - this will improve with regular practice",
        "Try the 30-second challenge to build confidence",
        "Focus on consistency before trying to increase speed",
      ];
    }
    return [
      "Keep practicing - every attempt makes you better!",
      "Focus on accuracy first, speed will follow naturally",
      "Challenge yourself with longer durations as you improve",
    ];
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 animate-in fade-in duration-700">
      {/* Animated background with failure theme */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-96 h-96 bg-red-500/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-orange-500/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/3 left-10 w-72 h-72 bg-red-500/5 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      {/* Header with Icon */}
      <div className="text-center space-y-4 relative z-10 pt-8">
        {/* Animated icon */}
        <div className="inline-block relative">
          <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-orange-600 rounded-full blur-2xl opacity-50 animate-pulse" />

          {/* Failure Icon */}
          <div className={`relative flex items-center justify-center w-24 h-24 rounded-full bg-gray-950 border-4 border-gray-700 shadow-2xl`}>
            <span className="text-5xl animate-bounce">📉</span>
          </div>
        </div>

        <h2 className="text-5xl font-black bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
          Keep Trying! 💪
        </h2>
        <p className="text-2xl font-bold text-orange-400">You can do better!</p>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 relative z-10">
        {/* WPM Card */}
        <div className="group relative">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-600 to-orange-400 rounded-xl blur opacity-40 group-hover:opacity-70 transition duration-500" />
          <div className="relative bg-gradient-to-br from-orange-900/40 to-orange-900/10 border-2 border-orange-700/50 rounded-xl p-6 text-center space-y-3 backdrop-blur-sm hover:border-orange-600 transition-all">
            <div className="text-gray-300 text-sm font-bold uppercase tracking-widest">⚡ WPM</div>
            <div className="text-5xl font-black text-orange-300 drop-shadow-lg">{stats.wpm}</div>
            <div className="text-xs text-gray-400">Words Per Minute</div>
            <div className="h-2 bg-orange-900/50 rounded-full overflow-hidden mt-3">
              <div className="h-full bg-gradient-to-r from-orange-500 to-orange-400 shadow-lg shadow-orange-500/50" style={{ width: `${Math.min(100, (stats.wpm / 150) * 100)}%` }} />
            </div>
          </div>
        </div>

        {/* Accuracy Card */}
        <div className="group relative">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-red-600 to-red-400 rounded-xl blur opacity-40 group-hover:opacity-70 transition duration-500" />
          <div className="relative bg-gradient-to-br from-red-900/40 to-red-900/10 border-2 border-red-700/50 rounded-xl p-6 text-center space-y-3 backdrop-blur-sm hover:border-red-600 transition-all">
            <div className="text-gray-300 text-sm font-bold uppercase tracking-widest">📊 Accuracy</div>
            <div className="text-5xl font-black text-red-300 drop-shadow-lg">{stats.accuracy}%</div>
            <div className="text-xs text-gray-400">Correct matches</div>
            <div className="h-2 bg-red-900/50 rounded-full overflow-hidden mt-3">
              <div className="h-full bg-gradient-to-r from-red-500 to-red-400 shadow-lg shadow-red-500/50" style={{ width: `${stats.accuracy}%` }} />
            </div>
          </div>
        </div>

        {/* Characters Card */}
        <div className="group relative">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-yellow-600 to-yellow-400 rounded-xl blur opacity-40 group-hover:opacity-70 transition duration-500" />
          <div className="relative bg-gradient-to-br from-yellow-900/40 to-yellow-900/10 border-2 border-yellow-700/50 rounded-xl p-6 text-center space-y-3 backdrop-blur-sm hover:border-yellow-600 transition-all">
            <div className="text-gray-300 text-sm font-bold uppercase tracking-widest">⌨️ Characters</div>
            <div className="text-5xl font-black text-yellow-300 drop-shadow-lg">{stats.correctChars}</div>
            <div className="text-xs text-gray-400">Typed correctly</div>
            <div className="h-2 bg-yellow-900/50 rounded-full overflow-hidden mt-3">
              <div className="h-full bg-gradient-to-r from-yellow-500 to-yellow-400 shadow-lg shadow-yellow-500/50" style={{ width: `${Math.min(100, (stats.correctChars / stats.totalChars) * 100)}%` }} />
            </div>
          </div>
        </div>

        {/* Errors Card */}
        <div className="group relative">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-red-600 to-red-400 rounded-xl blur opacity-40 group-hover:opacity-70 transition duration-500" />
          <div className="relative bg-gradient-to-br from-red-900/40 to-red-900/10 border-2 border-red-700/50 rounded-xl p-6 text-center space-y-3 backdrop-blur-sm hover:border-red-600 transition-all">
            <div className="text-gray-300 text-sm font-bold uppercase tracking-widest">❌ Errors</div>
            <div className="text-5xl font-black text-red-300 drop-shadow-lg">{stats.errors}</div>
            <div className="text-xs text-gray-400">Mistakes made</div>
            <div className="h-2 bg-red-900/50 rounded-full overflow-hidden mt-3">
              <div className="h-full bg-gradient-to-r from-red-500 to-red-400 shadow-lg shadow-red-500/50" style={{ width: `${Math.min(100, (stats.errors / stats.totalChars) * 100)}%` }} />
            </div>
          </div>
        </div>
      </div>

      {/* Feedback Message */}
      <div className="relative z-10 group">
        <div className="absolute -inset-1 bg-gradient-to-r from-orange-600/20 to-red-600/20 rounded-2xl blur-lg opacity-50 group-hover:opacity-100 transition duration-500" />
        <div className="relative bg-gray-800/50 border-2 border-orange-700/50 rounded-2xl p-8 space-y-4 backdrop-blur-sm hover:border-orange-600/50 transition-all">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="text-2xl">💡</span>
            What to improve:
          </h3>

          <div className="space-y-2">
            {stats.accuracy < 70 && (
              <div className="flex items-start gap-3 text-sm">
                <span className="text-orange-400 font-bold mt-1">→</span>
                <span className="text-gray-300">Accuracy is below 70% - focus on typing carefully rather than fast</span>
              </div>
            )}

            {stats.wpm < 30 && (
              <div className="flex items-start gap-3 text-sm">
                <span className="text-orange-400 font-bold mt-1">→</span>
                <span className="text-gray-300">Your WPM is quite low - try the shorter challenges first to build confidence</span>
              </div>
            )}

            {stats.accuracy >= 70 && stats.wpm >= 30 && (
              <div className="flex items-start gap-3 text-sm">
                <span className="text-orange-400 font-bold mt-1">→</span>
                <span className="text-gray-300">You're on the right track! Keep practicing to improve both speed and accuracy</span>
              </div>
            )}

            <div className="flex items-start gap-3 text-sm">
              <span className="text-orange-400 font-bold mt-1">→</span>
              <span className="text-gray-300">Take breaks between attempts to maintain focus and avoid fatigue</span>
            </div>

            <div className="flex items-start gap-3 text-sm">
              <span className="text-orange-400 font-bold mt-1">→</span>
              <span className="text-gray-300">Practice consistently - even 5-10 minutes daily will improve your skills</span>
            </div>
          </div>
        </div>
      </div>

      {/* Motivation Section */}
      <div className="relative z-10 bg-gradient-to-r from-purple-900/20 to-blue-900/20 border-2 border-purple-700/50 rounded-2xl p-8 text-center space-y-3">
        <div className="text-3xl">🚀</div>
        <p className="text-white font-bold text-lg">Don't Give Up!</p>
        <p className="text-gray-400 text-sm leading-relaxed">
          Every typing champion started where you are. With consistent practice, you'll see dramatic improvements. 
          Try again and beat your current score!
        </p>
      </div>

      {/* Action Buttons - Fixed positioning */}
      <div className="relative z-10 flex flex-col sm:flex-row gap-4 justify-center w-full">
        <Button
          onClick={onRetry}
          className="gap-2 bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 shadow-xl hover:shadow-2xl hover:shadow-orange-500/50 sm:flex-1 rounded-xl font-bold text-lg py-6 transition-all hover:scale-105"
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

        <Button
          variant="outline"
          className="gap-2 border-gray-600 hover:bg-gray-800/50 border-2 sm:flex-1 rounded-xl font-bold text-lg py-6 transition-all hover:border-gray-500"
          onClick={() => window.location.href = '/typing-race'}
        >
          <TrendingUp className="w-5 h-5" />
          Home
        </Button>
      </div>

      <style>{`
        .delay-1000 { animation-delay: 1000ms; }
      `}</style>
    </div>
  );
}
