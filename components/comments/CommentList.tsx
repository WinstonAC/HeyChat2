'use client';

import React, { useEffect, useState } from 'react';
import Comment from './Comment';
import type { Comment as CommentType } from '../../lib/types';
import { supabase } from '../../lib/supabaseClient';
import Loading from '../common/Loading';

interface CommentListProps {
  showId: string;
  seasonNumber: number;
  episodeId: string;
  refreshTrigger: number; 
}

const CommentList: React.FC<CommentListProps> = ({ showId, seasonNumber, episodeId, refreshTrigger }) => {
  const [comments, setComments] = useState<CommentType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('CommentList received props:', { showId, seasonNumber, episodeId });

    if (!episodeId || !showId || isNaN(seasonNumber)) {
      setComments([]);
      setLoading(false);
      setError(null); 
      return;
    }

    const fetchComments = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data, error: supabaseError } = await supabase
          .from('comments')
          .select('id, show_id, season_number, episode_id, text, author, created_at')
          .eq('show_id', showId)
          .eq('season_number', seasonNumber)
          .eq('episode_id', episodeId)
          .order('created_at', { ascending: false });

        if (supabaseError) {
          throw supabaseError;
        }
        
        setComments(data || []);

      } catch (err) {
        console.error("Error fetching comments:", err);
        setError(err instanceof Error ? err.message : 'Failed to load comments.');
        setComments([]);
      }
      setLoading(false);
    };

    fetchComments();
  }, [showId, seasonNumber, episodeId, refreshTrigger]);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <p className="text-red-400 italic my-4">Error loading comments: {error}</p>;
  }

  if (comments.length === 0) {
    return <p className="text-gray-400 italic my-4">No comments yet. Be the first to comment!</p>;
  }

  return (
    <div className="space-y-2 mt-2 mb-6">
      {comments.map((comment) => (
        <Comment key={comment.id} comment={comment} />
      ))}
    </div>
  );
};

export default CommentList; 