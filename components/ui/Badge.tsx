export function Badge({ label }: { label: string }) {
  return (
    <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 uppercase">
      {label}
    </span>
  );
} 