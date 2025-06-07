-- Enable RLS on comments table if not already enabled
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow read access to everyone" ON public.comments;
DROP POLICY IF EXISTS "Allow insert for authenticated users" ON public.comments;
DROP POLICY IF EXISTS "Allow update for owners" ON public.comments;
DROP POLICY IF EXISTS "Allow delete for owners" ON public.comments;

-- Create new policies
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
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

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