\"use client\";

import { supabase } from '@/lib/supabaseClient';
import Link from 'next/link';
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/useToast";

// Helper function for formatting dates safely
const formatDate = (input?: string, options?: Intl.DateTimeFormatOptions) => {
  if (!input) return "Unknown date";
  const d = new Date(input);
  if (isNaN(d.getTime())) {
    console.warn("Invalid date input for formatDate:", input);
    return "Invalid Date";
  }
  return options ? d.toLocaleString(undefined, options) : d.toLocaleDateString();
};

interface Episode {
  id: string;
  title: string;
  description: string;
  air_date: string;
  episode_number: number;
}

interface Show {
  id: string;
  title: string;
  // Add other show properties if needed, like poster_url if the page design needs it
}

// Removed slugToTitle and getShowTitleFromSlug as showId is now used directly

export default function ShowPageById({ params }: { params: { showId: string } }) { // Changed params.slug to params.showId
  const { showToast } = useToast();
  // State for existing data
  const [currentShow, setCurrentShow] = useState<Show | null>(null);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [fetchShowError, setFetchShowError] = useState<string | null>(null);
  const [fetchEpisodesError, setFetchEpisodesError] = useState<string | null>(null);
  const [isLoadingInitialData, setIsLoadingInitialData] = useState(true);

  // State for comments (from user)
  const [user, setUser] = useState<any>(null); // Consider more specific User type from Supabase
  const [comments, setComments] = useState<any[]>([]); // Consider specific Comment type
  const [newComment, setNewComment] = useState("");
  const [commentLoading, setCommentLoading] = useState(false);

  const mockComments = [ // This might be for fallback if comments API is down or for episode without comments.
    {
      id: "1",
      content: "Omg that final scene?!",
      created_at: "2024-01-01T10:00:00.000Z",
      user: { email: "demo1@heychat.com" },
    },
    {
      id: "2",
      content: "Che was finally tolerable lol.",
      created_at: "2024-01-02T11:30:00.000Z",
      user: { email: "demo2@heychat.com" },
    },
  ];

  // useEffect for initial show and episode fetching
  useEffect(() => {
    const fetchData = async () => {
      console.log(\`[ShowPageById] Fetching data for show ID: \${params.showId}\`); // Changed logging
      setIsLoadingInitialData(true);
      setFetchShowError(null);
      setFetchEpisodesError(null);

      let fetchedShow: Show | null = null;

      try {
        console.log(\`[ShowPageById] Fetching show with ID: \${params.showId}\`); // Changed logging
        const { data: showData, error: showError } = await supabase
          .from('shows')
          .select('id, title') // Consider selecting poster_url if needed by the page design
          .eq('id', params.showId) // Changed to query by showId
          .single();

        if (showError && showError.code !== 'PGRST116') { // PGRST116 means no rows found, which is handled
          console.error("[ShowPageById] Error fetching show:", showError);
          throw showError;
        }
        
        if (!showData) {
          const errorMsg = \`Show with ID \"\${params.showId}\" not found.\`; // Changed error message
          console.warn("[ShowPageById]", errorMsg);
          setFetchShowError(errorMsg);
          showToast(errorMsg, "error");
        } else {
          fetchedShow = showData as Show;
          console.log("[ShowPageById] Show data fetched:", fetchedShow);
          setCurrentShow(fetchedShow);
          
          console.log(\`[ShowPageById] Fetching episodes for show ID: \${fetchedShow.id}\`);
          const { data: episodesData, error: episodesError } = await supabase
            .from('episodes')
            .select('*')
            .eq('show_id', fetchedShow.id)
            .order('episode_number', { ascending: true });

          if (episodesError) {
            console.error("[ShowPageById] Error fetching episodes:", episodesError);
            throw episodesError;
          }
          console.log("[ShowPageById] Episodes data fetched:", episodesData);
          setEpisodes(episodesData || []);
        }
      } catch (err: any) {
        console.error(\`[ShowPageById] Error processing show/episodes for show ID \"\${params.showId}\":\`, err); // Changed error message
        if (!fetchShowError) { 
            const specificEpisodeError = err.message || 'An unexpected error occurred while fetching episodes.';
            setFetchEpisodesError(specificEpisodeError);
            showToast(specificEpisodeError, "error");
        }
      } finally {
        console.log("[ShowPageById] Finished initial data fetch. Setting isLoadingInitialData to false.");
        setIsLoadingInitialData(false);
      }
    };
    if (params.showId) { // Ensure showId is present before fetching
        fetchData();
    } else {
        console.warn("[ShowPageById] showId is missing, cannot fetch data.");
        setFetchShowError("Show ID is missing. Cannot load page.");
        setIsLoadingInitialData(false);
    }
  }, [params.showId]); // Changed dependency to params.showId

  // useEffect for user and comments
  useEffect(() => {
    const fetchUserAndComments = async () => {
      console.log("[ShowPageById] Fetching user and comments. Current show:", currentShow);
      const { data: userData } = await supabase.auth.getUser();
      console.log("[ShowPageById] User data:", userData.user);
      setUser(userData.user);

      if (currentShow && currentShow.id) {
        try {
          console.log(\`[ShowPageById] Fetching comments for show ID: \${currentShow.id}\`);
          // This page seems to fetch comments by 'show_id'.
          // The more detailed episode page fetches comments by 'episode_id'.
          // This distinction is maintained from the original [slug]/page.tsx.
          const { data: commentsData, error: commentsError } = await supabase
            .from("comments")
            .select("id, content, created_at, user:users(email)") 
            .eq("show_id", currentShow.id) 
            .order("created_at", { ascending: false });

          if (commentsError || !commentsData || commentsData.length === 0) { 
            console.warn("[ShowPageById] Error fetching comments or no comments found, using fallback comments. Error:", commentsError, "Data:", commentsData);
            setComments(mockComments);
          } else {
            console.log("[ShowPageById] Comments data fetched:", commentsData);
            setComments(commentsData);
          }
        } catch (err) {
          console.error("[ShowPageById] Critical error fetching comments, using fallback:", err);
          showToast("Could not load comments.", "error");
          setComments(mockComments);
        }
      } else if (!currentShow && !isLoadingInitialData) { 
        console.warn("[ShowPageById] No current show data (and not loading), using fallback comments for offline/error scenario.");
        setComments(mockComments);
      }
    };

    if (currentShow) {
        fetchUserAndComments();
    } else if (!isLoadingInitialData) {
        console.log("[ShowPageById] No current show and not loading initial data, running fetchUserAndComments to potentially set mock comments.");
        fetchUserAndComments();
    }
    
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log("[ShowPageById] Auth state changed:", event, "Session user:", session?.user);
        setUser(session?.user ?? null);
        if (event === "SIGNED_IN" || event === "SIGNED_OUT") {
            if (currentShow && currentShow.id) {
                 console.log("[ShowPageById] User signed in/out, re-fetching comments.");
                 fetchUserAndComments(); 
            }
        }
      }
    );

    return () => {
      console.log("[ShowPageById] Unsubscribing from auth listener.");
      authListener?.subscription.unsubscribe();
    };
  }, [currentShow, isLoadingInitialData]);

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !user || !currentShow) {
        showToast("Comment cannot be empty and you must be logged in.", "warning");
        return;
    }

    setCommentLoading(true);
    const { error } = await supabase.from("comments").insert({
      content: newComment.trim(),
      user_id: user.id,
      show_id: currentShow.id, // This links comment to the show.
    });

    if (!error) {
      setNewComment("");
      showToast("Comment posted successfully!", "success");
      console.log("[ShowPageById] Comment posted, re-fetching comments.");
      const { data: updatedComments, error: fetchError } = await supabase
        .from("comments")
        .select("id, content, created_at, user:users(email)")
        .eq("show_id", currentShow.id)
        .order("created_at", { ascending: false });
      if (!fetchError) {
        setComments(updatedComments || []);
      } else {
        console.error("Error re-fetching comments:", fetchError);
        showToast("Could not refresh comments after posting.", "error");
      }
    } else {
      console.error("Error posting comment:", error);
      showToast(\`Error posting comment: \${error.message}\`, "error");
    }
    setCommentLoading(false);
  };

  if (isLoadingInitialData) {
    return (
      <div className="container mx-auto p-4 text-center">
        <p>Loading show details...</p>
      </div>
    );
  }

  if (fetchShowError) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold text-red-500 mb-4">Error</h1>
        <p>{fetchShowError}</p>
        <Link href="/" legacyBehavior><a className="text-blue-500 hover:underline mt-4 inline-block">Go back to homepage</a></Link>
      </div>
    );
  }
  
  if (!currentShow && !isLoadingInitialData) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold text-red-500 mb-4">Show Not Found</h1>
        <p>The show you\\'re looking for (ID: \"{params.showId}\") could not be found.</p> {/* Changed params.slug to params.showId */}
        <Link href="/" legacyBehavior><a className="text-blue-500 hover:underline mt-4 inline-block">Go back to homepage</a></Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      {/* Ensure currentShow is not null before trying to access its properties */}
      <h1 className="text-4xl font-bold mb-2">{currentShow?.title || 'Show Title'}</h1>
      <p className="text-sm text-gray-400 mb-6">Show ID: {params.showId}</p> {/* Changed from Slug to Show ID */}

      <h2 className="text-3xl font-semibold mb-4">Episodes</h2>
      {fetchEpisodesError && <p className="text-red-500">Error loading episodes: {fetchEpisodesError}</p>}
      {!fetchEpisodesError && episodes.length === 0 && (
        <p className="text-gray-400">No episodes found for this show.</p>
      )}
      {!fetchEpisodesError && episodes.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {episodes.map((episode) => (
            <div key={episode.id} className="bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
              <h3 className="text-xl font-bold mb-2 text-purple-400">Ep. {episode.episode_number}: {episode.title}</h3>
              <p className="text-sm text-gray-400 mb-2">Air Date: {formatDate(episode.air_date)}</p>
              {/* <p className="text-gray-300\">{episode.description}</p> */}
            </div>
          ))}
        </div>
      )}

      {/* Comment Section Start */}
      <div className="mt-10 pt-6 border-t border-gray-700">
        <h2 className="text-3xl font-semibold mb-6">Comments</h2>
        {user ? (
          <form onSubmit={handleSubmitComment} className="mb-6">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              className="w-full p-3 border border-gray-600 rounded bg-gray-800 text-white placeholder-gray-500 focus:ring-purple-500 focus:border-purple-500"
              rows={3}
              disabled={commentLoading}
            />
            <button 
              type="submit" 
              disabled={commentLoading || !newComment.trim()} 
              className="mt-3 px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-md disabled:opacity-50 transition-colors duration-150"
            >
              {commentLoading ? "Posting..." : "Post Comment"}
            </button>
          </form>
        ) : (
          <p className="mb-6 text-gray-500">
            Please <Link href="/login" legacyBehavior><a className="text-purple-400 hover:underline">log in</a></Link> to post a comment.
          </p>
        )}

        <div className="space-y-4">
          {comments.length === 0 && !commentLoading ? (
            <p className="text-gray-500">No comments yet. Be the first to share your thoughts!</p>
          ) : (
            comments.map((comment) => (
              <div key={comment.id} className="bg-gray-800 p-4 rounded-lg shadow">
                <p className="text-gray-300 whitespace-pre-wrap">{comment.content}</p>
                <p className="text-xs text-gray-500 mt-2">
                  By: {comment.user?.email || "Anonymous"} 
                  <span className="mx-1">|</span> 
                  On: {formatDate(comment.created_at, { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
      {/* Comment Section End */}

      <div className="mt-8">
        <Link href="/" legacyBehavior><a className="text-blue-400 hover:text-blue-300 hover:underline">← Back to All Shows (Homepage)</a></Link>
      </div>
    </div>
  );
} 