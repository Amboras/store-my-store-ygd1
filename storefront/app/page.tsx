'use client'

import Image from 'next/image'
import Link from 'next/link'
import { FormEvent, useState } from 'react'
import { ArrowUpRight, Check, Minus, Plus } from 'lucide-react'
import ProductGrid from '@/components/product/product-grid'

const heroImage = 'https://ahjviugsxpwzpkyzgrhi.supabase.co/storage/v1/object/public/product-user-files/214c9079-193c-4e4f-b918-2abb77ec8d98%2F01M3J33QW4ZHA4HRWZ0DX82SP9.webp'
const storyImage = 'https://ahjviugsxpwzpkyzgrhi.supabase.co/storage/v1/object/public/product-user-files/214c9079-193c-4e4f-b918-2abb77ec8d98%2F01M3J33ZHH5N4RV3KDR86TEC6F.webp'

const notes = [
  'Designed for the everyday',
  'Natural materials, lasting use',
  'Thoughtful details, quietly made',
]

export default function HomePage() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)
  const [openQuestion, setOpenQuestion] = useState<number | null>(0)

  const subscribe = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!email.trim()) return
    setSubscribed(true)
    setEmail('')
  }

  const questions = [
    ['What does My Store curate?', 'Useful home essentials with a calm point of view — pieces chosen to work beautifully in real, lived-in spaces.'],
    ['Where can I see the full range?', 'Explore the complete collection in our shop, with each product page showing available options and pricing.'],
    ['How can I get in touch?', 'Visit our contact page and we will be happy to help with a product or an order question.'],
  ]

  return (
    <div className="overflow-hidden">
      <section className="border-b border-border">
        <div className="container-custom grid min-h-[calc(100svh-4rem)] items-stretch lg:grid-cols-[0.93fr_1.07fr]">
          <div className="flex flex-col justify-between py-12 sm:py-16 lg:py-20 lg:pr-12">
            <div>
              <p className="mb-7 text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">My Store / Home essentials</p>
              <h1 className="max-w-xl font-heading text-5xl font-bold leading-[0.98] tracking-[-0.055em] text-foreground sm:text-6xl lg:text-7xl">
                Useful pieces.<br />Beautifully considered.
              </h1>
              <p className="mt-7 max-w-md text-base leading-7 text-muted-foreground sm:text-lg">
                A small collection of everyday objects for slower mornings, shared meals, and homes that feel easy to live in.
              </p>
            </div>
            <div className="mt-12 flex flex-wrap items-center gap-6">
              <Link href="/products" className="inline-flex items-center gap-3 bg-foreground px-5 py-3.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-85">
                Shop the collection <ArrowUpRight className="h-4 w-4" />
              </Link>
              <Link href="#objects" className="text-sm font-semibold underline decoration-foreground/30 underline-offset-8 transition-colors hover:decoration-foreground">
                Discover the edit
              </Link>
            </div>
          </div>

          <div className="relative min-h-[26rem] border-t border-border lg:min-h-0 lg:border-l lg:border-t-0">
            <Image src={heroImage} alt="Ceramic tableware and natural home objects" fill priority sizes="(max-width: 1024px) 100vw, 58vw" className="object-cover" />
            <div className="absolute bottom-5 left-5 bg-background px-4 py-3 text-xs leading-5 text-muted-foreground sm:bottom-8 sm:left-8">
              <span className="block font-semibold uppercase tracking-[0.16em] text-foreground">The daily ritual</span>
              Good things, made useful.
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-muted/35">
        <div className="container-custom grid gap-0 md:grid-cols-3">
          {notes.map((note, index) => (
            <div key={note} className={`flex items-center gap-3 py-5 text-sm font-medium ${index !== 0 ? 'md:border-l md:border-border md:pl-8' : ''} ${index !== notes.length - 1 ? 'border-b border-border md:border-b-0' : ''}`}>
              <span className="flex h-5 w-5 items-center justify-center rounded-full border border-foreground"><Check className="h-3 w-3" /></span>
              {note}
            </div>
          ))}
        </div>
      </section>

      <section id="objects" className="container-custom py-20 sm:py-28">
        <div className="mb-10 flex items-end justify-between gap-6 sm:mb-12">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">The edit</p>
            <h2 className="mt-3 font-heading text-4xl font-bold tracking-[-0.045em] sm:text-5xl">For the spaces you use most.</h2>
          </div>
          <Link href="/products" className="hidden shrink-0 text-sm font-semibold underline decoration-foreground/30 underline-offset-8 transition-colors hover:decoration-foreground sm:block">View all products</Link>
        </div>
        <ProductGrid limit={4} />
        <Link href="/products" className="mt-10 inline-flex text-sm font-semibold underline decoration-foreground/30 underline-offset-8 sm:hidden">View all products</Link>
      </section>

      <section className="border-y border-border bg-muted/35">
        <div className="container-custom grid items-center gap-10 py-10 sm:py-14 lg:grid-cols-2 lg:gap-20 lg:py-20">
          <div className="relative aspect-square overflow-hidden bg-muted">
            <Image src={storyImage} alt="Quietly arranged ceramic and bamboo home essentials" fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" />
          </div>
          <div className="max-w-lg">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">Made to belong</p>
            <h2 className="mt-4 font-heading text-4xl font-bold leading-[1.03] tracking-[-0.045em] sm:text-5xl">Less noise. More room for the good stuff.</h2>
            <p className="mt-6 text-base leading-7 text-muted-foreground">We look for the things that earn their place: timeless forms, natural textures, and a purpose you notice in the everyday.</p>
            <Link href="/about" className="mt-8 inline-flex items-center gap-2 text-sm font-semibold underline decoration-foreground/30 underline-offset-8 transition-colors hover:decoration-foreground">About My Store <ArrowUpRight className="h-4 w-4" /></Link>
          </div>
        </div>
      </section>

      <section className="container-custom grid gap-14 py-20 sm:py-28 lg:grid-cols-[0.85fr_1.15fr] lg:gap-24">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">A few questions</p>
          <h2 className="mt-4 font-heading text-4xl font-bold tracking-[-0.045em] sm:text-5xl">Simple is a good place to start.</h2>
          <Link href="/faq" className="mt-7 inline-flex items-center gap-2 text-sm font-semibold underline decoration-foreground/30 underline-offset-8 transition-colors hover:decoration-foreground">Visit the help centre <ArrowUpRight className="h-4 w-4" /></Link>
        </div>
        <div className="border-t border-border">
          {questions.map(([question, answer], index) => {
            const isOpen = openQuestion === index
            return <div key={question} className="border-b border-border">
              <button type="button" onClick={() => setOpenQuestion(isOpen ? null : index)} className="flex w-full items-center justify-between gap-6 py-6 text-left text-base font-semibold" aria-expanded={isOpen}>
                {question}
                {isOpen ? <Minus className="h-4 w-4 shrink-0" /> : <Plus className="h-4 w-4 shrink-0" />}
              </button>
              {isOpen && <p className="max-w-xl pb-6 text-sm leading-6 text-muted-foreground">{answer}</p>}
            </div>
          })}
        </div>
      </section>

      <section className="border-t border-border bg-foreground text-primary-foreground">
        <div className="container-custom grid gap-10 py-16 sm:py-20 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-primary-foreground/60">A note from us</p>
            <h2 className="mt-4 max-w-xl font-heading text-4xl font-bold leading-[1.03] tracking-[-0.045em] sm:text-5xl">New objects and useful stories, occasionally.</h2>
          </div>
          {subscribed ? <p className="border border-primary-foreground/30 px-5 py-3 text-sm">You are on the list. Thank you.</p> : <form onSubmit={subscribe} className="flex w-full max-w-md border-b border-primary-foreground/60 pb-2">
            <label htmlFor="newsletter" className="sr-only">Email address</label>
            <input id="newsletter" type="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Your email address" className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-primary-foreground/45" />
            <button type="submit" className="text-sm font-semibold underline underline-offset-4 transition-opacity hover:opacity-70">Subscribe</button>
          </form>}
        </div>
      </section>
    </div>
  )
}
