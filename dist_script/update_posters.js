// update_posters.ts
import 'dotenv/config'; // Load environment variables from .env
import { supabase } from './lib/supabaseClient'; // Import Supabase client - remove .ts extension
const TMDB_API_KEY = process.env.TMDB_API_KEY;
const NEXT_PUBLIC_SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const NEXT_PUBLIC_SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const POSTER_BASE_URL = 'https://image.tmdb.org/t/p/w500';
if (!TMDB_API_KEY) {
    console.error('Error: TMDB_API_KEY environment variable is not set.');
    process.exit(1);
}
if (!NEXT_PUBLIC_SUPABASE_URL || !NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    console.error('Error: Supabase URL or Anon Key environment variables are not set.');
    process.exit(1);
}
async function fetchShowsFromSupabase() {
    console.log('Fetching shows from Supabase that need poster URLs...');
    const { data: shows, error } = await supabase
        .from('shows')
        .select('id, title, poster_url')
        .is('poster_url', null); // Only fetch shows where poster_url is null
    if (error) {
        console.error('Error fetching shows from Supabase:', error.message);
        return [];
    }
    console.log(`Found ${shows?.length || 0} shows in Supabase needing poster URLs.`);
    return shows || [];
}
async function searchTmdbByTitle(title) {
    const searchUrl = `${TMDB_BASE_URL}/search/tv?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(title)}`;
    console.log(`Searching TMDB for: "${title}"`);
    try {
        const response = await fetch(searchUrl);
        if (!response.ok) {
            let errorDetails = await response.text();
            try {
                errorDetails = JSON.stringify(await response.json());
            }
            catch (e) { /* Ignore if not JSON */ }
            console.error(`TMDB API error for title "${title}": ${response.status} ${response.statusText}. Details: ${errorDetails}`);
            return null;
        }
        const data = await response.json();
        if (data.results && data.results.length > 0) {
            console.log(`Found TMDB match for "${title}": ${data.results[0].name}`);
            return data.results[0];
        }
        else {
            console.log(`No TMDB match found for title: "${title}"`);
            return null;
        }
    }
    catch (error) {
        console.error(`Network or other error searching TMDB for title "${title}":`, error.message);
        return null;
    }
}
async function updateShowPosterInSupabase(showId, posterUrl) {
    console.log(`Updating show ID ${showId} with poster_url: ${posterUrl}`);
    const { error } = await supabase
        .from('shows')
        .update({ poster_url: posterUrl })
        .eq('id', showId);
    if (error) {
        console.error(`Error updating show ID ${showId} in Supabase:`, error.message);
        return false;
    }
    console.log(`Successfully updated poster_url for show ID ${showId}.`);
    return true;
}
async function main() {
    console.log('Starting poster update script (TypeScript)...');
    const shows = await fetchShowsFromSupabase();
    if (!shows || shows.length === 0) {
        console.log('No shows to process or error fetching them. Exiting.');
        return;
    }
    let updatedCount = 0;
    let failedToFindPosterCount = 0;
    let failedToUpdateSupabaseCount = 0;
    for (let i = 0; i < shows.length; i++) {
        const show = shows[i];
        console.log(`\nProcessing show ${i + 1}/${shows.length}: ${show.title} (ID: ${show.id})`);
        // Double check if poster_url is somehow filled (shouldn't happen with the query filter)
        if (show.poster_url) {
            console.log(`Skipping show "${show.title}" as it already has a poster_url: ${show.poster_url}`);
            continue;
        }
        const tmdbMatch = await searchTmdbByTitle(show.title);
        if (tmdbMatch && tmdbMatch.poster_path) {
            const fullPosterUrl = `${POSTER_BASE_URL}${tmdbMatch.poster_path}`;
            const success = await updateShowPosterInSupabase(show.id, fullPosterUrl);
            if (success) {
                updatedCount++;
            }
            else {
                failedToUpdateSupabaseCount++;
            }
        }
        else {
            console.log(`No poster_path found on TMDB for "${show.title}". Skipping Supabase update for this show.`);
            failedToFindPosterCount++;
        }
        if (i < shows.length - 1) {
            console.log('Waiting 250ms before next TMDB request...');
            await new Promise(resolve => setTimeout(resolve, 250));
        }
    }
    console.log('\n--- Script Summary ---');
    console.log(`Total shows queried (needing posters): ${shows.length}`);
    console.log(`Successfully updated posters for: ${updatedCount} shows`);
    console.log(`Could not find poster on TMDB for: ${failedToFindPosterCount} shows`);
    console.log(`Failed to update Supabase (after finding poster): ${failedToUpdateSupabaseCount} shows`);
    console.log('Poster update script finished.');
}
main().catch(error => {
    console.error("Unhandled error in main execution:", error);
    process.exit(1);
});
