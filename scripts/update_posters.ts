// Load environment variables from .env.local first
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

// Then import other dependencies
import { supabase } from '../lib/supabaseClient'; // Relative and extensionless for tsc

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const POSTER_BASE_URL = 'https://image.tmdb.org/t/p/w500';

// Basic check for the API key
if (!TMDB_API_KEY) {
  console.error('Error: TMDB_API_KEY environment variable is not set. Ensure it is in .env.local');
  process.exit(1);
}
if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    console.error(
      'Error: Supabase environment variables (NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY) are not set. Ensure they are in .env.local'
    );
    process.exit(1);
  }

interface Show {
  id: string;
  title: string;
}

interface TmdbTvResult {
  poster_path: string | null;
  // Add other fields if needed, e.g., name for logging
  name?: string;
}

interface TmdbError {
  success?: boolean;
  status_message?: string;
  status_code?: number;
}

async function fetchShows(): Promise<Show[]> {
  console.log('Fetching shows from Supabase that need poster URLs...');
  const { data, error } = await supabase
    .from('shows')
    .select('id, title')
    .is('poster_url', null);
  
  if (error) {
    console.error('Supabase error fetching shows:', error.message);
    throw error; // Rethrow to be caught by main or exit
  }
  const shows = data || [];
  console.log(`Found ${shows.length} shows needing posters.`);
  return shows;
}

async function fetchPoster(title: string): Promise<string | null> {
  const searchUrl = `${TMDB_BASE_URL}/search/tv?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(title)}`;
  console.log(`Fetching poster for: "${title}" from TMDB...`);
  try {
    const res = await fetch(searchUrl);
    if (!res.ok) {
      let errorDetails = `TMDB API responded with status: ${res.status} ${res.statusText}`;
      try {
        const errJson: TmdbError = await res.json();
        if (errJson.status_message) {
          errorDetails += ` - Message: ${errJson.status_message}`;
        }
      } catch (e) {
        // If parsing error JSON fails, use the text response if available
        const errText = await res.text().catch(() => 'No additional text from error response.');
        errorDetails += ` - Body: ${errText}`.substring(0, 500); // Limit length
      }
      console.error(errorDetails);
      return null; // Indicate failure to fetch or non-OK response
    }
    const data = await res.json();
    const posterPath = data.results?.[0]?.poster_path || null;
    if (posterPath) {
      console.log(`Found poster_path for "${title}": ${data.results[0].name || 'Unknown name'}`);
    } else {
      console.log(`No poster_path found in TMDB results for "${title}".`);
    }
    return posterPath;
  } catch (error: any) {
    console.error(`Network or other error fetching poster for "${title}":`, error.message);
    return null; // Indicate failure due to network or other exceptions
  }
}

async function updatePoster(id: string, url: string): Promise<void> {
  console.log(`Updating Supabase for show ID ${id} with poster_url: ${url}`);
  const { error } = await supabase
    .from('shows')
    .update({ poster_url: url })
    .eq('id', id);

  if (error) {
    console.error(`Supabase error updating poster for show ID ${id}:`, error.message);
    throw error; // Rethrow to be caught by main or indicate failure
  }
}

async function main() {
  console.log('Starting poster update script...');
  let shows: Show[] = [];
  try {
    shows = await fetchShows();
  } catch (error) {
    console.error('Failed to fetch shows from Supabase. Exiting.');
    process.exit(1);
  }

  if (shows.length === 0) {
    console.log('No shows to update.');
    console.log('\n✅ All done.');
    return;
  }

  let successCount = 0;
  let notFoundCount = 0;
  let errorCount = 0;

  for (const show of shows) {
    try {
      console.log(`\n🎬 Processing: ${show.title} (ID: ${show.id})`);
      const posterPath = await fetchPoster(show.title);
      if (posterPath) {
        await updatePoster(show.id, `${POSTER_BASE_URL}${posterPath}`);
        console.log('✅ Poster updated successfully in Supabase.');
        successCount++;
      } else {
        console.log('❌ No poster found on TMDB.');
        notFoundCount++;
      }
    } catch (err: any) {
      console.error(`❌ Failed to process show "${show.title}": ${err.message}`);
      errorCount++;
    }
    // Delay before the next show, regardless of outcome for this one
    if (shows.indexOf(show) < shows.length - 1) {
        console.log('Waiting 300ms before next show...');
        await new Promise(res => setTimeout(res, 300));
    }
  }
  console.log('\n--- Summary ---');
  console.log(`Total shows needing posters: ${shows.length}`);
  console.log(`✅ Successfully updated: ${successCount}`);
  console.log(`❌ Posters not found on TMDB: ${notFoundCount}`);
  console.log(`🚨 Errors during processing: ${errorCount}`);
  console.log('\n✅ All done.');
}

main().catch(error => {
  // This catches errors rethrown from main or unhandled promise rejections in main itself
  console.error('\n🚨 Critical error in script execution:', error?.message || error);
  process.exit(1);
}); 