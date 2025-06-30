'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
const CommentInput = ({ showId, seasonNumber, episodeId, author, onCommentPosted }) => {
    const [commentText, setCommentText] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);
    // Removed useState for currentUser and the useEffect that fetched it and listened to auth changes.
    // The 'author' prop is now the source of truth for who is posting.
    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!commentText.trim()) {
            setError('Comment cannot be empty.');
            return;
        }
        if (!author) {
            setError('Author information is missing. Cannot post comment.');
            return;
        }
        console.log('Submitting comment with props:', { showId, seasonNumber, episodeId, author, commentText: commentText.trim() });
        setIsSubmitting(true);
        setError(null);
        try {
            const { error: insertError } = await supabase
                .from('comments')
                .insert({
                show_id: showId,
                season_number: seasonNumber,
                episode_id: episodeId,
                text: commentText.trim(),
                author: author,
                // created_at is handled by Supabase (default now())
            });
            if (insertError) {
                throw insertError;
            }
            setCommentText('');
            onCommentPosted();
        }
        catch (err) {
            console.error("Failed to post comment:", err);
            setError(err instanceof Error ? err.message : 'An unknown error occurred while posting.');
        }
        finally {
            setIsSubmitting(false);
        }
    };
    return (<form onSubmit={handleSubmit} className="mt-6 mb-8">
      <h3 className="text-xl font-semibold text-white mb-3">Leave a Comment</h3>
      <textarea className="w-full p-3 bg-gray-700 text-gray-200 rounded-md border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out disabled:bg-gray-600" rows={4} placeholder={author && author !== "Anonymous" ? `Commenting as ${author}...` : "Write your comment here..."} value={commentText} onChange={(e) => {
            setCommentText(e.target.value);
            if (error)
                setError(null);
        }} disabled={isSubmitting || !author}/>
      {error && <p className="text-red-400 text-sm mt-1">{error}</p>}
      <button type="submit" disabled={isSubmitting || !commentText.trim() || !author} className="mt-3 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition duration-150 ease-in-out">
        {isSubmitting ? 'Posting...' : 'Post Comment'}
      </button>
      {/* Message about needing to be logged in can be removed or adapted based on how 'author' is handled upstream */}
    </form>);
};
export default CommentInput;
