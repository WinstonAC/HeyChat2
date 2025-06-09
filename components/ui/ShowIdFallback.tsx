import { AlertCircle } from 'lucide-react';
import Link from 'next/link';

interface ShowIdFallbackProps {
  showId: string;
}

export function ShowIdFallback({ showId }: ShowIdFallbackProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] p-4 text-center">
      <AlertCircle className="w-12 h-12 text-yellow-500 mb-4" />
      <h2 className="text-xl font-semibold text-gray-200 mb-2">
        Show Not Found
      </h2>
      <p className="text-gray-400 mb-4">
        The show with ID "{showId}" could not be found.
      </p>
      <div className="space-x-4">
        <Link
          href="/shows"
          className="inline-flex items-center px-4 py-2 bg-accent text-white rounded-md hover:bg-accent/90 transition-colors"
        >
          Browse Shows
        </Link>
        <Link
          href="/"
          className="inline-flex items-center px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition-colors"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
} 