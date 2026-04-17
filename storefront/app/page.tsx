'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import {
  ArrowRight,
  Truck,
  Shield,
  RotateCcw,
  Star,
  Leaf,
  Package,
  Flame,
  Home,
  Clock,
} from 'lucide-react'
import CollectionSection from '@/components/marketing/collection-section'
import { useCollections } from '@/hooks/use-collections'

const HERO_IMAGE = 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1400&q=80'
const LIFESTYLE_IMAGE = 'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=1200&q=80'
const KITCHEN_IMAGE = 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=900&q=80'
const LIVING_IMAGE = 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=900&q=80'

const categories = [
  {
    title: 'Kitchen & Dining',
    subtitle: 'Cook, serve, enjoy',
    href: '/products',
    image: KITCHEN_IMAGE,
  },
  {
    title: 'Living & Decor',
    subtitle: 'Style your space',
    href: '/products',
    image: LIVING_IMAGE,
  },
  {
    title: 'All Products',
    subtitle: 'Browse everything',
    href: '/products',
    image: LIFESTYLE_IMAGE,
  },
]

const features = [
  {
    icon: Truck,
    title: 'Free Delivery',
    desc: 'On orders above ₹999',
  },
  {
    icon: RotateCcw,
    title: 'Easy Returns',
    desc: '30-day hassle-free returns',
  },
  {
    icon: Shield,
    title: 'Secure Payments',
    desc: 'UPI, Cards & Wallets',
  },
  {
    icon: Leaf,
    title: 'Eco Conscious',
    desc: 'Sustainable materials',
  },
]

const whyUs = [
  {
    icon: Star,
    title: 'Quality First',
    desc: 'Every product is handpicked for durability, design, and daily usability.',
  },
  {
    icon: Home,
    title: 'Made for Indian Homes',
    desc: 'Products designed keeping the needs of everyday Indian living in mind.',
  },
  {
    icon: Package,
    title: 'Safe Packaging',
    desc: 'Every order is packed securely so your items arrive in perfect condition.',
  },
  {
    icon: Flame,
    title: 'Best-Value Prices',
    desc: 'Premium home essentials at prices that make sense for every household.',
  },
]

function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState({ h: 11, m: 47, s: 32 })

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        let { h, m, s } = prev
        s -= 1
        if (s < 0) { s = 59; m -= 1 }
        if (m < 0) { m = 59; h -= 1 }
        if (h < 0) { h = 23; m = 59; s = 59 }
        return { h, m, s }
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  const pad = (n: number) => String(n).padStart(2, '0')

  return (
    <div className="flex items-center gap-2">
      <Clock className="h-4 w-4 text-[#c2714f]" />
      <span className="text-sm font-medium text-muted-foreground">Sale ends in</span>
      <div className="flex items-center gap-1 font-mono font-bold text-[#c2714f]">
        <span className="bg-[#7c5c3e]/10 px-2 py-0.5 rounded text-sm">{pad(timeLeft.h)}</span>
        <span className="text-sm">:</span>
        <span className="bg-[#7c5c3e]/10 px-2 py-0.5 rounded text-sm">{pad(timeLeft.m)}</span>
        <span className="text-sm">:</span>
        <span className="bg-[#7c5c3e]/10 px-2 py-0.5 rounded text-sm">{pad(timeLeft.s)}</span>
      </div>
    </div>
  )
}

