'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import type { Comment } from '@/lib/types';
import Loading from '@/components/common/Loading';
import CommentCard from '@/components/cards/CommentCard';
import AddCommentForm from './AddCommentForm';
import FilterPill from '@/components/ui/FilterPill';

interface CommentListProps {
  episodeId: string;
}

const CommentList: React.FC<CommentListProps> = ({ episodeId }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>('All');
  const [sourceTypes, setSourceTypes] = useState<string[]>(['All']);

  const fetchComments = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      let query = supabase
        .from('comments')
        .select(`
          id,
          content,
          created_at,
          likes_count,
          episode_id,
          source_type,
          author:profiles (
            user_id,
            name: full_name,
            handle,
            avatar_url
          )
        `)
        .eq('episode_id', episodeId);

      // Apply source type filter if not 'All'
      if (activeFilter !== 'All') {
        query = query.eq('source_type', activeFilter);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;
      
      // Extract unique source types
      const uniqueSourceTypes = ['All', ...new Set(data.map(c => c.source_type || 'Other'))];
      setSourceTypes(uniqueSourceTypes);
      
      setComments(data as any[] as Comment[]);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch comments.');
    } finally {
      setLoading(false);
    }
  }, [episodeId, activeFilter]);

  useEffect(() => {
    if (episodeId) {
      fetchComments();
    }
  }, [fetchComments, episodeId]);

  // Handle deep linking
  useEffect(() => {
    const commentId = searchParams.get('comment');
    if (commentId) {
      const element = document.getElementById(`comment-${commentId}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        element.classList.add('highlight');
        setTimeout(() => element.classList.remove('highlight'), 2000);
      }
    }
  }, [searchParams, comments]);

  return (
    <div className="space-y-6">
      <AddCommentForm episodeId={episodeId} onCommentAdded={fetchComments} />
      
      {/* Source Type Filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {sourceTypes.map((type) => (
          <FilterPill
            key={type}
            label={type}
            isActive={activeFilter === type}
            onClick={() => setActiveFilter(type)}
          />
        ))}
      </div>
      
      {loading && <Loading />}
      {error && <p className="text-center text-red-500">{error}</p>}
      
      {!loading && !error && (
        <div className="space-y-4">
          {comments.length > 0 ? (
            comments.map((comment) => (
              <div key={comment.id} id={`comment-${comment.id}`}>
                <CommentCard comment={comment} />
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 py-8">
              {activeFilter === 'All' 
                ? "No comments yet. Be the first to share your thoughts!"
                : `No ${activeFilter} comments yet.`}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default CommentList; 