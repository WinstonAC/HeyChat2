'use client';
import Link from 'next/link';
import Image from 'next/image';
const ShowCard = ({ show }) => {
    return (<Link href={`/show/${show.id}`} className="block group">
      <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 ease-in-out">
        <div className="relative w-full h-72"> {/* Fixed height for consistent card size */}
          {show.poster_url ? (<Image src={show.poster_url} alt={`${show.title} poster`} layout="fill" objectFit="cover" className="transition-transform duration-300 group-hover:scale-105"/>) : (<div className="w-full h-full bg-gray-700 flex items-center justify-center">
              <span className="text-gray-400">No Poster</span>
            </div>)}
        </div>
        <div className="p-4">
          <h3 className="text-lg font-semibold text-white truncate group-hover:text-blue-400 transition-colors">
            {show.title}
          </h3>
        </div>
      </div>
    </Link>);
};
export default ShowCard;
