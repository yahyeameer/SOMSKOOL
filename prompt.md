# SOMSKOOL — AI Coding Agent Prompt

### 5-Page E-Learning Platform · Next.js 15 + Supabase

-----

## 🧠 PROJECT OVERVIEW

Build **SomSkool** — a professional Somali e-learning platform with exactly **5 pages**:

1. `/` — Home (Landing Page)
1. `/courses` — Course Catalog
1. `/payment` — Payment / Enrollment
1. `/login` + `/register` — Auth (Sign In / Sign Up)
1. `/contact` contact page— Contact Page

**Tech Stack:**

- Next.js 15 (App Router, Server Components, Server Actions)
- Supabase (Auth + PostgreSQL database)
- Tailwind CSS v4
- shadcn/ui components
- lucide-react icons
- next/font for typography

**Init commands:**

```bash
npx create-next-app@latest somskool --typescript --tailwind --app
npm install @supabase/supabase-js @supabase/auth-helpers-nextjs lucide-react clsx tailwind-merge class-variance-authority
npx shadcn@latest init
npx shadcn@latest add button input card badge avatar
```

**.env.local:**

```
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

-----

## 🎨 DESIGN SYSTEM

Apply this design system consistently across all 5 pages.

### Colors

```css
:root {
  --primary: #5B4FE9;        /* Purple — hero bg, buttons, active states */
  --primary-dark: #4438C7;   /* Hover on purple buttons */
  --accent: #F5A623;         /* Yellow — CTA buttons, star ratings, badges */
  --dark: #1A1A2E;           /* Footer, dark sections */
  --text: #1A1A2E;           /* Body text */
  --text-muted: #6B7280;     /* Labels, subtitles */
  --bg: #F9FAFB;             /* Page background */
  --white: #FFFFFF;
  --border: #E5E7EB;
  --success: #22C55E;        /* Green — confirmation states */
}
```

### Typography

```tsx
// app/layout.tsx
import { Plus_Jakarta_Sans, DM_Sans } from 'next/font/google'

const jakarta = Plus_Jakarta_Sans({ subsets: ['latin'], variable: '--font-display' })
const dmSans = DM_Sans({ subsets: ['latin'], variable: '--font-body' })
// Apply both variables to <html> tag
```

- **Headings:** `font-[family-name:var(--font-display)] font-bold`
- **Body/UI:** `font-[family-name:var(--font-body)]`

### Reusable Component Specs

**Navbar** (all pages):

- White bg, sticky, shadow on scroll
- Left: logo mark SVG + “SOMSKOOL” bold + tiny tagline
- Center: `Home · Courses · Contact`
- Right: `Login` (ghost outline) + `Register` (purple filled, rounded-full)
- Mobile: hamburger → slide-down drawer

**Footer** (all pages):

- Dark bg `#1A1A2E`, 4-column grid
- Col 1: Logo + tagline + social icons (Facebook, Instagram, LinkedIn)
- Col 2: Quick Links — About, All Courses, Instructors, Pricing, Contact
- Col 3: Top Categories — Web Dev, UI/UX, Digital Marketing, Data Science, Business
- Col 4: Newsletter — email input + yellow “Subscribe Now” button
- Bottom bar: `© 2026 SomSkool` + Privacy Policy + Terms of Service

**CourseCard** component:

```tsx
// components/CourseCard.tsx
interface CourseCardProps {
  title: string
  slug: string
  thumbnail_url: string
  level: 'Beginner' | 'Intermediate' | 'Advanced'
  rating: number        // e.g. 4.8
  duration_minutes: number
  price: number
  is_free: boolean
  instructor_name: string
  instructor_avatar: string
}
```

- White card, `rounded-2xl shadow-md hover:shadow-xl transition`
- Thumbnail image (16:9) with level badge pill overlaid top-left
  - Beginner → `bg-green-100 text-green-700`
  - Intermediate → `bg-blue-100 text-blue-700`
  - Advanced → `bg-orange-100 text-orange-700`
- Heart icon top-right (toggle wishlist, client component)
- Star rating (filled yellow stars) + duration row
- Course title bold, 2 lines max, ellipsis
- Bottom row: instructor avatar + name left · “Enroll Now” purple text-link right

