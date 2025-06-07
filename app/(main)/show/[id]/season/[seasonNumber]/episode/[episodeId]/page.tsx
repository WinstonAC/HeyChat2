'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import CommentList from '@/components/comments/CommentList';
import CommentInput from '@/components/comments/CommentInput';
import type { Episode } from '@/lib/types';
import { supabase } from '@/lib/supabaseClient';
import Link from 'next/link';
import Loading from '@/components/common/Loading';

// Helper function for formatting dates safely
const formatDate = (input?: string, options?: Intl.DateTimeFormatOptions) => {
  if (!input) return "N/A";
  const d = new Date(input);
  if (isNaN(d.getTime())) {
    console.warn("Invalid date input for formatDate:", input);
    return "Invalid Date";
  }
  return options ? d.toLocaleString(undefined, options) : d.toLocaleDateString();
};

async function fetchEpisodeDetails(episodeId: string): Promise<Episode | null> {
  try {
    console.log(`[fetchEpisodeDetails] Fetching details for episodeId: ${episodeId}`);
    const { data, error, status } = await supabase
      .from('episodes')
      .select('id, episode_number, title, description, air_date')
      .eq('id', episodeId)
      .single();

    if (error && status !== 406) {
      console.error(`[fetchEpisodeDetails] Supabase error fetching episode ${episodeId}:`, error);
      throw error;
    }

    if (!data) {
      console.warn(`[fetchEpisodeDetails] No episode found with id: ${episodeId}`);
      return null;
    }

    console.log(`[fetchEpisodeDetails] Fetched episode details:`, data);
    return data as Episode;
  } catch (error) {
    console.error(`[fetchEpisodeDetails] Failed to fetch episode details for ${episodeId}:`, error);
    return null;
  }
}

