import { NextResponse } from 'next/server';
const TMDB_API_KEY = process.env.TMDB_API_KEY;
// STATUS CHECK: TMDB_API_KEY is fetched from environment variables and used for TMDB API calls. Checks for its existence are in place.
const TARGET_SHOW_NAME = "And Just Like That...";
const TARGET_SEASON_NUMBER = 3;
async function fetchShowId(showName) {
    if (!TMDB_API_KEY) {
        console.warn('[API /api/fetch-episodes] TMDB_API_KEY is not set. Cannot fetch show ID.');
        return null;
    }
    const searchUrl = `https://api.themoviedb.org/3/search/tv?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(showName)}`;
    console.log(`[API /api/fetch-episodes] Searching for show ID: ${searchUrl}`);
    try {
        const response = await fetch(searchUrl);
        if (!response.ok) {
            const errorData = await response.json();
            console.error('[API /api/fetch-episodes] TMDb search API error:', errorData);
            throw new Error(`TMDb search API request failed: ${response.status} ${errorData.status_message || ''}`);
        }
        const data = await response.json();
        if (data.results && data.results.length > 0) {
            // Assuming the first result is the most relevant one
            const foundShowId = data.results[0].id;
            console.log(`[API /api/fetch-episodes] Found show ID for "${showName}": ${foundShowId}`);
            return foundShowId;
        }
        console.warn(`[API /api/fetch-episodes] No show found for "${showName}" on TMDb.`);
        return null;
    }
    catch (error) {
        console.error(`[API /api/fetch-episodes] Error fetching show ID for "${showName}":`, error);
        return null;
    }
}
async function fetchSeasonEpisodes(tvId, seasonNumber) {
    if (!TMDB_API_KEY) {
        console.warn('[API /api/fetch-episodes] TMDB_API_KEY is not set. Cannot fetch season episodes.');
        return [];
    }
    const seasonUrl = `https://api.themoviedb.org/3/tv/${tvId}/season/${seasonNumber}?api_key=${TMDB_API_KEY}`;
    console.log(`[API /api/fetch-episodes] Fetching season details: ${seasonUrl}`);
    try {
        const response = await fetch(seasonUrl);
        if (!response.ok) {
            const errorData = await response.json();
            console.error('[API /api/fetch-episodes] TMDb season API error:', errorData);
            throw new Error(`TMDb season API request failed: ${response.status} ${errorData.status_message || ''}`);
        }
        const data = await response.json();
        return data.episodes || []; // The episodes are in an 'episodes' array in the season details
    }
    catch (error) {
        console.error(`[API /api/fetch-episodes] Error fetching season ${seasonNumber} for TV ID ${tvId}:`, error);
        return [];
    }
}
export async function GET() {
    console.log('[API /api/fetch-episodes] Received request');
    if (!TMDB_API_KEY) {
        console.warn('[API /api/fetch-episodes] TMDB_API_KEY is not set. Falling back to dummy data.');
        const dummyEpisodes = getDummyEpisodesPlaceholder();
        console.log('[API /api/fetch-episodes] Returning dummy data (TMDB_API_KEY missing):', JSON.stringify(dummyEpisodes, null, 2));
        return NextResponse.json({
            source: 'Dummy JSON (TMDB API Key Missing)',
            message: 'TMDB_API_KEY not configured. Using dummy episode data.',
            episodes: dummyEpisodes,
        });
    }
    try {
        const showId = await fetchShowId(TARGET_SHOW_NAME);
        if (!showId) {
            console.warn(`[API /api/fetch-episodes] Could not find show ID for "${TARGET_SHOW_NAME}". Falling back to dummy data.`);
            const dummyEpisodes = getDummyEpisodesPlaceholder();
            console.log('[API /api/fetch-episodes] Returning dummy data (Show ID not found):', JSON.stringify(dummyEpisodes, null, 2));
            return NextResponse.json({
                source: 'Dummy JSON (Show ID Not Found)',
                message: `Failed to find TMDb ID for show "${TARGET_SHOW_NAME}". Using dummy data.`,
                episodes: dummyEpisodes,
            }, { status: 404 });
        }
        const rawEpisodes = await fetchSeasonEpisodes(showId, TARGET_SEASON_NUMBER);
        if (!rawEpisodes || rawEpisodes.length === 0) {
            console.warn(`[API /api/fetch-episodes] No episodes found for Season ${TARGET_SEASON_NUMBER} of show ID ${showId}. This could be correct if the season has no episodes listed yet.`);
            // It might be valid for a season to have no episodes listed yet on TMDb.
            // Consider if you want to return an error or an empty list, or fall back to dummy.
            // For now, returning empty, but could fall back to dummy if preferred.
            return NextResponse.json({
                source: 'TMDb API',
                message: `No episodes found on TMDb for "${TARGET_SHOW_NAME}" Season ${TARGET_SEASON_NUMBER}. The season might not have episode data yet.`,
                episodes: [],
            });
        }
        // ✅ FINAL Supabase Show ID:
        const yourSupabaseShowId = '04bddd34-0e3b-4fcc-984d-52e4f0bb75d8';
        const formattedEpisodes = rawEpisodes.map((ep) => ({
            show_id: yourSupabaseShowId,
            episode_number: ep.episode_number,
            title: ep.name,
            air_date: ep.air_date || null,
            overview: ep.overview || null,
            still_path: ep.still_path ? `https://image.tmdb.org/t/p/original${ep.still_path}` : null,
            // season_number: ep.season_number, // uncomment if you added to FormattedEpisode
            // tmdb_episode_id: ep.id, // uncomment if you added to FormattedEpisode
        }));
        console.log('[API /api/fetch-episodes] Formatted TMDb Episodes for Supabase:', JSON.stringify(formattedEpisodes, null, 2));
        console.log('[API /api/fetch-episodes] Returning TMDb data. Count:', formattedEpisodes.length);
        return NextResponse.json({
            source: 'TMDb API',
            message: `Successfully fetched and formatted ${formattedEpisodes.length} episodes for "${TARGET_SHOW_NAME}" Season ${TARGET_SEASON_NUMBER}`,
            episodes: formattedEpisodes,
        });
    }
    catch (error) {
        console.error('[API /api/fetch-episodes] General error in GET handler:', error);
        const dummyEpisodes = getDummyEpisodesPlaceholder();
        console.log('[API /api/fetch-episodes] Returning dummy data (General error fallback):', JSON.stringify(dummyEpisodes, null, 2));
        return NextResponse.json({
            source: 'Dummy JSON (Error Fallback)',
            message: error.message || 'An unexpected error occurred. Using dummy data.',
            episodes: dummyEpisodes,
        }, { status: 500 });
    }
}
// Helper function to provide dummy episode data (placeholder if TMDb fails)
function getDummyEpisodesPlaceholder() {
    // STATUS CHECK: The placeholder 'yourSupabaseShowId' is used below and needs to be replaced with an actual ID.
    // TODO: Replace 'your-actual-supabase-show-id-for-ajlt' with the actual Supabase show ID for "And Just Like That...".
    const yourSupabaseShowId = '04bddd34-0e3b-4fcc-984d-52e4f0bb75d8';
    return [
        {
            show_id: yourSupabaseShowId,
            episode_number: 1,
            title: "(Dummy) Chapter One: City Lights",
            air_date: "2025-02-01",
            overview: "This is a dummy description for episode 1.",
            still_path: null,
        },
        {
            show_id: yourSupabaseShowId,
            episode_number: 2,
            title: "(Dummy) Chapter Two: New Beginnings",
            air_date: "2025-02-08",
            overview: "This is a dummy description for episode 2.",
            still_path: null,
        },
    ];
}