-----

## 🗃️ SUPABASE SCHEMA

Run this SQL in Supabase SQL Editor:

```sql
-- Profiles (auto-created on signup via trigger)
create table profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  full_name text,
  avatar_url text,
  role text not null default 'student' check (role in ('student', 'admin')),
  created_at timestamptz default now()
);

-- Categories
create table categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null
);

-- Courses
create table courses (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique not null,
  description text,
  thumbnail_url text,
  price numeric(10,2) default 0,
  is_free boolean default false,
  level text check (level in ('Beginner', 'Intermediate', 'Advanced')),
  duration_minutes integer,
  category_id uuid references categories(id),
  instructor_name text,
  instructor_avatar text,
  rating numeric(3,2) default 0,
  total_students integer default 0,
  is_published boolean default false,
  created_at timestamptz default now()
);

-- Payments
create table payments (
  id uuid primary key default gen_random_uuid(),
  student_id uuid references profiles(id),
  course_id uuid references courses(id),
  full_name text not null,
  email text not null,
  phone_number text not null,
  payment_method text check (payment_method in ('zaad', 'edahab', 'evc_plus', 'golis')),
  transaction_reference text not null,
  amount numeric(10,2) not null,
  status text default 'pending' check (status in ('pending', 'confirmed', 'failed')),
  created_at timestamptz default now()
);

-- Enrollments (created when payment confirmed)
create table enrollments (
  id uuid primary key default gen_random_uuid(),
  student_id uuid references profiles(id),
  course_id uuid references courses(id),
  enrolled_at timestamptz default now(),
  unique(student_id, course_id)
);

-- Contact messages
create table contact_messages (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text not null,
  subject text,
  message text not null,
  created_at timestamptz default now()
);

-- RLS
alter table profiles enable row level security;
alter table payments enable row level security;
alter table enrollments enable row level security;

create policy "Own profile" on profiles for all using (auth.uid() = id);
create policy "Public courses" on courses for select using (is_published = true);
create policy "Own payments" on payments for select using (auth.uid() = student_id);
create policy "Insert own payment" on payments for insert with check (auth.uid() = student_id);

-- Auto-create profile on signup
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into profiles (id, full_name)
  values (new.id, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();
```

-----

## 📁 FILE STRUCTURE

```
somskool/
├── app/
│   ├── layout.tsx              # Root layout: fonts, Navbar, Footer
│   ├── page.tsx                # PAGE 1: Home
│   ├── courses/
│   │   └── page.tsx            # PAGE 2: Course Catalog
│   ├── payment/
│   │   └── page.tsx            # PAGE 3: Payment
│   ├── login/
│   │   └── page.tsx            # PAGE 4a: Login
│   ├── register/
│   │   └── page.tsx            # PAGE 4b: Register
│   └── contact/
│       └── page.tsx            # PAGE 5: Contact
├── components/
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   └── CourseCard.tsx
├── lib/
│   ├── supabase/
│   │   ├── client.ts           # Browser Supabase client
│   │   └── server.ts           # Server Supabase client
│   └── actions/
│       ├── auth.ts             # signIn, signUp, signOut Server Actions
│       ├── courses.ts          # getCourses, getCourseBySlug
│       ├── payment.ts          # submitPayment Server Action
│       └── contact.ts          # submitContactMessage Server Action
├── middleware.ts               # Protect /payment route (must be logged in)
└── types/index.ts
```

### `lib/supabase/client.ts`

```ts
import { createBrowserClient } from '@supabase/ssr'
export const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)
```

### `lib/supabase/server.ts`

```ts
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
export function createClient() {
  const cookieStore = cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll(), setAll: (c) => c.forEach(({ name, value, options }) => cookieStore.set(name, value, options)) } }
  )
}
```

-----

## PAGE 1 — HOME `/`

**Type:** Server Component (static, ISR 60s)

### Layout (top to bottom):

```
<Navbar />
<HeroSection />
<StatsBar />
<RecentCoursesSection />
<TestimonialsSection />
<Footer />
```

### HeroSection

