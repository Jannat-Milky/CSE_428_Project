'use client';

import { Trophy, Medal, TrendingUp } from 'lucide-react';

interface LeaderboardEntry {
  id: string;
  rank: number;
  username: string;
  wpm: number;
  accuracy: number;
  date: string;
}

interface LeaderboardProps {
  entries?: LeaderboardEntry[];
}

export function Leaderboard({ entries = [] }: LeaderboardProps) {
  // Sample data if no entries provided
  const sampleEntries: LeaderboardEntry[] = [
    { id: '1', rank: 1, username: 'SpeedDemon', wpm: 142, accuracy: 98, date: '2 hours ago' },
    { id: '2', rank: 2, username: 'KeyMaster', wpm: 128, accuracy: 96, date: '4 hours ago' },
    { id: '3', rank: 3, username: 'FlashFinger', wpm: 115, accuracy: 94, date: '6 hours ago' },
    { id: '4', rank: 4, username: 'QuickType', wpm: 108, accuracy: 92, date: '1 day ago' },
    { id: '5', rank: 5, username: 'ProTyper', wpm: 98, accuracy: 91, date: '2 days ago' },
  ];

  const displayEntries = entries.length > 0 ? entries : sampleEntries;

  const getMedalIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-5 h-5 text-yellow-400" />;
      case 2:
        return <Medal className="w-5 h-5 text-gray-400" />;
      case 3:
        return <Medal className="w-5 h-5 text-orange-400" />;
      default:
        return <TrendingUp className="w-5 h-5 text-blue-400" />;
    }
  };

  const getBgColor = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-gradient-to-r from-yellow-900/30 to-yellow-800/20 border-yellow-700/50';
      case 2:
        return 'bg-gradient-to-r from-gray-800/30 to-gray-700/20 border-gray-600/50';
      case 3:
        return 'bg-gradient-to-r from-orange-900/30 to-orange-800/20 border-orange-700/50';
      default:
        return 'bg-gray-800/30 border-gray-700/50';
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Trophy className="w-6 h-6 text-yellow-400" />
          <h3 className="text-2xl font-bold">Leaderboard</h3>
        </div>
        <p className="text-gray-400 text-sm">Top performers in typing races</p>
      </div>

      {/* Leaderboard Table */}
      <div className="space-y-3">
        {displayEntries.map((entry) => (
          <div
            key={entry.id}
            className={`flex items-center gap-4 p-4 rounded-lg border transition-all hover:shadow-lg ${getBgColor(entry.rank)}`}
          >
            {/* Rank */}
            <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-gray-900 border border-gray-700">
              <div className="flex items-center gap-2">
                {getMedalIcon(entry.rank)}
              </div>
            </div>

            {/* Username */}
            <div className="flex-1">
              <div className="font-semibold text-white">{entry.username}</div>
              <div className="text-xs text-gray-500">{entry.date}</div>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-6">
              <div className="text-right">
                <div className="text-lg font-bold text-blue-400">{entry.wpm} WPM</div>
                <div className="text-xs text-gray-500">Words/Min</div>
              </div>

              <div className="text-right">
                <div className="text-lg font-bold text-green-400">{entry.accuracy}%</div>
                <div className="text-xs text-gray-500">Accuracy</div>
              </div>
            </div>

            {/* Rank Badge */}
            <div className="text-right">
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-blue-700 border border-blue-500">
                <span className="font-bold text-white text-sm">#{entry.rank}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Stats Footer */}
      <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-700">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-400">{displayEntries[0]?.wpm || 0}</div>
          <div className="text-xs text-gray-500">Highest WPM</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-400">{Math.round(displayEntries.reduce((sum, e) => sum + e.accuracy, 0) / displayEntries.length)}%</div>
          <div className="text-xs text-gray-500">Avg Accuracy</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-400">{displayEntries.length}</div>
          <div className="text-xs text-gray-500">Total Races</div>
        </div>
      </div>
    </div>
  );
}
