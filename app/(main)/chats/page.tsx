"use client";

import { useEffect, useState, useRef } from "react";
import { ArrowLeft } from "lucide-react";
import { useSearchParams, useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { Database } from "@/lib/database.types";

type Comment = Database["public"]["Tables"]["comments"]["Row"];

export default function ChatsPage() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams();

  const showId = searchParams?.get("show_id") || params?.id || "demo-show-id";

  // Auth + session check
  useEffect(() => {
    const fetchSession = async () => {
      try {
        console.log("🔑 Fetching user session:", {
          showId,
          timestamp: new Date().toISOString()
        });

        const { data, error } = await supabase.auth.getSession();
        if (error) {
          console.error("❌ Session fetch error:", {
            error,
            message: error.message,
            status: error.status,
            showId,
            timestamp: new Date().toISOString()
          });
          return;
        }

        const currentUser = data?.session?.user;
        if (!currentUser) {
          console.warn("⚠️ No user session found:", {
            session: data?.session,
            showId,
            timestamp: new Date().toISOString()
          });
          return;
        }

        console.log("✅ User session established:", {
          id: currentUser.id,
          email: currentUser.email,
          showId,
          timestamp: new Date().toISOString()
        });
        setUser(currentUser);
      } catch (err) {
        console.error("🚨 Unexpected session error:", {
          error: err,
          showId,
          timestamp: new Date().toISOString()
        });
      }
    };

    fetchSession();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log("🟣 Auth state changed:", {
        event: _event,
        userId: session?.user?.id,
        email: session?.user?.email,
        showId,
        timestamp: new Date().toISOString()
      });
      if (session?.user) setUser(session.user);
    });

    return () => {
      if (listener?.subscription) {
        console.log("🧹 Cleaning up auth listener:", {
          showId,
          timestamp: new Date().toISOString()
        });
        listener.subscription.unsubscribe();
      }
    };
  }, [showId]);

  // Fetch and subscribe to comments
  useEffect(() => {
    let subscription: any;

    const loadComments = async () => {
      setLoading(true);
      setError(null);

      // Skip for demo or invalid showId
      if (!showId || showId === "demo-show-id") {
        console.warn("⚠️ Skipping comments fetch for demo/invalid showId:", {
          showId,
          timestamp: new Date().toISOString()
        });
        setComments([]);
        setLoading(false);
        return;
      }

      try {
        // Verify user session before querying
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          console.warn("⚠️ No active session for comments query:", {
            showId,
            timestamp: new Date().toISOString()
          });
          setError("Please sign in to view comments");
          setLoading(false);
          return;
        }

        console.log("🔍 Fetching comments:", {
          showId,
          userId: session.user.id,
          email: session.user.email,
          timestamp: new Date().toISOString()
        });

        const { data, error } = await supabase
          .from("comments")
          .select(`
            id,
            content,
            created_at,
            author_name,
            show_id,
            user_id,
            source_type,
            parent_id,
            pinned,
            saved_by,
            ingested,
            relevance_score
          `)
          .eq("show_id", showId)
          .order("created_at", { ascending: true });

        if (error) {
          console.error("❌ Failed to fetch comments:", {
            error,
            message: error.message,
            details: error.details,
            hint: error.hint,
            code: error.code,
            showId,
            userId: session.user.id,
            timestamp: new Date().toISOString()
          });
          setError(error.message || "Failed to load comments");
        } else {
          console.log("✅ Comments loaded:", {
            count: data?.length || 0,
            firstComment: data?.[0],
            showId,
            userId: session.user.id,
            timestamp: new Date().toISOString()
          });
          setComments(data || []);
        }
      } catch (err: any) {
        console.error("🚨 Unexpected fetch error:", {
          error: err,
          message: err.message,
          stack: err.stack,
          showId,
          timestamp: new Date().toISOString()
        });
        setError(err.message || "Failed to load comments");
      } finally {
        setLoading(false);
      }
    };

    loadComments();

    // Only set up subscription if we have a real showId
    if (showId && showId !== "demo-show-id") {
      console.log("📡 Setting up real-time subscription:", {
        showId,
        timestamp: new Date().toISOString()
      });

      subscription = supabase
        .channel("comments-chat")
        .on(
          "postgres_changes",
          { event: "INSERT", schema: "public", table: "comments" },
          (payload) => {
            if (payload.new.show_id === showId) {
              console.log("📨 New comment received:", {
                comment: payload.new,
                showId,
                timestamp: new Date().toISOString()
              });
              setComments((prev) => [...prev, payload.new as Comment]);
            }
          }
        )
        .subscribe((status) => {
          console.log("📡 Subscription status:", {
            status,
            showId,
            timestamp: new Date().toISOString()
          });
        });
    }

    return () => {
      if (subscription) {
        console.log("🧹 Cleaning up subscription:", {
          showId,
          timestamp: new Date().toISOString()
        });
        supabase.removeChannel(subscription);
      }
    };
  }, [showId]);

  const handleInputKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && input.trim()) {
      if (!user?.id) {
        console.error("❌ No user available for comment insert");
        return;
      }

      const payload = {
        content: input.trim(),
        user_id: user.id,
        show_id: showId,
        author_name: user.email ?? "Anonymous",
      };

      console.log("📦 Inserting payload:", payload);

      const { error } = await supabase.from("comments").insert([payload]);

      if (error) {
        console.error("❌ Comment insert failed:", error);
      } else {
        console.log("✅ Comment submitted");
        setInput("");
        inputRef.current?.focus();
      }
    }
  };

  return (
    <div className="flex flex-col flex-1">
      <header className="h-14 flex items-center backdrop-blur bg-black/95 sticky top-0 z-50">
        <button
          aria-label="Go back"
          className="w-10 h-10 flex items-center justify-center"
          onClick={() => router.back()}
        >
          <ArrowLeft className="w-5 h-5 text-white" />
        </button>
        <h1 className="text-lg font-semibold flex-1 text-center -ml-10">Show Chat</h1>
      </header>

      <div className="h-14 flex items-center bg-black px-4">
        <span className="text-sm font-semibold text-white">Comments ({comments.length})</span>
      </div>

      <div className="flex-1 overflow-y-auto space-y-6 py-4 px-4">
        {loading ? (
          <p className="text-center text-zinc-400">Loading...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : comments.length === 0 ? (
          <p className="text-center text-zinc-400">No comments yet. Start the conversation!</p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="pb-4">
              <p className="text-sm font-medium">{comment.author_name || "User"}</p>
              <p className="text-sm text-zinc-300 mt-1">{comment.content}</p>
              <p className="text-xs text-zinc-500 mt-1">
                {new Date(comment.created_at).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          ))
        )}
      </div>

      <footer className="min-h-[72px] py-3 bg-black/90 backdrop-blur sticky bottom-0 z-[60] px-4">
        <div className="flex items-center gap-2">
          <input
            ref={inputRef}
            type="text"
            placeholder={user ? "Type a comment..." : "Sign in to comment"}
            className="flex-1 h-10 rounded-full px-4 bg-zinc-900 text-white text-sm outline-none"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleInputKeyDown}
            autoFocus
            disabled={!user}
          />
        </div>
      </footer>
    </div>
  );
} 