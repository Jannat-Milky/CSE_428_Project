'use client';

import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { mathChallenges } from './challenges-data';
import { Clock, BookOpen, Zap } from 'lucide-react';

interface ChallengesListProps {
  onSelectChallenge: (challenge: any) => void;
}

export default function ChallengesList({ onSelectChallenge }: ChallengesListProps) {
  return (
    <div className="w-full space-y-6">
      {/* Filter/Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-purple-900/30 to-purple-800/20 rounded-xl p-6 border border-purple-800/50">
          <p className="text-gray-400 text-sm font-semibold uppercase tracking-wider mb-2">Total Challenges</p>
          <div className="text-4xl font-bold text-white">{mathChallenges.length}</div>
          <p className="text-gray-500 text-sm mt-2">Available to complete</p>
        </div>

        <div className="bg-gradient-to-br from-blue-900/30 to-blue-800/20 rounded-xl p-6 border border-blue-800/50">
          <p className="text-gray-400 text-sm font-semibold uppercase tracking-wider mb-2">Difficulty Levels</p>
          <div className="text-4xl font-bold text-white">3</div>
          <p className="text-gray-500 text-sm mt-2">Easy, Medium, Hard</p>
        </div>

        <div className="bg-gradient-to-br from-orange-900/30 to-orange-800/20 rounded-xl p-6 border border-orange-800/50">
          <p className="text-gray-400 text-sm font-semibold uppercase tracking-wider mb-2">Categories</p>
          <div className="text-4xl font-bold text-white">4</div>
          <p className="text-gray-500 text-sm mt-2">Different math topics</p>
        </div>
      </div>

      {/* Challenges Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {mathChallenges.map((challenge) => (
          <div 
            key={challenge.id} 
            className="bg-[#1a1f2b] rounded-xl border border-gray-800 hover:border-purple-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/10 overflow-hidden hover:scale-[1.02] transform duration-300"
          >
            {/* Challenge Image */}
            <div className="relative w-full h-48 bg-gray-800 overflow-hidden">
              <Image
                src={challenge.image}
                alt={challenge.title}
                fill
                className="object-cover hover:scale-110 transition-transform duration-300"
                onError={(e) => {
                  e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 200"%3E%3Crect fill="%23374151" width="400" height="200"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="16" fill="%239ca3af"%3EImage not available%3C/text%3E%3C/svg%3E';
                }}
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#1a1f2b] via-transparent to-transparent opacity-60"></div>
            </div>

            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <span className={`px-4 py-2 rounded-lg text-sm font-bold uppercase tracking-wider transition-all duration-300 hover:scale-110 cursor-default ${challenge.difficultyColor}`}>
                  {challenge.difficulty}
                </span>
                <span className="text-xs text-gray-500 bg-gray-800 px-2 py-1 rounded">
                  {challenge.category}
                </span>
              </div>

              <h3 className="text-xl font-bold text-white mb-2">{challenge.title}</h3>
              <p className="text-gray-400 text-sm mb-4">{challenge.description}</p>

              {/* Challenge Stats */}
              <div className="grid grid-cols-2 gap-4 py-4 border-y border-gray-700">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-blue-400" />
                  <div>
                    <p className="text-xs text-gray-500">Questions</p>
                    <p className="font-bold text-white">{challenge.questions.length}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-orange-400" />
                  <div>
                    <p className="text-xs text-gray-500">Time</p>
                    <p className="font-bold text-white">{challenge.estimatedTime}</p>
                  </div>
                </div>
              </div>

              {/* Start Button */}
              <button
                onClick={() => onSelectChallenge(challenge)}
                className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white font-semibold rounded-lg transition-all duration-300 group"
              >
                <Zap className="w-4 h-4 group-hover:scale-110 transition-transform" />
                Start Challenge
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Tips Section */}
      <div className="bg-gradient-to-br from-blue-900/20 to-cyan-900/20 rounded-xl p-6 border border-blue-800/50">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          💡 Tips for Success
        </h3>
        <ul className="space-y-3">
          <li className="flex gap-3">
            <span className="text-blue-400 font-bold text-lg">1.</span>
            <span className="text-gray-300">Start with Easy challenges to warm up before attempting harder ones</span>
          </li>
          <li className="flex gap-3">
            <span className="text-blue-400 font-bold text-lg">2.</span>
            <span className="text-gray-300">Take your time to understand each problem before answering</span>
          </li>
          <li className="flex gap-3">
            <span className="text-blue-400 font-bold text-lg">3.</span>
            <span className="text-gray-300">Review incorrect answers to learn from mistakes</span>
          </li>
          <li className="flex gap-3">
            <span className="text-blue-400 font-bold text-lg">4.</span>
            <span className="text-gray-300">Practice regularly to improve your math skills</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