export default function EpisodeConversationPage() {
  const params = useParams();
  
  const showId = Array.isArray(params.showId) ? params.showId[0] : params.showId as string;
  const seasonNumberStr = Array.isArray(params.seasonNumber) ? params.seasonNumber[0] : params.seasonNumber as string;
  const episodeId = Array.isArray(params.episodeId) ? params.episodeId[0] : params.episodeId as string;
  
  // Ensure seasonNumber is a valid number for the CommentInput prop
  const seasonNumber = parseInt(seasonNumberStr, 10);

  console.log('EpisodeConversationPage params:', { showId, seasonNumberStr, seasonNumber, episodeId }); // Added for debugging

  const [episodeDetails, setEpisodeDetails] = useState<Episode | null>(null);
  const [loadingEpisode, setLoadingEpisode] = useState(true);
  const [pageError, setPageError] = useState<string | null>(null);
  
  const [commentRefreshTrigger, setCommentRefreshTrigger] = useState<number>(Date.now());
  const hardcodedAuthor = "Anonymous"; // Hardcoded author as per requirement

  useEffect(() => {
    const fetchInitialPageData = async () => {
      if (!episodeId) {
        setPageError("Episode ID is missing from URL.");
        setLoadingEpisode(false);
        return;
      }
      if (isNaN(seasonNumber)) {
        setPageError("Invalid Season Number in URL.");
        setLoadingEpisode(false);
        return;
      }
      if (!showId) {
        setPageError("Show ID is missing from URL.");
        setLoadingEpisode(false);
        return;
      }
      
      setLoadingEpisode(true);
      setPageError(null);
      try {
        const details = await fetchEpisodeDetails(episodeId);
        setEpisodeDetails(details);
      } catch (err) {
        console.error("Error loading page data:", err);
        setPageError(err instanceof Error ? err.message : 'Error fetching episode page data');
      }
      setLoadingEpisode(false);
    };

    fetchInitialPageData();
  }, [episodeId, showId, seasonNumberStr, seasonNumber]); // Added all relevant params as dependencies

  const handleCommentPosted = () => {
    setCommentRefreshTrigger(Date.now()); // Update the trigger to re-fetch comments in CommentList
  };

  if (loadingEpisode) {
    return <Loading />;
  }

  if (!episodeId || !showId || isNaN(seasonNumber)) {
     return (
        <div className="container mx-auto px-4 py-8">
            <div className="text-center p-4 bg-red-900 border border-red-700 rounded-md">
            <p className="text-xl text-white">Page Load Error:</p>
            <p className="text-sm text-red-200">
                {pageError || "Required information (Show ID, Season Number, or Episode ID) is missing or invalid in the URL."}
            </p>
            <Link href={`/show/${showId || ''}`} className="text-blue-300 hover:underline mt-2 inline-block">Back to Show</Link>
            {' | '}
            <Link href="/" className="text-blue-300 hover:underline mt-2 inline-block">Go Home</Link>
            </div>
        </div>
        );
  }

  if (pageError && !episodeDetails) {
     return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center p-4 bg-red-900 border border-red-700 rounded-md">
          <p className="text-xl text-white">Error loading episode content:</p>
          <p className="text-sm text-red-200">{pageError}</p>
          <Link href={`/show/${showId || ''}`} className="text-blue-300 hover:underline mt-2 inline-block">Back to Show</Link>
           {' | '}
          <Link href="/" className="text-blue-300 hover:underline mt-2 inline-block">Go Home</Link>
        </div>
      </div>
    );
  }
  
  if (!loadingEpisode && !episodeDetails && !pageError) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold text-yellow-400 mb-4">Episode Not Found</h1>
        <p className="text-gray-300">The episode you are looking for (ID: {episodeId}) could not be found.</p>
        <div className="mt-4">
          <Link href={`/show/${showId || ''}`} className="text-blue-500 hover:underline">Back to Show Details</Link>
          {' | '}
          <Link href="/" className="text-blue-500 hover:underline ml-2">Go to Homepage</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      {episodeDetails ? (
        <>
          <h1 className="text-3xl font-bold text-white mb-2">
            {episodeDetails.title || 'Episode Title Not Available'}
          </h1>
          <div className="text-sm text-gray-400 mb-1">
            <span>Season {seasonNumber}, Episode {episodeDetails.episode_number || 'N/A'}</span>
            {episodeDetails.air_date && (
              <span className="ml-2 pl-2 border-l border-gray-600">
                Aired: {formatDate(episodeDetails.air_date, { year: 'numeric', month: 'long', day: 'numeric' })}
              </span>
            )}
          </div>
          {episodeDetails.description && (
            <p className="text-gray-300 mt-2 mb-6 whitespace-pre-line">
              {episodeDetails.description}
            </p>
          )}
        </>
      ) : (
         <h1 className="text-3xl font-bold text-white mb-2">
          Episode Discussion
        </h1>
      )}
      {(!episodeDetails?.title) && (
         <>
            <p className="text-sm text-gray-400 mb-1">Show ID: {showId}</p>
            <p className="text-sm text-gray-400 mb-1">Season: {seasonNumber}</p>
            <p className="text-sm text-gray-400 mb-6">Episode ID: {episodeId}</p>
         </>
      )}
      
      {pageError && episodeDetails && (
        <div className="my-4 p-3 bg-yellow-800 border border-yellow-600 rounded-md">
            <p className="text-md text-white">Notice:</p>
            <p className="text-sm text-yellow-200">{pageError}</p>
        </div>
      )}

      <div className="mt-8">
        <h2 className="text-2xl font-semibold text-gray-200 mb-4">Comments</h2>
        <CommentList 
            showId={showId}
            seasonNumber={seasonNumber}
            episodeId={episodeId} 
            refreshTrigger={commentRefreshTrigger} 
        />
      </div>

      <CommentInput 
        showId={showId}
        seasonNumber={seasonNumber}
        episodeId={episodeId} 
        author={hardcodedAuthor}
        onCommentPosted={handleCommentPosted} 
      />
    </div>
  );
} 