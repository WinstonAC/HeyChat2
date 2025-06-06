'use client';

import React, { useState } from 'react';
import { Heart, MessageCircle, MoreHorizontal, Share2, Pin, Bookmark } from 'lucide-react';
import type { Comment } from '@/lib/types';
import { timeAgo } from '@/lib/utils';
import { useToast } from '@/hooks/useToast';
import { useRouter } from 'next/navigation';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Avatar } from '../ui/Avatar';

interface CommentCardProps {
  comment: Comment;
  onReply: () => void;
  onPin: () => void;
  onSave: () => void;
  onLike: () => void;
  isAdmin: boolean;
  isSaved: boolean;
}

const CommentCard: React.FC<CommentCardProps> = ({
  comment,
  onReply,
  onPin,
  onSave,
  onLike,
  isAdmin,
  isSaved
}) => {
  const { showToast } = useToast();
  const router = useRouter();
  const [expanded, setExpanded] = useState(false);

  const handleCopyLink = async () => {
    const url = `${window.location.pathname}?comment=${comment.id}`;
    try {
      await navigator.clipboard.writeText(url);
      showToast('Link copied to clipboard!', 'success');
    } catch (err) {
      showToast('Failed to copy link', 'error');
    }
  };

  // Collapse logic
  const isLong = comment.content.length > 300;
  const displayContent = !isLong || expanded ? comment.content : comment.content.slice(0, 300) + '...';

  return (
    <div className="mb-4">
      <Card>
        <div className="flex items-start gap-3 mb-2">
          {/* Avatar */}
          {comment.author?.avatar_url && (
            <Avatar src={comment.author.avatar_url} />
          )}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-bold text-sm">{comment.author?.name}</span>
              <span className="text-xs text-gray-400">@{comment.author?.handle}</span>
              {/* Source badge for ingested */}
              {comment.source_type && <Badge label={comment.source_type} />}
            </div>
            <div className="text-xs text-gray-500 flex items-center gap-2 mb-1">
              <span>{timeAgo(comment.created_at)}</span>
              {isAdmin && (
                <button
                  onClick={onPin}
                  className={`hover:bg-gray-200 hover:opacity-80 transition-colors ${comment.pinned ? 'text-accent' : ''} rounded p-1`}
                  title={comment.pinned ? 'Unpin comment' : 'Pin comment'}
                >
                  <Pin size={14} />
                </button>
              )}
              <button 
                onClick={handleCopyLink}
                className="hover:bg-gray-200 hover:opacity-80 transition-colors rounded p-1"
                title="Copy link to comment"
              >
                <Share2 size={14} />
              </button>
              <MoreHorizontal size={16} />
            </div>
            <div className="text-sm text-white mb-1 transition-all duration-300 ease-in-out">
              {displayContent}
              {isLong && (
                <button
                  onClick={() => setExpanded((v) => !v)}
                  className="ml-2 text-xs font-semibold text-blue-500 hover:underline hover:text-blue-600 transition-colors"
                >
                  {expanded ? 'Show Less' : 'Show More'}
                </button>
              )}
            </div>
            {comment.source_url && (
              <a
                href={comment.source_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs underline text-muted-foreground block mb-1 hover:text-blue-500 hover:underline transition-colors"
              >
                View Source
              </a>
            )}
            <div className="flex items-center gap-4 mt-1">
              <button 
                onClick={onLike}
                className="flex items-center gap-1 hover:bg-gray-200 hover:opacity-80 transition-colors text-xs rounded p-1"
              >
                <Heart size={16} /> {comment.like_count}
              </button>
              <button 
                onClick={onReply}
                className="flex items-center gap-1 hover:bg-gray-200 hover:opacity-80 transition-colors text-xs rounded p-1"
              >
                <MessageCircle size={16} />
                {comment.replies?.length ? ` ${comment.replies.length}` : ''}
              </button>
              <button 
                onClick={onSave}
                className={`flex items-center gap-1 hover:bg-gray-200 hover:opacity-80 transition-colors text-xs rounded p-1 ${isSaved ? 'text-accent' : ''}`}
              >
                <Bookmark size={16} />
              </button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default CommentCard; 