import ShowCard from "@/components/ShowCard";

export default function HomePage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8 text-center">Popular Shows</h1>
      <div className="flex justify-center">
        <ShowCard
          title="And Just Like That..."
          imageUrl="/show-placeholder.jpg" // Placeholder image
          showLink="/show/and-just-like-that"
        />
      </div>
    </div>
  );
} 