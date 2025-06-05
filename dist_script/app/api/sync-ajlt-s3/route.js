import { NextResponse } from 'next/server';
const TARGET_SHOW_NAME = "And Just Like That...";
const TARGET_SEASON_NUMBER = 3;
const SUPABASE_SHOW_ID = '1664e7e7-391d-412f-9604-5f9460eca94a';
// Helper function to fetch Show ID from TMDb
async function fetchShowId(showName, apiKey) {
    const searchUrl = `https://api.themoviedb.org/3/search/tv?api_key=${apiKey}&query=${encodeURIComponent(showName)}`;
    const response = await fetch(searchUrl);
    if (!response.ok)
        return null;
    const data = await response.json();
    const match = data.results?.find((r) => r.name.toLowerCase() === showName.toLowerCase());
    return match?.id ?? null;
}
// Helper function to fetch Season Episodes from TMDb
async function fetchSeasonEpisodes(tvId, season, apiKey) {
    const url = `https://api.themoviedb.org/3/tv/${tvId}/season/${season}?api_key=${apiKey}`;
    const response = await fetch(url);
    if (!response.ok)
        return [];
    const data = await response.json();
    return data.episodes || [];
}
export async function GET() {
    try {
        const TMDB_API_KEY = process.env.TMDB_API_KEY;
        if (!TMDB_API_KEY) {
            console.error('Missing TMDB_API_KEY');
            return NextResponse.json({ error: 'Missing TMDB_API_KEY' }, { status: 500 });
        }
        const response = await fetch(`https://api.themoviedb.org/3/tv/203482/season/3?api_key=${TMDB_API_KEY}`);
        const data = await response.json();
        if (!data?.episodes) {
            console.error('No episodes found in TMDB response', data);
            return NextResponse.json({ error: 'No episodes found' }, { status: 404 });
        }
        return NextResponse.json({ episodes: data.episodes });
    }
    catch (err) {
        console.error('Error in sync-ajlt-s3:', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
