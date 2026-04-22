'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import ChallengesList from '@/components/math-challenges/challenges-list';
import MathChallenge from '@/components/math-challenges/math-challenge';
import ChallengeResults from '@/components/math-challenges/challenge-results';

export default function MathChallengesPage() {
  const [view, setView] = useState<'list' | 'challenge' | 'results'>('list');
  const [selectedChallenge, setSelectedChallenge] = useState<any>(null);
  const [results, setResults] = useState<any>(null);
  const [isExpanded, setIsExpanded] = useState(true);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const handleStartChallenge = (challenge: any) => {
    setSelectedChallenge(challenge);
    setView('challenge');
  };

  const handleCompleteChallenge = (challengeResults: any) => {
    setResults(challengeResults);
    setView('results');
  };

  const handleBackToList = () => {
    setView('list');
    setSelectedChallenge(null);
    setResults(null);
  };

  const mainNavItems = [
    { id: 'home', label: 'Home', icon: (
      <svg className="w-9 h-9" fill="currentColor" viewBox="0 0 24 24">
        <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
      </svg>
    ), link: '/' },
    { id: 'challenges', label: 'Challenges', icon: (
      <svg className="w-9 h-9" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm1-13h-2v6h2V7zm0 8h-2v2h2v-2z" />
      </svg>
    ), link: '/math-challenges' },
  ];

  const categoryItems = [
    { name: 'Difficulty', icon: (<svg className="w-9 h-9" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4z" /></svg>) },
    { name: 'Topics', icon: (<svg className="w-9 h-9" fill="currentColor" viewBox="0 0 24 24"><path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3z" /></svg>) },
    { name: 'Progress', icon: (<svg className="w-9 h-9" fill="currentColor" viewBox="0 0 24 24"><path d="M19 12h-2v-2h-2v2h-2v2h2v2h2v-2h2v-2zm-8-6H9v2H7V6h4zm0 4H9v2H7v-2h4zm0 4H9v2H7v-2h4zM19 4h-8v2h8V4z" /></svg>) },
    { name: 'Leaderboard', icon: (<svg className="w-9 h-9" fill="currentColor" viewBox="0 0 24 24"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm8 0h-3.1c.07.32.1.66.1 1 0 .34-.03.68-.1 1H24v-2zm-4 4h-2.02c.32.62.52 1.34.52 2.11V19h6v-2c0-1.1-.9-2-2-2h-2.5zM8 11c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm8 2h-2.5c-.97 0-1.82.5-2.33 1.25.52.75.83 1.67.83 2.67v.08h10V15c0-1.1-.9-2-2-2h-4zM0 11h3.1c-.07.32-.1.66-.1 1 0 .34.03.68.1 1H0v-2zm4 4h2.02c-.32.62-.52 1.34-.52 2.11V19h-6v-2c0-1.1.9-2 2-2H4z" /></svg>) },
  ];

  return (
    <main className="min-h-screen bg-[#0f1219]">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#1a1f2b] border-b border-gray-800">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link href="/" className="flex items-center gap-4">
                <div className="relative w-24 h-24">
                  <Image src="/images/rabbit-logo.png" alt="SkillJoy Rabbit" fill className="object-contain" />
                </div>
                <div className="flex flex-col">
                  <span className="text-6xl font-bold tracking-wide bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent">skilljoy</span>
                  <span className="text-base text-gray-400 tracking-wider">PLAY·LEARN·GROW</span>
                </div>
              </Link>
            </div>
            <div className="flex-1 max-w-4xl mx-8">
              <div className="flex items-center bg-[#2a3040] rounded-full px-8 py-5 border border-gray-700 hover:border-gray-600 transition">
                <svg className="w-7 h-7 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input 
                  type="text" 
                  placeholder="Find math topic" 
                  className="bg-transparent text-white text-xl ml-4 outline-none placeholder:text-gray-500 w-full"
                />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button className="p-4 text-gray-400 hover:text-white hover:bg-gray-800 rounded-full transition">
                <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.33-.02-.64-.06-.94l2.02-1.58c.18-.14.23-.38.12-.56l-1.89-3.28c-.12-.19-.36-.26-.56-.18l-2.38.96c-.5-.38-1.06-.68-1.66-.88L14.45 3.5c-.04-.2-.2-.34-.4-.34h-3.78c-.2 0-.36.14-.4.34l-.3 2.52c-.6.2-1.16.5-1.66.88l-2.38-.96c-.2-.08-.44-.01-.56.18l-1.89 3.28c-.12.19-.07.42.12.56l2.02 1.58c-.04.3-.06.61-.06.94 0 .33.02.64.06.94l-2.02 1.58c-.18.14-.23.38-.12.56l1.89 3.28c.12.19.36.26.56.18l2.38-.96c.5.38 1.06.68 1.66.88l.3 2.52c.04.2.2.34.4.34h3.78c.2 0 .36-.14.4-.34l.3-2.52c.6-.2 1.16-.5 1.66-.88l2.38.96c.2.08.44.01.56-.18l1.89-3.28c.12-.19.07-.42-.12-.56l-2.02-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z" />
                </svg>
              </button>
              <button className="flex items-center gap-2 px-8 py-4 bg-purple-600 hover:bg-purple-700 rounded-full transition">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                </svg>
                <span className="text-xl font-medium text-white">Log in</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="pt-[113px] flex">
        {/* Sidebar */}
        <aside 
          className={`fixed left-0 top-[113px] bottom-0 bg-[#1a1f2b] border-r border-gray-800 overflow-y-auto overflow-x-hidden transition-all duration-300 ease-in-out ${isExpanded ? 'w-80' : 'w-32'}`}
          onMouseEnter={() => setIsExpanded(true)}
          onMouseLeave={() => { setIsExpanded(false); setHoveredItem(null); }}
        >
          <div className="py-4">
            {mainNavItems.map((item) => (
              <Link
                key={item.id}
                href={item.link}
                onMouseEnter={() => setHoveredItem(item.id)}
                onMouseLeave={() => setHoveredItem(null)}
                className={`w-full flex items-center justify-between px-5 py-4 transition-all duration-200 ${
                  item.id === 'challenges' ? 'bg-purple-600 text-white' : hoveredItem === item.id ? 'bg-gray-800 text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-4">
                  <span className="w-9 h-9 flex items-center justify-center flex-shrink-0">{item.icon}</span>
                  <span className={`font-medium text-xl whitespace-nowrap transition-opacity duration-200 ${isExpanded ? 'opacity-100' : 'opacity-0 hidden'}`}>{item.label}</span>
                </div>
              </Link>
            ))}

            <div className="my-4 border-t border-gray-800"></div>

            <div className="px-5 py-2">
              <span className={`text-base font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap transition-opacity duration-200 ${isExpanded ? 'opacity-100' : 'opacity-0 hidden'}`}>Categories</span>
              {!isExpanded && <div className="flex justify-center"><svg className="w-9 h-9 text-gray-500" fill="currentColor" viewBox="0 0 24 24"><path d="M4 6h16v2H4V6zm0 5h16v2H4v-2zm0 5h10v2H4v-2z" /></svg></div>}
            </div>

            {categoryItems.map((category) => (
              <button
                key={category.name}
                onMouseEnter={() => setHoveredItem(category.name)}
                onMouseLeave={() => setHoveredItem(null)}
                className={`w-full flex items-center gap-4 px-5 py-4 transition-all duration-200 ${
                  hoveredItem === category.name ? 'bg-gray-800 text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                <span className="w-9 h-9 flex items-center justify-center flex-shrink-0">{category.icon}</span>
                <span className={`font-medium text-xl whitespace-nowrap transition-opacity duration-200 ${isExpanded ? 'opacity-100' : 'opacity-0 hidden'}`}>{category.name}</span>
              </button>
            ))}
          </div>
        </aside>

        {/* Main Content */}
        <div className={`flex-1 transition-all duration-300 ${isExpanded ? 'ml-80' : 'ml-32'}`}>
          <div className="p-6 pt-10">
            {/* Back Button - Only show when not in list view */}
            {view !== 'list' && (
              <div className="mb-6">
                <button 
                  onClick={handleBackToList}
                  className="flex items-center gap-2 px-4 py-2 text-purple-400 hover:text-purple-300 transition"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Back to Challenges
                </button>
              </div>
            )}

            {/* Content Views */}
            {view === 'list' && (
              <div className="space-y-6">
                <div className="mb-8">
                  <h1 className="text-4xl font-bold text-white mb-2">Math Challenges</h1>
                  <p className="text-gray-400 text-lg">Test your mathematical skills with our interactive challenges</p>
                </div>
                <ChallengesList onSelectChallenge={handleStartChallenge} />
              </div>
            )}

            {view === 'challenge' && selectedChallenge && (
              <div className="bg-[#1a1f2b] rounded-xl p-8 border border-gray-800">
                <MathChallenge 
                  challenge={selectedChallenge} 
                  onComplete={handleCompleteChallenge}
                />
              </div>
            )}

            {view === 'results' && results && (
              <div className="bg-[#1a1f2b] rounded-xl p-8 border border-gray-800">
                <ChallengeResults 
                  results={results}
                  challenge={selectedChallenge}
                  onBackToList={handleBackToList}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
