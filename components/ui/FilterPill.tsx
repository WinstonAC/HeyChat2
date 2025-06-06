'use client';

import React from 'react';

interface FilterPillProps {
  label: string;
  isActive?: boolean;
  onClick?: () => void;
}

const FilterPill: React.FC<FilterPillProps> = ({ label, isActive = false, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-full font-semibold text-sm transition-colors duration-200
        ${
          isActive
            ? 'bg-accent text-black'
            : 'bg-zinc-800 text-white hover:bg-zinc-700'
        }
      `}
    >
      {label}
    </button>
  );
};

export default FilterPill; 