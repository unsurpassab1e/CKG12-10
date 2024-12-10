import React from 'react';
import { ArrowUpDown } from 'lucide-react';

interface SortSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string; }[];
}

export default function SortSelect({ value, onChange, options }: SortSelectProps) {
  return (
    <div className="flex items-center gap-2">
      <ArrowUpDown className="text-gray-400 h-5 w-5" />
      <select
        className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}