export default function HomePage() {
  const { data: collections, isLoading } = useCollections()
  const [newsletterEmail, setNewsletterEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newsletterEmail.trim()) return
    setSubscribed(true)
    setNewsletterEmail('')
  }

  return (
    <>
      {/* ── Hero Section ── */}
      <section className="relative bg-[#f5ede2] overflow-hidden">
        <div className="container-custom grid lg:grid-cols-2 gap-8 items-center py-16 lg:py-28">
          {/* Text */}
          <div className="space-y-7 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 bg-[#7c5c3e]/10 text-[#7c5c3e] px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest">
              <Flame className="h-3 w-3" />
              New Arrivals — 2025 Collection
            </div>
            <h1 className="text-display font-heading font-bold text-balance leading-tight text-[#2b1f14]">
              Your Home,<br />
              <span className="text-[#7c5c3e]">Beautifully</span> Lived In
            </h1>
            <p className="text-lg text-[#6b5040] max-w-md leading-relaxed">
              Discover thoughtfully crafted home essentials — from your kitchen to your living room — that make every day feel a little more beautiful.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 bg-[#7c5c3e] text-white px-8 py-3.5 text-sm font-semibold uppercase tracking-wide hover:bg-[#6a4e34] transition-colors rounded-sm"
                prefetch={true}
              >
                Shop Now
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center gap-2 border border-[#7c5c3e] text-[#7c5c3e] px-8 py-3.5 text-sm font-semibold uppercase tracking-wide hover:bg-[#7c5c3e]/5 transition-colors rounded-sm"
                prefetch={true}
              >
                Our Story
              </Link>
            </div>
            <div className="flex items-center gap-4 pt-2">
              <div className="flex -space-x-2">
                {['🧑‍🍳', '👩‍🏠', '🏡', '👨‍🍳'].map((emoji, i) => (
                  <div key={i} className="w-8 h-8 rounded-full bg-[#c9a87c]/40 border-2 border-white flex items-center justify-center text-sm">
                    {emoji}
                  </div>
                ))}
              </div>
              <p className="text-sm text-[#6b5040]">
                <strong className="text-[#2b1f14]">10,000+</strong> happy homes across India
              </p>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative aspect-[4/5] lg:aspect-[3/4] rounded-2xl overflow-hidden shadow-xl animate-fade-in">
            <Image
              src={HERO_IMAGE}
              alt="Beautiful Home Products"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
              priority
            />
            {/* floating badge */}
            <div className="absolute bottom-6 left-6 bg-white/95 backdrop-blur-sm rounded-xl px-4 py-3 shadow-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#7c5c3e]/10 flex items-center justify-center">
                  <Star className="h-5 w-5 text-[#7c5c3e]" fill="#7c5c3e" />
                </div>
                <div>
                  <p className="text-xs font-bold text-[#2b1f14]">4.9/5 Rating</p>
                  <p className="text-[10px] text-[#6b5040]">1,200+ verified reviews</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Feature Bar ── */}
      <section className="border-y bg-white py-6">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {features.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex items-center gap-3">
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-[#7c5c3e]/10 flex items-center justify-center">
                  <Icon className="h-5 w-5 text-[#7c5c3e]" strokeWidth={1.6} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{title}</p>
                  <p className="text-xs text-muted-foreground">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Category Grid ── */}
      <section className="py-section">
        <div className="container-custom">
          <div className="text-center mb-12">
            <p className="text-xs uppercase tracking-[0.2em] text-[#7c5c3e] font-semibold mb-2">Explore</p>
            <h2 className="text-h2 font-heading font-bold text-foreground">Shop by Category</h2>
            <p className="mt-3 text-muted-foreground max-w-md mx-auto">
              From kitchen must-haves to living room accents — find what your home needs.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {categories.map(({ title, subtitle, href, image }) => (
              <Link
                key={title}
                href={href}
                className="group relative aspect-[3/4] rounded-xl overflow-hidden block"
                prefetch={true}
              >
                <Image
                  src={image}
                  alt={title}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <p className="text-white/70 text-xs uppercase tracking-widest mb-1">{subtitle}</p>
                  <h3 className="text-white font-heading font-bold text-xl">{title}</h3>
                  <div className="mt-3 inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1.5 rounded-full group-hover:bg-white/30 transition-colors">
                    Shop Now <ArrowRight className="h-3 w-3" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Dynamic Collections ── */}
      {isLoading ? (
        <section className="py-section">
          <div className="container-custom">
            <div className="animate-pulse space-y-4 text-center">
              <div className="h-3 w-20 bg-muted rounded mx-auto" />
              <div className="h-8 w-64 bg-muted rounded mx-auto" />
            </div>
          </div>
        </section>
      ) : collections && collections.length > 0 ? (
        collections.map((collection: { id: string; handle: string; title: string; metadata?: Record<string, unknown> }, index: number) => (
          <CollectionSection
            key={collection.id}
            collection={collection}
            alternate={index % 2 === 1}
          />
        ))
      ) : null}

      {/* ── Sale Banner with Countdown ── */}
      <section className="py-section-sm bg-[#2b1f14]">
        <div className="container-custom flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <p className="text-[#c9a87c] text-xs uppercase tracking-widest font-semibold mb-1">Limited Time Offer</p>
            <h2 className="text-h2 font-heading font-bold text-white">Up to 40% Off</h2>
            <p className="text-white/60 mt-1 text-sm">On select kitchen & home essentials</p>
          </div>
          <div className="flex flex-col items-center gap-4">
            <CountdownTimer />
            <Link
              href="/products"
              className="inline-flex items-center gap-2 bg-[#7c5c3e] text-white px-8 py-3 text-sm font-semibold uppercase tracking-wide hover:bg-[#6a4e34] transition-colors rounded-sm"
            >
              Grab the Deal
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Brand Story / Philosophy ── */}
      <section className="py-section bg-[#f5ede2]/60">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="aspect-[4/5] rounded-2xl overflow-hidden relative shadow-lg">
              <Image
                src={LIFESTYLE_IMAGE}
                alt="Our Philosophy"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
            <div className="space-y-6 lg:max-w-md">
              <p className="text-xs uppercase tracking-[0.2em] text-[#7c5c3e] font-semibold">Our Philosophy</p>
              <h2 className="text-h2 font-heading font-bold text-[#2b1f14]">
                Crafted for the<br />Everyday Indian Home
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                We believe a beautiful home doesn't need to break the bank. Each product at Nestify is carefully curated — balancing timeless design with practical functionality that fits seamlessly into the rhythm of Indian daily life.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                From morning chai to evening gatherings, our products are companions to life's most meaningful moments.
              </p>
              <Link
                href="/about"
                className="inline-flex items-center gap-2 text-sm font-semibold text-[#7c5c3e] uppercase tracking-wide link-underline pb-0.5"
                prefetch={true}
              >
                Read Our Story
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Why Choose Us ── */}
      <section className="py-section">
        <div className="container-custom">
          <div className="text-center mb-12">
            <p className="text-xs uppercase tracking-[0.2em] text-[#7c5c3e] font-semibold mb-2">Why Nestify</p>
            <h2 className="text-h2 font-heading font-bold text-foreground">Built Around You</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {whyUs.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="text-center group">
                <div className="w-14 h-14 rounded-2xl bg-[#7c5c3e]/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-[#7c5c3e]/20 transition-colors">
                  <Icon className="h-6 w-6 text-[#7c5c3e]" strokeWidth={1.5} />
                </div>
                <h3 className="font-heading font-bold text-foreground mb-2">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Newsletter ── */}
      <section className="py-section border-t bg-[#7c5c3e]">
        <div className="container-custom max-w-xl text-center">
          <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center mx-auto mb-4">
            <Home className="h-6 w-6 text-white" strokeWidth={1.5} />
          </div>
          <h2 className="text-h2 font-heading font-bold text-white">Join the Nestify Family</h2>
          <p className="mt-3 text-white/70 text-sm">
            Get early access to new arrivals, exclusive home tips, and special offers — delivered to your inbox.
          </p>
          {subscribed ? (
            <div className="mt-8 bg-white/20 text-white rounded-lg px-6 py-4 text-sm font-medium">
              Welcome aboard! You are now part of the Nestify family.
            </div>
          ) : (
            <form className="mt-8 flex gap-2" onSubmit={handleNewsletterSubmit}>
              <input
                type="email"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 border border-white/30 bg-white/10 text-white placeholder:text-white/50 px-4 py-3 text-sm rounded-sm focus:outline-none focus:border-white/60 transition-colors"
              />
              <button
                type="submit"
                className="bg-white text-[#7c5c3e] px-6 py-3 text-sm font-semibold uppercase tracking-wide hover:bg-white/90 transition-colors rounded-sm whitespace-nowrap"
              >
                Subscribe
              </button>
            </form>
          )}
        </div>
      </section>
    </>
  )
}
