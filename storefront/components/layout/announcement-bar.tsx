'use client'

import { useState } from 'react'
import { X, Sparkles } from 'lucide-react'

export default function AnnouncementBar() {
  const [isVisible, setIsVisible] = useState(true)

  if (!isVisible) return null

  return (
    <div className="relative bg-[#7c5c3e] text-white">
      <div className="container-custom flex items-center justify-center py-2.5 gap-2 text-sm tracking-wide">
        <Sparkles className="h-3.5 w-3.5 flex-shrink-0 opacity-80" />
        <p className="text-center">
          Free shipping on orders above ₹999 &nbsp;·&nbsp; Trusted by 10,000+ Indian homes
        </p>
        <button
          onClick={() => setIsVisible(false)}
          className="absolute right-4 p-1 hover:opacity-70 transition-opacity"
          aria-label="Dismiss announcement"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  )
}
