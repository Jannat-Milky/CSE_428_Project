'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { getGenreStats, getUserName } from '@/app/lib/supabaseStore';

export default function ReadingClubPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [stats, setStats] = useState<Record<string, { books: number; readers: number }>>({});
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
    getUserName(); // Ask for name on first visit
    loadStats();
  }, []);

  const loadStats = async () => {
    setLoading(true);
    const genreStats = await getGenreStats();
    setStats(genreStats);
    setLoading(false);
  };

  const genres = [
    { id: 'horror', name: 'Horror', image: '/images/genres/genre-horror.png' },
    { id: 'scifi', name: 'Sci-Fi', image: '/images/genres/genre-scifi.png' },
    { id: 'fantasy', name: 'Fantasy', image: '/images/genres/genre-fantasy.png' },
    { id: 'mystery', name: 'Mystery', image: '/images/genres/genre-mystery.png' },
    { id: 'romance', name: 'Romance', image: '/images/genres/genre-romance.png' },
    { id: 'adventure', name: 'Adventure', image: '/images/genres/genre-adventure.png' },
  ];

  const filteredGenres = genres.filter(g =>
    g.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalReaders = Object.values(stats).reduce((sum, s) => sum + (s.readers || 0), 0);
  const totalBooks = Object.values(stats).reduce((sum, s) => sum + (s.books || 0), 0);

  if (!mounted) return null;

  return (
    <main className="min-h-screen bg-[#0f1219]">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-[#1a1f2b] border-b border-gray-800">
        <div className="px-8 py-4">
          <div className="flex items-center">
            <Link href="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span className="text-sm">Back to Home</span>
            </Link>
          </div>
        </div>
      </header>

      <div className="pt-[73px] px-8 py-8">
        {/* Title */}
        <div className="flex items-center justify-center mb-8">
          <h1 className="text-6xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent">
            Reading Club
          </h1>
        </div>

        {/* Search */}
        <div className="flex justify-center mb-10">
          <div className="w-full max-w-3xl">
            <div className="flex items-center bg-[#2a3040] rounded-full px-6 py-4 border border-gray-700">
              <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search genres..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent text-white text-lg ml-3 outline-none placeholder:text-gray-500 w-full"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="p-2 hover:bg-gray-700 rounded-full">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Hero */}
        <div className="text-center mb-10">
          <h2 className="text-5xl font-bold mb-3">
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent">
              Choose Your Reading Adventure
            </span>
          </h2>
          <p className="text-gray-400 text-xl">Select a genre to discover books and track your reading</p>
        </div>

        {/* Stats Bar */}
        <div className="flex flex-wrap items-center justify-center gap-8 bg-[#1a1f2b] rounded-2xl py-4 px-8 mb-8 border border-gray-800 max-w-2xl mx-auto">
          <div className="text-center">
            <p className="text-3xl font-bold text-white">{loading ? '...' : totalReaders}</p>
            <p className="text-gray-400 text-sm">Active Readers</p>
          </div>
          <div className="w-px h-8 bg-gray-700"></div>
          <div className="text-center">
            <p className="text-3xl font-bold text-white">{loading ? '...' : totalBooks}</p>
            <p className="text-gray-400 text-sm">Books</p>
          </div>
        </div>

        {/* Featured Genres Label */}
        <div className="max-w-[2100px] mx-auto mb-4">
          <div className="flex items-center gap-3">
            <div className="w-1 h-8 bg-gradient-to-b from-purple-400 to-pink-400 rounded-full"></div>
            <h3 className="text-3xl font-bold text-white">Featured Genres</h3>
          </div>
        </div>

        {/* Genres Grid */}
        {filteredGenres.length === 0 ? (
          <div className="text-center py-20">
            <h3 className="text-2xl text-white font-semibold mb-2">No genres found</h3>
            <p className="text-gray-400">Try searching for something else</p>
          </div>
        ) : (
          <div className="max-w-[2100px] mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              {filteredGenres.map((genre) => {
                const genreStats = stats[genre.id] || { books: 0, readers: 0 };
                return (
                  <Link key={genre.id} href={`/reading-club/${genre.id}`} className="group">
                    <div className="bg-[#1a1f2b] rounded-3xl overflow-hidden border border-gray-800 hover:border-purple-500/50 transition-all duration-300 hover:scale-[1.01] hover:shadow-2xl hover:shadow-purple-500/10 h-full">
                      <div className="relative w-full h-[400px]">
                        <Image 
                          src={genre.image} 
                          alt={genre.name} 
                          fill 
                          className="object-cover" 
                          sizes="(max-width: 1024px) 100vw, 33vw" 
                          unoptimized 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent"></div>
                        <div className="absolute bottom-0 left-0 right-0 p-6">
                          <h3 className="text-5xl font-bold text-white mb-2">{genre.name}</h3>
                          <div className="flex items-center gap-6">
                            <span className="text-gray-200 flex items-center gap-2 text-lg">
                              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                              </svg>
                              {loading ? '...' : genreStats.readers} readers
                            </span>
                            <span className="text-gray-200 flex items-center gap-2 text-lg">
                              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                              </svg>
                              {loading ? '...' : genreStats.books} books
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="p-5 flex items-center justify-end">
                        <span className="text-purple-400 font-medium text-xl flex items-center gap-2 group-hover:gap-3 group-hover:text-purple-300 transition-all">
                          Browse Books 
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}