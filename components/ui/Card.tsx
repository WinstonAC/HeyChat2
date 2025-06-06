export function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-xl border bg-white p-4 shadow-sm dark:bg-gray-900">
      {children}
    </div>
  );
} 