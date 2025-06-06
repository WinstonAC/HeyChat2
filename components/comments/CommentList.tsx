'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import type { Comment } from '@/lib/types';
import Loading, { LoadingSkeleton } from '@/components/common/Loading';
import CommentCard from '@/components/cards/CommentCard';
import AddCommentForm from './AddCommentForm';
import FilterPill from '@/components/ui/FilterPill';

interface CommentListProps {
  episodeId: string;
}

const CommentList: React.FC<CommentListProps> = ({ episodeId }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const user = { id: 'demo-user', name: 'Demo' };
  const [comments, setComments] = useState<Comment[]>([]);
  const [hotTakes, setHotTakes] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>('All');
  const [sourceTypes, setSourceTypes] = useState<string[]>(['All']);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);

  const fetchComments = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch hot takes
      const { data: hotTakesData, error: hotTakesError } = await supabase
        .rpc('get_hot_takes', { episode_id: episodeId, limit_count: 3 });
      
      if (hotTakesError) throw hotTakesError;
      setHotTakes(hotTakesData || []);

      // Fetch all comments
      let query = supabase
        .from('comments')
        .select(`
          id,
          content,
          created_at,
          likes_count,
          episode_id,
          source_type,
          source_url,
          parent_id,
          pinned,
          saved_by,
          ingested,
          relevance_score,
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

      const { data, error } = await query
        .order('pinned', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Extract unique source types
      const uniqueSourceTypes = ['All', ...new Set(data.map(c => c.source_type || 'Other'))];
      setSourceTypes(uniqueSourceTypes);
      
      // Organize comments into a tree structure
      const commentMap = new Map<string, Comment>();
      const rootComments: Comment[] = [];

      data.forEach((comment: any) => {
        const commentWithReplies = { ...comment, replies: [] };
        commentMap.set(comment.id, commentWithReplies);

        if (comment.parent_id) {
          const parent = commentMap.get(comment.parent_id);
          if (parent) {
            parent.replies = parent.replies || [];
            parent.replies.push(commentWithReplies);
          }
        } else {
          rootComments.push(commentWithReplies);
        }
      });

      setComments(rootComments);
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

  const handleReply = (commentId: string) => {
    setReplyingTo(commentId);
  };

  const handlePin = async (commentId: string) => {
    if (!user) return;
    
    try {
      const { error } = await supabase.rpc('toggle_comment_pin', { comment_id: commentId });
      if (error) throw error;
      fetchComments();
    } catch (err: any) {
      console.error('Failed to pin comment:', err);
    }
  };

  const handleSave = async (commentId: string) => {
    if (!user) return;
    
    try {
      const { error } = await supabase.rpc('toggle_comment_save', { comment_id: commentId });
      if (error) throw error;
      fetchComments();
    } catch (err: any) {
      console.error('Failed to save comment:', err);
    }
  };

  const handleLike = async (commentId: string) => {
    if (!user) return;
    
    try {
      const { error } = await supabase.rpc('increment_comment_likes', { comment_id: commentId });
      if (error) throw error;
      fetchComments();
    } catch (err: any) {
      console.error('Failed to like comment:', err);
    }
  };

  const renderComment = (comment: Comment, isReply = false) => (
    <div key={comment.id} id={`comment-${comment.id}`} className={isReply ? 'ml-8 mt-4' : ''}>
      <CommentCard
        comment={comment}
        onReply={() => handleReply(comment.id)}
        onPin={() => handlePin(comment.id)}
        onSave={() => handleSave(comment.id)}
        onLike={() => handleLike(comment.id)}
        isAdmin={user}
        isSaved={user ? comment.saved_by.includes(user.id) : false}
      />
      {comment.replies?.map(reply => renderComment(reply, true))}
      {replyingTo === comment.id && (
        <div className="ml-8 mt-4">
          <AddCommentForm
            episodeId={episodeId}
            parentId={comment.id}
            onCommentAdded={() => {
              fetchComments();
              setReplyingTo(null);
            }}
          />
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Hot Takes Section */}
      {hotTakes.length > 0 && (
        <div className="bg-zinc-900/50 rounded-lg p-4">
          <h3 className="text-lg font-bold mb-4">Hot Takes 🔥</h3>
          <div className="space-y-4">
            {hotTakes.map(comment => (
              <CommentCard
                key={comment.id}
                comment={comment}
                onReply={() => handleReply(comment.id)}
                onPin={() => handlePin(comment.id)}
                onSave={() => handleSave(comment.id)}
                onLike={() => handleLike(comment.id)}
                isAdmin={user}
                isSaved={user ? comment.saved_by.includes(user.id) : false}
              />
            ))}
          </div>
        </div>
      )}

      <AddCommentForm
        episodeId={episodeId}
        onCommentAdded={fetchComments}
      />
      
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
      
      {loading && <LoadingSkeleton />}
      {error && <p className="text-center text-red-500">{error}</p>}
      
      {!loading && !error && (
        <div className="space-y-4">
          {comments.length > 0 ? (
            comments.map(comment => renderComment(comment))
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