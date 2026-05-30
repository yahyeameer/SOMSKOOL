import React from 'react'
import PaymentForm from '@/components/PaymentForm'
import { getSessionUser } from '@/lib/actions/auth'
import { getCourseBySlug } from '@/lib/actions/courses'
import { BookOpen, AlertCircle, Phone, ArrowRight, ShieldCheck, Check } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface PageProps {
  searchParams: Promise<{
    courseId?: string;
    title?: string;
    price?: string;
  }>
}

export default async function PaymentPage({ searchParams }: PageProps) {
  const resolvedParams = await searchParams
  const user = await getSessionUser()

  const courseId = resolvedParams.courseId || ''
  const title = resolvedParams.title || 'Koorsada SomSkool'
  const price = parseFloat(resolvedParams.price || '0')

  const methodsInstructions = [
    { name: 'Zaad Service', num: '*220*0634567890#', label: 'Telesom Zaad', wa: '063-4567890' },
    { name: 'eDahab', num: '*101*0624567890#', label: 'Somtel eDahab', wa: '062-4567890' },
    { name: 'EVC Plus', num: '*712*0614567890#', label: 'Hormuud EVC+', wa: '061-4567890' },
    { name: 'Golis Sahal', num: '*812*0904567890#', label: 'Golis Sahal', wa: '090-4567890' },
  ]

  return (
    <div className="flex flex-col w-full font-sans bg-gray-50/50">
      {/* 💳 Header */}
      <section className="bg-brand-primary py-12 text-center text-white relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-2 relative z-10">
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight">
            Gudbi Lacagta Koorsada
          </h1>
          <p className="text-white/80 text-xs sm:text-sm max-w-lg mx-auto font-semibold">
            Kaliya 1 talaabo ayaa kuu dhiman si aad u bilowdo barashada!
          </p>
        </div>
      </section>

      {/* 🛠️ Layout columns */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid grid-cols-1 md:grid-cols-2 gap-10">
        
        {/* Left Column - Instructions */}
        <div className="space-y-8 text-left">
          {/* Summary Card */}
          <div className="bg-white border border-border rounded-2xl p-6 shadow-sm space-y-4">
            <h2 className="font-display text-lg font-bold text-brand-dark flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-brand-primary" />
              Summary-ga Isdiiwangalinta
            </h2>
            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400 font-semibold">Koorsada:</span>
                <span className="text-brand-dark font-extrabold line-clamp-1 max-w-[200px] text-right">{title}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400 font-semibold">Barihii:</span>
                <span className="text-brand-dark font-extrabold">Eng. Yahye Meer</span>
              </div>
              <div className="border-t border-gray-100 my-2 pt-2 flex items-center justify-between text-base">
                <span className="text-brand-dark font-bold">Qiimaha Guud:</span>
                <span className="text-brand-primary font-extrabold font-display">${price.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Payment Methods Instruction Grid */}
          <div className="space-y-4">
            <h2 className="font-display text-lg font-bold text-brand-dark">
              Hababka Lacagta loo diro
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {methodsInstructions.map((m, idx) => (
                <div key={idx} className="bg-white border border-border rounded-xl p-4 space-y-2 shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold font-display uppercase tracking-wider text-brand-primary">
                      {m.name}
                    </span>
                    <span className="text-[10px] bg-brand-accent/10 text-brand-accent font-bold px-2 py-0.5 rounded-full">
                      USD Only
                    </span>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-gray-500 font-medium leading-none">U dir qiimaha kor ku xusan:</p>
                    <p className="text-sm font-extrabold text-brand-dark font-display">{m.num}</p>
                    <p className="text-[10px] text-gray-400 font-semibold">WhatsApp Support: {m.wa}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Steps List Card */}
          <div className="bg-brand-primary/[0.02] border border-brand-primary/10 rounded-2xl p-6 space-y-4">
            <h2 className="font-display text-lg font-bold text-brand-dark flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-brand-primary" />
              Talaabooyinka Xaqiijinta
            </h2>
            <ul className="space-y-3">
              {[
                'Dooro mid ka mid ah hababka lacag-bixinta ee kor ku xusan.',
                `U dir lacag dhan $${price.toFixed(2)} USD lambarka u gaarka ah habkaas.`,
                `Ku dar xogta tixraaca ee ah: "SSKL-${courseId.substring(0, 6).toUpperCase()}"`,
                'Ka dib marka aad lacagta dirto, geli faahfaahinta rasiidhka dhanka midig.',
                'Maamulka SomSkool wuxuu ku siin doonaa ogolaanshaha 24 saac gudahood.'
              ].map((step, idx) => (
                <li key={idx} className="flex gap-3 text-xs leading-relaxed font-semibold text-gray-600">
                  <div className="h-5 w-5 rounded-full bg-brand-primary/10 text-brand-primary flex items-center justify-center flex-shrink-0 text-[10px] font-bold">
                    {idx + 1}
                  </div>
                  <span>{step}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right Column - Client form */}
        <div className="flex flex-col justify-center">
          <PaymentForm
            courseId={courseId}
            title={title}
            price={price}
            user={user}
          />
        </div>
        
      </main>
    </div>
  )
}
