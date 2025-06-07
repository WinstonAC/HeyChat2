'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import type { Show, Episode } from '@/lib/types';
import Loading from '@/components/common/Loading';
import Image from 'next/image';
import { MessageSquare, Heart, Share2 } from 'lucide-react';
import FilterPill from '@/components/ui/FilterPill';
import EpisodeCard from '@/components/cards/EpisodeCard';

export default function ShowPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const [show, setShow] = useState<Show | null>(null);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('Episodes');

  useEffect(() => {
    if (!id) return;

    const fetchShowData = async () => {
      setLoading(true);
      try {
        const { data: showData, error: showError } = await supabase
          .from('shows')
          .select('*')
          .eq('id', id)
          .single();
        if (showError) throw showError;
        setShow(showData);

        const { data: episodesData, error: episodesError } = await supabase
          .from('episodes')
          .select('*')
          .eq('show_id', id)
          .order('season_number', { ascending: true })
          .order('episode_number', { ascending: true });
        if (episodesError) throw episodesError;
        setEpisodes(episodesData || []);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch show data.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchShowData();
  }, [id]);

  if (loading) return <Loading />;
  if (error || !show) return <p className="p-4 text-center text-red-500">{error || 'Show not found.'}</p>;

  return (
    <div className="pb-24"> {/* Padding bottom to avoid overlap with action buttons */}
      {show.poster_url && (
        <div className="relative w-full h-80">
          <Image src={show.poster_url} alt={`${show.title} poster`} layout="fill" objectFit="cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
        </div>
      )}

      <div className="p-4 -mt-16 relative z-10">
        <p className="text-xs bg-zinc-800/80 backdrop-blur-sm text-white font-semibold px-3 py-1 rounded-full inline-block mb-2">
          {show.platform ? `Available on ${show.platform}` : 'Platform not specified'}
        </p>
        <h1 className="text-4xl font-bold">{show.title}</h1>
        <div className="flex items-center gap-2 text-sm text-gray-400 mt-1">
          <MessageSquare size={14} />
          <span>comments</span>
        </div>
        <p className="mt-4 text-gray-300 text-sm">
          {show.description || 'No description available.'}
        </p>

        <div className="mt-6 flex items-center border-b border-[#2a2a2a]">
          <FilterPill label="View Threads" isActive={activeTab === 'Threads'} onClick={() => setActiveTab('Threads')} />
          <FilterPill label="Chat" isActive={activeTab === 'Chat'} onClick={() => setActiveTab('Chat')} />
          <FilterPill label="Episodes" isActive={activeTab === 'Episodes'} onClick={() => setActiveTab('Episodes')} />
        </div>

        <div className="mt-6">
          {activeTab === 'Episodes' && (
            <div className="space-y-3">
              {episodes.map((episode) => (
                <EpisodeCard key={episode.id} episode={episode} showId={id} />
              ))}
            </div>
          )}
          {activeTab !== 'Episodes' && (
            <p className="text-gray-500 text-center py-8">Discussion threads coming soon...</p>
          )}
        </div>
      </div>

      <div className="fixed bottom-16 left-0 w-full bg-black/80 backdrop-blur-sm p-4 border-t border-[#2a2a2a]">
        <div className="flex justify-around items-center">
            <button className="flex flex-col items-center text-white text-xs gap-1"><MessageSquare /> Comment</button>
            <button className="flex flex-col items-center text-white text-xs gap-1"><Heart /> Like</button>
            <button className="flex flex-col items-center text-white text-xs gap-1"><Share2 /> Share</button>
        </div>
      </div>
       <div className="fixed bottom-32 left-0 w-full p-4">
        <button className="w-full bg-accent text-black font-bold py-3 rounded-lg hover:bg-accent-hover transition-colors">
            Join the Conversation
        </button>
      </div>
    </div>
  );
} 