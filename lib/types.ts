export type Show = {
  id: string;
  created_at: string;
  title: string;
  description: string | null;
  image_url: string | null;
};

export type Comment = {
  id: string;
  content: string;
  created_at: string;
  author_name: string | null;
  show_id: string;
  user_id: string;
  source_type: string | null;
  parent_id: string | null;
  pinned: boolean | null;
  saved_by: string[] | null;
  ingested: boolean | null;
  relevance_score: number | null;
};

export type Episode = {
  id: string;
  show_id: string;
  season: number;
  episode_number: number;
  title: string;
  description: string | null;
  air_date: string | null;
  created_at: string;
};

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