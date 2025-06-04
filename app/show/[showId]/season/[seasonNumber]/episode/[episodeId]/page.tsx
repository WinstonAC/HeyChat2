'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import CommentList from '@/components/CommentList';
import CommentInput from '@/components/CommentInput';
import type { Episode } from '@/lib/types';
// Supabase client and User type are no longer directly needed here for comment auth

// Placeholder for fetching specific episode details (e.g., title)
async function fetchEpisodeDetails(episodeId: string): Promise<Partial<Episode> | null> {
  try {
    console.warn('fetchEpisodeDetails is a placeholder. Implement actual API call for episode title and metadata.');
    return {
      id: episodeId,
      title: "Episode Title (Placeholder)", // Replace with actual fetched title
      // season_number and episode_number might also come from here if not from params directly for display
    };
  } catch (error) {
    console.error(`Failed to fetch episode details for ${episodeId}:`, error);
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

  const [episodeDetails, setEpisodeDetails] = useState<Partial<Episode> | null>(null);
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
        // Removed direct fetching of Supabase user from this page component
      } catch (err) {
        console.error("Error loading page data:", err);
        setPageError(err instanceof Error ? err.message : 'Error fetching episode page data');
      }
      setLoadingEpisode(false);
    };

    fetchInitialPageData();
    // Removed Supabase auth listener as CommentInput now takes author directly

  }, [episodeId, showId, seasonNumberStr, seasonNumber]); // Added all relevant params as dependencies

  const handleCommentPosted = () => {
    setCommentRefreshTrigger(Date.now()); // Update the trigger to re-fetch comments in CommentList
  };

  if (loadingEpisode) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-xl text-gray-400">Loading episode discussion...</p>
      </div>
    );
  }

  // Check for missing IDs or errors after loading attempt
  if (!episodeId || !showId || isNaN(seasonNumber)) {
     return (
        <div className="container mx-auto px-4 py-8">
            <div className="text-center p-4 bg-red-900 border border-red-700 rounded-md">
            <p className="text-xl text-white">Page Load Error:</p>
            <p className="text-sm text-red-200">
                {pageError || "Required information (Show ID, Season Number, or Episode ID) is missing or invalid in the URL."}
            </p>
            </div>
        </div>
        );
  }

  if (pageError && !episodeDetails) {
     return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center p-4 bg-red-900 border border-red-700 rounded-md">
          <p className="text-xl text-white">Error loading page content:</p>
          <p className="text-sm text-red-200">{pageError}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      {episodeDetails ? (
        <h1 className="text-3xl font-bold text-white mb-2">
          {episodeDetails.title || 'Episode Discussion'}
        </h1>
      ) : (
         <h1 className="text-3xl font-bold text-white mb-2">
          Episode Discussion (Title not loaded)
        </h1>
      )}
      <p className="text-sm text-gray-400 mb-1">Show ID: {showId}</p>
      <p className="text-sm text-gray-400 mb-1">Season: {seasonNumber}</p>
      <p className="text-sm text-gray-400 mb-6">Episode ID: {episodeId}</p>
      
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
        seasonNumber={seasonNumber} // Pass the parsed number
        episodeId={episodeId} 
        author={hardcodedAuthor} // Pass hardcoded author
        onCommentPosted={handleCommentPosted} 
      />
    </div>
  );
} 