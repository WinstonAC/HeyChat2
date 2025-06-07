-- Enable Row Level Security
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE episodes ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Enable read access for all users" ON comments;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON comments;
DROP POLICY IF EXISTS "Enable update for users based on user_id" ON comments;
DROP POLICY IF EXISTS "Enable delete for users based on user_id" ON comments;

DROP POLICY IF EXISTS "Enable read access for all users" ON episodes;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON episodes;

-- Comments table policies
CREATE POLICY "Enable read access for all users"
ON comments FOR SELECT
TO public
USING (true);

CREATE POLICY "Enable insert for authenticated users only"
ON comments FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Enable update for users based on user_id"
ON comments FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Enable delete for users based on user_id"
ON comments FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- Episodes table policies
CREATE POLICY "Enable read access for all users"
ON episodes FOR SELECT
TO public
USING (true);

CREATE POLICY "Enable insert for authenticated users only"
ON episodes FOR INSERT
TO authenticated
WITH CHECK (true);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS comments_user_id_idx ON comments(user_id);
CREATE INDEX IF NOT EXISTS comments_show_id_idx ON comments(show_id);
CREATE INDEX IF NOT EXISTS episodes_show_id_idx ON episodes(show_id); 