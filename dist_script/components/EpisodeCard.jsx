'use client';
import Link from 'next/link';
const EpisodeCard = ({ episode, showId }) => {
    return (<Link href={`/show/${showId}/season/${episode.season_number}/episode/${episode.id}`} className="block p-4 bg-gray-800 rounded-lg shadow hover:bg-gray-700 transition-colors duration-200 ease-in-out">
      <h4 className="text-md font-semibold text-white truncate">
        S{episode.season_number.toString().padStart(2, '0')}E{episode.episode_number.toString().padStart(2, '0')}: {episode.title}
      </h4>
      {/* You can add more episode details here if needed, e.g., air date, description snippet */}
    </Link>);
};
export default EpisodeCard;
