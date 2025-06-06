export function Button({ children }: { children: React.ReactNode }) {
  return (
    <button className="bg-blue-600 text-white px-3 py-1.5 rounded-md text-sm hover:bg-blue-700 hover:bg-gray-200 hover:opacity-80 transition">
      {children}
    </button>
  );
} 