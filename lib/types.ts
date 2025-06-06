export interface Show {
  id: string;
  title: string;
  poster_url?: string;
  season_count?: number;
  // Add other show properties as needed
}

export interface Episode {
  id: string;
  title: string;
  description: string;
  air_date: string;
  season_number: number;
  episode_number: number;
  // Add other episode properties as needed
}

export interface Comment {
  id: string; // uuid, default in Supabase, but string in TS
  show_id: string;
  season_number: number;
  episode_id: string;
  text: string;
  author: string;
  created_at: string; // Supabase timestampz typically comes as string
} 