```tsx
// Full-width, bg-[#5B4FE9]
// Left 55%:
//   - Badge pill: "⭐ #1 Learning Platform" (white bg, small text, rounded-full)
//   - H1: "Learn Without Limits" — text-5xl md:text-7xl font-extrabold text-white leading-tight
//   - P: subtitle text, text-white/80
//   - Two buttons side-by-side:
//     - "Start Learning" → white bg, dark text, rounded-full px-6 py-3
//     - "Explore Courses →" → white border outline, white text, rounded-full px-6 py-3
//   - Avatar stack: 4 overlapping circle avatars + "+2k Active Students" white text
// Right 45%:
//   - Dark rounded-2xl card (mock dashboard screenshot) — use a dark placeholder div
//     with gradient bg and fake UI elements inside (bars, text lines)
//   - Floating toast card bottom-left of the big card:
//     - Green checkmark circle + "Course Completed" bold + "UI/UX Design Masterclass" small
//     - White bg, rounded-xl, shadow-xl, slight -rotate-2
```

### StatsBar

```tsx
// White bg, py-16
// flex justify-around, 4 items:
// Each: <p className="text-4xl font-extrabold text-[#5B4FE9]">{value}</p>
//       <p className="text-sm text-gray-500 mt-1">{label}</p>
// Values: "18+" / "Expert Instructors", "75+" / "Premium Courses",
//         "8k+" / "Active Students", "4.9/5" / "Average Rating"
```

### RecentCoursesSection

```tsx
// Fetch: SELECT * FROM courses WHERE is_published=true ORDER BY created_at DESC LIMIT 6
// Header row: small purple label "TRENDING NOW" + H2 "Recent Courses" + "View All →" link
// Filter tab pills: Beginner | Intermediate | Advanced (client component for active state)
// 3-column grid of <CourseCard /> components
```

### TestimonialsSection

```tsx
// Light gray bg section
// Centered: label "STUDENT SUCCESS" + H2 "What Our Students Say" + subtitle
// 3-column grid, each card:
//   - White card rounded-2xl shadow-sm p-6
//   - Large decorative " quote mark top-right, text-purple-100 text-8xl
//   - 5 yellow stars
//   - Quote text (italic)
//   - Bottom: avatar circle + name bold + role text-gray-500
// Hardcode 3 testimonials (Emily R., James L., Sophia M. from design)
```

-----

## PAGE 2 — COURSES `/courses`

**Type:** Server Component with client-side filter

### Layout:

```
<Navbar />
<PageHero title="All Courses" subtitle="Browse our full catalog" />
<section className="max-w-7xl mx-auto px-4 py-12 flex gap-8">
  <FilterSidebar />     {/* client component, 280px wide */}
  <CourseGrid />        {/* server-fetched, updates via URL params */}
</section>
<Footer />
```

### FilterSidebar (client component)

- **Search:** text input with search icon, filters title on type
- **Category checkboxes:** Web Development, UI/UX Design, Digital Marketing, Data Science, Business Strategy
- **Level radio:** All · Beginner · Intermediate · Advanced
- **Price radio:** All · Free · Paid
- On change: update URL search params with `router.push`

### CourseGrid

```tsx
// Read searchParams from URL: ?category=&level=&price=&q=
// Build Supabase query dynamically:
let query = supabase.from('courses').select('*').eq('is_published', true)
if (level) query = query.eq('level', level)
if (category) query = query.eq('category_slug', category)
if (price === 'free') query = query.eq('is_free', true)
if (price === 'paid') query = query.eq('is_free', false)
if (q) query = query.ilike('title', `%${q}%`)

// Render: responsive grid (1 col mobile, 2 tablet, 3 desktop)
// Show "No courses found" empty state if results empty
// Show total count: "Showing 12 courses"
```

-----

## PAGE 3 — PAYMENT `/payment`

**Type:** Client Component (interactive form)

**Access:** Must be logged in. If not → redirect to `/login?next=/payment`

This page handles Zaad/eDahab manual payment confirmation. No payment gateway — student pays via mobile money then submits proof.

### URL params: `/payment?courseId=xxx&title=xxx&price=xxx`

### Layout:

```
<Navbar />
<main className="max-w-5xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-2 gap-10">
  <PaymentInstructions />
  <PaymentForm />
</main>
<Footer />
```

### PaymentInstructions (left column)

