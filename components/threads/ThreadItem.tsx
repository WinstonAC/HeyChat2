'use client';

import type { Thread } from '@/lib/types';
import { timeAgo } from '@/lib/utils'; // Assuming timeAgo is moved to a utils file
import { ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

interface ThreadItemProps {
  thread: Thread;
}

const ThreadItem: React.FC<ThreadItemProps> = ({ thread }) => {
  return (
    <div className="bg-zinc-900/50 rounded-lg p-4 flex items-center justify-between">
      <div>
        <Link href={thread.url} target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors">
          <h4 className="font-bold text-lg">{thread.title}</h4>
        </Link>
        <p className="text-sm text-gray-400 mt-1">
          submitted {timeAgo(thread.created_at)} by @{thread.author.handle}
        </p>
      </div>
       <Link href={thread.url} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-accent transition-colors">
         <ArrowUpRight size={24} />
       </Link>
    </div>
  );
};

export default ThreadItem; 