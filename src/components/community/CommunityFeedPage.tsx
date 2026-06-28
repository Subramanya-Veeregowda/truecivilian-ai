import React, { useState, useEffect } from 'react';
import { Compass, Sparkles, Filter, Hash, RefreshCw, Layers } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Issue } from '../maps/types';
import { IssueCard } from './IssueCard';
import { TrendingHashtags } from './TrendingHashtags';
import { FollowAreaPanel } from './FollowAreaPanel';
import { FollowUserPanel } from './FollowUserPanel';
import { ActivityTimeline } from './ActivityTimeline';

export const CommunityFeedPage: React.FC = () => {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedHashtag, setSelectedHashtag] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchIssues = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/issues');
      if (response.ok) {
        const data = await response.json();
        setIssues(data);
      } else {
        // Fallback default mock data if database is empty on start
        setIssues(getMockIssues());
      }
    } catch (err) {
      console.error('Error fetching issues:', err);
      setIssues(getMockIssues());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIssues();
  }, []);

  // Filter issues based on category, hashtag, and search
  const filteredIssues = issues.filter((issue) => {
    const matchesCategory = selectedCategory === 'all' || issue.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesHashtag = !selectedHashtag || (issue.hashtags && issue.hashtags.some((tag) => tag.toLowerCase() === selectedHashtag.toLowerCase()));
    const matchesSearch = !searchQuery || 
      issue.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      issue.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesHashtag && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* 1. Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-200/50 dark:border-zinc-800/50 pb-5">
        <div className="space-y-1">
          <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider font-mono flex items-center gap-1.5">
            <Sparkles className="h-3 w-3" />
            Social & Collaboration Hub
          </span>
          <h2 className="font-display font-black text-xl md:text-2xl tracking-tight text-zinc-950 dark:text-white">
            Citizen Action Network
          </h2>
          <p className="text-xs text-zinc-400">
            Upvote, verify, and debate localized municipal issues with your neighbors in real time.
          </p>
        </div>

        {/* Search bar & Filter */}
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Search report titles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="text-xs px-3 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500 text-zinc-800 dark:text-white shadow-sm"
          />
          <button
            onClick={fetchIssues}
            disabled={loading}
            className="p-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 rounded-xl transition-all shadow-sm"
            title="Refresh feed"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* 2. Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: Feed & Category Filter */}
        <div className="lg:col-span-8 space-y-6">
          {/* Quick category filter tags */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 shrink-0 scrollbar-none">
            {[
              { id: 'all', label: 'All Incidents' },
              { id: 'road', label: 'Roadways & Potholes' },
              { id: 'sewerage', label: 'Water & Sewage' },
              { id: 'electricity', label: 'Power & Grid' },
              { id: 'waste', label: 'Sanitation & Waste' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  setSelectedCategory(cat.id);
                  setSelectedHashtag(null); // clear tag filter if picking category
                }}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  selectedCategory === cat.id && !selectedHashtag
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-white text-zinc-600 border border-zinc-200/60 dark:bg-zinc-900 dark:text-zinc-400 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-850'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {selectedHashtag && (
            <div className="flex items-center gap-2 bg-emerald-500/10 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 rounded-xl px-3 py-2 border border-emerald-500/20 text-xs font-semibold">
              <Hash className="h-4 w-4 text-emerald-500" />
              <span>Filtering by tag: #{selectedHashtag}</span>
              <button
                onClick={() => setSelectedHashtag(null)}
                className="ml-auto underline text-[10px] hover:text-emerald-800 dark:hover:text-emerald-300"
              >
                Clear Filter
              </button>
            </div>
          )}

          {/* Main Feed */}
          {loading && filteredIssues.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 space-y-3">
              <RefreshCw className="h-8 w-8 text-emerald-500 animate-spin" />
              <p className="text-xs text-zinc-400 animate-pulse">Assembling municipal feed...</p>
            </div>
          ) : filteredIssues.length === 0 ? (
            <div className="p-12 text-center border border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl bg-white dark:bg-zinc-900/40">
              <Layers className="h-8 w-8 text-zinc-300 mx-auto mb-2" />
              <p className="text-sm font-bold text-zinc-800 dark:text-zinc-300">No Incidents Found</p>
              <p className="text-xs text-zinc-400 mt-1">Try adjusting your filters or search keywords.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredIssues.map((issue) => (
                <IssueCard key={issue.id} issue={issue} />
              ))}
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: Bento Widgets */}
        <div className="lg:col-span-4 space-y-6">
          {/* 1. Trending Hashtags */}
          <TrendingHashtags
            selectedHashtag={selectedHashtag}
            onHashtagSelect={(tag) => {
              setSelectedHashtag(tag);
              setSelectedCategory('all'); // override category filter
            }}
          />

          {/* 2. Subscribed Wards */}
          <FollowAreaPanel />

          {/* 3. Follow Citizens */}
          <FollowUserPanel />

          {/* 4. Live Events Log */}
          <ActivityTimeline />
        </div>
      </div>
    </div>
  );
};

// Beautiful initial mock list to render in case the database is freshly provisioned
function getMockIssues(): Issue[] {
  return [
    {
      id: '10000000-0000-0000-0000-000000000001',
      title: 'Major Pothole Blockage at Ward 102 Main Crossing',
      description: 'A deep pothole has emerged near the main square, causing dangerous swerving for motorcyclists and heavy delays during peak hours. Needs immediate filling and road triage.',
      latitude: 12.9716,
      longitude: 77.5946,
      locationAddress: 'Sector 3 Circle, Ward 102, Bangalore',
      status: 'REPORTED',
      priority: 'HIGH',
      severity: 'MAJOR',
      category: 'road',
      wardCode: 'WARD-102',
      upvoteCount: 14,
      downvoteCount: 1,
      isAnonymous: false,
      hashtags: ['PotholeAlert', 'CleanWard102', 'SafeStreets'],
      media: [
        {
          id: 'media-1',
          mediaUrl: 'https://images.unsplash.com/photo-1515162305285-0293e4767cc2?auto=format&fit=crop&q=80&w=600',
          mediaType: 'image',
          caption: 'Severe road surface damage'
        }
      ],
      reporterId: 'ElenaID',
      reporterName: 'Elena Rostova',
      createdAt: '2026-06-27T08:00:00.000Z',
      updatedAt: '2026-06-27T08:00:00.000Z',
    },
    {
      id: '20000000-0000-0000-0000-000000000002',
      title: 'Water Main Burst Leakage',
      description: 'Clean drinking water has been bursting onto the public road for the past 6 hours. High volume of water waste and mild localized flooding on the sidewalk.',
      latitude: 12.9279,
      longitude: 77.6271,
      locationAddress: '5th Main Rd, Sector 4, HSR Layout, Ward 102',
      status: 'VERIFIED',
      priority: 'MEDIUM',
      severity: 'MODERATE',
      category: 'sewerage',
      wardCode: 'WARD-102',
      upvoteCount: 22,
      downvoteCount: 0,
      isAnonymous: true,
      hashtags: ['WaterLeaks', 'CleanWard102'],
      media: [
        {
          id: 'media-2',
          mediaUrl: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=600',
          mediaType: 'image',
          caption: 'Water flooding road'
        }
      ],
      createdAt: '2026-06-26T18:30:00.000Z',
      updatedAt: '2026-06-26T18:30:00.000Z',
    },
  ];
}
