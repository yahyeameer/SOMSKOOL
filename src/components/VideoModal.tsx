'use client'

import React, { useState, useEffect } from 'react'
import { X, Play } from 'lucide-react'

interface VideoModalProps {
  youtubeId: string
  channelName: string
}

export default function VideoModal({ youtubeId, channelName }: VideoModalProps) {
  const [isOpen, setIsOpen] = useState(false)

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  return (
    <>
      {/* Play Button Trigger */}
      <button
        onClick={() => setIsOpen(true)}
        className="group relative flex items-center justify-center cursor-pointer"
        aria-label="Play promotional video"
      >
        {/* Pulsing ring animation */}
        <span className="absolute inset-0 rounded-full bg-white/20 animate-ping" style={{ animationDuration: '2s' }} />
        <span className="absolute inset-[-8px] rounded-full bg-white/10 animate-pulse" />
        
        {/* Play icon circle */}
        <span className="relative h-20 w-20 rounded-full bg-white shadow-2xl shadow-white/20 flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
          <Play className="h-8 w-8 text-brand-primary ml-1 fill-brand-primary" />
        </span>
      </button>

      {/* Modal Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8"
          onClick={() => setIsOpen(false)}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md" />
          
          {/* Modal Content */}
          <div 
            className="relative w-full max-w-4xl aspect-video rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-black"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute -top-12 right-0 sm:top-4 sm:right-4 z-10 h-10 w-10 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white transition-all cursor-pointer"
              aria-label="Close video"
            >
              <X className="h-5 w-5" />
            </button>
            
            {/* YouTube Embed */}
            <iframe
              src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0&modestbranding=1`}
              title={channelName}
              className="absolute inset-0 w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
          
          {/* Channel attribution below */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/50 text-xs font-semibold">
            Watching from {channelName}
          </div>
        </div>
      )}
    </>
  )
}