```tsx
// H2: "Complete Your Enrollment"
// Course summary card:
//   - Course title, price in USD
//   - Instructor name
//   - "You're one step away from starting!"

// Payment methods section — 4 method cards:
// Each card: method logo/name + phone number to send to + amount
// [Zaad]    Send {price} USD → 063-XXX-XXXX
// [eDahab]  Send {price} USD → 061-XXX-XXXX
// [EVC+]    Send {price} USD → 061-XXX-XXXX
// [Golis]   Send {price} USD → 090-XXX-XXXX

// Steps list:
// 1. Choose your payment method above
// 2. Send the exact amount to the number shown
// 3. Use reference: "SSKL-[courseId first 6 chars]"
// 4. Fill in the form with your transaction details
// 5. We'll confirm within 24 hours and send you access
```

### PaymentForm (right column — client component)

```tsx
// State: { fullName, email, phone, method, reference, agreed }

// Fields:
// - Full Name (text input, pre-filled from profile)
// - Email (email input, pre-filled from auth)
// - Phone Number (tel input — "e.g. 0634567890")
// - Payment Method (4 radio cards with icons: Zaad, eDahab, EVC Plus, Golis)
//   - Each: radio + logo icon + name + "Send to: XXXXXXXXXX"
//   - Active card: purple border + light purple bg
// - Transaction Reference (text input — "Enter the reference number from your receipt")
// - Checkbox: "I confirm I have sent the payment and the details above are correct"
// - Submit button: full-width yellow (#F5A623) "Submit Payment Details"

// On submit → Server Action: submitPayment()
// Success state: show green confirmation card
//   "✅ Payment Details Received!"
//   "We'll review your payment within 24 hours.
//    You'll receive an email confirmation once access is granted."
//   "Back to Courses" button
// Error state: show red error message inline
```

### `lib/actions/payment.ts`

```ts
'use server'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function submitPayment(formData: {
  courseId: string
  fullName: string
  email: string
  phone: string
  method: 'zaad' | 'edahab' | 'evc_plus' | 'golis'
  reference: string
  amount: number
}) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const { error } = await supabase.from('payments').insert({
    student_id: user.id,
    course_id: formData.courseId,
    full_name: formData.fullName,
    email: formData.email,
    phone_number: formData.phone,
    payment_method: formData.method,
    transaction_reference: formData.reference,
    amount: formData.amount,
    status: 'pending'
  })

  if (error) return { error: error.message }
  return { success: true }
}
```

-----

## PAGE 4 — AUTH `/login` + `/register`

**Type:** Client Components (form interactivity)

### Shared layout for both pages:

```tsx
// Full screen: left half = decorative purple panel, right half = white form panel
// Left panel (hidden on mobile):
//   - bg-[#5B4FE9]
//   - Large white "Learn Without Limits" heading
//   - Subtitle
//   - Floating course card mockup (same as hero)
// Right panel:
//   - Centered form, max-w-md
//   - SomSkool logo top
//   - Page title H2
//   - Form fields
//   - Submit button
//   - Switch link (Login ↔ Register)
```

### Login form (`/login`)

```tsx
// Fields:
// - Email (type="email", required)
// - Password (type="password", show/hide toggle eye icon)
// - "Forgot password?" link (right-aligned, small)
// Submit: full-width purple button "Sign In"
// Bottom: "Don't have an account? Register →"

// Server Action: signIn
// On success: redirect to /courses
// On error: show inline red error message below form
```

### Register form (`/register`)

```tsx
// Fields:
// - Full Name (text)
// - Email (email)
// - Password (password, show/hide toggle)
// - Confirm Password (password, validate match client-side)
// Submit: full-width purple button "Create Account"
// Terms: small text "By registering you agree to our Terms of Service"
// Bottom: "Already have an account? Login →"

// Server Action: signUp
// On success: redirect to /courses
// On error: show inline error
```

### `lib/actions/auth.ts`

