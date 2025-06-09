-- Add author_name column to comments table
ALTER TABLE comments
ADD COLUMN IF NOT EXISTS author_name TEXT;

-- Update existing comments to use user's email as author_name
UPDATE comments c
SET author_name = u.email
FROM auth.users u
WHERE c.user_id = u.id
AND c.author_name IS NULL;

-- Add RLS policy to allow users to update their own author_name
CREATE POLICY "Enable update of author_name for users based on user_id"
ON comments
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Add index for better performance
CREATE INDEX IF NOT EXISTS comments_author_name_idx ON comments(author_name); 