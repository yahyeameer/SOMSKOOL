'use client'

import React, { useState, useTransition } from 'react'
import { Course, Payment } from '@/types'
import { modifyPaymentStatus, submitDocumentUpload, saveVideoSettings } from '@/lib/actions/admin'
import { 
  CheckCircle, 
  XCircle, 
  FileText, 
  Video, 
  CreditCard, 
  Upload, 
  Plus, 
  Loader2,
  CheckCircle2, 
  AlertCircle,
  FileCheck,
  Download,
  Link2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface AdminPanelProps {
  payments: Payment[]
  documents: any[]
  courses: Course[]
  videoSettings: { youtube_id: string; channel_name: string; channel_url: string }
}

export default function AdminPanel({ payments: initialPayments, documents: initialDocs, courses, videoSettings }: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<'payments' | 'docs' | 'video'>('payments')
  const [payments, setPayments] = useState<Payment[]>(initialPayments)
  const [documents, setDocuments] = useState<any[]>(initialDocs)

  // Tab 2: Document Form states
  const [docTitle, setDocTitle] = useState('')
  const [docCourse, setDocCourse] = useState(courses[0]?.id || '')
  const [docType, setDocType] = useState('pdf')
  const [docUrl, setDocUrl] = useState('')
  const [docMessage, setDocMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  // Tab 3: Video Form states
  const [youtubeId, setYoutubeId] = useState(videoSettings.youtube_id)
  const [channelName, setChannelName] = useState(videoSettings.channel_name)
  const [channelUrl, setChannelUrl] = useState(videoSettings.channel_url)
  const [videoMessage, setVideoMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  const [isPending, startTransition] = useTransition()

  // Tab 1 Actions: Approve / Reject Payments
  const handlePaymentAction = async (paymentId: string, status: 'confirmed' | 'failed') => {
    startTransition(async () => {
      const res = await modifyPaymentStatus(paymentId, status)
      if (res.success) {
        setPayments(prev => prev.map(p => p.id === paymentId ? { ...p, status } : p))
      } else {
        alert(res.error || 'Khalad ayaa ka dhacay ansixinta.')
      }
    })
  }

  // Tab 2 Action: Document Upload
  const handleDocSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setDocMessage(null)

    if (!docTitle) {
      setDocMessage({ type: 'error', text: 'Fadlan ku qor magaca dokumentiga.' })
      return
    }

    startTransition(async () => {
      const res = await submitDocumentUpload({
        title: docTitle,
        courseId: docCourse,
        type: docType,
        url: docUrl || 'https://somskool.com/uploads/syllabus.pdf'
      })

      if (res.success) {
        setDocMessage({ type: 'success', text: 'Dukumentiga waa la galiyey si guul ah!' })
        // Append to local state list for instant responsiveness
        const matchedCourse = courses.find(c => c.id === docCourse)
        setDocuments(prev => [
          {
            id: 'doc-' + Math.random().toString(36).substring(2, 9),
            title: docTitle,
            course_id: docCourse,
            course_title: matchedCourse ? matchedCourse.title : 'General',
            type: docType,
            url: docUrl || 'https://somskool.com/uploads/syllabus.pdf',
            created_at: new Date().toISOString()
          },
          ...prev
        ])
        setDocTitle('')
        setDocUrl('')
      } else {
        setDocMessage({ type: 'error', text: res.error || 'Khalad ayaa dhacay.' })
      }
    })
  }

  // Tab 3 Action: Video Settings
  const handleVideoSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setVideoMessage(null)

    if (!youtubeId || !channelName) {
      setVideoMessage({ type: 'error', text: 'Muuqaalka YouTube ID iyo magaca kanaalka waa muhiim.' })
      return
    }

    startTransition(async () => {
      const res = await saveVideoSettings({
        youtube_id: youtubeId,
        channel_name: channelName,
        channel_url: channelUrl || 'https://youtube.com'
      })

      if (res.success) {
        setVideoMessage({ type: 'success', text: 'Habeynta kanaalka YouTube-ka si guul ah ayaa loo keydiyey!' })
      } else {
        setVideoMessage({ type: 'error', text: res.error || 'Khalad ayaa dhacay.' })
      }
    })
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 font-sans">
      
      {/* Sidebar Navigation (3 columns) */}
      <div className="lg:col-span-3 flex flex-col gap-2">
        <button
          onClick={() => setActiveTab('payments')}
          className={`flex items-center gap-3 px-5 py-4 rounded-xl text-sm font-semibold transition-all text-left ${
            activeTab === 'payments'
              ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/15'
              : 'bg-white hover:bg-gray-50 border border-border text-brand-dark'
          }`}
        >
          <CreditCard className="h-5 w-5" />
          <span>Lacagaha (Payments)</span>
          {payments.filter(p => p.status === 'pending').length > 0 && (
            <span className="ml-auto bg-brand-accent text-brand-dark rounded-full px-2 py-0.5 text-xs font-bold">
              {payments.filter(p => p.status === 'pending').length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('docs')}
          className={`flex items-center gap-3 px-5 py-4 rounded-xl text-sm font-semibold transition-all text-left ${
            activeTab === 'docs'
              ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/15'
              : 'bg-white hover:bg-gray-50 border border-border text-brand-dark'
          }`}
        >
          <FileText className="h-5 w-5" />
          <span>Dukumentiyada (Docs)</span>
        </button>

        <button
          onClick={() => setActiveTab('video')}
          className={`flex items-center gap-3 px-5 py-4 rounded-xl text-sm font-semibold transition-all text-left ${
            activeTab === 'video'
              ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/15'
              : 'bg-white hover:bg-gray-50 border border-border text-brand-dark'
          }`}
        >
          <Video className="h-5 w-5" />
          <span>Kanaalka Muuqaalka</span>
        </button>
      </div>

      {/* Main Console Content (9 columns) */}
      <div className="lg:col-span-9">
        {isPending && (
          <div className="fixed top-4 right-4 bg-brand-primary text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 text-xs font-bold z-50">
            <Loader2 className="h-4 w-4 animate-spin" />
            Gudbinayaa...
          </div>
        )}

        {/* ================= TAB 1: PAYMENTS ================= */}
        {activeTab === 'payments' && (
          <Card className="border border-border rounded-2xl shadow-sm bg-white overflow-hidden text-left">
            <CardHeader className="border-b border-gray-100 p-6 bg-gray-50/50">
              <CardTitle className="font-display text-xl font-bold text-brand-dark">Lacagaha Ardayda (Student Payments)</CardTitle>
              <CardDescription className="text-gray-400 font-medium">Ku maamul halkan rasiidhada lacag-bixinta, una fasax casharada ardayda ansaxday.</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              {payments.length === 0 ? (
                <div className="py-16 text-center space-y-3">
                  <CreditCard className="h-12 w-12 text-gray-300 mx-auto" />
                  <p className="text-gray-400 text-sm font-semibold">Wax lacag-bixin ah oo la gudbiyey wali lama helin.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead>
                      <tr className="border-b border-gray-100 text-gray-500 text-xs font-bold uppercase tracking-wider">
                        <th className="py-3.5 px-3">Student / Course</th>
                        <th className="py-3.5 px-3">Reference / Phone</th>
                        <th className="py-3.5 px-3">Method</th>
                        <th className="py-3.5 px-3">Amount</th>
                        <th className="py-3.5 px-3">Status</th>
                        <th className="py-3.5 px-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 font-medium">
                      {payments.map((p) => {
                        const matchedCourse = courses.find(c => c.id === p.course_id)
                        return (
                          <tr key={p.id} className="hover:bg-gray-50/50 transition-colors">
                            <td className="py-4 px-3 space-y-0.5">
                              <p className="font-extrabold text-brand-dark">{p.full_name}</p>
                              <p className="text-xs text-gray-400 font-bold truncate max-w-[200px]" title={matchedCourse?.title || 'Unknown Course'}>
                                {matchedCourse?.title || 'Koorsada SomSkool'}
                              </p>
                            </td>
                            <td className="py-4 px-3 space-y-0.5 text-xs">
                              <p className="font-extrabold text-brand-dark bg-gray-100 px-2 py-0.5 rounded inline-block font-mono">
                                {p.transaction_reference}
                              </p>
                              <p className="text-gray-400 font-semibold">{p.phone_number}</p>
                            </td>
                            <td className="py-4 px-3 text-xs uppercase font-extrabold text-brand-primary">
                              {p.payment_method.replace('_', ' ')}
                            </td>
                            <td className="py-4 px-3 font-bold text-brand-dark">
                              ${p.amount.toFixed(2)}
                            </td>
                            <td className="py-4 px-3">
                              {p.status === 'confirmed' ? (
                                <span className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-xs font-extrabold border border-emerald-100 inline-flex items-center gap-1">
                                  <CheckCircle className="h-3 w-3" /> Ansixiyey
                                </span>
                              ) : p.status === 'failed' ? (
                                <span className="bg-red-50 text-red-500 px-3 py-1 rounded-full text-xs font-extrabold border border-red-100 inline-flex items-center gap-1">
                                  <XCircle className="h-3 w-3" /> Diiday
                                </span>
                              ) : (
                                <span className="bg-amber-50 text-amber-600 px-3 py-1 rounded-full text-xs font-extrabold border border-amber-100 inline-flex items-center gap-1 animate-pulse">
                                  Sugaya (Pending)
                                </span>
                              )}
                            </td>
                            <td className="py-4 px-3 text-right">
                              {p.status === 'pending' ? (
                                <div className="flex items-center justify-end gap-2">
                                  <button
                                    onClick={() => handlePaymentAction(p.id, 'confirmed')}
                                    className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg px-3 py-1.5 text-xs font-bold shadow-sm shadow-emerald-500/10 cursor-pointer transition-colors"
                                  >
                                    Approve
                                  </button>
                                  <button
                                    onClick={() => handlePaymentAction(p.id, 'failed')}
                                    className="bg-white hover:bg-red-50 border border-red-200 text-red-500 rounded-lg px-3 py-1.5 text-xs font-bold cursor-pointer transition-all"
                                  >
                                    Reject
                                  </button>
                                </div>
                              ) : (
                                <span className="text-xs text-gray-400 font-bold">Xaqiijiyey</span>
                              )}
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* ================= TAB 2: DOCUMENTS ================= */}
        {activeTab === 'docs' && (
          <div className="space-y-8 text-left">
            {/* Upload form card */}
            <Card className="border border-border rounded-2xl shadow-sm bg-white overflow-hidden">
              <CardHeader className="border-b border-gray-100 p-6 bg-gray-50/50">
                <CardTitle className="font-display text-xl font-bold text-brand-dark">Geli Dukumenti Cusub (Upload Resource)</CardTitle>
                <CardDescription className="text-gray-400 font-medium">U kordhi casharada ardayda lifaaqyo kala duwan sida PDF Syllabus ama slide code-ka koorsada.</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <form onSubmit={handleDocSubmit} className="space-y-5">
                  {docMessage && (
                    <div className={`p-4 rounded-xl flex items-start gap-2.5 text-sm font-semibold ${
                      docMessage.type === 'success' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-red-50 text-red-500 border border-red-100'
                    }`}>
                      {docMessage.type === 'success' ? <CheckCircle2 className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
                      <span>{docMessage.text}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="title" className="text-xs font-bold text-gray-500 uppercase">Magaca Dokumentiga</Label>
                      <Input
                        id="title"
                        type="text"
                        placeholder="e.g. HTML & CSS Cheat Sheet Somali"
                        value={docTitle}
                        onChange={(e) => setDocTitle(e.target.value)}
                        className="rounded-xl border-gray-200"
                        required
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="course" className="text-xs font-bold text-gray-500 uppercase">Dooro Koorsada</Label>
                      <select
                        id="course"
                        value={docCourse}
                        onChange={(e) => setDocCourse(e.target.value)}
                        className="w-full h-10 px-3 border border-gray-200 text-brand-dark font-medium rounded-xl text-sm outline-none focus:ring-2 focus:ring-brand-primary/25 focus:border-brand-primary"
                      >
                        {courses.map(c => (
                          <option key={c.id} value={c.id}>{c.title}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="type" className="text-xs font-bold text-gray-500 uppercase">Nooca Faylka (File Type)</Label>
                      <select
                        id="type"
                        value={docType}
                        onChange={(e) => setDocType(e.target.value)}
                        className="w-full h-10 px-3 border border-gray-200 text-brand-dark font-medium rounded-xl text-sm outline-none focus:ring-2 focus:ring-brand-primary/25 focus:border-brand-primary"
                      >
                        <option value="pdf">PDF Document (.pdf)</option>
                        <option value="slides">Presentation slides (.pptx/.pdf)</option>
                        <option value="zip">Project Zip code (.zip/.rar)</option>
                        <option value="syllabus">Syllabus Curriculum (.pdf)</option>
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="url" className="text-xs font-bold text-gray-500 uppercase">File Link / URL</Label>
                      <Input
                        id="url"
                        type="url"
                        placeholder="e.g. https://somskool.com/syllabus-1.pdf"
                        value={docUrl}
                        onChange={(e) => setDocUrl(e.target.value)}
                        className="rounded-xl border-gray-200"
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full md:w-auto rounded-xl bg-brand-primary hover:bg-brand-primary-dark font-semibold text-white px-8 gap-2 shadow-lg shadow-brand-primary/10 cursor-pointer"
                  >
                    <Plus className="h-5 w-5" />
                    Geli Dukumentiga
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* List of uploaded documents */}
            <Card className="border border-border rounded-2xl shadow-sm bg-white overflow-hidden">
              <CardHeader className="border-b border-gray-100 p-6 bg-gray-50/50">
                <CardTitle className="font-display text-xl font-bold text-brand-dark">Kaydka Dukumentiyada (Uploaded Materials)</CardTitle>
                <CardDescription className="text-gray-400 font-medium">Liiska dhamaan dukumentiyada aad horey ugu soo dartay barmaamijka.</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                {documents.length === 0 ? (
                  <div className="py-12 text-center space-y-2">
                    <FileCheck className="h-11 w-11 text-gray-300 mx-auto" />
                    <p className="text-gray-400 text-sm font-semibold">Wali ma jiro wax dukumenti ah oo lagu daray.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {documents.map((d) => {
                      const matchedCourse = courses.find(c => c.id === d.course_id)
                      return (
                        <div key={d.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border border-gray-100 rounded-xl hover:shadow-sm transition-all gap-4">
                          <div className="flex items-start gap-3 text-left">
                            <div className="h-10 w-10 bg-brand-primary/10 text-brand-primary flex items-center justify-center rounded-lg flex-shrink-0">
                              <FileText className="h-5 w-5" />
                            </div>
                            <div className="space-y-0.5">
                              <h4 className="text-sm font-bold text-brand-dark">{d.title}</h4>
                              <p className="text-xs text-gray-400 font-semibold uppercase">
                                Course: {d.course_title || matchedCourse?.title || 'General'} · Type: {d.type}
                              </p>
                            </div>
                          </div>
                          
                          <a
                            href={d.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full sm:w-auto h-9 px-4 rounded-lg bg-gray-50 border border-gray-100 text-gray-600 text-xs font-bold flex items-center justify-center gap-2 hover:bg-gray-100 transition-colors"
                          >
                            <Download className="h-3.5 w-3.5" />
                            Muuqi Faylka
                          </a>
                        </div>
                      )
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* ================= TAB 3: VIDEO SETTINGS ================= */}
        {activeTab === 'video' && (
          <Card className="border border-border rounded-2xl shadow-sm bg-white overflow-hidden text-left">
            <CardHeader className="border-b border-gray-100 p-6 bg-gray-50/50">
              <CardTitle className="font-display text-xl font-bold text-brand-dark">Habaynta Kanaalka YouTube (Promotional Video settings)</CardTitle>
              <CardDescription className="text-gray-400 font-medium">Habeey muuqaalka soo jiidashada ah ee lagu soo bandhigayo homepage-ka iyo macluumaadka kanaalkaaga YouTube.</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <form onSubmit={handleVideoSubmit} className="space-y-5">
                {videoMessage && (
                  <div className={`p-4 rounded-xl flex items-start gap-2.5 text-sm font-semibold ${
                    videoMessage.type === 'success' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-red-50 text-red-500 border border-red-100'
                  }`}>
                    {videoMessage.type === 'success' ? <CheckCircle2 className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
                    <span>{videoMessage.text}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1.5 md:col-span-1">
                    <Label htmlFor="ytId" className="text-xs font-bold text-gray-500 uppercase">YouTube Video ID (11 xaraf)</Label>
                    <Input
                      id="ytId"
                      type="text"
                      placeholder="e.g. ScMzIvxBSi4"
                      value={youtubeId}
                      onChange={(e) => setYoutubeId(e.target.value)}
                      className="rounded-xl border-gray-200 font-mono font-bold"
                      required
                    />
                  </div>
                  
                  <div className="space-y-1.5 md:col-span-1">
                    <Label htmlFor="chanName" className="text-xs font-bold text-gray-500 uppercase">Magaca Kanaalka YouTube-ka</Label>
                    <Input
                      id="chanName"
                      type="text"
                      placeholder="e.g. SomSkool Academy"
                      value={channelName}
                      onChange={(e) => setChannelName(e.target.value)}
                      className="rounded-xl border-gray-200"
                      required
                    />
                  </div>

                  <div className="space-y-1.5 md:col-span-1">
                    <Label htmlFor="chanUrl" className="text-xs font-bold text-gray-500 uppercase">URL Kanaalka YouTube-ka</Label>
                    <Input
                      id="chanUrl"
                      type="url"
                      placeholder="e.g. https://youtube.com/@somskool"
                      value={channelUrl}
                      onChange={(e) => setChannelUrl(e.target.value)}
                      className="rounded-xl border-gray-200"
                    />
                  </div>
                </div>

                <div className="bg-brand-primary/[0.02] border border-brand-primary/10 rounded-xl p-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <Link2 className="h-4 w-4 text-brand-primary" />
                    <h4 className="text-xs font-bold text-brand-dark uppercase tracking-wider">Talo bixin faahfaahsan</h4>
                  </div>
                  <p className="text-[11px] text-gray-500 font-medium leading-relaxed">
                    Si aad u hesho Video ID-ga, u fur muuqaalka aad rabto YouTube-ka, ka koobiyeey 11-ka xaraf ee ku jira URL-ka kadib xariiqda <code className="bg-gray-100 px-1 py-0.5 font-mono text-brand-primary">v=</code> (e.g. <code className="bg-gray-100 px-1 py-0.5 font-mono">https://youtube.com/watch?v=ScMzIvxBSi4</code> ID-ga waa <code className="bg-gray-100 px-1 py-0.5 font-mono font-bold text-brand-dark">ScMzIvxBSi4</code>).
                  </p>
                </div>

                <Button
                  type="submit"
                  className="rounded-xl bg-brand-primary hover:bg-brand-primary-dark font-semibold text-white px-8 gap-2 shadow-lg shadow-brand-primary/10 cursor-pointer"
                >
                  <Video className="h-5 w-5" />
                  Keydi Dejinta Muuqaalka
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

      </div>
    </div>
  )
}
