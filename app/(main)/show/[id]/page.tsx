import { SearchParams } from 'next/navigation';

export default function Page({
  params,
}: {
  params: { id: string };
  searchParams?: SearchParams;
}) {
  const { id } = params;

  return (
    <main className="p-4">
      <h1 className="text-xl font-bold">Show ID: {id}</h1>
    </main>
  );
} 