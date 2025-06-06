'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import type { Thread } from '@/lib/types';
import Loading from '@/components/common/Loading';
import ThreadItem from './ThreadItem';
import AddThreadForm from './AddThreadForm';

interface ThreadListProps {
  episodeId: string;
}

const ThreadList: React.FC<ThreadListProps> = ({ episodeId }) => {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchThreads = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('threads')
        .select(`
          id,
          title,
          url,
          created_at,
          episode_id,
          author:profiles (
            user_id,
            name: full_name,
            handle,
            avatar_url
          )
        `)
        .eq('episode_id', episodeId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setThreads(data as any[] as Thread[]);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch threads.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (episodeId) {
      fetchThreads();
    }
  }, [episodeId]);

  return (
    <div className="space-y-6">
      <AddThreadForm episodeId={episodeId} onThreadAdded={fetchThreads} />
      
      {loading && <Loading />}
      {error && <p className="text-center text-red-500">{error}</p>}
      
      {!loading && !error && (
        <div className="space-y-4">
          {threads.length > 0 ? (
            threads.map((thread) => <ThreadItem key={thread.id} thread={thread} />)
          ) : (
            <p className="text-center text-gray-500 py-8">No threads yet. Be the first to add one!</p>
          )}
        </div>
      )}
    </div>
  );
};

export default ThreadList; 