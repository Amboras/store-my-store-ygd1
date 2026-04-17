'use client'

import { useEffect, useState } from 'react'
import { Package, Zap, CheckCircle, Clock } from 'lucide-react'
import { formatPrice } from '@/lib/utils/format-price'

interface BundleOption {
  id: string
  label: string
  qty: number
  pricePerUnit: number
  totalPrice: number
  currency: string
  badgeText?: string
  savings?: number
}

interface ProductBundleOfferProps {
  basePrice: number | null
  currency: string
  onSelectBundle: (qty: number, priceOverride?: number) => void
  selectedBundleQty: number
}

export default function ProductBundleOffer({
  basePrice,
  currency,
  onSelectBundle,
  selectedBundleQty,
}: ProductBundleOfferProps) {
  const [timeLeft, setTimeLeft] = useState({ m: 14, s: 47 })

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        let { m, s } = prev
        s -= 1
        if (s < 0) { s = 59; m -= 1 }
        if (m < 0) { m = 29; s = 59 }
        return { m, s }
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  const pad = (n: number) => String(n).padStart(2, '0')

  if (!basePrice) return null

  const bundles: BundleOption[] = [
    {
      id: 'single',
      label: '1 Item',
      qty: 1,
      pricePerUnit: basePrice,
      totalPrice: basePrice,
      currency,
    },
    {
      id: 'double',
      label: '2 Items',
      qty: 2,
      pricePerUnit: Math.round(basePrice * 0.9),
      totalPrice: Math.round(basePrice * 0.9 * 2),
      currency,
      badgeText: 'Save 10%',
      savings: Math.round(basePrice * 2 - basePrice * 0.9 * 2),
    },
    {
      id: 'triple',
      label: '3 Items',
      qty: 3,
      pricePerUnit: Math.round(basePrice * 0.8),
      totalPrice: Math.round(basePrice * 0.8 * 3),
      currency,
      badgeText: 'Best Value',
      savings: Math.round(basePrice * 3 - basePrice * 0.8 * 3),
    },
  ]

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Zap className="h-4 w-4 text-[#7c5c3e]" />
          <h3 className="text-xs font-semibold uppercase tracking-widest text-foreground">
            Bundle &amp; Save
          </h3>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-[#c2714f] font-medium">
          <Clock className="h-3.5 w-3.5" />
          <span>Offer ends {pad(timeLeft.m)}:{pad(timeLeft.s)}</span>
        </div>
      </div>

      {/* Bundle Options */}
      <div className="space-y-2">
        {bundles.map((bundle) => {
          const isSelected = selectedBundleQty === bundle.qty
          return (
            <button
              key={bundle.id}
              onClick={() => onSelectBundle(bundle.qty, bundle.totalPrice)}
              className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-lg border-2 transition-all text-left ${
                isSelected
                  ? 'border-[#7c5c3e] bg-[#7c5c3e]/5'
                  : 'border-border hover:border-[#7c5c3e]/40 bg-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                  isSelected ? 'border-[#7c5c3e]' : 'border-muted-foreground/30'
                }`}>
                  {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-[#7c5c3e]" />}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-foreground">{bundle.label}</span>
                    {bundle.badgeText && (
                      <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                        bundle.badgeText === 'Best Value'
                          ? 'bg-[#7c5c3e] text-white'
                          : 'bg-[#7c5c3e]/15 text-[#7c5c3e]'
                      }`}>
                        {bundle.badgeText}
                      </span>
                    )}
                  </div>
                  {bundle.savings && bundle.savings > 0 ? (
                    <p className="text-xs text-[#7c5c3e] font-medium mt-0.5">
                      You save {formatPrice(bundle.savings, bundle.currency)}
                    </p>
                  ) : (
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {formatPrice(bundle.pricePerUnit, bundle.currency)} each
                    </p>
                  )}
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-sm font-bold text-foreground">
                  {formatPrice(bundle.totalPrice, bundle.currency)}
                </p>
                {bundle.qty > 1 && (
                  <p className="text-xs text-muted-foreground line-through">
                    {formatPrice(basePrice * bundle.qty, bundle.currency)}
                  </p>
                )}
              </div>
            </button>
          )
        })}
      </div>

      {/* Benefit note */}
      <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/40 rounded-lg px-3 py-2">
        <Package className="h-3.5 w-3.5 flex-shrink-0" />
        <span>Bundles are shipped together in secure, gift-ready packaging</span>
      </div>
    </div>
  )
}

interface StockUrgencyProps {
  quantity: number | null | undefined
}

export function StockUrgency({ quantity }: StockUrgencyProps) {
  if (quantity == null || quantity <= 0 || quantity >= 20) return null

  const level = quantity <= 5 ? 'critical' : 'low'

  return (
    <div className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium ${
      level === 'critical'
        ? 'bg-red-50 text-red-700 border border-red-200'
        : 'bg-orange-50 text-orange-700 border border-orange-200'
    }`}>
      <div className={`w-2 h-2 rounded-full animate-pulse ${
        level === 'critical' ? 'bg-red-500' : 'bg-orange-500'
      }`} />
      {level === 'critical'
        ? `Only ${quantity} left — almost sold out!`
        : `Only ${quantity} left in stock — selling fast`
      }
    </div>
  )
}

interface TrustBadgesProps {
  className?: string
}

export function TrustBadges({ className = '' }: TrustBadgesProps) {
  const badges = [
    { icon: CheckCircle, label: 'Quality Guaranteed' },
    { icon: Package, label: 'Secure Packaging' },
    { icon: Zap, label: 'Fast Dispatch' },
  ]

  return (
    <div className={`grid grid-cols-3 gap-3 ${className}`}>
      {badges.map(({ icon: Icon, label }) => (
        <div key={label} className="flex flex-col items-center gap-1.5 text-center p-3 bg-muted/40 rounded-lg">
          <Icon className="h-4 w-4 text-[#7c5c3e]" strokeWidth={1.8} />
          <p className="text-[10px] font-medium text-muted-foreground leading-tight">{label}</p>
        </div>
      ))}
    </div>
  )
}
