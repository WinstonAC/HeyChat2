-- Goal: Implement all approved updates across Supabase schema.

-- Task 1: Add `network` column to `shows` table.
-- It's assumed this is already done. If not, run this:
-- ALTER TABLE "public"."shows" ADD COLUMN "network" text;


-- Task 2: Create the new `threads` table.
-- This table will store threads (likely external links) related to specific episodes.
CREATE TABLE IF NOT EXISTS public.threads (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    episode_id uuid REFERENCES public.episodes(id) ON DELETE CASCADE,
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    title text NOT NULL,
    url text,
    created_at timestamp WITH time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT title_length CHECK (char_length(title) > 0)
);

-- Task 3: Update the `comments` table.
-- The old `Comment` type had `author` as a simple string.
-- We are replacing it with a proper foreign key to the `users` table
-- and adding other features like likes.
-- This schema is based on the needs of the `CommentCard` component.

-- Drop the old table if it exists
DROP TABLE IF EXISTS public.comments;

-- Create the new `comments` table
CREATE TABLE public.comments (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    show_id uuid REFERENCES public.shows(id) ON DELETE CASCADE,
    episode_id uuid REFERENCES public.episodes(id) ON DELETE CASCADE,
    content text NOT NULL,
    likes_count integer DEFAULT 0,
    created_at timestamp WITH time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT content_length CHECK (char_length(content) > 0)
);


-- Task 4: Create a function to get trending shows.
-- This function calculates trending shows based on the number of comments
-- in the last 7 days. This gives more recent shows a higher weight.
CREATE OR REPLACE FUNCTION get_trending_shows()
RETURNS TABLE (
    id uuid,
    title text,
    poster_url text,
    description text,
    network text,
    comment_count bigint
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        s.id,
        s.title,
        s.poster_url,
        s.description,
        s.network,
        count(c.id) as comment_count
    FROM
        public.shows s
    JOIN
        public.comments c ON s.id = c.show_id
    WHERE
        c.created_at >= now() - interval '7 days'
    GROUP BY
        s.id
    ORDER BY
        comment_count DESC
    LIMIT 10;
END;
$$ LANGUAGE plpgsql;

-- Create a function to get distinct platforms
CREATE OR REPLACE FUNCTION get_distinct_platforms()
RETURNS TABLE (
    platform text
) AS $$
BEGIN
    RETURN QUERY
    SELECT DISTINCT s.platform
    FROM public.shows s
    WHERE s.platform IS NOT NULL AND s.platform <> '';
END;
$$ LANGUAGE plpgsql;

-- Enable RLS for the new tables
ALTER TABLE public.threads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

-- Add RLS policies for the new tables (example policies, adjust as needed)
-- Allow anyone to read threads and comments
CREATE POLICY "Allow read access to everyone" ON public.threads FOR SELECT USING (true);
CREATE POLICY "Allow read access to everyone" ON public.comments FOR SELECT USING (true);

-- Allow authenticated users to insert their own threads and comments
CREATE POLICY "Allow insert for authenticated users" ON public.threads FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Allow insert for authenticated users" ON public.comments FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own threads and comments
CREATE POLICY "Allow update for owners" ON public.threads FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Allow update for owners" ON public.comments FOR UPDATE USING (auth.uid() = user_id);

-- Allow users to delete their own threads and comments
CREATE POLICY "Allow delete for owners" ON public.threads FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "Allow delete for owners" ON public.comments FOR DELETE USING (auth.uid() = user_id); 