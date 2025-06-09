"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, MessageSquare } from 'lucide-react';
import type { Show, Comment, Episode } from '@/lib/types';

export default function Page() {
  const searchParams = useSearchParams();
  const showId = searchParams.get('show_id');
  const episodeId = searchParams.get('episode_id');
  
  const [show, setShow] = useState<Show | null>(null);
  const [episode, setEpisode] = useState<Episode | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
    };
    checkAuth();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (!showId) return;

      try {
        setLoading(true);
        setError(null);

        // Fetch show data
        const { data: showData, error: showError } = await supabase
          .from('shows')
          .select('*')
          .eq('id', showId)
          .single();

        if (showError) throw showError;
        setShow(showData);

        // Fetch episode data if episode_id is provided
        if (episodeId) {
          const { data: episodeData, error: episodeError } = await supabase
            .from('episodes')
            .select('*')
            .eq('id', episodeId)
            .single();

          if (episodeError) throw episodeError;
          setEpisode(episodeData);
        }

        // Fetch comments
        const { data: commentsData, error: commentsError } = await supabase
          .from('comments')
          .select('*')
          .eq('show_id', showId)
          .eq('episode_id', episodeId)
          .order('created_at', { ascending: true });

        if (commentsError) throw commentsError;
        setComments(commentsData || []);

        // Subscribe to new comments
        const channel = supabase
          .channel('comments')
          .on(
            'postgres_changes',
            {
              event: 'INSERT',
              schema: 'public',
              table: 'comments',
              filter: `show_id=eq.${showId} AND episode_id=eq.${episodeId}`,
            },
            (payload) => {
              setComments((current) => [...current, payload.new as Comment]);
            }
          )
          .subscribe();

        return () => {
          supabase.removeChannel(channel);
        };
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load chat');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [showId, episodeId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !isAuthenticated) return;

    try {
      setIsSubmitting(true);
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error('Not authenticated');
      }

      const { error } = await supabase.from('comments').insert({
        show_id: showId,
        episode_id: episodeId,
        user_id: session.user.id,
        content: newComment.trim(),
      });

      if (error) throw error;
      setNewComment('');
    } catch (err) {
      console.error('Error submitting comment:', err);
      setError('Failed to submit comment');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!showId) {
    return (
      <div className="min-h-screen bg-black text-white p-4">
        <p>Invalid show ID</p>
        <Link href="/" className="text-purple-500 hover:text-purple-400">
          Return to Home
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white p-4">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-3/4 bg-zinc-800 rounded" />
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-zinc-800 rounded" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !show) {
    return (
      <div className="min-h-screen bg-black text-white p-4">
        <p className="text-red-500">{error || 'Show not found'}</p>
        <Link href="/" className="text-purple-500 hover:text-purple-400">
          Return to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Sticky Header */}
      <div className="sticky top-0 bg-black border-b border-gray-800 p-4 z-10">
        <div className="flex items-center gap-4">
          <Link href={`/show/${showId}`} className="text-zinc-400 hover:text-white">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-lg font-semibold truncate">{show.title}</h1>
            {episode && (
              <p className="text-sm text-zinc-400">
                Episode {episode.episode_number}: {episode.title}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Comments Feed */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[calc(100vh-200px)]">
        {comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment.id} className="bg-zinc-900 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="flex-1">
                  <p className="text-sm text-zinc-300">{comment.content}</p>
                  <p className="text-xs text-zinc-500 mt-1">
                    {new Date(comment.created_at).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-zinc-500 py-8">No comments yet. Be the first to join the discussion!</p>
        )}
      </div>

      {/* Comment Input */}
      <div className="sticky bottom-0 bg-black border-t border-gray-800 p-4">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder={isAuthenticated ? "Add a comment..." : "Sign in to comment"}
            disabled={!isAuthenticated || isSubmitting}
            className="flex-1 px-4 py-2 rounded-lg bg-zinc-900 text-white border border-zinc-800 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
            aria-label="Comment input"
          />
          <Button
            type="submit"
            disabled={!isAuthenticated || isSubmitting || !newComment.trim()}
            className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50"
            aria-label="Submit comment"
          >
            <MessageSquare className="h-5 w-5" />
          </Button>
        </form>
      </div>
    </div>
  );
} 