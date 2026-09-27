# Storefront

Medusa v2 eCommerce storefront. Next.js 16 App Router, React 19, Tailwind CSS, Medusa JS SDK. Multi-tenant via `X-Store-Environment-ID` header.

**Chassis philosophy**: this template ships zero visual opinions — commerce plumbing only; the AI design run writes the real UI.

Every shopper-facing surface is a SEMANTIC SKELETON: the commerce logic, the data
wiring, the plugin slots and the aria bindings are complete and must survive a
rewrite; there is no styling to inherit. That covers the homepage, the product
and collection routes, cart, search, 404/error, the loading states, about,
contact and faq, and the shared components under `components/product/` and
`components/cart/`. Each such file opens with a `SEMANTIC SKELETON` comment
naming exactly what must survive.

Presentation STATE is carried on data attributes rather than class strings, so a
redesign can style it without having to re-derive it: `data-state` on the
add-to-cart control, `data-selected`/`data-unavailable` on variant options,
`data-busy` on an in-flight cart line, `data-current` on the active page,
`data-open` on the FAQ panel, `data-variant` on a price.

Still styled, deliberately: checkout, account and auth (shared commerce flows —
a familiar checkout is a UX asset, and rebuilding a payment flow per store is
not worth the risk), the policy pages (merchant legal text), and
`components/layout/header.tsx` / `footer.tsx`, which are never rendered and
exist as functional reference for the design run.

## Tech Stack

