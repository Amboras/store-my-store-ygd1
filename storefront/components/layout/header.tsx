'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Menu, Search, ShoppingBag, User, X } from 'lucide-react'
import CartDrawer from '@/components/cart/cart-drawer'
import { useAuth } from '@/hooks/use-auth'
import { useCart } from '@/hooks/use-cart'

const navigation = [
  { label: 'Shop', href: '/products' },
  { label: 'About', href: '/about' },
  { label: 'Journal', href: '/faq' },
]

export default function Header() {
  const { itemCount } = useCart()
  const { isLoggedIn } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)
  const [cartOpen, setCartOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 14)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  return (
    <>
      <header data-nav-behavior="solid-on-scroll" className={`sticky top-0 z-40 border-b border-border bg-background transition-shadow duration-300 ${scrolled ? 'shadow-sm' : ''}`}>
        <div className="container-custom flex h-16 items-center justify-between gap-4 sm:h-[4.5rem]">
          <div className="flex flex-1 items-center gap-1 lg:hidden">
            <button type="button" onClick={() => setMenuOpen(true)} className="-ml-2 p-2.5" aria-label="Open menu"><Menu className="h-5 w-5" /></button>
          </div>
          <nav className="hidden flex-1 items-center gap-7 lg:flex" aria-label="Main navigation">
            {navigation.map((item) => <Link key={item.href} href={item.href} className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground transition-colors hover:text-foreground">{item.label}</Link>)}
          </nav>

          <Link href="/" className="absolute left-1/2 -translate-x-1/2 font-heading text-2xl font-bold tracking-[-0.06em] text-foreground" aria-label="My Store home">My Store</Link>

          <div className="flex flex-1 items-center justify-end gap-1">
            <Link href="/search" className="p-2.5 transition-opacity hover:opacity-60" aria-label="Search"><Search className="h-[18px] w-[18px]" strokeWidth={1.8} /></Link>
            <Link href={isLoggedIn ? '/account' : '/auth/login'} className="hidden p-2.5 transition-opacity hover:opacity-60 sm:block" aria-label={isLoggedIn ? 'Account' : 'Sign in'}><User className="h-[18px] w-[18px]" strokeWidth={1.8} /></Link>
            <button type="button" onClick={() => setCartOpen(true)} className="relative p-2.5 transition-opacity hover:opacity-60" aria-label={`Shopping bag, ${itemCount} items`}>
              <ShoppingBag className="h-[18px] w-[18px]" strokeWidth={1.8} />
              {itemCount > 0 && <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-foreground px-1 text-[9px] font-bold text-primary-foreground">{itemCount}</span>}
            </button>
          </div>
        </div>
      </header>

      {menuOpen && <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Navigation menu">
        <button type="button" onClick={() => setMenuOpen(false)} className="absolute inset-0 cursor-default bg-foreground/25" aria-label="Close menu" />
        <div className="relative flex h-full w-[min(22rem,88vw)] flex-col bg-background p-6 shadow-xl">
          <div className="flex items-center justify-between border-b border-border pb-5">
            <span className="font-heading text-2xl font-bold tracking-[-0.06em]">My Store</span>
            <button type="button" onClick={() => setMenuOpen(false)} className="-mr-2 p-2" aria-label="Close menu"><X className="h-5 w-5" /></button>
          </div>
          <nav className="mt-8 flex flex-col" aria-label="Mobile navigation">
            {navigation.map((item) => <Link key={item.href} href={item.href} onClick={() => setMenuOpen(false)} className="border-b border-border py-5 text-lg font-semibold tracking-[-0.02em]">{item.label}</Link>)}
            <Link href={isLoggedIn ? '/account' : '/auth/login'} onClick={() => setMenuOpen(false)} className="border-b border-border py-5 text-lg font-semibold tracking-[-0.02em]">{isLoggedIn ? 'Account' : 'Sign in'}</Link>
          </nav>
          <Link href="/products" onClick={() => setMenuOpen(false)} className="mt-auto inline-flex justify-center bg-foreground px-4 py-3 text-sm font-semibold text-primary-foreground">Shop all products</Link>
        </div>
      </div>}

      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  )
}
