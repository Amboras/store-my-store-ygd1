'use client'

import { useMemo, useState } from 'react'
import { useCart } from '@/hooks/use-cart'
import { Minus, Plus, Check, Loader2, ShieldCheck, Truck, RotateCcw } from 'lucide-react'
import { toast } from 'sonner'
import ProductPrice, { type VariantExtension } from './product-price'
import ProductBundleOffer, { StockUrgency, TrustBadges } from './product-bundle-offer'
import { trackAddToCart } from '@/lib/analytics'
import { trackMetaEvent, toMetaCurrencyValue } from '@/lib/meta-pixel'
import type { Product } from '@/types'

interface ProductActionsProps {
  product: Product
  variantExtensions?: Record<string, VariantExtension>
}

interface VariantOption {
  option_id?: string
  option?: { id: string }
  value: string
}

interface ProductVariantWithPrice {
  id: string
  options?: VariantOption[]
  calculated_price?: {
    calculated_amount?: number
    currency_code?: string
  } | number
  [key: string]: unknown
}

interface ProductOptionValue {
  id?: string
  value: string
}

interface ProductOptionWithValues {
  id: string
  title: string
  values?: (string | ProductOptionValue)[]
}

function getVariantPriceAmount(variant: ProductVariantWithPrice | undefined): number | null {
  const cp = variant?.calculated_price
  if (!cp) return null
  return typeof cp === 'number' ? cp : cp.calculated_amount ?? null
}

