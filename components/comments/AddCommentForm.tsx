'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

interface AddCommentFormProps {
  episodeId: string;
  onCommentAdded: () => void;
}

const sourceTypes = ['Reddit', 'TikTok', 'Podcast', 'Twitter', 'YouTube', 'Other'] as const;

const AddCommentForm: React.FC<AddCommentFormProps> = ({ episodeId, onCommentAdded }) => {
  const [content, setContent] = useState('');
  const [sourceType, setSourceType] = useState<typeof sourceTypes[number]>('Other');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!content.trim()) {
      return;
    }
    
    setSubmitting(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('You must be logged in to comment.');

      const { error: insertError } = await supabase
        .from('comments')
        .insert({
          content,
          episode_id: episodeId,
          user_id: user.id,
          source_type: sourceType
        });

      if (insertError) throw insertError;

      setContent('');
      setSourceType('Other');
      onCommentAdded(); // Refresh the list
    } catch (err: any) {
      setError(err.message || 'Failed to submit comment.');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-zinc-800 p-4 rounded-lg space-y-3">
      <h3 className="text-lg font-bold">Share Your Thoughts</h3>
      <textarea
        placeholder="Add a comment..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={3}
        className="w-full bg-zinc-900 border border-zinc-700 rounded-md px-3 py-2 text-white placeholder-gray-500 focus:ring-accent focus:border-accent focus:outline-none"
      />
      <div className="flex items-center gap-3">
        <label className="text-sm text-gray-400">Source:</label>
        <select
          value={sourceType}
          onChange={(e) => setSourceType(e.target.value as typeof sourceTypes[number])}
          className="bg-zinc-900 border border-zinc-700 rounded-md px-3 py-1 text-white focus:ring-accent focus:border-accent focus:outline-none"
        >
          {sourceTypes.map((type) => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </div>
      <div className="flex justify-end">
        <button 
          type="submit"
          disabled={submitting || !content.trim()}
          className="bg-accent text-black font-bold py-2 px-4 rounded-md hover:bg-accent-hover transition-colors disabled:bg-zinc-600 disabled:cursor-not-allowed"
        >
          {submitting ? 'Posting...' : 'Post Comment'}
        </button>
      </div>
      {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
    </form>
  );
};

export default AddCommentForm; 