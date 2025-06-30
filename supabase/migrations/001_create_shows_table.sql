-- Create shows table
CREATE TABLE IF NOT EXISTS public.shows (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    poster_url TEXT,
    platform TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.shows ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow read for all" 
ON public.shows 
FOR SELECT 
USING (true);

CREATE POLICY "Allow insert for authenticated users" 
ON public.shows 
FOR INSERT 
TO authenticated 
WITH CHECK (true);

CREATE POLICY "Allow update for authenticated users" 
ON public.shows 
FOR UPDATE 
TO authenticated 
USING (true);

CREATE POLICY "Allow delete for authenticated users" 
ON public.shows 
FOR DELETE 
TO authenticated 
USING (true);

-- Insert demo show
INSERT INTO public.shows (id, title, description, created_at)
SELECT 
    gen_random_uuid(),
    'Demo Show',
    'This is a demo show for testing purposes',
    NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM public.shows WHERE title = 'Demo Show'
); 