'use client'

import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { clearConsent } from '@/lib/cookie-consent'
import { usePolicies } from '@/hooks/use-policies'

const browseLinks = [
  { label: 'All products', href: '/products' },
  { label: 'New arrivals', href: '/products?sort=newest' },
  { label: 'Collections', href: '/collections' },
]

const supportLinks = [
  { label: 'Contact', href: '/contact' },
  { label: 'Shipping & returns', href: '/shipping' },
  { label: 'FAQs', href: '/faq' },
]

export default function Footer() {
  const { policies } = usePolicies()
  const policyLinks = [
    policies?.privacy_policy ? { label: 'Privacy', href: '/privacy' } : null,
    policies?.terms_of_service ? { label: 'Terms', href: '/terms' } : null,
    policies?.refund_policy ? { label: 'Returns', href: '/refund-policy' } : null,
    policies?.cookie_policy ? { label: 'Cookies', href: '/cookie-policy' } : null,
  ].filter(Boolean) as { label: string; href: string }[]

  return (
    <footer className="border-t border-border bg-background">
      <div className="container-custom py-14 sm:py-20">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-[1.4fr_0.65fr_0.65fr_1fr] lg:gap-10">
          <div className="max-w-xs">
            <Link href="/" className="font-heading text-3xl font-bold tracking-[-0.065em]">My Store</Link>
            <p className="mt-5 text-sm leading-6 text-muted-foreground">Everyday home essentials, selected with care for spaces that feel lived in and loved.</p>
            <Link href="/about" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold underline decoration-foreground/30 underline-offset-8 transition-colors hover:decoration-foreground">Our approach <ArrowUpRight className="h-4 w-4" /></Link>
          </div>
          <FooterGroup title="Browse" links={browseLinks} />
          <FooterGroup title="Help" links={supportLinks} />
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Keep in touch</p>
            <p className="mt-4 text-sm leading-6 text-muted-foreground">A considered note when something new arrives.</p>
            <Link href="/#newsletter" className="mt-5 inline-flex text-sm font-semibold underline decoration-foreground/30 underline-offset-8 transition-colors hover:decoration-foreground">Join the mailing list</Link>
          </div>
        </div>
        <div className="mt-14 flex flex-col gap-5 border-t border-border pt-6 text-xs text-muted-foreground sm:mt-20 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} My Store. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
            {policyLinks.map((link) => <Link key={link.href} href={link.href} className="transition-colors hover:text-foreground">{link.label}</Link>)}
            <button type="button" data-manage-cookies onClick={() => { clearConsent(); window.dispatchEvent(new Event('manage-cookies')) }} className="transition-colors hover:text-foreground">Manage cookies</button>
          </div>
        </div>
      </div>
    </footer>
  )
}

function FooterGroup({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return <div>
    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">{title}</p>
    <ul className="mt-5 space-y-3">
      {links.map((link) => <li key={link.href}><Link href={link.href} className="text-sm font-medium transition-colors hover:text-muted-foreground">{link.label}</Link></li>)}
    </ul>
  </div>
}
