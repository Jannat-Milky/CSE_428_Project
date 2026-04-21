'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import { 
  getBooksByGenre, 
  addBook, 
  deleteBook, 
  updateBook,
  getBookProgress, 
  updateProgress, 
  getBookDiscussions, 
  addDiscussion,
  getUserName,
  subscribeToBooks,
  subscribeToProgress,
  subscribeToDiscussions,
  Book
} from '@/app/lib/supabaseStore';
import { 
  getStoriesByBook, 
  createStory, 
  getStoryEntries, 
  addStoryEntry,
  deleteStoryEntry,
  updateStoryEntry,
  completeStory,
  subscribeToStories,
  subscribeToStoryEntries,
  Story,
  StoryEntry
} from '@/app/lib/storyStore';

export default function GenrePage() {
  const params = useParams();
  const genre = params.genre as string;
  
  return <BooksContent genre={genre} />;
}

function BooksContent({ genre }: { genre: string }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [books, setBooks] = useState<Book[]>([]);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [showAddBook, setShowAddBook] = useState(false);
  const [showEditBook, setShowEditBook] = useState(false);
  const [showProgress, setShowProgress] = useState(false);
  const [showDiscussion, setShowDiscussion] = useState(false);
  const [showCreativeWriting, setShowCreativeWriting] = useState(false);
  const [newBook, setNewBook] = useState({ title: '', trackingMode: 'chapter' as 'chapter' | 'page', totalChapters: 0, totalPages: 0 });
  const [editBook, setEditBook] = useState<Book | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [progress, setProgress] = useState<any[]>([]);
  const [discussions, setDiscussions] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [userProgress, setUserProgress] = useState({ currentChapter: 0, currentPage: 0 });
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Creative Writing states
  const [stories, setStories] = useState<Story[]>([]);
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  const [storyEntries, setStoryEntries] = useState<StoryEntry[]>([]);
  const [newStoryTitle, setNewStoryTitle] = useState('');
  const [newEntryContent, setNewEntryContent] = useState('');
  const [editingEntryId, setEditingEntryId] = useState<string | null>(null);
  const [editingContent, setEditingContent] = useState('');

  const userName = getUserName();

  const genreInfo: Record<string, { name: string; color: string }> = {
    horror: { name: 'Horror', color: 'from-red-600 to-orange-700' },
    scifi: { name: 'Sci-Fi', color: 'from-cyan-500 to-blue-600' },
    fantasy: { name: 'Fantasy', color: 'from-purple-500 to-pink-600' },
    mystery: { name: 'Mystery', color: 'from-indigo-500 to-purple-600' },
    romance: { name: 'Romance', color: 'from-pink-500 to-rose-600' },
    adventure: { name: 'Adventure', color: 'from-emerald-500 to-green-600' },
  };

  const info = genreInfo[genre] || { name: genre, color: 'from-gray-600 to-gray-700' };

  // Load books and subscribe to realtime updates
  useEffect(() => {
    loadBooksData();
    
    const bookSubscription = subscribeToBooks(genre, (updatedBooks) => {
      setBooks(updatedBooks);
    });
    
    return () => {
      bookSubscription.unsubscribe();
    };
  }, [genre]);

  // Subscribe to progress and discussions when a book is selected
  useEffect(() => {
    if (!selectedBook) return;
    
    const progressSubscription = subscribeToProgress(selectedBook.id, (updatedProgress) => {
      setProgress(updatedProgress);
    });
    
    const discussionSubscription = subscribeToDiscussions(selectedBook.id, (updatedDiscussions) => {
      setDiscussions(updatedDiscussions);
    });
    
    return () => {
      progressSubscription.unsubscribe();
      discussionSubscription.unsubscribe();
    };
  }, [selectedBook]);

  // Subscribe to stories for the selected book
  useEffect(() => {
    if (!selectedBook) return;
    
    const storiesSubscription = subscribeToStories(selectedBook.id, (updatedStories) => {
      setStories(updatedStories);
    });
    
    return () => {
      storiesSubscription.unsubscribe();
    };
  }, [selectedBook]);

  // Subscribe to story entries when a story is selected
  useEffect(() => {
    if (!selectedStory) return;
    
    const entriesSubscription = subscribeToStoryEntries(selectedStory.id, (updatedEntries) => {
      setStoryEntries(updatedEntries);
    });
    
    return () => {
      entriesSubscription.unsubscribe();
    };
  }, [selectedStory]);

  const loadBooksData = async () => {
    setLoading(true);
    const fetchedBooks = await getBooksByGenre(genre);
    setBooks(fetchedBooks || []);
    setLoading(false);
  };

  const handleImageError = (bookId: string) => {
    setImageErrors(prev => ({ ...prev, [bookId]: true }));
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleAddBook = async () => {
    if (!newBook.title) return;
    
    let imagePath = '';
    if (imagePreview) {
      imagePath = imagePreview;
    } else {
      const genreFolder = genre.charAt(0).toUpperCase() + genre.slice(1);
      imagePath = `/images/books/${genreFolder}/book-${genre}-${books.length + 1}.png`;
    }
    
    const added = await addBook({
      title: newBook.title,
      genre,
      image: imagePath,
      trackingMode: newBook.trackingMode,
      totalChapters: newBook.trackingMode === 'chapter' ? newBook.totalChapters : undefined,
      totalPages: newBook.trackingMode === 'page' ? newBook.totalPages : undefined,
    });
    
    if (added) {
      setNewBook({ title: '', trackingMode: 'chapter', totalChapters: 0, totalPages: 0 });
      setSelectedImage(null);
      setImagePreview('');
      setShowAddBook(false);
    }
  };

  const handleEditBook = (book: Book) => {
    setEditBook({...book});
    setShowEditBook(true);
  };

  const handleSaveEdit = async () => {
    if (!editBook) return;
    
    await updateBook(editBook.id, {
      title: editBook.title,
      tracking_mode: editBook.tracking_mode,
      total_chapters: editBook.tracking_mode === 'chapter' ? editBook.total_chapters : null,
      total_pages: editBook.tracking_mode === 'page' ? editBook.total_pages : null,
    });
    
    setShowEditBook(false);
    setEditBook(null);
  };

  const handleDeleteBook = async (bookId: string) => {
    if (confirm('Are you sure you want to delete this book?')) {
      await deleteBook(bookId);
      setSelectedBook(null);
      setShowProgress(false);
      setShowDiscussion(false);
      setShowCreativeWriting(false);
    }
  };

  const handleSelectBook = async (book: Book) => {
    setSelectedBook(book);
    const bookProgress = await getBookProgress(book.id);
    const bookDiscussions = await getBookDiscussions(book.id);
    setProgress(bookProgress);
    setDiscussions(bookDiscussions);
    
    const myProgress = bookProgress.find((p: any) => p.user_name === userName);
    setUserProgress({
      currentChapter: myProgress?.current_chapter || 1,
      currentPage: myProgress?.current_page || 1,
    });
    setShowProgress(true);
  };

  const handleUpdateProgress = async () => {
    if (!selectedBook) return;
    await updateProgress(selectedBook.id, {
      current_chapter: selectedBook.tracking_mode === 'chapter' ? userProgress.currentChapter : undefined,
      current_page: selectedBook.tracking_mode === 'page' ? userProgress.currentPage : undefined,
    });
  };

  const handleAddDiscussion = async () => {
    if (!selectedBook || !newMessage.trim()) return;
    await addDiscussion(selectedBook.id, newMessage, {
      chapter: selectedBook.tracking_mode === 'chapter' ? userProgress.currentChapter : undefined,
      page: selectedBook.tracking_mode === 'page' ? userProgress.currentPage : undefined,
    });
    setNewMessage('');
  };

  // Creative Writing functions
  const loadStories = async () => {
    if (!selectedBook) return;
    const bookStories = await getStoriesByBook(selectedBook.id);
    setStories(bookStories);
  };

  const handleCreateStory = async () => {
    if (!selectedBook || !newStoryTitle.trim()) return;
    const story = await createStory(selectedBook.id, newStoryTitle);
    if (story) {
      setNewStoryTitle('');
      loadStories();
    }
  };

  const handleSelectStory = async (story: Story) => {
    setSelectedStory(story);
    const entries = await getStoryEntries(story.id);
    setStoryEntries(entries);
  };

  const handleAddEntry = async () => {
    if (!selectedStory || !newEntryContent.trim()) return;
    await addStoryEntry(selectedStory.id, newEntryContent);
    setNewEntryContent('');
    const entries = await getStoryEntries(selectedStory.id);
    setStoryEntries(entries);
  };

  const handleDeleteEntry = async (entryId: string) => {
    if (!confirm('Delete your entry?')) return;
    await deleteStoryEntry(entryId);
    if (selectedStory) {
      const entries = await getStoryEntries(selectedStory.id);
      setStoryEntries(entries);
    }
  };

  const handleUpdateEntry = async (entryId: string) => {
    if (!editingContent.trim()) return;
    await updateStoryEntry(entryId, editingContent);
    setEditingEntryId(null);
    setEditingContent('');
    if (selectedStory) {
      const entries = await getStoryEntries(selectedStory.id);
      setStoryEntries(entries);
    }
  };

  const handleCompleteStory = async () => {
    if (!selectedStory) return;
    await completeStory(selectedStory.id);
    loadStories();
  };

  const filteredBooks = books.filter((b: Book) => 
    b.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getDefaultCover = () => {
    const covers: Record<string, string> = {
      horror: '/images/books/Horror/book-horror-1.png',
      fantasy: '/images/books/Fantasy/book-fantasy-1.png',
      romance: '/images/books/romance/book-romance-1.png',
      scifi: '/images/books/sci-fi/book-scifi-1.png',
      mystery: '/images/books/mystery/book-mystery-1.png',
      adventure: '/images/books/adventure/book-adventure-1.png',
    };
    return covers[genre] || '/images/featured-reading.png';
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-[#0f1219] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0f1219]">
      <header className="bg-[#1a1f2b] border-b border-gray-800 sticky top-0 z-40">
        <div className="px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/reading-club" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span className="text-sm">Back to Genres</span>
              </Link>
              <h1 className={`text-3xl font-bold bg-gradient-to-r ${info.color} bg-clip-text text-transparent`}>
                {info.name} Books
              </h1>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="w-80">
                <div className="flex items-center bg-[#2a3040] rounded-full px-5 py-3 border border-gray-700">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input type="text" placeholder="Search books..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-transparent text-white text-base ml-3 outline-none placeholder:text-gray-500 w-full" />
                </div>
              </div>
              <button onClick={() => setShowAddBook(true)} className="px-5 py-3 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition font-medium flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Book
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="px-8 py-8">
        <div className="max-w-[1600px] mx-auto">
          <h2 className="text-2xl font-semibold text-white mb-5">Available Books ({books.length})</h2>
          
          {filteredBooks.length === 0 ? (
            <div className="text-center py-20">
              <svg className="w-20 h-20 text-gray-600 mx-auto mb-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <h3 className="text-2xl text-white font-semibold mb-2">No books yet</h3>
              <p className="text-gray-400 mb-4">Be the first to add a book to this genre!</p>
              <button onClick={() => setShowAddBook(true)} className="px-6 py-3 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition font-medium">
                Add Your First Book
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filteredBooks.map((book: Book) => {
                const hasImageError = imageErrors[book.id];
                const displayImage = book.image && book.image.startsWith('data:') ? book.image : 
                                   (book.image || getDefaultCover());
                
                return (
                  <div key={book.id} className="group">
                    <div className="bg-[#1a1f2b] rounded-xl overflow-hidden border border-gray-800 hover:border-purple-500/50 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl">
                      <div className="aspect-[3/4] relative bg-gradient-to-br from-gray-800 to-gray-900">
                        {!hasImageError && (
                          <Image 
                            src={displayImage} 
                            alt={book.title} 
                            fill 
                            className="object-cover" 
                            sizes="(max-width: 640px) 100vw, 25vw" 
                            unoptimized
                            onError={() => handleImageError(book.id)}
                          />
                        )}
                        
                        {hasImageError && (
                          <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                            <svg className="w-16 h-16 text-white/30 mb-3" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                            <p className="text-white/60 text-sm text-center font-medium">{book.title}</p>
                          </div>
                        )}
                        
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                        
                        <div className="absolute top-3 left-3 flex gap-1">
                          <span className="px-3 py-1 rounded-full text-xs font-semibold text-white bg-purple-600">
                            {book.tracking_mode === 'chapter' 
                              ? `${book.total_chapters || '?'} ch` 
                              : `${book.total_pages || '?'} pg`}
                          </span>
                          <button onClick={() => handleEditBook(book)} className="px-2 py-1 rounded-full text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700">
                            Edit
                          </button>
                        </div>
                        
                        <div className="absolute bottom-0 left-0 right-0 p-4">
                          <h3 className="text-white font-bold text-xl">{book.title}</h3>
                          <p className="text-gray-300 text-sm">Added by {book.added_by_name}</p>
                        </div>
                      </div>
                      <div className="p-4">
                        <div className="flex gap-2">
                          <button onClick={() => handleSelectBook(book)} className="flex-1 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-medium text-sm">
                            View Progress
                          </button>
                          <button onClick={() => handleDeleteBook(book.id)} className="px-3 py-2 bg-red-600/20 text-red-400 rounded-lg hover:bg-red-600/30 transition">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Add Book Modal */}
      {showAddBook && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowAddBook(false)}>
          <div className="bg-[#1a1f2b] rounded-2xl p-6 max-w-md w-full border border-gray-800" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-xl font-bold text-white mb-4">Add New Book</h3>
            
            <input type="text" placeholder="Book Title" value={newBook.title} onChange={(e) => setNewBook({...newBook, title: e.target.value})}
              className="w-full bg-[#2a3040] text-white px-4 py-3 rounded-lg mb-3 outline-none border border-gray-700" />
            
            <div className="mb-3">
              <label className="text-gray-400 text-sm mb-2 block">Book Cover (optional)</label>
              <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageSelect} className="hidden" />
              <div onClick={() => fileInputRef.current?.click()} className="w-full bg-[#2a3040] text-gray-400 px-4 py-3 rounded-lg border border-gray-700 cursor-pointer hover:border-purple-500 transition text-center">
                {selectedImage ? 'Change Image' : 'Browse from device'}
              </div>
              {imagePreview && (
                <div className="mt-2 relative w-24 h-24 rounded-lg overflow-hidden">
                  <Image src={imagePreview} alt="Preview" fill className="object-cover" unoptimized />
                </div>
              )}
            </div>
            
            <div className="mb-3">
              <label className="text-gray-400 text-sm mb-2 block">Tracking Mode</label>
              <div className="flex gap-3">
                <button onClick={() => setNewBook({...newBook, trackingMode: 'chapter'})}
                  className={`flex-1 py-2 rounded-lg transition ${newBook.trackingMode === 'chapter' ? 'bg-purple-600 text-white' : 'bg-[#2a3040] text-gray-400 border border-gray-700'}`}>
                  Chapters
                </button>
                <button onClick={() => setNewBook({...newBook, trackingMode: 'page'})}
                  className={`flex-1 py-2 rounded-lg transition ${newBook.trackingMode === 'page' ? 'bg-purple-600 text-white' : 'bg-[#2a3040] text-gray-400 border border-gray-700'}`}>
                  Pages
                </button>
              </div>
            </div>
            
            {newBook.trackingMode === 'chapter' ? (
              <input type="number" placeholder="Total Chapters" value={newBook.totalChapters || ''} onChange={(e) => setNewBook({...newBook, totalChapters: parseInt(e.target.value) || 0})}
                className="w-full bg-[#2a3040] text-white px-4 py-3 rounded-lg mb-4 outline-none border border-gray-700" />
            ) : (
              <input type="number" placeholder="Total Pages" value={newBook.totalPages || ''} onChange={(e) => setNewBook({...newBook, totalPages: parseInt(e.target.value) || 0})}
                className="w-full bg-[#2a3040] text-white px-4 py-3 rounded-lg mb-4 outline-none border border-gray-700" />
            )}
            
            <div className="flex gap-3">
              <button onClick={handleAddBook} className="flex-1 py-3 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition font-medium">
                Add Book
              </button>
              <button onClick={() => { setShowAddBook(false); setSelectedImage(null); setImagePreview(''); }} className="px-6 py-3 bg-gray-700 text-white rounded-full hover:bg-gray-600 transition">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Book Modal */}
      {showEditBook && editBook && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowEditBook(false)}>
          <div className="bg-[#1a1f2b] rounded-2xl p-6 max-w-md w-full border border-gray-800" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-xl font-bold text-white mb-4">Edit Book</h3>
            
            <input type="text" placeholder="Book Title" value={editBook.title} onChange={(e) => setEditBook({...editBook, title: e.target.value})}
              className="w-full bg-[#2a3040] text-white px-4 py-3 rounded-lg mb-3 outline-none border border-gray-700" />
            
            <div className="mb-3">
              <label className="text-gray-400 text-sm mb-2 block">Tracking Mode</label>
              <div className="flex gap-3">
                <button onClick={() => setEditBook({...editBook, tracking_mode: 'chapter'})}
                  className={`flex-1 py-2 rounded-lg transition ${editBook.tracking_mode === 'chapter' ? 'bg-purple-600 text-white' : 'bg-[#2a3040] text-gray-400 border border-gray-700'}`}>
                  Chapters
                </button>
                <button onClick={() => setEditBook({...editBook, tracking_mode: 'page'})}
                  className={`flex-1 py-2 rounded-lg transition ${editBook.tracking_mode === 'page' ? 'bg-purple-600 text-white' : 'bg-[#2a3040] text-gray-400 border border-gray-700'}`}>
                  Pages
                </button>
              </div>
            </div>
            
            {editBook.tracking_mode === 'chapter' ? (
              <input type="number" placeholder="Total Chapters" value={editBook.total_chapters || ''} onChange={(e) => setEditBook({...editBook, total_chapters: parseInt(e.target.value) || 0})}
                className="w-full bg-[#2a3040] text-white px-4 py-3 rounded-lg mb-4 outline-none border border-gray-700" />
            ) : (
              <input type="number" placeholder="Total Pages" value={editBook.total_pages || ''} onChange={(e) => setEditBook({...editBook, total_pages: parseInt(e.target.value) || 0})}
                className="w-full bg-[#2a3040] text-white px-4 py-3 rounded-lg mb-4 outline-none border border-gray-700" />
            )}
            
            <div className="flex gap-3">
              <button onClick={handleSaveEdit} className="flex-1 py-3 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition font-medium">
                Save Changes
              </button>
              <button onClick={() => setShowEditBook(false)} className="px-6 py-3 bg-gray-700 text-white rounded-full hover:bg-gray-600 transition">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Progress, Discussion & Creative Writing Modal */}
      {showProgress && selectedBook && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => { setShowProgress(false); setShowDiscussion(false); setShowCreativeWriting(false); }}>
          <div className="bg-[#1a1f2b] rounded-2xl p-6 max-w-4xl w-full border border-gray-800 max-h-[85vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-white">{selectedBook.title}</h3>
              <button onClick={() => { setShowProgress(false); setShowDiscussion(false); setShowCreativeWriting(false); }} className="p-2 text-gray-400 hover:text-white">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="flex gap-4 mb-6 border-b border-gray-800">
              <button onClick={() => { setShowDiscussion(false); setShowCreativeWriting(false); }} 
                className={`pb-2 px-2 text-lg font-medium transition ${!showDiscussion && !showCreativeWriting ? 'text-purple-400 border-b-2 border-purple-400' : 'text-gray-400'}`}>
                Reading Progress
              </button>
              <button onClick={() => { setShowDiscussion(true); setShowCreativeWriting(false); }} 
                className={`pb-2 px-2 text-lg font-medium transition ${showDiscussion && !showCreativeWriting ? 'text-purple-400 border-b-2 border-purple-400' : 'text-gray-400'}`}>
                Discussion
              </button>
              <button onClick={() => { setShowCreativeWriting(true); setShowDiscussion(false); loadStories(); }} 
                className={`pb-2 px-2 text-lg font-medium transition ${showCreativeWriting ? 'text-purple-400 border-b-2 border-purple-400' : 'text-gray-400'}`}>
                ✨ Creative Writing
              </button>
            </div>
            
            {!showDiscussion && !showCreativeWriting ? (
              <>
                <div className="bg-[#2a3040] rounded-xl p-4 mb-6">
                  <h4 className="text-white font-semibold mb-3">Update Your Progress</h4>
                  <div className="flex items-end gap-4">
                    {selectedBook.tracking_mode === 'chapter' ? (
                      <div className="flex-1">
                        <label className="text-gray-400 text-sm mb-1 block">Current Chapter (max {selectedBook.total_chapters || '?'})</label>
                        <input type="number" min="1" max={selectedBook.total_chapters || undefined} value={userProgress.currentChapter} onChange={(e) => setUserProgress({...userProgress, currentChapter: parseInt(e.target.value) || 1})}
                          className="w-full bg-[#1a1f2b] text-white px-4 py-2 rounded-lg border border-gray-700" />
                      </div>
                    ) : (
                      <div className="flex-1">
                        <label className="text-gray-400 text-sm mb-1 block">Current Page (max {selectedBook.total_pages || '?'})</label>
                        <input type="number" min="1" max={selectedBook.total_pages || undefined} value={userProgress.currentPage} onChange={(e) => setUserProgress({...userProgress, currentPage: parseInt(e.target.value) || 1})}
                          className="w-full bg-[#1a1f2b] text-white px-4 py-2 rounded-lg border border-gray-700" />
                      </div>
                    )}
                    <button onClick={handleUpdateProgress} className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition">
                      Update
                    </button>
                  </div>
                </div>
                
                <h4 className="text-white font-semibold mb-3">Readers Progress</h4>
                {progress.length === 0 ? (
                  <p className="text-gray-400 text-center py-4">No reading progress yet. Be the first!</p>
                ) : (
                  <div className="space-y-2">
                    {progress.map((p: any, i: number) => (
                      <div key={i} className="flex items-center justify-between p-3 bg-[#2a3040] rounded-lg">
                        <span className="text-white">{p.user_name}</span>
                        <span className="text-purple-400">
                          {selectedBook.tracking_mode === 'chapter' 
                            ? `Chapter ${p.current_chapter || '?'}` 
                            : `Page ${p.current_page || '?'}`}
                        </span>
                        <span className="text-gray-500 text-sm">{new Date(p.updated_at).toLocaleDateString()}</span>
                      </div>
                    ))}
                  </div>
                )}
              </>
            ) : showDiscussion ? (
              <>
                <div className="mb-4">
                  <div className="flex gap-2">
                    <input type="text" placeholder="Write a comment..." value={newMessage} onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleAddDiscussion()}
                      className="flex-1 bg-[#2a3040] text-white px-4 py-2 rounded-lg outline-none border border-gray-700" />
                    <button onClick={handleAddDiscussion} className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition">
                      Send
                    </button>
                  </div>
                </div>
                
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {discussions.length === 0 ? (
                    <p className="text-gray-400 text-center py-8">No discussions yet. Start the conversation!</p>
                  ) : (
                    discussions.map((d: any) => (
                      <div key={d.id} className="bg-[#2a3040] rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-white font-medium">{d.user_name}</span>
                          {(d.chapter || d.page) && (
                            <span className="text-purple-400 text-xs">
                              {d.chapter ? `Ch. ${d.chapter}` : `Pg. ${d.page}`}
                            </span>
                          )}
                          <span className="text-gray-500 text-xs ml-auto">{new Date(d.created_at).toLocaleTimeString()}</span>
                        </div>
                        <p className="text-gray-300">{d.message}</p>
                      </div>
                    ))
                  )}
                </div>
              </>
            ) : (
              <>
                {!selectedStory ? (
                  <>
                    <div className="mb-6">
                      <h4 className="text-white font-semibold mb-3">Start a New Story</h4>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Story title..."
                          value={newStoryTitle}
                          onChange={(e) => setNewStoryTitle(e.target.value)}
                          className="flex-1 bg-[#2a3040] text-white px-4 py-2 rounded-lg outline-none border border-gray-700"
                        />
                        <button onClick={handleCreateStory} className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition">
                          Create
                        </button>
                      </div>
                    </div>
                    
                    <h4 className="text-white font-semibold mb-3">Ongoing Stories</h4>
                    {stories.filter(s => !s.is_completed).length === 0 && stories.filter(s => s.is_completed).length === 0 ? (
                      <p className="text-gray-400 text-center py-8">No stories yet. Start the first one!</p>
                    ) : (
                      <>
                        {stories.filter(s => !s.is_completed).length > 0 && (
                          <div className="space-y-2 mb-4">
                            {stories.filter(s => !s.is_completed).map((story) => (
                              <div key={story.id} className="bg-[#2a3040] rounded-lg p-4 hover:bg-[#353d50] transition cursor-pointer" onClick={() => handleSelectStory(story)}>
                                <div className="flex items-center justify-between">
                                  <span className="text-white font-medium">{story.title}</span>
                                  <span className="text-gray-400 text-sm">by {story.created_by}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                        
                        {stories.filter(s => s.is_completed).length > 0 && (
                          <>
                            <h4 className="text-white font-semibold mt-6 mb-3">Completed Stories</h4>
                            <div className="space-y-2 opacity-60">
                              {stories.filter(s => s.is_completed).map((story) => (
                                <div key={story.id} className="bg-[#2a3040] rounded-lg p-4 hover:bg-[#353d50] transition cursor-pointer" onClick={() => handleSelectStory(story)}>
                                  <div className="flex items-center justify-between">
                                    <span className="text-white font-medium">{story.title}</span>
                                    <span className="text-gray-400 text-sm">by {story.created_by}</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </>
                        )}
                      </>
                    )}
                  </>
                ) : (
                  <>
                    <div className="mb-4 flex items-center justify-between">
                      <button onClick={() => { setSelectedStory(null); setStoryEntries([]); }} className="text-gray-400 hover:text-white transition flex items-center gap-1">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Back to Stories
                      </button>
                      {!selectedStory.is_completed && (
                        <button onClick={handleCompleteStory} className="px-3 py-1 bg-green-600/20 text-green-400 rounded-lg text-sm hover:bg-green-600/30 transition">
                          Mark Complete
                        </button>
                      )}
                    </div>
                    
                    <h4 className="text-xl font-bold text-white mb-4">{selectedStory.title}</h4>
                    
                    <div className="bg-gradient-to-br from-amber-900/20 to-orange-900/20 rounded-xl p-6 mb-6 max-h-96 overflow-y-auto border border-amber-800/30">
                      {storyEntries.length === 0 ? (
                        <p className="text-gray-400 text-center py-8 italic">The story begins here...</p>
                      ) : (
                        <div className="space-y-4">
                          {storyEntries.map((entry) => (
                            <div key={entry.id} className="group">
                              {editingEntryId === entry.id ? (
                                <div className="flex gap-2">
                                  <input
                                    type="text"
                                    value={editingContent}
                                    onChange={(e) => setEditingContent(e.target.value)}
                                    className="flex-1 bg-[#1a1f2b] text-white px-3 py-2 rounded-lg outline-none border border-purple-500"
                                    autoFocus
                                  />
                                  <button onClick={() => handleUpdateEntry(entry.id)} className="px-3 py-1 bg-purple-600 text-white rounded-lg">Save</button>
                                  <button onClick={() => { setEditingEntryId(null); setEditingContent(''); }} className="px-3 py-1 bg-gray-600 text-white rounded-lg">Cancel</button>
                                </div>
                              ) : (
                                <>
                                  <p className="text-gray-200 text-lg leading-relaxed">{entry.content}</p>
                                  <div className="flex items-center gap-3 mt-1">
                                    <span className="text-amber-400 text-sm">— {entry.user_name}</span>
                                    {entry.user_name === userName && (
                                      <div className="opacity-0 group-hover:opacity-100 transition flex gap-2">
                                        <button onClick={() => { setEditingEntryId(entry.id); setEditingContent(entry.content); }} className="text-xs text-blue-400 hover:text-blue-300">Edit</button>
                                        <button onClick={() => handleDeleteEntry(entry.id)} className="text-xs text-red-400 hover:text-red-300">Delete</button>
                                      </div>
                                    )}
                                  </div>
                                </>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    {!selectedStory.is_completed && (
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Continue the story..."
                          value={newEntryContent}
                          onChange={(e) => setNewEntryContent(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && handleAddEntry()}
                          className="flex-1 bg-[#2a3040] text-white px-4 py-3 rounded-lg outline-none border border-gray-700"
                        />
                        <button onClick={handleAddEntry} className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-medium">
                          Add
                        </button>
                      </div>
                    )}
                  </>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </main>
  );
}