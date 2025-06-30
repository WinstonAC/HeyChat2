import Image from 'next/image';
import Link from 'next/link';

interface ShowCardProps {
  title: string;
  imageUrl: string;
  showLink: string;
}

const ShowCard: React.FC<ShowCardProps> = ({ title, imageUrl, showLink }) => {
  return (
    <Link href={showLink} legacyBehavior>
      <a className="block rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
        <Image src={imageUrl} alt={title} width={300} height={450} className="object-cover" />
        <div className="p-4 bg-gray-700">
          <h3 className="text-xl font-semibold text-white">{title}</h3>
        </div>
      </a>
    </Link>
  );
};

export default ShowCard; 