import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

// Interface for the episode data, matching Supabase schema and TMDB response
interface FormattedEpisode {
  show_id: string;
  episode_number: number;
  title: string;
  air_date: string | null;
  overview: string | null;
  still_path: string | null;
  // Add season_number if you plan to store it, TMDB API provides it per episode
  season_number?: number; 
}

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TARGET_SHOW_NAME = "And Just Like That...";
const TARGET_SEASON_NUMBER = 2; // Changed from 3 to 2
const SUPABASE_SHOW_ID = '04bddd34-0e3b-4fcc-984d-52e4f0bb75d8'; // Provided Show ID

// Helper function to fetch Show ID from TMDb (adapted from fetch-episodes)
async function fetchTmdbShowId(showName: string): Promise<number | null> {
  if (!TMDB_API_KEY) {
    console.warn('[API /api/seed-ajlt-s2] TMDB_API_KEY is not set. Cannot fetch show ID.');
    return null;
  }
  const searchUrl = `https://api.themoviedb.org/3/search/tv?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(showName)}`;
  try {
    const response = await fetch(searchUrl);
    if (!response.ok) {
      const errorData = await response.json();
      console.error('[API /api/seed-ajlt-s2] TMDb search API error:', errorData);
      return null;
    }
    const data = await response.json();
    if (data.results && data.results.length > 0) {
      return data.results[0].id;
    }
    console.warn(`[API /api/seed-ajlt-s2] No show found for "${showName}" on TMDb.`);
    return null;
  } catch (error) {
    console.error(`[API /api/seed-ajlt-s2] Error fetching show ID for "${showName}":`, error);
    return null;
  }
}

// Helper function to fetch Season Episodes from TMDb (adapted from fetch-episodes)
async function fetchTmdbSeasonEpisodes(tmdbShowId: number, seasonNumber: number): Promise<any[]> {
  if (!TMDB_API_KEY) {
    console.warn('[API /api/seed-ajlt-s2] TMDB_API_KEY is not set. Cannot fetch season episodes.');
    return [];
  }
  const seasonUrl = `https://api.themoviedb.org/3/tv/${tmdbShowId}/season/${seasonNumber}?api_key=${TMDB_API_KEY}`;
  try {
    const response = await fetch(seasonUrl);
    if (!response.ok) {
      const errorData = await response.json();
      console.error('[API /api/seed-ajlt-s2] TMDb season API error:', errorData);
      return [];
    }
    const data = await response.json();
    return data.episodes || [];
  } catch (error) {
    console.error(`[API /api/seed-ajlt-s2] Error fetching season ${seasonNumber} for TV ID ${tmdbShowId}:`, error);
    return [];
  }
}

export async function POST() {
  console.log('[API /api/seed-ajlt-s2] Received POST request to seed episodes.');

  if (!TMDB_API_KEY) {
    console.error('[API /api/seed-ajlt-s2] TMDB_API_KEY is not configured.');
    return NextResponse.json({ error: 'TMDB_API_KEY is not configured. Seeding aborted.' }, { status: 500 });
  }

  let newEpisodesAdded = 0;

  try {
    const tmdbShowId = await fetchTmdbShowId(TARGET_SHOW_NAME);
    if (!tmdbShowId) {
      return NextResponse.json({ error: `Failed to find TMDb ID for show "${TARGET_SHOW_NAME}". Seeding aborted.` }, { status: 404 });
    }

    const rawEpisodes = await fetchTmdbSeasonEpisodes(tmdbShowId, TARGET_SEASON_NUMBER);
    if (!rawEpisodes || rawEpisodes.length === 0) {
      return NextResponse.json({ message: `No episodes found on TMDb for "${TARGET_SHOW_NAME}" Season ${TARGET_SEASON_NUMBER}. Nothing to seed.` }, { status: 200 });
    }

    const formattedEpisodes: FormattedEpisode[] = rawEpisodes.map((ep: any) => ({
      show_id: SUPABASE_SHOW_ID,
      episode_number: ep.episode_number,
      title: ep.name,
      air_date: ep.air_date || null,
      overview: ep.overview || null,
      still_path: ep.still_path ? `https://image.tmdb.org/t/p/original${ep.still_path}` : null,
      season_number: ep.season_number, // Make sure your 'episodes' table has this column if you include it
    }));

    for (const episode of formattedEpisodes) {
      // Check for existing episode
      const { data: existingEpisode, error: selectError } = await supabase
        .from('episodes')
        .select('id')
        .eq('show_id', episode.show_id)
        .eq('episode_number', episode.episode_number)
        .eq('season_number', episode.season_number)
        .single(); // .single() is important to get one record or null

      if (selectError && selectError.code !== 'PGRST116') { // PGRST116: Row to VARYING relation does not exist (means no record found)
        console.error(`[API /api/seed-ajlt-s2] Error checking for existing episode ${episode.episode_number}:`, selectError);
        // Decide if you want to continue or abort for this specific error
        continue; 
      }

      if (existingEpisode) {
        console.log(`[API /api/seed-ajlt-s2] Episode ${episode.episode_number} for show ${episode.show_id} already exists. Skipping.`);
        continue;
      }

      // Insert new episode
      // Ensure your Supabase RLS policies allow insert operations for the service_role key or the authenticated user.
      const { error: insertError } = await supabase
        .from('episodes')
        .insert(episode);

      if (insertError) {
        console.error(`[API /api/seed-ajlt-s2] Error inserting episode ${episode.episode_number}:`, insertError);
        // Decide if you want to log this and continue, or stop the whole process
      } else {
        console.log(`[API /api/seed-ajlt-s2] Successfully inserted episode ${episode.episode_number} for show ${episode.show_id}.`);
        newEpisodesAdded++;
      }
    }

    return NextResponse.json({
      message: "Seeding process complete.",
      newEpisodesAdded,
      totalEpisodesFetched: formattedEpisodes.length,
    });

  } catch (error: any) {
    console.error('[API /api/seed-ajlt-s2] General error during seeding process:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred during seeding.', details: error.message }, 
      { status: 500 }
    );
  }
} 