import React from 'react';

// Єдина система іконок категорій
export const CategoryIcons: Record<string, React.FC<{ className?: string }>> = {
  electronics: ({ className = "w-8 h-8" }) => (
    <svg className={className} viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="5" width="26" height="18" rx="2"/>
      <path d="M11 27h10M16 23v4"/>
      <rect x="7" y="9" width="8" height="6" rx="1"/>
      <circle cx="22" cy="12" r="2"/>
      <path d="M20 16h4"/>
    </svg>
  ),

  clothing: ({ className = "w-8 h-8" }) => (
    <svg className={className} viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3L8 8l-5 2 2 5h4v12h14V15h4l2-5-5-2-4-5"/>
      <path d="M12 3a4 4 0 008 0"/>
    </svg>
  ),

  home: ({ className = "w-8 h-8" }) => (
    <svg className={className} viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 14L16 3l13 11"/>
      <path d="M6 12v14h8v-8h4v8h8V12"/>
    </svg>
  ),

  beauty: ({ className = "w-8 h-8" }) => (
    <svg className={className} viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 3C11 3 7 7 7 12c0 6 9 17 9 17s9-11 9-17c0-5-4-9-9-9z"/>
      <circle cx="16" cy="12" r="3"/>
    </svg>
  ),

  sport: ({ className = "w-8 h-8" }) => (
    <svg className={className} viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="16" cy="16" r="13"/>
      <path d="M8 8c2 3 2 9 0 16M24 8c-2 3-2 9 0 16"/>
      <path d="M3 13h26M3 19h26"/>
    </svg>
  ),

  auto: ({ className = "w-8 h-8" }) => (
    <svg className={className} viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 18l3-8h16l3 8"/>
      <rect x="3" y="18" width="26" height="7" rx="2"/>
      <circle cx="9" cy="26" r="2.5"/>
      <circle cx="23" cy="26" r="2.5"/>
      <path d="M3 21h5M24 21h5M12 10h8"/>
    </svg>
  ),

  kids: ({ className = "w-8 h-8" }) => (
    <svg className={className} viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="16" cy="9" r="5"/>
      <path d="M8 28v-6a8 8 0 0116 0v6"/>
      <path d="M12 21l1 7M20 21l-1 7"/>
    </svg>
  ),

  books: ({ className = "w-8 h-8" }) => (
    <svg className={className} viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 5h14v22H4z"/>
      <path d="M18 5l10 3v20l-10-3z"/>
      <path d="M18 5v22M8 10h6M8 15h6M8 20h4"/>
    </svg>
  ),

  food: ({ className = "w-8 h-8" }) => (
    <svg className={className} viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 3v8a6 6 0 0012 0V3"/>
      <path d="M12 11v18"/>
      <path d="M22 3v26M19 8h6M19 13h6"/>
    </svg>
  ),

  jewelry: ({ className = "w-8 h-8" }) => (
    <svg className={className} viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 8l3-5h10l3 5L16 28 8 8z"/>
      <path d="M8 8h16M11 3l2 5M21 3l-2 5"/>
    </svg>
  ),

  tools: ({ className = "w-8 h-8" }) => (
    <svg className={className} viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 8a6 6 0 00-8 8l-8 8 4 4 8-8a6 6 0 008-8l-4 4-4-4 4-4z"/>
    </svg>
  ),

  pets: ({ className = "w-8 h-8" }) => (
    <svg className={className} viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="10" cy="9" r="3"/>
      <circle cx="22" cy="9" r="3"/>
      <circle cx="6" cy="19" r="3"/>
      <circle cx="26" cy="19" r="3"/>
      <path d="M12 22c0 4 8 4 8 0v-3c0-3-8-7-8-3v3z"/>
    </svg>
  ),
};