export default function ProductActions({ product, variantExtensions }: ProductActionsProps) {
  const variants = useMemo(
    () => (product.variants || []) as unknown as ProductVariantWithPrice[],
    [product.variants],
  )
  const options = useMemo(() => product.options || [], [product.options])

  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>(() => {
    const defaults: Record<string, string> = {}
    const firstVariant = variants[0]
    if (firstVariant?.options) {
      for (const opt of firstVariant.options) {
        const optionId = opt.option_id || opt.option?.id
        if (optionId && opt.value) {
          defaults[optionId] = opt.value
        }
      }
    }
    return defaults
  })

  const [quantity, setQuantity] = useState(1)
  const [justAdded, setJustAdded] = useState(false)
  const [selectedBundleQty, setSelectedBundleQty] = useState(1)
  const [bundlePriceOverride, setBundlePriceOverride] = useState<number | null>(null)
  const { addItem, isAddingItem } = useCart()

  const selectedVariant = useMemo(() => {
    if (variants.length <= 1) return variants[0]
    return variants.find((v: ProductVariantWithPrice) => {
      if (!v.options) return false
      return v.options.every((opt: VariantOption) => {
        const optionId = opt.option_id || opt.option?.id
        if (!optionId) return false
        return selectedOptions[optionId] === opt.value
      })
    }) || variants[0]
  }, [variants, selectedOptions])

  const ext = selectedVariant?.id ? variantExtensions?.[selectedVariant.id] : null
  const currentPriceCents = getVariantPriceAmount(selectedVariant)
  const cp = selectedVariant?.calculated_price
  const currency = (cp && typeof cp !== 'number' ? cp.currency_code : undefined) || 'inr'

  const allowBackorder = ext?.allow_backorder ?? false
  const inventoryQuantity = ext?.inventory_quantity
  const isOutOfStock = !allowBackorder && inventoryQuantity != null && inventoryQuantity <= 0

  const handleOptionChange = (optionId: string, value: string) => {
    setSelectedOptions((prev) => ({ ...prev, [optionId]: value }))
    setQuantity(1)
    setSelectedBundleQty(1)
    setBundlePriceOverride(null)
  }

  const handleSelectBundle = (qty: number, priceOverride?: number) => {
    setSelectedBundleQty(qty)
    setQuantity(qty)
    setBundlePriceOverride(priceOverride ?? null)
  }

  const handleAddToCart = () => {
    if (!selectedVariant?.id || isOutOfStock) return

    addItem(
      { variantId: selectedVariant.id, quantity },
      {
        onSuccess: () => {
          setJustAdded(true)
          toast.success(`${quantity > 1 ? `${quantity}x ` : ''}Added to bag`)
          const metaValue = toMetaCurrencyValue(currentPriceCents)
          trackAddToCart(product?.id || '', selectedVariant.id, quantity, currentPriceCents ?? undefined)
          trackMetaEvent('AddToCart', {
            content_ids: [selectedVariant.id],
            content_type: 'product',
            content_name: product?.title,
            value: metaValue,
            currency,
            contents: [{ id: selectedVariant.id, quantity, item_price: metaValue }],
            num_items: quantity,
          })
          setTimeout(() => setJustAdded(false), 2500)
        },
        onError: (error: Error) => {
          toast.error(error.message || 'Failed to add to bag')
        },
      }
    )
  }

  const hasMultipleVariants = variants.length > 1
  const effectivePriceCents = bundlePriceOverride !== null && selectedBundleQty > 1
    ? Math.round(bundlePriceOverride / selectedBundleQty)
    : currentPriceCents

  return (
    <div className="space-y-6">
      {/* Price */}
      <div className="flex items-center gap-3">
        <ProductPrice
          amount={effectivePriceCents}
          currency={currency}
          compareAtPrice={ext?.compare_at_price}
          soldOut={isOutOfStock}
          size="detail"
        />
        {selectedBundleQty > 1 && bundlePriceOverride && currentPriceCents && (
          <span className="text-sm text-[#7c5c3e] font-semibold bg-[#7c5c3e]/10 px-2.5 py-1 rounded-full">
            Bundle price applied
          </span>
        )}
      </div>

      {/* Option Selectors */}
      {hasMultipleVariants && (options as ProductOptionWithValues[]).map((option) => {
        const values = (option.values || []).map((v: string | ProductOptionValue) =>
          typeof v === 'string' ? v : v.value
        ).filter(Boolean) as string[]

        if (values.length <= 1 && (values[0] === 'One Size' || values[0] === 'Default')) {
          return null
        }

        const optionId = option.id
        const selectedValue = selectedOptions[optionId]

        return (
          <div key={optionId}>
            <h3 className="text-xs uppercase tracking-widest font-semibold mb-3">
              {option.title}
              {selectedValue && (
                <span className="ml-2 normal-case tracking-normal font-normal text-muted-foreground">
                  — {selectedValue}
                </span>
              )}
            </h3>
            <div className="flex flex-wrap gap-2">
              {values.map((value) => {
                const isSelected = selectedValue === value
                const isAvailable = variants.some((v: ProductVariantWithPrice) => {
                  const hasValue = v.options?.some(
                    (o: VariantOption) =>
                      (o.option_id === optionId || o.option?.id === optionId) && o.value === value
                  )
                  if (!hasValue) return false
                  const vExt = variantExtensions?.[v.id]
                  if (!vExt) return true
                  if (vExt.allow_backorder) return true
                  return vExt.inventory_quantity == null || vExt.inventory_quantity > 0
                })

                return (
                  <button
                    key={value}
                    onClick={() => handleOptionChange(optionId, value)}
                    disabled={!isAvailable}
                    className={`min-w-[52px] px-4 py-2.5 text-sm border-2 rounded-sm transition-all font-medium ${
                      isSelected
                        ? 'border-[#7c5c3e] bg-[#7c5c3e] text-white'
                        : isAvailable
                        ? 'border-border hover:border-[#7c5c3e]/60 text-foreground'
                        : 'border-border text-muted-foreground/40 line-through cursor-not-allowed'
                    }`}
                  >
                    {value}
                  </button>
                )
              })}
            </div>
          </div>
        )
      })}

      {/* Stock Urgency */}
      <StockUrgency quantity={inventoryQuantity} />

      {/* Bundle Offer */}
      <ProductBundleOffer
        basePrice={currentPriceCents}
        currency={currency}
        onSelectBundle={handleSelectBundle}
        selectedBundleQty={selectedBundleQty}
      />

      {/* Quantity + Add to Cart */}
      <div className="flex gap-3">
        <div className="flex items-center border-2 border-border rounded-sm overflow-hidden">
          <button
            onClick={() => {
              const newQty = Math.max(1, quantity - 1)
              setQuantity(newQty)
              if (selectedBundleQty > 1) {
                setSelectedBundleQty(1)
                setBundlePriceOverride(null)
              }
            }}
            className="p-3 hover:bg-muted transition-colors"
            disabled={quantity <= 1}
            aria-label="Decrease quantity"
          >
            <Minus className="h-4 w-4" />
          </button>
          <span className="w-12 text-center text-sm font-bold tabular-nums">{quantity}</span>
          <button
            onClick={() => {
              setQuantity(quantity + 1)
              if (selectedBundleQty > 1) {
                setSelectedBundleQty(1)
                setBundlePriceOverride(null)
              }
            }}
            className="p-3 hover:bg-muted transition-colors"
            disabled={isOutOfStock || (!allowBackorder && inventoryQuantity != null && quantity >= inventoryQuantity)}
            aria-label="Increase quantity"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>

        <button
          onClick={handleAddToCart}
          disabled={isOutOfStock || isAddingItem}
          className={`flex-1 flex items-center justify-center gap-2 py-3.5 text-sm font-bold uppercase tracking-wider rounded-sm transition-all ${
            isOutOfStock
              ? 'bg-muted text-muted-foreground cursor-not-allowed'
              : justAdded
              ? 'bg-green-700 text-white'
              : 'bg-[#7c5c3e] text-white hover:bg-[#6a4e34]'
          }`}
        >
          {isAddingItem ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : justAdded ? (
            <>
              <Check className="h-4 w-4" />
              Added to Bag
            </>
          ) : isOutOfStock ? (
            'Sold Out'
          ) : (
            `Add to Bag${quantity > 1 ? ` (${quantity})` : ''}`
          )}
        </button>
      </div>

      {/* Trust Badges */}
      <TrustBadges />

      {/* Delivery & Returns strip */}
      <div className="space-y-2 pt-1">
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <Truck className="h-4 w-4 text-[#7c5c3e] flex-shrink-0" strokeWidth={1.8} />
          <span>Free delivery on orders above <strong className="text-foreground">₹999</strong></span>
        </div>
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <RotateCcw className="h-4 w-4 text-[#7c5c3e] flex-shrink-0" strokeWidth={1.8} />
          <span>30-day hassle-free returns &amp; exchange</span>
        </div>
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <ShieldCheck className="h-4 w-4 text-[#7c5c3e] flex-shrink-0" strokeWidth={1.8} />
          <span>100% authentic &amp; quality-checked products</span>
        </div>
      </div>
    </div>
  )
}