```ts
'use server'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function signIn(formData: FormData) {
  const supabase = createClient()
  const { error } = await supabase.auth.signInWithPassword({
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  })
  if (error) return { error: error.message }
  redirect('/courses')
}

export async function signUp(formData: FormData) {
  const supabase = createClient()
  const { error } = await supabase.auth.signUp({
    email: formData.get('email') as string,
    password: formData.get('password') as string,
    options: { data: { full_name: formData.get('full_name') } }
  })
  if (error) return { error: error.message }
  redirect('/courses')
}

export async function signOut() {
  const supabase = createClient()
  await supabase.auth.signOut()
  redirect('/')
}
```

-----

## PAGE 5 — CONTACT `/contact`

**Type:** Server Component shell + Client form component

### Layout:

```
<Navbar />
<ContactHero />       {/* Purple banner: "Get In Touch" */}
<section className="max-w-6xl mx-auto px-4 py-16 grid grid-cols-1 md:grid-cols-2 gap-12">
  <ContactInfo />
  <ContactForm />
</section>
<Footer />
```

### ContactInfo (left)

```tsx
// H2: "We're here to help"
// P: "Have questions about courses, payments, or need support? Reach out."

// 3 info cards (icon + label + value):
// 📍 Location:    Hargeisa, Somaliland
// 📧 Email:       support@somskool.com
// 📱 WhatsApp:    +252 63 XXX XXXX  (clickable wa.me link)

// Social row: Facebook, Instagram, LinkedIn icons (lucide-react)

// Support hours:
// Mon–Fri: 8:00 AM – 6:00 PM (EAT)
// Sat:     9:00 AM – 2:00 PM (EAT)
```

### ContactForm (right — client component)

```tsx
// White card, rounded-2xl shadow-md p-8

// Fields:
// - Full Name (text)
// - Email (email)
// - Subject (text — "e.g. Question about a course")
// - Message (textarea, 5 rows)
// Submit: full-width purple "Send Message" button with send icon

// On submit → Server Action: submitContactMessage()
// Loading state: button shows spinner + "Sending..."
// Success: replace form with green card:
//   "✅ Message Sent! We'll get back to you within 24 hours."
// Error: inline red error message
```

### `lib/actions/contact.ts`

```ts
'use server'
import { createClient } from '@/lib/supabase/server'

export async function submitContactMessage(formData: FormData) {
  const supabase = createClient()
  const { error } = await supabase.from('contact_messages').insert({
    full_name: formData.get('full_name'),
    email: formData.get('email'),
    subject: formData.get('subject'),
    message: formData.get('message'),
  })
  if (error) return { error: error.message }
  return { success: true }
}
```

-----

## 🛡️ MIDDLEWARE (Route Protection)

```ts
// middleware.ts
import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const response = NextResponse.next()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => request.cookies.getAll(), setAll: (c) => c.forEach(({ name, value, options }) => response.cookies.set(name, value, options)) } }
  )
  const { data: { user } } = await supabase.auth.getUser()

  // Only /payment requires login
  if (request.nextUrl.pathname.startsWith('/payment') && !user) {
    return NextResponse.redirect(new URL('/login?next=/payment', request.url))
  }

  // Redirect logged-in users away from auth pages
  if ((request.nextUrl.pathname === '/login' || request.nextUrl.pathname === '/register') && user) {
    return NextResponse.redirect(new URL('/courses', request.url))
  }

  return response
}

export const config = { matcher: ['/payment/:path*', '/login', '/register'] }
```

-----

## ✅ AGENT RULES

1. **Pixel-faithful to the design** — Use the exact colors, typography, and layout from the design system above
1. **Server Components by default** — Only add `'use client'` for forms, filters, and interactive states
1. **Server Actions for all mutations** — signIn, signUp, submitPayment, submitContactMessage
1. **Mobile-first Tailwind** — Write base styles for mobile, add `md:` / `lg:` for larger screens
1. **Always handle 3 states** — loading skeleton / spinner, success, error for every async operation
1. **next/image for all images** — Never use `<img>` tags; always `<Image>` from next/image with proper width/height
1. **No hardcoded course data** — Always fetch from Supabase; seed the DB for development
1. **Type everything** — Define interfaces for Course, Payment, ContactMessage in `types/index.ts`
1. **Revalidate after mutations** — Call `revalidatePath('/')` or relevant path after Server Actions

-----

*SomSkool · 5-Page Build · Next.js 15 + Supabase*
*Hargeisa, Somaliland 🇸🇴*