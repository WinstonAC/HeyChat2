-- Add show ID validation
CREATE OR REPLACE FUNCTION validate_show_id(show_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.shows WHERE id = show_id
  );
END;
$$ LANGUAGE plpgsql;

-- Add RLS policy for shows table if not exists
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'shows' 
    AND policyname = 'Enable read access for all users'
  ) THEN
    CREATE POLICY "Enable read access for all users"
    ON public.shows
    FOR SELECT
    TO public
    USING (true);
  END IF;
END $$;

-- Insert demo show if no shows exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.shows LIMIT 1) THEN
    INSERT INTO public.shows (
      id,
      title,
      description,
      created_at
    ) VALUES (
      gen_random_uuid(),
      'Demo Show',
      'This is a demo show for testing purposes',
      NOW()
    );
  END IF;
END $$; 