"use client";

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function ChatsPage() {
  const params = useSearchParams();
  const show_id = params.get('show_id');
  const episode_id = params.get('episode_id');
  const [comments, setComments] = useState([]);
  const [input, setInput] = useState('');
  const [episode, setEpisode] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!show_id || !episode_id) return;

    (async () => {
      setLoading(true);
      const { data: epData, error: epError } = await supabase
        .from('episodes')
        .select('*')
        .eq('id', episode_id)
        .single();

      if (!epData || epError) {
        setEpisode(null);
        setLoading(false);
        return;
      }

      setEpisode(epData);

      const { data: commentsData } = await supabase
        .from('comments')
        .select('*')
        .eq('show_id', show_id)
        .eq('episode_id', episode_id)
        .order('created_at');

      setComments(commentsData || []);
      setLoading(false);
    })();
  }, [show_id, episode_id]);

  const postComment = async () => {
    if (!input) return;

    const { data, error } = await supabase
      .from('comments')
      .insert({ show_id, episode_id, text: input });

    if (!error && data) {
      setComments(prev => [...prev, ...data]);
      setInput('');
    }
  };

  if (loading) return <p className="p-4 text-white bg-black h-screen">Loading chat...</p>;

  return (
    <div className="p-4 text-white bg-black h-screen">
      {episode ? (
        <>
          <h1 className="text-xl font-bold mb-1">{episode.title}</h1>
          <p className="text-sm mb-4">{episode.description}</p>
          <div className="overflow-y-scroll max-h-[60vh] space-y-2">
            {comments.length > 0 ? comments.map(c => (
              <div key={c.id} className="p-2 border-b border-gray-800">{c.text}</div>
            )) : (
              <p className="text-gray-400">No comments yet. Be the first to post!</p>
            )}
          </div>
          <div className="fixed bottom-0 left-0 right-0 p-4 bg-black">
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Add a comment..."
              className="w-full p-2 rounded bg-gray-800 text-white border border-gray-600"
            />
            <button
              onClick={postComment}
              className="mt-2 w-full bg-purple-600 text-white p-2 rounded"
            >
              Post
            </button>
          </div>
        </>
      ) : (
        <p className="text-red-400">Episode not found or failed to load.</p>
      )}
    </div>
  );
}
