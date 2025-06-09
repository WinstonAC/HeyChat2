'use client';

export function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}

interface FilterPillProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
}

export default function FilterPill({ label, isActive, onClick }: FilterPillProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'px-3 py-1 rounded-full text-sm font-medium transition-colors',
        isActive
          ? 'bg-accent text-black'
          : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
      )}
    >
      {label}
    </button>
  );
} 