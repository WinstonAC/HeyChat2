'use client';

import React from 'react';
import Image from 'next/image';
import { Heart, MessageCircle, MoreHorizontal, Share2 } from 'lucide-react';
import { FaReddit, FaTiktok, FaTwitter, FaYoutube, FaPodcast } from 'react-icons/fa';
import type { Comment } from '@/lib/types';
import { timeAgo } from '@/lib/utils';
import { useToast } from '@/hooks/useToast';
import { useRouter } from 'next/navigation';

interface CommentCardProps {
  comment: Comment;
}

const CommentCard: React.FC<CommentCardProps> = ({ comment }) => {
  const { showToast } = useToast();
  const router = useRouter();

  const handleCopyLink = async () => {
    const url = `${window.location.pathname}?comment=${comment.id}`;
    try {
      await navigator.clipboard.writeText(url);
      showToast('Link copied to clipboard!', 'success');
    } catch (err) {
      showToast('Failed to copy link', 'error');
    }
  };

  const getSourceIcon = (type?: string) => {
    switch (type) {
      case 'Reddit': return <FaReddit className="text-orange-500" />;
      case 'TikTok': return <FaTiktok className="text-pink-500" />;
      case 'Twitter': return <FaTwitter className="text-blue-400" />;
      case 'YouTube': return <FaYoutube className="text-red-500" />;
      case 'Podcast': return <FaPodcast className="text-purple-500" />;
      default: return null;
    }
  };

  return (
    <div className="bg-zinc-900/50 rounded-lg p-4 transition-all duration-300 hover:bg-zinc-900/70">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <Image
            src={comment.author.avatar_url || "/heychat.png"}
            alt={`${comment.author.name}'s avatar`}
            width={40}
            height={40}
            className="rounded-full"
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold">{comment.author.name}</span>
              <span className="text-sm text-gray-400">@{comment.author.handle}</span>
            </div>
            {comment.source_type && (
              <div className="flex items-center gap-1 mt-1">
                {getSourceIcon(comment.source_type)}
                <span className="text-xs text-gray-400">{comment.source_type}</span>
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2 text-gray-500">
          <span className='text-sm'>{timeAgo(comment.created_at)}</span>
          <button 
            onClick={handleCopyLink}
            className="hover:text-accent transition-colors"
            title="Copy link to comment"
          >
            <Share2 size={18} />
          </button>
          <MoreHorizontal size={20} />
        </div>
      </div>
      <p className="text-white mb-4">
        {comment.content}
      </p>
      <div className="flex items-center gap-6 text-gray-400">
        <button className="flex items-center gap-2 hover:text-accent transition-colors">
          <Heart size={18} /> {comment.likes_count}
        </button>
        <button className="flex items-center gap-2 hover:text-accent transition-colors">
          <MessageCircle size={18} />
        </button>
      </div>
    </div>
  );
};

export default CommentCard; 