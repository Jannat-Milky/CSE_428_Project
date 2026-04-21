import { createClient } from '@/lib/supabase/client';

// Types
export interface Book {
  id: string;
  title: string;
  genre: string;
  image: string;
  added_by_name: string;
  created_at: string;
  total_chapters: number | null;
  total_pages: number | null;
  tracking_mode: 'chapter' | 'page';
}

export interface ReadingProgress {
  id: string;
  book_id: string;
  user_name: string;
  current_chapter: number | null;
  current_page: number | null;
  updated_at: string;
}

export interface Discussion {
  id: string;
  book_id: string;
  user_name: string;
  message: string;
  chapter: number | null;
  page: number | null;
  created_at: string;
}

// Get current user name
export const getUserName = (): string => {
  if (typeof window === 'undefined') return 'Reader';
  
  let name = localStorage.getItem('skilljoy_reader_name');
  if (!name) {
    name = prompt('Enter your name to continue:') || 'Reader';
    if (name) localStorage.setItem('skilljoy_reader_name', name);
  }
  return name || 'Reader';
};

// BOOKS
export const getBooksByGenre = async (genre: string): Promise<Book[]> => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('books')
    .select('*')
    .eq('genre', genre)
    .order('created_at', { ascending: false });
  
  if (error) console.error('Error fetching books:', error);
  return data || [];
};

export const addBook = async (book: {
  title: string;
  genre: string;
  image: string;
  trackingMode: 'chapter' | 'page';
  totalChapters?: number;
  totalPages?: number;
}): Promise<Book | null> => {
  const supabase = createClient();
  const userName = getUserName();
  
  const { data, error } = await supabase
    .from('books')
    .insert({
      title: book.title,
      genre: book.genre,
      image: book.image,
      added_by_name: userName,
      tracking_mode: book.trackingMode,
      total_chapters: book.trackingMode === 'chapter' ? book.totalChapters : null,
      total_pages: book.trackingMode === 'page' ? book.totalPages : null,
    })
    .select()
    .single();
  
  if (error) {
    console.error('Error adding book:', error);
    return null;
  }
  return data;
};

export const deleteBook = async (bookId: string): Promise<boolean> => {
  const supabase = createClient();
  
  const { error } = await supabase
    .from('books')
    .delete()
    .eq('id', bookId);
  
  if (error) {
    console.error('Error deleting book:', error);
    return false;
  }
  return true;
};

export const updateBook = async (bookId: string, updates: Partial<Book>): Promise<boolean> => {
  const supabase = createClient();
  
  const { error } = await supabase
    .from('books')
    .update(updates)
    .eq('id', bookId);
  
  if (error) {
    console.error('Error updating book:', error);
    return false;
  }
  return true;
};

// READING PROGRESS
export const getBookProgress = async (bookId: string): Promise<ReadingProgress[]> => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('reading_progress')
    .select('*')
    .eq('book_id', bookId)
    .order('updated_at', { ascending: false });
  
  if (error) console.error('Error fetching progress:', error);
  return data || [];
};

export const updateProgress = async (
  bookId: string,
  progress: { current_chapter?: number; current_page?: number }
): Promise<boolean> => {
  const supabase = createClient();
  const userName = getUserName();
  
  const { data: existing } = await supabase
    .from('reading_progress')
    .select('id')
    .eq('book_id', bookId)
    .eq('user_name', userName)
    .maybeSingle();
  
  let error;
  if (existing) {
    const result = await supabase
      .from('reading_progress')
      .update({
        current_chapter: progress.current_chapter || null,
        current_page: progress.current_page || null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', existing.id);
    error = result.error;
  } else {
    const result = await supabase
      .from('reading_progress')
      .insert({
        book_id: bookId,
        user_name: userName,
        current_chapter: progress.current_chapter || null,
        current_page: progress.current_page || null,
      });
    error = result.error;
  }
  
  if (error) {
    console.error('Error updating progress:', error);
    return false;
  }
  return true;
};

// DISCUSSIONS
export const getBookDiscussions = async (bookId: string): Promise<Discussion[]> => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('discussions')
    .select('*')
    .eq('book_id', bookId)
    .order('created_at', { ascending: false });
  
  if (error) console.error('Error fetching discussions:', error);
  return data || [];
};

export const addDiscussion = async (
  bookId: string,
  message: string,
  context?: { chapter?: number; page?: number }
): Promise<Discussion | null> => {
  const supabase = createClient();
  const userName = getUserName();
  
  const { data, error } = await supabase
    .from('discussions')
    .insert({
      book_id: bookId,
      user_name: userName,
      message,
      chapter: context?.chapter || null,
      page: context?.page || null,
    })
    .select()
    .single();
  
  if (error) {
    console.error('Error adding discussion:', error);
    return null;
  }
  return data;
};

// GENRE STATS
export const getGenreStats = async (): Promise<Record<string, { books: number; readers: number }>> => {
  const supabase = createClient();
  
  const { data: books } = await supabase.from('books').select('genre');
  const { data: progress } = await supabase.from('reading_progress').select('book_id, user_name, books(genre)');
  
  const stats: Record<string, { books: number; readers: Set<string> }> = {};
  const genres = ['horror', 'scifi', 'fantasy', 'mystery', 'romance', 'adventure'];
  genres.forEach(g => { stats[g] = { books: 0, readers: new Set() }; });
  
  books?.forEach(book => {
    if (book.genre && stats[book.genre]) {
      stats[book.genre].books++;
    }
  });
  
  progress?.forEach(p => {
    const bookGenre = (p.books as any)?.genre;
    if (bookGenre && stats[bookGenre]) {
      stats[bookGenre].readers.add(p.user_name);
    }
  });
  
  const result: Record<string, { books: number; readers: number }> = {};
  Object.keys(stats).forEach(genre => {
    result[genre] = {
      books: stats[genre].books,
      readers: stats[genre].readers.size
    };
  });
  
  return result;
};

// REALTIME SUBSCRIPTIONS
export const subscribeToBooks = (genre: string, callback: (books: Book[]) => void) => {
  const supabase = createClient();
  return supabase
    .channel(`books-${genre}`)
    .on('postgres_changes', { 
      event: '*', 
      schema: 'public', 
      table: 'books',
      filter: `genre=eq.${genre}`
    }, async () => {
      const books = await getBooksByGenre(genre);
      callback(books);
    })
    .subscribe();
};

export const subscribeToProgress = (bookId: string, callback: (progress: ReadingProgress[]) => void) => {
  const supabase = createClient();
  return supabase
    .channel(`progress-${bookId}`)
    .on('postgres_changes', { 
      event: '*', 
      schema: 'public', 
      table: 'reading_progress',
      filter: `book_id=eq.${bookId}`
    }, async () => {
      const progress = await getBookProgress(bookId);
      callback(progress);
    })
    .subscribe();
};

export const subscribeToDiscussions = (bookId: string, callback: (discussions: Discussion[]) => void) => {
  const supabase = createClient();
  return supabase
    .channel(`discussions-${bookId}`)
    .on('postgres_changes', { 
      event: '*', 
      schema: 'public', 
      table: 'discussions',
      filter: `book_id=eq.${bookId}`
    }, async () => {
      const discussions = await getBookDiscussions(bookId);
      callback(discussions);
    })
    .subscribe();
};