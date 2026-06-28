import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, X, Loader2 } from 'lucide-react';
import api from '../../lib/api';
import { GeocodingResult } from './types';

interface SearchLocationBarProps {
  onLocationSelect: (location: { lat: number; lng: number; address: string }) => void;
  defaultCenterAddress?: string;
}

export const SearchLocationBar: React.FC<SearchLocationBarProps> = ({
  onLocationSelect,
  defaultCenterAddress = '',
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<GeocodingResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Handle click outside to close dropdown
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = async (val: string) => {
    setQuery(val);
    if (val.trim().length < 3) {
      setResults([]);
      return;
    }

    setLoading(true);
    setOpen(true);
    try {
      const response = await api.get<GeocodingResult[]>(`/maps/search`, {
        params: { query: val },
      });
      setResults(response.data);
    } catch (err) {
      console.error('Error fetching search locations:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setQuery('');
    setResults([]);
    setOpen(false);
  };

  const handleSelectResult = (r: GeocodingResult) => {
    setQuery(r.address);
    setOpen(false);
    onLocationSelect({
      lat: r.latitude,
      lng: r.longitude,
      address: r.address,
    });
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-md z-30">
      <div className="flex items-center bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800/80 rounded-2xl shadow-lg px-3 py-2.5 gap-2.5 transition-all focus-within:border-emerald-500/50 focus-within:ring-2 focus-within:ring-emerald-500/10">
        <Search className="h-4.5 w-4.5 text-zinc-400 shrink-0" />
        <input
          type="text"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Search by neighborhood, circle, or address..."
          className="w-full bg-transparent text-xs text-zinc-800 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none"
          onFocus={() => {
            if (results.length > 0) setOpen(true);
          }}
        />
        {loading ? (
          <Loader2 className="h-4 w-4 text-emerald-500 animate-spin shrink-0" />
        ) : query ? (
          <button onClick={handleClear} className="p-0.5 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400">
            <X className="h-3.5 w-3.5" />
          </button>
        ) : null}
      </div>

      {open && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-2xl shadow-xl z-50 overflow-hidden max-h-64 overflow-y-auto divide-y divide-zinc-50 dark:divide-zinc-850">
          {results.map((r, idx) => (
            <button
              key={idx}
              onClick={() => handleSelectResult(r)}
              className="w-full flex items-start gap-3 px-4 py-3 hover:bg-zinc-50 dark:hover:bg-zinc-850/50 text-left transition-colors text-xs"
            >
              <MapPin className="h-4 w-4 text-zinc-400 mt-0.5 shrink-0" />
              <div>
                <p className="font-semibold text-zinc-800 dark:text-zinc-200 line-clamp-1">{r.address.split(',')[0]}</p>
                <p className="text-[10px] text-zinc-400 truncate line-clamp-1">{r.address}</p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
