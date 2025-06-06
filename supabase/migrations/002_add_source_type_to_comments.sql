-- Add source_type column to comments table
ALTER TABLE public.comments ADD COLUMN source_type text;

-- Add index for faster filtering
CREATE INDEX idx_comments_source_type ON public.comments(source_type);

-- Add index for faster comment lookups by ID (for deep linking)
CREATE INDEX idx_comments_id ON public.comments(id);

-- Create an enum type for source types to ensure consistency
CREATE TYPE public.comment_source_type AS ENUM (
    'Reddit',
    'TikTok',
    'Podcast',
    'Twitter',
    'YouTube',
    'Other'
);

-- Update the column to use the enum type
ALTER TABLE public.comments 
    ALTER COLUMN source_type TYPE public.comment_source_type 
    USING source_type::public.comment_source_type;

-- Add a default value
ALTER TABLE public.comments 
    ALTER COLUMN source_type SET DEFAULT 'Other';

-- Add a function to detect source type from URL
CREATE OR REPLACE FUNCTION detect_source_type(url text)
RETURNS public.comment_source_type AS $$
BEGIN
    IF url ILIKE '%reddit.com%' THEN
        RETURN 'Reddit';
    ELSIF url ILIKE '%tiktok.com%' THEN
        RETURN 'TikTok';
    ELSIF url ILIKE '%twitter.com%' OR url ILIKE '%x.com%' THEN
        RETURN 'Twitter';
    ELSIF url ILIKE '%youtube.com%' OR url ILIKE '%youtu.be%' THEN
        RETURN 'YouTube';
    ELSIF url ILIKE '%podcast%' OR url ILIKE '%spotify.com%' OR url ILIKE '%apple.com%' THEN
        RETURN 'Podcast';
    ELSE
        RETURN 'Other';
    END IF;
END;
$$ LANGUAGE plpgsql; 