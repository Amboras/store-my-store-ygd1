'use client'
// Nestify Footer v2
import Link from 'next/link'
import { Home, Camera, Share2, PlayCircle } from 'lucide-react'
import { clearConsent } from '@/lib/cookie-consent'
import { usePolicies } from '@/hooks/use-policies'

const footerLinks = {
  shop: [
    { label: 'All Products', href: '/products' },
    { label: 'New Arrivals', href: '/products?sort=newest' },
    { label: 'Collections', href: '/collections' },
    { label: 'Kitchen & Dining', href: '/products' },
    { label: 'Living & Decor', href: '/products' },
  ],
  help: [
    { label: 'FAQ', href: '/faq' },
    { label: 'Shipping & Returns', href: '/shipping' },
    { label: 'Contact Us', href: '/contact' },
    { label: 'Track Order', href: '/account/orders' },
  ],
}

const socialLinks = [
  { icon: Camera, label: 'Instagram', href: '#' },
  { icon: Share2, label: 'Facebook', href: '#' },
  { icon: PlayCircle, label: 'YouTube', href: '#' },
]

export default function Footer() {
  const { policies } = usePolicies()

  const companyLinks = [
    { label: 'About Us', href: '/about' },
  ]

  if (policies?.privacy_policy) {
    companyLinks.push({ label: 'Privacy Policy', href: '/privacy' })
  }
  if (policies?.terms_of_service) {
    companyLinks.push({ label: 'Terms of Service', href: '/terms' })
  }
  if (policies?.refund_policy) {
    companyLinks.push({ label: 'Refund Policy', href: '/refund-policy' })
  }
  if (policies?.cookie_policy) {
    companyLinks.push({ label: 'Cookie Policy', href: '/cookie-policy' })
  }

  return (
    <footer className="border-t bg-[#2b1f14] text-white/80">
      <div className="container-custom py-section-sm">
        {/* Main Footer */}
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-flex items-center gap-2 mb-4">
              <div className="flex items-center justify-center w-8 h-8 rounded-sm bg-[#7c5c3e]">
                <Home className="h-4 w-4 text-white" strokeWidth={1.8} />
              </div>
              <span className="font-heading text-xl font-bold text-white tracking-tight">
                Nestify
              </span>
            </Link>
            <p className="text-sm text-white/55 leading-relaxed max-w-xs">
              Premium home essentials curated for the everyday Indian household. Quality you can see, comfort you can feel.
            </p>
            <div className="flex items-center gap-3 mt-5">
              {socialLinks.map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center hover:bg-[#7c5c3e] transition-colors"
                >
                  <Icon className="h-4 w-4 text-white" strokeWidth={1.6} />
                </a>
              ))}
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest mb-4 text-white">Shop</h3>
            <ul className="space-y-3">
              {footerLinks.shop.map((link) => (
                <li key={link.href + link.label}>
                  <Link href={link.href} className="text-sm text-white/55 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help Links */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest mb-4 text-white">Help</h3>
            <ul className="space-y-3">
              {footerLinks.help.map((link) => (
                <li key={link.href + link.label}>
                  <Link href={link.href} className="text-sm text-white/55 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest mb-4 text-white">Company</h3>
            <ul className="space-y-3">
              {companyLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-white/55 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-8">
              <p className="text-xs text-white/40 uppercase tracking-widest mb-2">We Accept</p>
              <div className="flex flex-wrap gap-2">
                {['UPI', 'VISA', 'MC', 'COD'].map((m) => (
                  <span key={m} className="text-[10px] font-bold bg-white/10 text-white/60 px-2.5 py-1 rounded">
                    {m}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/35">
            &copy; {new Date().getFullYear()} Nestify. All rights reserved. Made with care in India.
          </p>
          <div className="flex items-center gap-6">
            <button
              onClick={() => {
                clearConsent()
                window.dispatchEvent(new Event('manage-cookies'))
              }}
              className="text-xs text-white/35 hover:text-white/60 transition-colors"
            >
              Manage Cookies
            </button>
            <span className="text-xs text-white/25">Powered by Amboras</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
