'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

interface AddThreadFormProps {
  episodeId: string;
  onThreadAdded: () => void;
}

const AddThreadForm: React.FC<AddThreadFormProps> = ({ episodeId, onThreadAdded }) => {
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim() || !url.trim()) {
      setError('Title and URL cannot be empty.');
      return;
    }

    try {
      new URL(url); // Check if URL is valid
    } catch (_) {
      setError('Please enter a valid URL.');
      return;
    }
    
    setSubmitting(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('You must be logged in to add a thread.');

      const { error: insertError } = await supabase
        .from('threads')
        .insert({
          title,
          url,
          episode_id: episodeId,
          user_id: user.id
        });

      if (insertError) throw insertError;

      setTitle('');
      setUrl('');
      onThreadAdded(); // Refresh the list
    } catch (err: any) {
      setError(err.message || 'Failed to submit thread.');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-zinc-800 p-4 rounded-lg space-y-4">
      <h3 className="text-lg font-bold">Add a new Thread</h3>
      <div className="flex flex-col gap-2">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="bg-zinc-900 border border-zinc-700 rounded-md px-3 py-2 text-white placeholder-gray-500 focus:ring-accent focus:border-accent focus:outline-none"
        />
        <input
          type="url"
          placeholder="URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="bg-zinc-900 border border-zinc-700 rounded-md px-3 py-2 text-white placeholder-gray-500 focus:ring-accent focus:border-accent focus:outline-none"
        />
      </div>
      <button 
        type="submit"
        disabled={submitting}
        className="w-full bg-accent text-black font-bold py-2 rounded-md hover:bg-accent-hover transition-colors disabled:bg-zinc-600 disabled:cursor-not-allowed"
      >
        {submitting ? 'Submitting...' : 'Submit Thread'}
      </button>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </form>
  );
};

export default AddThreadForm; 