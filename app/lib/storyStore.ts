import { createClient } from '@/lib/supabase/client';
import { getUserName } from './supabaseStore';

export interface Story {
  id: string;
  book_id: string;
  title: string;
  created_by: string;
  created_at: string;
  is_completed: boolean;
}

export interface StoryEntry {
  id: string;
  story_id: string;
  user_name: string;
  content: string;
  created_at: string;
}

// Get all stories for a book
export const getStoriesByBook = async (bookId: string): Promise<Story[]> => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('stories')
    .select('*')
    .eq('book_id', bookId)
    .order('created_at', { ascending: false });
  
  if (error) console.error('Error fetching stories:', error);
  return data || [];
};

// Create a new story
export const createStory = async (bookId: string, title: string): Promise<Story | null> => {
  const supabase = createClient();
  const userName = getUserName();
  
  const { data, error } = await supabase
    .from('stories')
    .insert({
      book_id: bookId,
      title,
      created_by: userName,
    })
    .select()
    .single();
  
  if (error) {
    console.error('Error creating story:', error);
    return null;
  }
  return data;
};

// Get all entries for a story
export const getStoryEntries = async (storyId: string): Promise<StoryEntry[]> => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('story_entries')
    .select('*')
    .eq('story_id', storyId)
    .order('created_at', { ascending: true });
  
  if (error) console.error('Error fetching story entries:', error);
  return data || [];
};

// Add an entry to a story
export const addStoryEntry = async (storyId: string, content: string): Promise<StoryEntry | null> => {
  const supabase = createClient();
  const userName = getUserName();
  
  const { data, error } = await supabase
    .from('story_entries')
    .insert({
      story_id: storyId,
      user_name: userName,
      content,
    })
    .select()
    .single();
  
  if (error) {
    console.error('Error adding story entry:', error);
    return null;
  }
  return data;
};

// Delete a story entry (only by the user who created it)
export const deleteStoryEntry = async (entryId: string): Promise<boolean> => {
  const supabase = createClient();
  const userName = getUserName();
  
  const { error } = await supabase
    .from('story_entries')
    .delete()
    .eq('id', entryId)
    .eq('user_name', userName);
  
  if (error) {
    console.error('Error deleting story entry:', error);
    return false;
  }
  return true;
};

// Update a story entry
export const updateStoryEntry = async (entryId: string, content: string): Promise<boolean> => {
  const supabase = createClient();
  const userName = getUserName();
  
  const { error } = await supabase
    .from('story_entries')
    .update({ content })
    .eq('id', entryId)
    .eq('user_name', userName);
  
  if (error) {
    console.error('Error updating story entry:', error);
    return false;
  }
  return true;
};

// Mark story as completed
export const completeStory = async (storyId: string): Promise<boolean> => {
  const supabase = createClient();
  
  const { error } = await supabase
    .from('stories')
    .update({ is_completed: true })
    .eq('id', storyId);
  
  if (error) {
    console.error('Error completing story:', error);
    return false;
  }
  return true;
};

// Delete a story
export const deleteStory = async (storyId: string): Promise<boolean> => {
  const supabase = createClient();
  
  const { error } = await supabase
    .from('stories')
    .delete()
    .eq('id', storyId);
  
  if (error) {
    console.error('Error deleting story:', error);
    return false;
  }
  return true;
};

// Realtime subscriptions
export const subscribeToStories = (bookId: string, callback: (stories: Story[]) => void) => {
  const supabase = createClient();
  return supabase
    .channel(`stories-${bookId}`)
    .on('postgres_changes', { 
      event: '*', 
      schema: 'public', 
      table: 'stories',
      filter: `book_id=eq.${bookId}`
    }, async () => {
      const stories = await getStoriesByBook(bookId);
      callback(stories);
    })
    .subscribe();
};

export const subscribeToStoryEntries = (storyId: string, callback: (entries: StoryEntry[]) => void) => {
  const supabase = createClient();
  return supabase
    .channel(`story-entries-${storyId}`)
    .on('postgres_changes', { 
      event: '*', 
      schema: 'public', 
      table: 'story_entries',
      filter: `story_id=eq.${storyId}`
    }, async () => {
      const entries = await getStoryEntries(storyId);
      callback(entries);
    })
    .subscribe();
};