'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLayout } from '../LayoutProvider';

interface SearchResult {
  id: string;
  title: string;
  subtitle?: string;
  type: 'page' | 'medication' | 'appointment' | 'family' | 'data';
  icon: React.ReactNode;
  href?: string;
  action?: () => void;
}

interface SearchOverlayProps {
  className?: string;
}

// Healthcare-specific search categories
const SEARCH_CATEGORIES = {
  pages: { label: 'Pages', icon: '📄' },
  medications: { label: 'Medications', icon: '💊' },
  appointments: { label: 'Appointments', icon: '📅' },
  family: { label: 'Family', icon: '👨‍👩‍👧‍👦' },
  data: { label: 'Health Data', icon: '📊' }
};

// Mock search results
const MOCK_RESULTS: SearchResult[] = [
  { id: '1', title: 'Dashboard', type: 'page', icon: '🏠', href: '/dashboard' },
  { id: '2', title: 'Medications', type: 'page', icon: '💊', href: '/medications' },
  { id: '3', title: 'Lisinopril 10mg', subtitle: 'Blood pressure medication', type: 'medication', icon: '💊' },
  { id: '4', title: 'Dr. Smith Appointment', subtitle: 'Tomorrow at 2:00 PM', type: 'appointment', icon: '📅' },
  { id: '5', title: 'Family Hub', type: 'page', icon: '👨‍👩‍👧‍👦', href: '/family' },
  { id: '6', title: 'Blood Pressure Trends', type: 'data', icon: '📊', href: '/analytics/blood-pressure' }
];

export function SearchOverlay({ className = '' }: SearchOverlayProps) {
  const { navigation, toggleSearch } = useLayout();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when overlay opens
  useEffect(() => {
    if (navigation.searchVisible && inputRef.current) {
      inputRef.current.focus();
    }
  }, [navigation.searchVisible]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.trim()) {
        performSearch(query);
      } else {
        setResults([]);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // Mock search function
  const performSearch = async (searchQuery: string) => {
    setIsLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const filteredResults = MOCK_RESULTS.filter(result =>
      result.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      result.subtitle?.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    setResults(filteredResults);
    setSelectedIndex(-1);
    setIsLoading(false);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!navigation.searchVisible) return;

      switch (e.key) {
        case 'Escape':
          toggleSearch();
          break;
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex(prev => Math.min(prev + 1, results.length - 1));
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex(prev => Math.max(prev - 1, -1));
          break;
        case 'Enter':
          e.preventDefault();
          if (selectedIndex >= 0 && results[selectedIndex]) {
            handleResultSelect(results[selectedIndex]);
          }
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [navigation.searchVisible, results, selectedIndex, toggleSearch]);

  const handleResultSelect = (result: SearchResult) => {
    if (result.action) {
      result.action();
    } else if (result.href) {
      window.location.href = result.href;
    }
    toggleSearch();
  };

  const getResultsByCategory = () => {
    const categorized: Record<string, SearchResult[]> = {};
    
    results.forEach(result => {
      if (!categorized[result.type]) {
        categorized[result.type] = [];
      }
      categorized[result.type].push(result);
    });

    return categorized;
  };

  if (!navigation.searchVisible) return null;

  return (
    <motion.div
      className={`fixed inset-0 z-50 flex items-start justify-center pt-20 ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
        onClick={toggleSearch}
      />

      {/* Search Modal */}
      <motion.div
        className="relative w-full max-w-2xl mx-4 bg-white rounded-lg shadow-modal overflow-hidden"
        initial={{ opacity: 0, y: -20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20, scale: 0.95 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        {/* Search Input */}
        <div className="flex items-center px-4 py-4 border-b border-neutral-200">
          <span className="text-xl mr-3">🔍</span>
          <input
            ref={inputRef}
            type="text"
            placeholder="Search medications, appointments, family members..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className={`
              flex-1 text-lg placeholder-neutral-500 bg-transparent
              focus:outline-none
            `}
          />
          {isLoading && (
            <div className="w-5 h-5 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
          )}
        </div>

        {/* Search Results */}
        <div className="max-h-96 overflow-y-auto">
          {query && results.length === 0 && !isLoading && (
            <div className="px-4 py-8 text-center text-neutral-500">
              <span className="text-4xl mb-2 block">🔍</span>
              No results found for "{query}"
            </div>
          )}

          {query === '' && (
            <div className="px-4 py-6">
              <h3 className="text-sm font-semibold text-neutral-500 uppercase tracking-wide mb-3">
                Quick Actions
              </h3>
              <div className="space-y-2">
                <SearchQuickAction icon="💊" label="Log Medication" />
                <SearchQuickAction icon="📅" label="Schedule Appointment" />
                <SearchQuickAction icon="📊" label="View Health Data" />
                <SearchQuickAction icon="👨‍👩‍👧‍👦" label="Check Family Status" />
              </div>
            </div>
          )}

          {results.length > 0 && (
            <div className="py-2">
              {Object.entries(getResultsByCategory()).map(([category, categoryResults]) => (
                <div key={category} className="mb-4">
                  <div className="px-4 py-2 bg-neutral-50">
                    <h3 className="text-xs font-semibold text-neutral-500 uppercase tracking-wide flex items-center gap-2">
                      <span>{SEARCH_CATEGORIES[category as keyof typeof SEARCH_CATEGORIES]?.icon}</span>
                      {SEARCH_CATEGORIES[category as keyof typeof SEARCH_CATEGORIES]?.label}
                    </h3>
                  </div>
                  
                  {categoryResults.map((result, index) => {
                    const globalIndex = results.indexOf(result);
                    const isSelected = selectedIndex === globalIndex;
                    
                    return (
                      <motion.button
                        key={result.id}
                        onClick={() => handleResultSelect(result)}
                        className={`
                          w-full flex items-center gap-3 px-4 py-3 text-left
                          transition-colors duration-150
                          ${isSelected 
                            ? 'bg-primary-50 text-primary-700' 
                            : 'hover:bg-neutral-50'
                          }
                        `}
                        whileHover={{ backgroundColor: isSelected ? undefined : '#f9fafb' }}
                      >
                        <span className="text-xl flex-shrink-0">{result.icon}</span>
                        <div className="min-w-0 flex-1">
                          <div className="font-medium text-neutral-900">{result.title}</div>
                          {result.subtitle && (
                            <div className="text-sm text-neutral-600">{result.subtitle}</div>
                          )}
                        </div>
                        <span className="text-neutral-400">→</span>
                      </motion.button>
                    );
                  })}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-3 bg-neutral-50 border-t border-neutral-200 text-xs text-neutral-500">
          <div className="flex items-center justify-between">
            <span>Use ↑↓ to navigate, Enter to select, Esc to close</span>
            <kbd className="px-2 py-1 bg-white border border-neutral-300 rounded text-xs">
              ⌘K
            </kbd>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// Quick Action Component
function SearchQuickAction({ 
  icon, 
  label, 
  onClick 
}: { 
  icon: string; 
  label: string; 
  onClick?: () => void; 
}) {
  return (
    <button
      onClick={onClick}
      className={`
        w-full flex items-center gap-3 px-3 py-2 rounded-md
        hover:bg-neutral-100 transition-colors duration-150
        text-left
      `}
    >
      <span className="text-lg">{icon}</span>
      <span className="font-medium text-neutral-700">{label}</span>
    </button>
  );
} 