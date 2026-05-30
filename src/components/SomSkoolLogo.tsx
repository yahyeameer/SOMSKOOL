import React from 'react'

interface SomSkoolLogoProps {
  className?: string
  size?: number
}

export default function SomSkoolLogo({ className = '', size = 44 }: SomSkoolLogoProps) {
  return (
    <svg
      viewBox="0 0 48 48"
      width={size}
      height={size}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <g stroke="#4834D4" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        {/* Book pages (bottom) */}
        <path d="M10 38c3-2 8-2 14 0" />
        <path d="M38 38c-3-2-8-2-14 0" />
        <path d="M10 42c3-2 8-2 14 0" />
        <path d="M38 42c-3-2-8-2-14 0" />
        <path d="M24 38v4" />
        <path d="M10 34v8" />
        <path d="M38 34v8" />
        <path d="M10 34c3-2 8-2 14 0" />
        <path d="M38 34c-3-2-8-2-14 0" />
        <path d="M24 30v8" />

        {/* Lightbulb (middle) */}
        <path d="M19 28c-2-2-3-4.5-3-7.5a8 8 0 1 1 16 0c0 3-1 5.5-3 7.5" />
        <path d="M20 28v2h8v-2" />
        <path d="M22 30v4h4v-4" />
        
        {/* Inner lightbulb filament / detail */}
        <path d="M24 24v-4" strokeWidth="2" />
        <path d="M24 20l-2-2" strokeWidth="2" />
        <path d="M24 20l2-2" strokeWidth="2" />

        {/* Graduation Cap (top) */}
        <path d="M24 6L10 12l14 6 14-6-14-6z" fill="#4834D4" fillOpacity="0.1" />
        <path d="M34 16.5v5c0 1-1 2-2 2h-1" />
        {/* Tassel */}
        <circle cx="31" cy="23.5" r="1.5" fill="#4834D4" stroke="none" />
      </g>
    </svg>
  )
}
