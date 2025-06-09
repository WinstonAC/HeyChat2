-- Enable RLS on comments and shows tables
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shows ENABLE ROW LEVEL SECURITY;

-- Comments RLS policies
CREATE POLICY "Allow read for all" ON public.comments FOR SELECT USING (true);
CREATE POLICY "Allow insert for authenticated users" ON public.comments FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Allow update own comments" ON public.comments FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Allow delete own comments" ON public.comments FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Shows RLS policies
CREATE POLICY "Allow read for all" ON public.shows FOR SELECT USING (true);
CREATE POLICY "Allow insert for authenticated users" ON public.shows FOR INSERT TO authenticated WITH CHECK (true);

-- Insert demo show if not exists
INSERT INTO public.shows (id, title, created_at)
SELECT 'demo-show-id', 'Demo Show', now()
WHERE NOT EXISTS (SELECT 1 FROM public.shows WHERE id = 'demo-show-id'); 