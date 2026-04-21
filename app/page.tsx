'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';

export default function Home() {
  const [isExpanded, setIsExpanded] = useState(true);
  const [activeTab, setActiveTab] = useState('home');
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [showViewAll, setShowViewAll] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const mainNavItems = [
    { id: 'home', label: 'Home', icon: (
      <svg className="w-9 h-9" fill="currentColor" viewBox="0 0 24 24">
        <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
      </svg>
    )},
    { id: 'new', label: 'New', badge: '239', icon: (
      <svg className="w-9 h-9" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm1-13h-2v6h2V7zm0 8h-2v2h2v-2z" />
      </svg>
    )},
    { id: 'popular', label: 'Popular', icon: (
      <svg className="w-9 h-9" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
      </svg>
    )},
  ];

  const categoryItems = [
    { name: 'Train your brain', icon: (<svg className="w-9 h-9" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4z" /></svg>) },
    { name: 'Solo', icon: (<svg className="w-9 h-9" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" /></svg>) },
    { name: 'Multiplayer', icon: (<svg className="w-9 h-9" fill="currentColor" viewBox="0 0 24 24"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm8 0h-3.1c.07.32.1.66.1 1 0 .34-.03.68-.1 1H24v-2zm-4 4h-2.02c.32.62.52 1.34.52 2.11V19h6v-2c0-1.1-.9-2-2-2h-2.5zM8 11c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm8 2h-2.5c-.97 0-1.82.5-2.33 1.25.52.75.83 1.67.83 2.67v.08h10V15c0-1.1-.9-2-2-2h-4zM0 11h3.1c-.07.32-.1.66-.1 1 0 .34.03.68.1 1H0v-2zm4 4h2.02c-.32.62-.52 1.34-.52 2.11V19h-6v-2c0-1.1.9-2 2-2H4z" /></svg>) },
    { name: 'Reading', icon: (<svg className="w-9 h-9" fill="currentColor" viewBox="0 0 24 24"><path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>) },
    { name: 'Memory', icon: (<svg className="w-9 h-9" fill="currentColor" viewBox="0 0 24 24"><path d="M15 9H9v6h6V9zm-2 4h-2v-2h2v2zm8-2V9h-2V7c0-1.1-.9-2-2-2h-2V3h-2v2h-2V3H9v2H7c-1.1 0-2 .9-2 2v2H3v2h2v2H3v2h2v2c0 1.1.9 2 2 2h2v2h2v-2h2v2h2v-2h2c1.1 0 2-.9 2-2v-2h2v-2h-2v-2h2zm-4 6H7V7h10v10z" /></svg>) },
    { name: '5-minute fun', icon: (<svg className="w-9 h-9" fill="currentColor" viewBox="0 0 24 24"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" /></svg>) },
    { name: 'Educational', icon: (<svg className="w-9 h-9" fill="currentColor" viewBox="0 0 24 24"><path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3z" /></svg>) },
    { name: 'Puzzles', icon: (<svg className="w-9 h-9" fill="currentColor" viewBox="0 0 24 24"><path d="M20.5 11H19V7c0-1.1-.9-2-2-2h-4V3.5C13 2.12 11.88 1 10.5 1S8 2.12 8 3.5V5H4c-1.1 0-1.99.9-1.99 2v3.8h1.5c1.49 0 2.7 1.21 2.7 2.7s-1.21 2.7-2.7 2.7H2V20c0 1.1.9 2 2 2h3.8v-1.5c0-1.49 1.21-2.7 2.7-2.7 1.49 0 2.7 1.21 2.7 2.7V22H17c1.1 0 2-.9 2-2v-4h1.5c1.38 0 2.5-1.12 2.5-2.5S21.88 11 20.5 11z" /></svg>) },
    { name: 'For Kids', icon: (<svg className="w-9 h-9" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4z" /></svg>) },
    { name: 'Typing', icon: (<svg className="w-9 h-9" fill="currentColor" viewBox="0 0 24 24"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H4V6h16v12zM7 10h2v2H7zm4 0h2v2h-2zm4 0h2v2h-2z" /></svg>) },
  ];

  const allGames = [
    { id: 1, title: 'Reading Club', description: 'Social reading with friends', category: 'Educational', image: '/images/featured-reading.png', rating: '88', tag: 'Featured', tagColor: 'bg-purple-600', players: '2.3k', link: '/reading-club', isNew: false, isPopular: true },
    { id: 2, title: 'Math Challenge', description: 'Solve equations, beat the clock', category: 'Math', image: '/images/featured-math.png', rating: '82', tag: 'New', tagColor: 'bg-green-600', players: '1.8k', link: '#', isNew: true, isPopular: false },
    { id: 3, title: 'Memory Match', description: 'Train your brain with pairs', category: 'Memory', image: '/images/featured-memory.png', rating: '85', tag: 'Popular', tagColor: 'bg-orange-600', players: '3.1k', link: '#', isNew: false, isPopular: true },
    { id: 4, title: 'Puzzle Master', description: 'Solve challenging puzzles', category: 'Puzzles', image: '/images/featured-puzzle.png', rating: '90', tag: 'Trending', tagColor: 'bg-blue-600', players: '1.5k', link: '#', isNew: false, isPopular: true },
    { id: 5, title: 'Typing Race', description: 'Race against time, type fast', category: 'Typing', image: '/images/recommended-typing.png', rating: '79', tag: 'Hot', tagColor: 'bg-red-600', players: '2.1k', link: '#', isNew: true, isPopular: false },
    { id: 6, title: 'Fun Grammar', description: 'Learn grammar with fun games', category: 'Grammar', image: '/images/recommended-grammar.png', rating: '84', tag: 'New', tagColor: 'bg-green-600', players: '1.2k', link: '#', isNew: true, isPopular: false },
    { id: 7, title: 'Word Search', description: 'Find hidden words', category: 'Puzzles', image: '/images/featured-puzzle.png', rating: '76', tag: '', tagColor: '', players: '0.9k', link: '#', isNew: true, isPopular: false },
    { id: 8, title: 'Speed Math', description: 'Quick math challenges', category: 'Math', image: '/images/featured-math.png', rating: '83', tag: '', tagColor: '', players: '1.4k', link: '#', isNew: false, isPopular: true },
    { id: 9, title: 'Spelling Bee', description: 'Test your spelling skills', category: 'Educational', image: '/images/featured-reading.png', rating: '81', tag: '', tagColor: '', players: '1.1k', link: '#', isNew: true, isPopular: false },
    { id: 10, title: 'Logic Puzzles', description: 'Challenge your mind', category: 'Puzzles', image: '/images/featured-puzzle.png', rating: '87', tag: 'Hot', tagColor: 'bg-red-600', players: '1.7k', link: '#', isNew: false, isPopular: true },
  ];

  // Filter games based on tab AND search query
  const getFilteredGames = () => {
    let filtered = allGames;
    
    // Filter by tab
    if (activeTab === 'new') {
      filtered = filtered.filter(g => g.isNew);
    } else if (activeTab === 'popular') {
      filtered = filtered.filter(g => g.isPopular);
    }
    
    // Filter by search query
    if (searchQuery.trim() !== '') {
      filtered = filtered.filter(g => 
        g.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        g.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (g.description && g.description.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }
    
    return filtered;
  };

  const filteredGames = getFilteredGames();
  const featuredGames = filteredGames.slice(0, 6);
  const recommendedGames = filteredGames.slice(0, 5);
  const showRecommended = activeTab === 'home' && searchQuery === '';
  const displayGames = showViewAll ? filteredGames : featuredGames;

  return (
    <main className="min-h-screen bg-[#0f1219]">
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
                  placeholder="Find game or genre" 
                  className="bg-transparent text-white text-xl ml-4 outline-none placeholder:text-gray-500 w-full"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setShowViewAll(false);
                  }}
                />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="ml-2 p-1 hover:bg-gray-700 rounded-full transition"
                  >
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
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
        <aside 
          className={`fixed left-0 top-[113px] bottom-0 bg-[#1a1f2b] border-r border-gray-800 overflow-y-auto overflow-x-hidden transition-all duration-300 ease-in-out ${isExpanded ? 'w-80' : 'w-32'}`}
          onMouseEnter={() => setIsExpanded(true)}
          onMouseLeave={() => { setIsExpanded(false); setHoveredItem(null); }}
        >
          <div className="py-4">
            {mainNavItems.map((item) => (
              <button
                key={item.id}
                onClick={() => { setActiveTab(item.id); setShowViewAll(false); setSearchQuery(''); }}
                onMouseEnter={() => setHoveredItem(item.id)}
                onMouseLeave={() => setHoveredItem(null)}
                className={`w-full flex items-center justify-between px-5 py-4 transition-all duration-200 ${
                  activeTab === item.id ? 'bg-purple-600 text-white' : hoveredItem === item.id ? 'bg-gray-800 text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-4">
                  <span className="w-9 h-9 flex items-center justify-center flex-shrink-0">{item.icon}</span>
                  <span className={`font-medium text-xl whitespace-nowrap transition-opacity duration-200 ${isExpanded ? 'opacity-100' : 'opacity-0 hidden'}`}>{item.label}</span>
                </div>
                {item.badge && isExpanded && <span className="text-base text-gray-400">{item.badge}</span>}
              </button>
            ))}

            <div className="my-4 border-t border-gray-800"></div>

            <div className="px-5 py-2">
              <span className={`text-base font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap transition-opacity duration-200 ${isExpanded ? 'opacity-100' : 'opacity-0 hidden'}`}>All categories</span>
              {!isExpanded && <div className="flex justify-center"><svg className="w-9 h-9 text-gray-500" fill="currentColor" viewBox="0 0 24 24"><path d="M4 6h16v2H4V6zm0 5h16v2H4v-2zm0 5h10v2H4v-2z" /></svg></div>}
            </div>

            {categoryItems.map((category) => (
              <Link
                key={category.name}
                href="#"
                onMouseEnter={() => setHoveredItem(category.name)}
                onMouseLeave={() => setHoveredItem(null)}
                className={`flex items-center gap-4 px-5 py-4 transition-all duration-200 ${
                  hoveredItem === category.name ? 'bg-gray-800 text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                <span className="w-9 h-9 flex items-center justify-center flex-shrink-0">{category.icon}</span>
                <span className={`font-medium text-xl whitespace-nowrap transition-opacity duration-200 ${isExpanded ? 'opacity-100' : 'opacity-0 hidden'}`}>{category.name}</span>
              </Link>
            ))}
          </div>
        </aside>

        <div className={`flex-1 transition-all duration-300 ${isExpanded ? 'ml-80' : 'ml-32'}`}>
          <div className="p-6 pt-10">
            {/* Search Results Info */}
            {searchQuery && (
              <div className="mb-6">
                <p className="text-gray-400 text-lg">
                  Search results for "<span className="text-white">{searchQuery}</span>" 
                  <span className="ml-2">({filteredGames.length} games found)</span>
                </p>
              </div>
            )}

            {/* No Results Message */}
            {searchQuery && filteredGames.length === 0 && (
              <div className="text-center py-20">
                <svg className="w-20 h-20 text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <h3 className="text-2xl text-white font-semibold mb-2">No games found</h3>
                <p className="text-gray-400">Try searching for something else</p>
              </div>
            )}

            {/* Recommended Section - Only show when not searching and on home tab */}
            {showRecommended && !showViewAll && filteredGames.length > 0 && (
              <section className="mb-10">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-3xl font-semibold text-white">Recommended for you</h2>
                  <button onClick={() => setShowViewAll(true)} className="text-xl text-purple-400 hover:text-purple-300 transition">View all</button>
                </div>
                <div className="grid grid-cols-5 gap-4">
                  {recommendedGames.map((game) => (
                    <Link key={game.id} href={game.link} className="group">
                      <div className="relative rounded-xl overflow-hidden border border-gray-800 hover:border-purple-500/50 transition-all duration-300 hover:scale-[1.02]">
                        <div className="aspect-square relative">
                          <Image src={game.image} alt={game.title} fill className="object-cover" />
                          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition"></div>
                          <div className="absolute top-2 right-2">
                            <span className="bg-black/60 backdrop-blur-sm text-white text-sm font-semibold px-2 py-1 rounded">{game.rating}</span>
                          </div>
                          {game.tag && (
                            <div className="absolute top-2 left-2">
                              <span className={`px-2 py-1 rounded text-xs font-semibold text-white ${game.tagColor}`}>{game.tag}</span>
                            </div>
                          )}
                        </div>
                        <div className="p-3 bg-[#1a1f2b]">
                          <h3 className="text-white text-base font-semibold truncate group-hover:text-purple-300 transition">{game.title}</h3>
                          <p className="text-gray-400 text-sm mt-0.5">{game.category}</p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* Featured Games / Search Results */}
            {filteredGames.length > 0 && (
              <section>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-3xl font-semibold text-white">
                    {searchQuery ? 'Search Results' : showViewAll ? 'All Games' : activeTab === 'new' ? 'New Games' : activeTab === 'popular' ? 'Popular Games' : 'Featured Games'}
                  </h2>
                  {!showViewAll && !searchQuery && (
                    <button onClick={() => setShowViewAll(true)} className="text-xl text-purple-400 hover:text-purple-300 transition">View all</button>
                  )}
                  {(showViewAll || searchQuery) && filteredGames.length > 6 && (
                    <button onClick={() => { setShowViewAll(false); setSearchQuery(''); }} className="text-xl text-purple-400 hover:text-purple-300 transition">Back</button>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {displayGames.map((game: any) => (
                    <Link key={game.id} href={game.link} className="group">
                      <div className="relative rounded-xl overflow-hidden border border-gray-800 hover:border-purple-500/50 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-purple-500/10">
                        <div className="aspect-video relative">
                          <Image src={game.image} alt={game.title} fill className="object-cover" />
                          <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition"></div>
                          {game.tag && (
                            <div className="absolute top-3 left-3">
                              <span className={`px-3 py-1.5 rounded-lg text-xs font-semibold text-white ${game.tagColor}`}>{game.tag}</span>
                            </div>
                          )}
                        </div>
                        <div className="p-4 bg-[#1a1f2b]">
                          <h3 className="text-white font-semibold text-lg group-hover:text-purple-300 transition">{game.title}</h3>
                          <p className="text-gray-400 text-sm mt-1">{game.category}</p>
                          <div className="flex items-center gap-2 mt-3">
                            <span className="text-sm text-gray-500">{game.players} playing</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}