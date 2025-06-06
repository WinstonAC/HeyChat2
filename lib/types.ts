export interface Show {
  id: string;
  title: string;
  poster_url?: string;
  description?: string;
  platform?: string;
}

export interface Episode {
  id: string;
  show_id: string;
  title: string;
  description: string;
  air_date: string;
  season_number: number;
  episode_number: number;
  // Add other episode properties as needed
}

export interface Comment {
  id: string;
  content: string;
  likes_count: number;
  created_at: string;
  show_id?: string;
  episode_id?: string;
  author: UserProfile;
  source_type?: string;
  source_url?: string;
  parent_id?: string;
  pinned: boolean;
  saved_by: string[];
  ingested: boolean;
  relevance_score: number;
  replies?: Comment[];
}

export interface UserProfile {
  user_id: string;
  name: string;
  handle: string;
  avatar_url: string;
}

export interface Thread {
  id: string;
  title: string;
  url: string;
  created_at: string;
  episode_id: string;
  author: UserProfile;
}

export interface Author {
  name: string;
  handle: string;
  avatar_url: string;
} 