- **Framework**: Next.js 16 (App Router, Server Components by default, Turbopack dev)
- **Styling**: Tailwind CSS — no custom CSS unless absolutely necessary
- **Data**: Medusa JS SDK via `lib/medusa-client.ts` (singleton, auto-attaches store headers)
- **State**: TanStack Query (5-min staleTime, no refetch on window focus)
- **Forms**: React Hook Form + Zod validation
- **Payments**: Stripe Connect (`react-stripe-js`, `@stripe/stripe-js`)
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **Toasts**: Sonner (placement/appearance are the design run's)
- **Themes**: next-themes (class-based; light/dark policy is the design run's)

## Edge / Middleware File

This project has exactly ONE edge routing file at the project root — either
`proxy.ts` (Next 16+) or `middleware.ts` (Next 15), never both. Check which
one already exists before touching routing/middleware logic; do not assume
based on the Next version stated above, since it may be out of date for this
project.

This file is platform-managed and cannot be created or edited from this
surface under either name — attempting to add the other one alongside an
existing proxy.ts/middleware.ts will fail: Next hard-fails every request at
runtime when both are present. If asked for edge/middleware behavior changes,
say this isn't something you can do from here.

## Project Structure

```
app/
  layout.tsx              # Root layout: fonts, metadata, providers, cart drawer host, cookie consent — NO header/footer chrome
  providers.tsx           # ThemeProvider + QueryClientProvider
  globals.css             # CSS variables (colors, spacing), base styles
  products/
    page.tsx              # Product listing (client) — category filter, sort, ProductGrid
    [handle]/page.tsx     # Product detail (SERVER) — SSR product + compare-at prices
  collections/
    page.tsx              # Collections listing (server)
    [handle]/page.tsx     # Collection detail (server) — filtered ProductGrid
  cart/page.tsx           # Full-page cart (client) — shared CartLineItemCard + order summary
  checkout/
    page.tsx              # Multi-step checkout (client) — info → shipping → payment
    success/page.tsx      # Order confirmation (client)
  account/
    page.tsx              # Account overview (client, auth-protected)
    orders/page.tsx       # Order history (client)
    addresses/page.tsx    # Address management (client)
    profile/page.tsx      # Profile settings (client)
  auth/
    login/page.tsx        # Login form (client)
    register/page.tsx     # Registration form (client)
    forgot-password/      # Password reset
  search/page.tsx         # Search results (client)
  about/, contact/, faq/, privacy/, terms/, shipping/  # Static content pages

components/
  layout/
    header.tsx            # NOT rendered by default — chassis reference header (search/account/cart icons)
    footer.tsx            # NOT rendered by default — chassis reference footer (legal links, Manage Cookies)
  product/
    product-card.tsx      # SEMANTIC SKELETON — product link, image, title, price. No styling
    product-grid.tsx      # SEMANTIC SKELETON — fetches products + compare-at prices and sorts them. No grid, no styling
    product-actions.tsx   # SEMANTIC SKELETON — variant selection, quantity, add-to-cart, stock. State on data-* attributes, no styling
  cart/
    cart-drawer.tsx       # SEMANTIC SKELETON — items, quantity edit, remove, subtotal, checkout CTA, 2 plugin slots. Unstyled and motionless: entrance direction, motion and presentation are free design decisions
    cart-drawer-host.tsx  # Layout-level mount: subscribes to openCartDrawer(), skips /checkout
    cart-line-item-card.tsx  # SEMANTIC SKELETON — shared by the drawer and /cart. `data-busy` while in flight
  checkout/
    stripe-payment-form.tsx  # Stripe Elements wrapper, PaymentElement, confirmPayment
  account/
    account-layout.tsx    # Auth-protected wrapper, sidebar nav, breadcrumbs
  analytics-provider.tsx  # Consent-based page view tracking
  cookie-consent.tsx      # SEMANTIC SKELETON — consent read/write, accept/decline, `data-manage-cookies`. Unstyled: it must be designed like the rest of the store
  element-picker-listener.tsx  # Admin dashboard element picker integration

lib/
  medusa-client.ts        # Medusa SDK singleton (baseUrl, publishableKey, store headers)
  analytics.ts            # AnalyticsTracker: session, pageview, cart, checkout, purchase events
  cookie-consent.ts       # Cookie read/write helpers (amboras_consent cookie, 1yr max-age)
  utils/
    placeholder-images.ts # Deterministic product image fallbacks

hooks/
  use-auth.ts             # Login, register, logout, customer retrieval
  use-cart.ts             # Cart CRUD (localStorage cart ID, create/add/update/remove items)
  use-checkout.ts         # Multi-step checkout state machine + Stripe init
  use-checkout-gate.ts    # Pure Pay-now readiness derivation (address/session/billing gates)
  use-order-totals.ts     # Totals breakdown from a live cart or a placed order
  use-collections.ts      # Collection list fetch
  use-products.ts         # Product list fetch (with calculated_price)
  use-product.ts          # Single product fetch by handle
  use-region.ts           # Region fetch (required for pricing context)
  use-stripe-config.ts    # Stripe Connect config fetch (/store/stripe-connect)

types/
  index.ts                # Product, ProductVariant, Cart, LineItem types
  browser.d.ts            # requestIdleCallback, NetworkInformation type extensions
```

## Root Layout (`app/layout.tsx`)

Wraps every page. **Renders zero pre-designed chrome — no Header, no Footer.** The chassis ships only functional plumbing; the AI design run composes its own header/footer. Render order:

1. **Fonts** — the root layout loads NO typefaces; `--font-heading` / `--font-body` are undefined until the design run authors its own `next/font` setup. (Chassis surfaces pin their own faces privately via `lib/chassis-fonts.ts` — that choice is theirs alone, not the store's.)
2. **Providers** — ThemeProvider + QueryClientProvider (+ plugin configs)
3. **BuildErrorBeacon** — dev build-error reporting
4. **ElementPickerListener** — admin dashboard integration
5. **main** > **ErrorBoundary** > **AnalyticsProvider** > `{children}`
6. **CartDrawerHost** — layout-level cart drawer; opens on `openCartDrawer()` (add-to-cart confirmation) with no header rendered; skips `/checkout` (CheckoutHeader owns its own drawer there)
7. **bodyEnd plugin slot** — chat widgets, overlays (from plugin registry)
8. **PolicyLinksFallback** — compliance overlay, NOT design chrome; the only route to `/privacy`, `/terms`, `/refund-policy`, `/cookie-policy` until the design links them, at which point it retires itself
9. **CookieConsent** — compliance overlay, NOT design chrome; must show even before any design exists
10. **Toaster** — Sonner notifications
11. **head plugin scripts** — analytics scripts, tracking pixels (from plugin registry)

`components/layout/header.tsx` and `footer.tsx` stay on disk as functional reference material for the design run — the layout renders neither (it imports only the `PolicyLinksFallback` named export from `footer.tsx`).

Typeface choice belongs entirely to the design run: author a fresh `next/font` setup in `layout.tsx` binding `--font-heading` / `--font-body`. Tailwind maps whatever you define via `fontFamily.heading` / `fontFamily.body`.

### Capabilities the AI design run must wire into its design

The chassis keeps these functional but renders no entry points for them — the designed UI must provide the affordances:

- **Search** — `app/search` route works; wire a search entry (link/box) to `/search?q=...`
- **Account/auth** — `/account`, `/auth/login`, `/auth/register` routes work (`use-auth.ts`); wire account/sign-in entries
- **Cart entry** — the drawer auto-opens on add-to-cart via `openCartDrawer()` (`lib/cart-ui.ts`), and `/cart` is the full-page cart; wire a cart icon/link that calls `openCartDrawer()` or links to `/cart`
- **Cookie management re-open** — after a consent choice the banner only reopens via `window.dispatchEvent(new Event('manage-cookies'))` (after `clearConsent()`); the design MUST include a manage-cookies affordance (see `components/layout/footer.tsx` for the reference implementation)
- **Policy links (REQUIRED — legal/payments blocker)** — `/privacy`, `/terms`, `/refund-policy`, `/cookie-policy` are live routes with NO link anywhere in the chassis tree. The design MUST link every policy the merchant has configured, normally from its footer; derive them from `usePolicies()` and render only the ones that are set (`components/layout/footer.tsx` is the reference implementation). Stripe requires a reachable Terms page for a live account, so a store that ships without these is not launchable. The chassis mounts a bare `PolicyLinksFallback` strip (`components/layout/footer.tsx`, rendered in `app/layout.tsx`) as a compliance floor; it retires itself as soon as the designed UI links to any policy route — it is a safety net, not a substitute for designing them in

## Data Fetching Patterns

### Server Components (SSR)
Product detail and collection pages fetch data server-side with async functions:
```typescript
// Direct SDK call in async server component
const response = await medusaClient.store.product.list({ handle, region_id, fields: '*variants.calculated_price' })
```

### Client Components (TanStack Query)
Product listing, cart, auth use hooks backed by `useQuery`/`useMutation`:
```typescript
// All hooks require regionId for pricing context
const { data: products } = useProducts({ limit: 100, category_id })
```

### Compare-at Prices (Custom Endpoint)
Not in the Medusa SDK — fetched via direct HTTP to `/store/product-extensions/products/{id}/variants`. **Must include both headers**: `X-Store-Environment-ID` and `x-publishable-api-key`.

## Pricing

- All prices are in **cents** (divide by 100 for display)
- `calculated_price.calculated_amount` — current price (includes region pricing, taxes, discounts)
- `calculated_price.currency_code` — currency (e.g. "eur")
- `compare_at_price` — original price for strikethrough display (from product-extensions endpoint)
- Strikethrough shows when `compare_at_price > calculated_amount`
- Format via `Intl.NumberFormat` with currency style

## Auth Flow

1. **Login**: `medusaClient.auth.login('customer', 'emailpass', { email, password })` → SDK stores token → fetch customer → cache → redirect `/account`
2. **Register**: `medusaClient.auth.register()` (create identity) → `medusaClient.store.customer.create()` (create customer record). On "identity exists" error: fallback to login.
3. **Logout**: `medusaClient.auth.logout()` → clear cache → redirect home

## Cart

- Cart ID stored in `localStorage` (`medusa_cart_id`)
- Auto-creates cart with first region if none exists
- Operations: `createLineItem`, `updateLineItem`, `deleteLineItem`
- `deleteLineItem` returns `response.parent` (not `response.cart`)
- The cart drawer is a SEMANTIC SKELETON: it lists items and exposes quantity/remove, and carries no positioning or styling at all — the design run composes how it appears

## Checkout Flow

1. **Info** — email + shipping address → `cart.update()`
2. **Shipping** — select method → `cart.addShippingMethod()`
3. **Payment** — init payment session (`pp_stripe-connect_stripe-connect` or `pp_system_default`) → Stripe Elements form or direct "Place Order"
4. **Complete** — `cart.complete()` → redirect to `/checkout/success?order_id=...`

## Theming (CSS Variables)

The store has NO predefined palette, no default colors, and no theme values. The
design run defines every color itself. `tailwind.config.ts` wires semantic
utility NAMES (`bg-background`, `text-foreground`, …) to CSS variables that are
deliberately UNDEFINED outside the chassis scope — define them (on `:root` or a
theme class) as part of the design, with whatever values the brief calls for.
The only place variables carry concrete values is `app/chassis.css`, scoped to
`.chassis-theme` (checkout/account/auth/policies) — those values are the frozen
chassis's own and are NOT the store's palette. Light/dark policy is likewise a
free design decision.

## Custom Tailwind Utilities

CHASSIS-ONLY — these utilities exist because the frozen chassis markup uses
them (`text-h1`–`text-h4`, `text-display`, `container-custom`, `link-underline`,
`font-heading`/`font-body`). They carry the chassis's own choices, not the
store's: the design run defines its own type scale, measure, motion and
utilities rather than adopting these. `text-balance` is functional and free to
use.

## Analytics

- Consent-based (cookie `amboras_consent`)
- Session tracking with 30-min timeout, heartbeat every 3-5s
- Events batched (max 20) and flushed every 3s
- Tracks: `page_view`, `add_to_cart`, `begin_checkout`, `purchase`
- Endpoint: `{MEDUSA_BACKEND_URL}/store/analytics/events`
- Silently fails — never breaks the store

## Environment Variables

```
NEXT_PUBLIC_MEDUSA_BACKEND_URL    # Medusa backend (default: http://localhost:9000)
NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY # Store API key (required for all /store/* calls)
NEXT_PUBLIC_STORE_ID              # Multi-tenant store environment ID (optional)
NEXT_PUBLIC_ANALYTICS_ENDPOINT    # Analytics endpoint override (optional)
PORT                              # Dev server port (default: 3000)
```

## Debugging

**When the store crashes or user reports issues, check the dev-server logs first.**

### Log Files (in this workspace)

```
/tmp/amboras-preview.out.log   ← Next.js stdout (compilation, requests, console.log)
/tmp/amboras-preview.err.log   ← Next.js stderr (errors, stack traces, supervisor restarts)
```

### After Making Code Changes

**ALWAYS verify your changes worked:**

1. Check compilation succeeded:
   ```bash
   tail -20 /tmp/amboras-preview.out.log
   # Look for: "✓ Compiled / in Xs"
   ```

2. Check for runtime errors:
   ```bash
   tail -20 /tmp/amboras-preview.err.log
   # Should be empty or only show old errors
   ```

3. If you see `GET / 500` in out.log, immediately check error.log for stack trace

### Common Error Patterns

| Error in logs | Cause | Fix |
|---------------|-------|-----|
| `Export X was not found in module Y` | Import doesn't exist in package | Check package docs for correct export names |
| `Module not found: Can't resolve 'X'` | Missing dependency | Check if package is in package.json |
| `GET / 500 in Xms` | Runtime error during render | Check error.log for full stack trace |
| `ECONNREFUSED` | Can't reach Medusa backend | Check NEXT_PUBLIC_MEDUSA_BACKEND_URL in .env.local |
| Compilation hangs | Syntax error or infinite loop | Check error.log |

### Example: lucide-react Import Error

**Error:** `Export Instagram was not found in module lucide-react`

**Cause:** Icon names don't exist or changed in lucide-react version

**Fix:** Check [lucide.dev](https://lucide.dev) for correct icon names in the installed version. Don't assume icon names - verify they exist.

## Rules

- Always use Tailwind CSS for styling
- Prefer editing existing components over creating new ones
- Use Server Components by default, only add `'use client'` when needed
- Fetch data via Medusa JS SDK (`medusaClient`), never direct API calls (exception: compare-at prices, analytics, stripe-connect config)
- All `/store/*` API calls require the `x-publishable-api-key` header — the SDK handles this automatically, but direct `fetch()` calls must add it manually
- Keep changes minimal and focused
- Read a file before editing it
- Follow existing naming conventions and patterns
- Prices are always in cents — divide by 100 for display
- Cart ID lives in localStorage — never assume a cart exists, always handle creation
- Stock checks: inventory is always tracked; use `allow_backorder` to decide whether a zero-stock variant is sold out or still purchasable
- **After ANY code change: check `/tmp/amboras-preview.out.log` for "✓ Compiled" and no 500 errors**
- **If user reports issue: check `/tmp/amboras-preview.err.log` FIRST before debugging**

<!-- AMBORAS:PLUGIN_PROTECTIONS -->

## Plugin Infrastructure — DO NOT TOUCH

The following are owned and managed by the Amboras plugin system. Modifying, moving,
or deleting any of them will silently break plugin installs, uninstalls, and placement
changes in ways that are very difficult to recover from.

### 1. AMBORAS: tagged JSX blocks

These comment-wrapped blocks are how the plugin system tracks what it has placed and where.
The comments are the ONLY record of placement — there is no database backup.

```tsx
{/* AMBORAS:REVIEWS:START id=reviewstars-pdpaftertitle slot=pdpAfterTitle */}
<ReviewStars productId={product.id} />
{/* AMBORAS:REVIEWS:END */}
```

**NEVER:**
- Delete or rename the START or END comment
- Move the block to a different file or a different position in the file
- Change the `id=` or `slot=` values inside the comment
- Wrap the block in a condition that changes its slot context

**You MAY freely edit the JSX between START and END** — that code belongs to the merchant.
The comments are the locks; the content between them is yours.

### 2. AMBORAS: tagged import blocks

```ts
// AMBORAS:REVIEWS:IMPORT:reviewstars-pdpaftertitle
import ReviewStars from '@/components/plugins/reviews/ReviewStars'
// AMBORAS:REVIEWS:IMPORT:END
```

**NEVER:**
- Delete the IMPORT comment lines
- Move the import outside the tagged block
- Change the IMPORT tag identifier

### 3. PluginSlot and ClientPluginSlot tags

```tsx
<PluginSlot name="pdpAfterTitle" context={{ productId: product.id }} />
<ClientPluginSlot name="cartDrawerFooter" context={{ cartId: cart?.id }} />
```

These render nothing visible for Class B plugins but are required infrastructure.
The codemod scans for them to discover which file to insert tagged blocks into.
Deleting one means future plugin placements targeting that slot will fail with
"Could not find a file containing PluginSlot name=X".

**NEVER:**
- Delete a PluginSlot or ClientPluginSlot tag
- Change the `name` attribute value
- Move the tag to a different file
- **Render the same slot name twice** — not in two files, not twice in one file, not
  once per branch of a ternary. The codemod inserts the plugin into whichever copy it
  finds first; if the page renders the other one, the install lands in dead code and
  the plugin silently does nothing (this is exactly how every cart-tracker install was
  lost). `pnpm run check-slots` fails the build on duplicates.
- **Put a slot behind a conditional or after an early return** — `{cart && <ClientPluginSlot .../>}`
  or a slot below `if (!product) return null` is present to the scanner and absent at
  runtime, which is the same dead-code failure with no gate able to see it. Slots render
  nothing on their own; render them unconditionally and let the slot decide.

The `name` attribute does NOT have to come first — `<PluginSlot context={{...}} name="pdpAfterTitle" />`
is fine, and freely-regenerated pages routinely write it that way.

### 4. app/_generated/plugin-registry.ts

This file is machine-generated by the orchestrator on every plugin install, upgrade,
and uninstall. It is always completely overwritten.

**NEVER edit this file.** Any changes you make will be silently lost on the next
install operation. If you need to verify what is registered, read it. Never write it.

### Quick rule of thumb

If a line or block contains the word `AMBORAS`, a `PluginSlot` component, or lives
in `app/_generated/` — do not touch it. Everything else in the storefront is yours.