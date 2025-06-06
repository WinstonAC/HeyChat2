-- Add new columns to comments table
ALTER TABLE public.comments 
    ADD COLUMN source_type TEXT,
    ADD COLUMN parent_id UUID REFERENCES public.comments(id) ON DELETE CASCADE,
    ADD COLUMN pinned BOOLEAN DEFAULT false,
    ADD COLUMN saved_by UUID[] DEFAULT '{}',
    ADD COLUMN like_count INTEGER DEFAULT 0,
    ADD COLUMN source_url TEXT,
    ADD COLUMN ingested BOOLEAN DEFAULT false,
    ADD COLUMN relevance_score FLOAT DEFAULT 0;

-- Add indexes for better query performance
CREATE INDEX idx_comments_source_type ON public.comments(source_type);
CREATE INDEX idx_comments_parent_id ON public.comments(parent_id);
CREATE INDEX idx_comments_pinned ON public.comments(pinned);
CREATE INDEX idx_comments_like_count ON public.comments(like_count);
CREATE INDEX idx_comments_relevance_score ON public.comments(relevance_score);

-- Create a function to get hot takes (most liked comments)
CREATE OR REPLACE FUNCTION get_hot_takes(episode_id UUID, limit_count INTEGER DEFAULT 3)
RETURNS TABLE (
    id UUID,
    content TEXT,
    created_at TIMESTAMPTZ,
    like_count INTEGER,
    author_id UUID,
    author_name TEXT,
    author_handle TEXT,
    author_avatar_url TEXT,
    source_type TEXT,
    source_url TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        c.id,
        c.content,
        c.created_at,
        c.like_count,
        c.user_id as author_id,
        p.full_name as author_name,
        p.handle as author_handle,
        p.avatar_url as author_avatar_url,
        c.source_type,
        c.source_url
    FROM public.comments c
    LEFT JOIN public.profiles p ON c.user_id = p.user_id
    WHERE c.episode_id = get_hot_takes.episode_id
    ORDER BY c.like_count DESC
    LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;

-- Create a function to toggle comment pin status (admin only)
CREATE OR REPLACE FUNCTION toggle_comment_pin(comment_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
    is_admin BOOLEAN;
BEGIN
    -- Check if user is admin
    SELECT EXISTS (
        SELECT 1 FROM public.profiles
        WHERE user_id = auth.uid()
        AND is_admin = true
    ) INTO is_admin;

    IF NOT is_admin THEN
        RAISE EXCEPTION 'Only admins can pin comments';
    END IF;

    -- Toggle pin status
    UPDATE public.comments
    SET pinned = NOT pinned
    WHERE id = comment_id;

    RETURN FOUND;
END;
$$ LANGUAGE plpgsql;

-- Create a function to toggle comment save status
CREATE OR REPLACE FUNCTION toggle_comment_save(comment_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
    user_id UUID;
    saved BOOLEAN;
BEGIN
    user_id := auth.uid();
    
    -- Check if user has already saved the comment
    SELECT user_id = ANY(saved_by) INTO saved
    FROM public.comments
    WHERE id = comment_id;

    -- Toggle save status
    IF saved THEN
        UPDATE public.comments
        SET saved_by = array_remove(saved_by, user_id)
        WHERE id = comment_id;
    ELSE
        UPDATE public.comments
        SET saved_by = array_append(saved_by, user_id)
        WHERE id = comment_id;
    END IF;

    RETURN NOT saved;
END;
$$ LANGUAGE plpgsql;

-- Create a function to increment like count
CREATE OR REPLACE FUNCTION increment_comment_likes(comment_id UUID)
RETURNS INTEGER AS $$
DECLARE
    new_count INTEGER;
BEGIN
    UPDATE public.comments
    SET like_count = like_count + 1
    WHERE id = comment_id
    RETURNING like_count INTO new_count;

    RETURN new_count;
END;
$$ LANGUAGE plpgsql;

-- Add RLS policies for new features
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read comments
CREATE POLICY "Allow read access to everyone" ON public.comments
    FOR SELECT USING (true);

-- Allow authenticated users to insert their own comments
CREATE POLICY "Allow insert for authenticated users" ON public.comments
    FOR INSERT TO authenticated
    WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own comments
CREATE POLICY "Allow update for owners" ON public.comments
    FOR UPDATE TO authenticated
    USING (auth.uid() = user_id);

-- Allow users to delete their own comments
CREATE POLICY "Allow delete for owners" ON public.comments
    FOR DELETE TO authenticated
    USING (auth.uid() = user_id);

-- Allow admins to pin comments
CREATE POLICY "Allow admins to pin comments" ON public.comments
    FOR UPDATE TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE user_id = auth.uid()
            AND is_admin = true
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE user_id = auth.uid()
            AND is_admin = true
        )
    ); 