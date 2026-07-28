'use client'

import React, { useState, useTransition } from 'react'
import { Course, Payment, CourseVideo } from '@/types'
import { modifyPaymentStatus, submitDocumentUpload, saveVideoSettings, addCourseVideo, deleteCourseVideo, lookupYoutubeVideo, addCourseVideosBulk, type BulkVideoResult } from '@/lib/actions/admin'
import { extractYoutubeId, youtubeThumbnail, slugifyTitle } from '@/lib/utils'
import { ImageUploadField } from '@/components/ImageUploadField'

/** Fallback course art when the admin does not pick a thumbnail. */
const DEFAULT_COURSE_ART =
  'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80'
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
  Link2,
  Users,
  UserPlus,
  PlayCircle,
  Trash2,
  LayoutTemplate,
  Eye,
  EyeOff,
  ShieldCheck,
  Key
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useLanguage } from '@/contexts/LanguageContext'

interface AdminPanelProps {
  payments: Payment[]
  documents: any[]
  courses: Course[]
  videoSettings: { youtube_id: string; channel_name: string; channel_url: string; video_title: string; video_thumbnail_url: string }
  initialStaff?: any[]
  courseVideos?: CourseVideo[]
  students?: any[]
  pageSettings?: any
  roles?: any[]
}

export default function AdminPanel({ payments: initialPayments, documents: initialDocs, courses: initialCourses, videoSettings, pageSettings, initialStaff = [], courseVideos: initialVideos = [], students: initialStudents = [], roles: initialRoles = [] }: AdminPanelProps) {
  const { t } = useLanguage()
  const [activeTab, setActiveTab] = useState<'payments' | 'docs' | 'video' | 'staff' | 'roles' | 'modules' | 'students' | 'courses' | 'pages'>('payments')
  const [payments, setPayments] = useState<Payment[]>(initialPayments)
  const [documents, setDocuments] = useState<any[]>(initialDocs)
  const [courses, setCourses] = useState<Course[]>(initialCourses)

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
  const [videoTitle, setVideoTitle] = useState(videoSettings.video_title || '')
  const [videoThumbnail, setVideoThumbnail] = useState(videoSettings.video_thumbnail_url || '')
  const [videoMessage, setVideoMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  // Tab 4: Staff states
  const [staffList, setStaffList] = useState<any[]>(initialStaff)
  const [rolesList, setRolesList] = useState<any[]>(initialRoles)
  const [staffName, setStaffName] = useState('')
  const [staffEmail, setStaffEmail] = useState('')
  const [staffPassword, setStaffPassword] = useState('')
  const [staffRole, setStaffRole] = useState(initialRoles.length > 0 ? initialRoles[0].name : 'teacher')
  const [staffMessage, setStaffMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  const [regeneratedPassword, setRegeneratedPassword] = useState<string | null>(null)
  
  // Tab 9: Role Management states
  const [roleName, setRoleName] = useState('')
  const [roleMessage, setRoleMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  // Tab 5: Course Modules states
  const [videoList, setVideoList] = useState<CourseVideo[]>(initialVideos)
  const [moduleCourse, setModuleCourse] = useState(initialCourses[0]?.id || '')
  const [moduleTitle, setModuleTitle] = useState('')
  const [moduleYoutubeId, setModuleYoutubeId] = useState('')
  // Live preview for the pasted YouTube link
  const [modulePreview, setModulePreview] = useState<{ videoId: string; title?: string; author?: string; error?: string } | null>(null)
  const [previewLoading, setPreviewLoading] = useState(false)
  // Bulk paste
  const [moduleMode, setModuleMode] = useState<'single' | 'bulk'>('single')
  const [bulkUrls, setBulkUrls] = useState('')
  const [bulkResults, setBulkResults] = useState<BulkVideoResult[] | null>(null)
  const [bulkLoading, setBulkLoading] = useState(false)
  const [modulePoints, setModulePoints] = useState(10)
  const [moduleMessage, setModuleMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  const [previewVideoId, setPreviewVideoId] = useState<string | null>(null)

  // Tab 6: Students
  const [students, setStudents] = useState<any[]>(initialStudents)
  const [editingStudentId, setEditingStudentId] = useState<string | null>(null)
  const [editingPoints, setEditingPoints] = useState<number>(0)

  // Tab 7: Course Management
  const [courseTitle, setCourseTitle] = useState('')
  const [courseSlug, setCourseSlug] = useState('')
  const [courseSlugTouched, setCourseSlugTouched] = useState(false)
  const [coursePrice, setCoursePrice] = useState(0)
  const [courseDescription, setCourseDescription] = useState('')
  const [courseLevel, setCourseLevel] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Beginner')
  const [courseDuration, setCourseDuration] = useState(60)
  const [courseThumbnail, setCourseThumbnail] = useState('')
  const [courseMessage, setCourseMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  // Tab 8: Pages Management
  const [aboutTitle, setAboutTitle] = useState(pageSettings?.about_title || '')
  const [aboutSubtitle, setAboutSubtitle] = useState(pageSettings?.about_subtitle || '')
  const [aboutText, setAboutText] = useState(pageSettings?.about_text || '')
  const [aboutImage, setAboutImage] = useState(pageSettings?.about_header_image || '')
  
  const [contactTitle, setContactTitle] = useState(pageSettings?.contact_title || '')
  const [contactSubtitle, setContactSubtitle] = useState(pageSettings?.contact_subtitle || '')
  const [contactText, setContactText] = useState(pageSettings?.contact_text || '')
  const [contactPhone, setContactPhone] = useState(pageSettings?.contact_phone || '')
  const [contactImage, setContactImage] = useState(pageSettings?.contact_header_image || '')
  const [contactEmail, setContactEmail] = useState(pageSettings?.contact_email || '')
  const [contactAddress, setContactAddress] = useState(pageSettings?.contact_address || '')
  
  const [socialFacebook, setSocialFacebook] = useState(pageSettings?.social_facebook || '')
  const [socialInstagram, setSocialInstagram] = useState(pageSettings?.social_instagram || '')
  const [socialLinkedin, setSocialLinkedin] = useState(pageSettings?.social_linkedin || '')
  const [socialYoutube, setSocialYoutube] = useState(pageSettings?.social_youtube || '')

  const [pageMessage, setPageMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  const [isPending, startTransition] = useTransition()

  // Tab 1 Actions: Approve / Reject Payments
  const handlePaymentAction = async (paymentId: string, status: 'confirmed' | 'failed') => {
    let rejectReason: string | undefined = undefined;
    if (status === 'failed') {
      const reason = window.prompt("Please enter the reason for rejecting this payment (e.g. 'Payment was not received'):");
      if (reason === null) return; // User cancelled the prompt
      rejectReason = reason.trim();
    }
    
    startTransition(async () => {
      const res = await modifyPaymentStatus(paymentId, status, rejectReason)
      if (res.success) {
        setPayments(prev => prev.map(p => p.id === paymentId ? { ...p, status, reject_reason: rejectReason } : p))
      } else {
        alert(res.error || 'Khalad ayaa ka dhacay ansixinta.')
      }
    })
  }

  // Tab 2 Action: Document Upload
  const handleDocSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setDocMessage(null)

    if (!docTitle || !docUrl) {
      setDocMessage({ type: 'error', text: 'Please enter the document name and its URL.' })
      return
    }

    let finalUrl = docUrl.trim();
    if (!finalUrl.startsWith('http://') && !finalUrl.startsWith('https://')) {
      finalUrl = 'https://' + finalUrl;
    }

    startTransition(async () => {
      const res = await submitDocumentUpload({
        title: docTitle,
        courseId: docCourse,
        type: docType,
        url: finalUrl
      })

      if (res.success) {
        setDocMessage({ type: 'success', text: 'Document uploaded successfully!' })
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
        setDocMessage({ type: 'error', text: res.error || 'Something went wrong. Please try again.' })
      }
    })
  }

  // Tab 3 Action: Video Settings
  const handleVideoSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setVideoMessage(null)

    if (!youtubeId || !channelName) {
      setVideoMessage({ type: 'error', text: 'YouTube video ID and channel name are required.' })
      return
    }

    startTransition(async () => {
      const res = await saveVideoSettings({
        youtube_id: youtubeId,
        channel_name: channelName,
        channel_url: channelUrl || 'https://youtube.com',
        video_title: videoTitle,
        video_thumbnail_url: videoThumbnail,
      })

      if (res.success) {
        setVideoMessage({ type: 'success', text: 'YouTube channel settings saved successfully!' })
      } else {
        setVideoMessage({ type: 'error', text: res.error || 'Something went wrong. Please try again.' })
      }
    })
  }

  // Tab 4 Action: Create Staff
  const handleStaffSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStaffMessage(null)

    if (!staffName || !staffEmail || !staffPassword) {
      setStaffMessage({ type: 'error', text: 'Please fill in all teacher/admin details.' })
      return
    }

    startTransition(async () => {
      const { createStaffAccount } = await import('@/lib/actions/admin')
      const res = await createStaffAccount({
        full_name: staffName,
        email: staffEmail,
        password: staffPassword,
        role: staffRole
      })

      if (res.success) {
        setStaffMessage({ type: 'success', text: `New account created successfully!` })
        setStaffList(prev => [
          {
            id: 'temp-' + Math.random(),
            full_name: staffName,
            email: staffEmail,
            role: staffRole,
            created_at: new Date().toISOString()
          },
          ...prev
        ])
        setStaffName('')
        setStaffEmail('')
        setStaffPassword('')
      } else {
        setStaffMessage({ type: 'error', text: res.error || 'Something went wrong. Please try again.' })
      }
    })
  }

  // Tab 4 Action: Regenerate Password
  const handleRegeneratePassword = async (userId: string, userName: string) => {
    if (!confirm(`Are you sure you want to reset the password for: ${userName}?`)) return
    
    startTransition(async () => {
      const { regenerateStaffPassword } = await import('@/lib/actions/admin')
      const res = await regenerateStaffPassword(userId)
      
      if (res.success && res.newPassword) {
        setRegeneratedPassword(`The new password for ${userName} is:\n\n${res.newPassword}\n\nPlease copy and share it.`);
      } else {
        alert(res.error || 'Something went wrong. Please try again.')
      }
    })
  }

  // Tab 9 Action: Manage Roles
  const handleRoleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setRoleMessage(null)

    if (!roleName.trim()) {
      setRoleMessage({ type: 'error', text: 'Please enter the role name.' })
      return
    }

    startTransition(async () => {
      const { createRole } = await import('@/lib/actions/admin')
      const res = await createRole(roleName.trim().toLowerCase())

      if (res.success) {
        setRoleMessage({ type: 'success', text: `New role registered!` })
        setRolesList(prev => [...prev, { id: 'temp-' + Math.random(), name: roleName.trim().toLowerCase(), created_at: new Date().toISOString() }])
        setRoleName('')
      } else {
        setRoleMessage({ type: 'error', text: res.error || 'Something went wrong. Please try again.' })
      }
    })
  }

  const handleRoleDelete = async (roleId: string, roleN: string) => {
    if (!confirm(`Are you sure you want to delete the role "${roleN}"?`)) return
    
    startTransition(async () => {
      const { deleteRole } = await import('@/lib/actions/admin')
      const res = await deleteRole(roleId)

      if (res.success) {
        setRolesList(prev => prev.filter(r => r.id !== roleId))
      } else {
        alert(res.error || 'Something went wrong. Please try again.')
      }
    })
  }

  // Verify a pasted YouTube link and pull its real title so the admin doesn't
  // have to retype it. Runs on blur/paste rather than every keystroke.
  const handleYoutubeLookup = async (value: string) => {
    const trimmed = value.trim()
    if (!trimmed) {
      setModulePreview(null)
      return
    }

    const videoId = extractYoutubeId(trimmed)
    if (!videoId) {
      setModulePreview({ videoId: '', error: 'That is not a valid YouTube link or video ID.' })
      return
    }

    setPreviewLoading(true)
    const res = await lookupYoutubeVideo(trimmed)
    setPreviewLoading(false)

    if ('error' in res && !('videoId' in res)) {
      setModulePreview({ videoId, error: res.error })
      return
    }

    setModulePreview({
      videoId,
      title: 'title' in res ? res.title : undefined,
      author: 'author' in res ? res.author : undefined,
      error: 'error' in res ? res.error : undefined,
    })

    // Auto-fill an empty title with the real video title
    if ('title' in res && res.title && !moduleTitle.trim()) {
      setModuleTitle(res.title)
    }
  }

  // Tab 5 Action: Add many lessons from pasted links
  const handleBulkSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setModuleMessage(null)
    setBulkResults(null)

    const urls = bulkUrls.split('\n').map(l => l.trim()).filter(Boolean)
    if (urls.length === 0) {
      setModuleMessage({ type: 'error', text: 'Paste at least one YouTube link.' })
      return
    }

    setBulkLoading(true)
    const res = await addCourseVideosBulk({
      course_id: moduleCourse,
      urls,
      points_awarded: modulePoints,
    })
    setBulkLoading(false)

    if (res.error) {
      setModuleMessage({ type: 'error', text: res.error })
      return
    }

    setBulkResults(res.results)
    const skipped = res.results.length - res.addedCount
    setModuleMessage({
      type: res.addedCount > 0 ? 'success' : 'error',
      text: `${res.addedCount} lesson${res.addedCount === 1 ? '' : 's'} added${skipped > 0 ? `, ${skipped} skipped` : ''}.`,
    })

    if (res.addedCount > 0) {
      setBulkUrls('')
      setVideoList(prev => [
        ...prev,
        ...res.results
          .filter(r => r.status === 'added')
          .map((r, i) => ({
            id: 'temp-' + Math.random(),
            course_id: moduleCourse,
            title: r.title || 'Lesson',
            youtube_id: r.videoId!,
            points_awarded: modulePoints,
            order_index: prev.filter(v => v.course_id === moduleCourse).length + i + 1,
            created_at: new Date().toISOString(),
          })) as any,
      ])
    }
  }

  // Tab 5 Action: Create Module
  const handleModuleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setModuleMessage(null)

    if (!moduleTitle || !moduleYoutubeId) {
      setModuleMessage({ type: 'error', text: 'Please fill in all module details.' })
      return
    }

    startTransition(async () => {
      const cleanedId = extractYoutubeId(moduleYoutubeId)
      const res = await addCourseVideo({
        course_id: moduleCourse,
        title: moduleTitle,
        youtube_id: cleanedId,
        points_awarded: modulePoints,
        order_index: videoList.filter(v => v.course_id === moduleCourse).length + 1
      })

      if (res.success) {
        setModuleMessage({ type: 'success', text: `New module registered!` })
        setVideoList(prev => [...prev, {
          id: 'temp-' + Math.random(),
          course_id: moduleCourse,
          title: moduleTitle,
          youtube_id: res.finalYoutubeId || cleanedId,
          points_awarded: modulePoints,
          order_index: videoList.filter(v => v.course_id === moduleCourse).length + 1,
          created_at: new Date().toISOString()
        }])
        setModuleTitle('')
        setModuleYoutubeId('')
      } else {
        setModuleMessage({ type: 'error', text: res.error || 'Something went wrong. Please try again.' })
      }
    })
  }

  const handleModuleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this video?')) return
    startTransition(async () => {
      const res = await deleteCourseVideo(id)
      if (res.success) {
        setVideoList(prev => prev.filter(v => v.id !== id))
      } else {
        alert(res.error || 'Something went wrong. Please try again.')
      }
    })
  }

  // Tab 6 Action: Update Student Points
  const handleUpdatePoints = async (id: string) => {
    startTransition(async () => {
      const { updateStudentPoints } = await import('@/lib/actions/users')
      const res = await updateStudentPoints(id, editingPoints)
      if (res.success) {
        setStudents(prev => prev.map(s => s.id === id ? { ...s, points: editingPoints } : s))
        setEditingStudentId(null)
      } else {
        alert(res.error || 'Something went wrong. Please try again.')
      }
    })
  }

  // Tab 7 Action: Create Course
  const handleCourseSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setCourseMessage(null)

    if (!courseTitle.trim()) {
      setCourseMessage({ type: 'error', text: 'Please enter a course title.' })
      return
    }

    // The slug is auto-filled from the title unless the admin typed their own.
    const finalSlug = courseSlug.trim() || slugifyTitle(courseTitle)
    const finalThumbnail = courseThumbnail.trim() || DEFAULT_COURSE_ART

    startTransition(async () => {
      const { createCourse } = await import('@/lib/actions/admin')
      const res = await createCourse({
        title: courseTitle.trim(),
        slug: finalSlug,
        price: coursePrice,
        description: courseDescription,
        level: courseLevel,
        duration_minutes: courseDuration,
        thumbnail_url: finalThumbnail,
      })

      if (res.success) {
        setCourseMessage({ type: 'success', text: 'Course created successfully!' })
        // Optimistic UI update
        setCourses(prev => [...prev, {
          id: 'temp-' + Math.random(),
          title: courseTitle.trim(),
          slug: finalSlug,
          description: courseDescription,
          price: coursePrice,
          is_free: coursePrice === 0,
          thumbnail_url: finalThumbnail,
          level: courseLevel,
          duration_minutes: courseDuration,
          instructor_name: 'Admin',
          instructor_avatar: '',
          rating: 0,
          total_students: 0,
          is_published: true,
          created_at: new Date().toISOString()
        } as Course])
        setCourseTitle('')
        setCourseSlug('')
        setCourseSlugTouched(false)
        setCoursePrice(0)
        setCourseDescription('')
        setCourseLevel('Beginner')
        setCourseDuration(60)
        setCourseThumbnail('')
      } else {
        setCourseMessage({ type: 'error', text: res.error || 'Something went wrong. Please try again.' })
      }
    })
  }

  const handleCourseDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this course?')) return
    startTransition(async () => {
      const { deleteCourse } = await import('@/lib/actions/admin')
      const res = await deleteCourse(id)
      if (res.success) {
        setCourses(prev => prev.filter(c => c.id !== id))
      } else {
        alert(res.error || 'Something went wrong. Please try again.')
      }
    })
  }

  const handleCourseTogglePublish = async (id: string, currentStatus: boolean) => {
    startTransition(async () => {
      const { toggleCoursePublish } = await import('@/lib/actions/admin')
      const res = await toggleCoursePublish(id, !currentStatus)
      if (res.success) {
        setCourses(prev => prev.map(c => c.id === id ? { ...c, is_published: !currentStatus } : c))
      } else {
        alert(res.error || 'Something went wrong. Please try again.')
      }
    })
  }


  // Tab 8 Action: Save Pages
  const handlePageSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setPageMessage(null)
    startTransition(async () => {
      const { savePageSettings } = await import('@/lib/actions/admin')
      const res = await savePageSettings({
        about_title: aboutTitle,
        about_subtitle: aboutSubtitle,
        about_text: aboutText,
        about_header_image: aboutImage,
        contact_title: contactTitle,
        contact_subtitle: contactSubtitle,
        contact_text: contactText,
        contact_phone: contactPhone,
        contact_header_image: contactImage,
        contact_email: contactEmail,
        contact_address: contactAddress,
        social_facebook: socialFacebook,
        social_instagram: socialInstagram,
        social_linkedin: socialLinkedin,
        social_youtube: socialYoutube
      })

      if (res.success) {
        setPageMessage({ type: 'success', text: 'Page content saved successfully!' })
      } else {
        setPageMessage({ type: 'error', text: res.error || 'Something went wrong. Please try again.' })
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
          <span>Payments</span>
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
          <span>Documents</span>
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
          <span>Promotional Video</span>
        </button>

        <button
          onClick={() => setActiveTab('modules')}
          className={`flex items-center gap-3 px-5 py-4 rounded-xl text-sm font-semibold transition-all text-left ${
            activeTab === 'modules'
              ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/15'
              : 'bg-white hover:bg-gray-50 border border-border text-brand-dark'
          }`}
        >
          <PlayCircle className="h-5 w-5" />
          <span>Course Modules</span>
        </button>

        <button
          onClick={() => setActiveTab('staff')}
          className={`flex items-center gap-3 px-5 py-4 rounded-xl text-sm font-semibold transition-all text-left ${
            activeTab === 'staff'
              ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/15'
              : 'bg-white hover:bg-gray-50 border border-border text-brand-dark'
          }`}
        >
          <Users className="h-5 w-5" />
          <span>Staff</span>
        </button>

        <button
          onClick={() => setActiveTab('roles')}
          className={`flex items-center gap-3 px-5 py-4 rounded-xl text-sm font-semibold transition-all text-left ${
            activeTab === 'roles'
              ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/15'
              : 'bg-white hover:bg-gray-50 border border-border text-brand-dark'
          }`}
        >
          <ShieldCheck className="h-5 w-5" />
          <span>Roles Management</span>
        </button>

        <button
          onClick={() => setActiveTab('students')}
          className={`flex items-center gap-3 px-5 py-4 rounded-xl text-sm font-semibold transition-all text-left ${
            activeTab === 'students'
              ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/15'
              : 'bg-white hover:bg-gray-50 border border-border text-brand-dark'
          }`}
        >
          <Users className="h-5 w-5" />
          <span>Students</span>
        </button>

        <button
          onClick={() => setActiveTab('courses')}
          className={`flex items-center gap-3 px-5 py-4 rounded-xl text-sm font-semibold transition-all text-left ${
            activeTab === 'courses'
              ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/15'
              : 'bg-white hover:bg-gray-50 border border-border text-brand-dark'
          }`}
        >
          <FileCheck className="h-5 w-5" />
          <span>Courses</span>
        </button>

        <button
          onClick={() => setActiveTab('pages')}
          className={`flex items-center gap-3 px-5 py-4 rounded-xl text-sm font-semibold transition-all text-left ${
            activeTab === 'pages'
              ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/15'
              : 'bg-white hover:bg-gray-50 border border-border text-brand-dark'
          }`}
        >
          <LayoutTemplate className="h-5 w-5" />
          <span>About & Contact</span>
        </button>
      </div>

      {/* Main Console Content (9 columns) */}
      <div className="lg:col-span-9">
        {isPending && (
          <div className="fixed top-4 right-4 bg-brand-primary text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 text-xs font-bold z-50">
            <Loader2 className="h-4 w-4 animate-spin" />
            Saving…
          </div>
        )}

        {/* ================= TAB 1: PAYMENTS ================= */}
        {activeTab === 'payments' && (
          <Card className="border border-border rounded-2xl shadow-sm bg-white overflow-hidden text-left">
            <CardHeader className="border-b border-gray-100 p-6 bg-gray-50/50">
              <CardTitle className="font-display text-xl font-bold text-brand-dark">Payments</CardTitle>
              <CardDescription className="text-gray-400 font-medium">Manage payment receipts here and grant course access to approved students.</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              {payments.length === 0 ? (
                <div className="py-16 text-center space-y-3">
                  <CreditCard className="h-12 w-12 text-gray-300 mx-auto" />
                  <p className="text-gray-400 text-sm font-semibold">No payment submissions received yet.</p>
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
                                {matchedCourse?.title || 'SomSkool Course'}
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
                                  <XCircle className="h-3 w-3" /> Rejected
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
                                <span className="text-xs text-gray-400 font-bold">Confirmed</span>
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
                <CardTitle className="font-display text-xl font-bold text-brand-dark">Upload New Document (Upload Resource)</CardTitle>
                <CardDescription className="text-gray-400 font-medium">Add supporting materials to lessons, such as a PDF syllabus or course slides.</CardDescription>
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
                      <Label htmlFor="title" className="text-xs font-bold text-gray-500 uppercase">Document Name</Label>
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
                      <Label htmlFor="course" className="text-xs font-bold text-gray-500 uppercase">Select Course</Label>
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
                      <Label htmlFor="type" className="text-xs font-bold text-gray-500 uppercase">File Type</Label>
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
                        required
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full md:w-auto rounded-xl bg-brand-primary hover:bg-brand-primary-dark font-semibold text-white px-8 gap-2 shadow-lg shadow-brand-primary/10 cursor-pointer"
                  >
                    <Plus className="h-5 w-5" />
                    Upload Document
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* List of uploaded documents */}
            <Card className="border border-border rounded-2xl shadow-sm bg-white overflow-hidden">
              <CardHeader className="border-b border-gray-100 p-6 bg-gray-50/50">
                <CardTitle className="font-display text-xl font-bold text-brand-dark">Uploaded Materials</CardTitle>
                <CardDescription className="text-gray-400 font-medium">A list of all documents you have added to the platform.</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                {documents.length === 0 ? (
                  <div className="py-12 text-center space-y-2">
                    <FileCheck className="h-11 w-11 text-gray-300 mx-auto" />
                    <p className="text-gray-400 text-sm font-semibold">No documents have been added yet.</p>
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
              <CardTitle className="font-display text-xl font-bold text-brand-dark">Promotional Video (YouTube Channel Settings)</CardTitle>
              <CardDescription className="text-gray-400 font-medium">Set the promotional video shown on the homepage, plus your YouTube channel details.</CardDescription>
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
                    <Label htmlFor="ytId" className="text-xs font-bold text-gray-500 uppercase">YouTube Link or Video ID</Label>
                    <Input
                      id="ytId"
                      type="text"
                      placeholder="Paste the full YouTube link"
                      value={youtubeId}
                      onChange={(e) => setYoutubeId(e.target.value)}
                      className="rounded-xl border-gray-200 font-mono text-sm"
                      required
                    />
                    {youtubeId && (
                      extractYoutubeId(youtubeId)
                        ? <p className="text-[11px] font-semibold text-emerald-600">Video ID detected: {extractYoutubeId(youtubeId)}</p>
                        : <p className="text-[11px] font-semibold text-red-500">No YouTube video ID found in that text.</p>
                    )}
                  </div>
                  
                  <div className="space-y-1.5 md:col-span-1">
                    <Label htmlFor="chanName" className="text-xs font-bold text-gray-500 uppercase">YouTube Channel Name</Label>
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
                    <Label htmlFor="chanUrl" className="text-xs font-bold text-gray-500 uppercase">YouTube Channel URL</Label>
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

                <div className="space-y-1.5">
                  <Label htmlFor="videoTitle" className="text-xs font-bold text-gray-500 uppercase">Video Title / Caption</Label>
                  <Input
                    id="videoTitle"
                    type="text"
                    placeholder="e.g. Welcome to SomSkool Academy"
                    value={videoTitle}
                    onChange={(e) => setVideoTitle(e.target.value)}
                    className="rounded-xl border-gray-200"
                  />
                </div>

                <ImageUploadField
                  label="Custom Thumbnail"
                  value={videoThumbnail}
                  onChange={setVideoThumbnail}
                  folder="promo"
                  hint="Optional — leave empty to use the video's own YouTube thumbnail."
                />

                <div className="bg-brand-primary/[0.02] border border-brand-primary/10 rounded-xl p-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <Link2 className="h-4 w-4 text-brand-primary" />
                    <h4 className="text-xs font-bold text-brand-dark uppercase tracking-wider">Tip</h4>
                  </div>
                  <p className="text-[11px] text-gray-500 font-medium leading-relaxed">
                    Just paste the whole YouTube link — for example <code className="bg-gray-100 px-1 py-0.5 font-mono">https://youtube.com/watch?v=ScMzIvxBSi4</code> — and the video ID is picked out for you. Share links, <code className="bg-gray-100 px-1 py-0.5 font-mono">youtu.be</code> links and Shorts links all work.
                  </p>
                </div>

                <Button
                  type="submit"
                  disabled={isPending}
                  className="rounded-xl bg-brand-primary hover:bg-brand-primary-dark font-semibold text-white px-8 gap-2 shadow-lg shadow-brand-primary/10 cursor-pointer"
                >
                  <Video className="h-5 w-5" />
                  Save Video Settings
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {/* ================= TAB 4: STAFF MANAGEMENT ================= */}
        {activeTab === 'staff' && (
          <div className="space-y-8 text-left">
            <Card className="border border-border rounded-2xl shadow-sm bg-white overflow-hidden">
              <CardHeader className="border-b border-gray-100 p-6 bg-gray-50/50">
                <CardTitle className="font-display text-xl font-bold text-brand-dark">Create New Account (Add Staff)</CardTitle>
                <CardDescription className="text-gray-400 font-medium">Create passwords for new teachers and admins so they can sign in directly.</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <form onSubmit={handleStaffSubmit} className="space-y-5">
                  {staffMessage && (
                    <div className={`p-4 rounded-xl flex items-start gap-2.5 text-sm font-semibold ${
                      staffMessage.type === 'success' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-red-50 text-red-500 border border-red-100'
                    }`}>
                      {staffMessage.type === 'success' ? <CheckCircle2 className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
                      <span>{staffMessage.text}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="staffName" className="text-xs font-bold text-gray-500 uppercase">Full Name</Label>
                      <Input
                        id="staffName"
                        type="text"
                        placeholder="e.g. Hassan Ahmed"
                        value={staffName}
                        onChange={(e) => setStaffName(e.target.value)}
                        className="rounded-xl border-gray-200"
                        required
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="staffEmail" className="text-xs font-bold text-gray-500 uppercase">Email (G-Mail)</Label>
                      <Input
                        id="staffEmail"
                        type="email"
                        placeholder="e.g. xasan@somskool.com"
                        value={staffEmail}
                        onChange={(e) => setStaffEmail(e.target.value)}
                        className="rounded-xl border-gray-200"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="staffPassword" className="text-xs font-bold text-gray-500 uppercase">New Password</Label>
                      <Input
                        id="staffPassword"
                        type="password"
                        placeholder="Enter a secure password"
                        value={staffPassword}
                        onChange={(e) => setStaffPassword(e.target.value)}
                        className="rounded-xl border-gray-200"
                        required
                        minLength={6}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="staffRole" className="text-xs font-bold text-gray-500 uppercase">Nooca Shaqada (Role)</Label>
                      <select
                        id="staffRole"
                        value={staffRole}
                        onChange={(e) => setStaffRole(e.target.value)}
                        className="w-full h-10 px-3 border border-gray-200 text-brand-dark font-medium rounded-xl text-sm outline-none focus:ring-2 focus:ring-brand-primary/25 focus:border-brand-primary"
                      >
                        {rolesList.length === 0 ? (
                          <option value="teacher">Teacher</option>
                        ) : (
                          rolesList.map(r => (
                            <option key={r.id} value={r.name}>{r.name.toUpperCase()}</option>
                          ))
                        )}
                      </select>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full md:w-auto rounded-xl bg-brand-primary hover:bg-brand-primary-dark font-semibold text-white px-8 gap-2 shadow-lg shadow-brand-primary/10 cursor-pointer"
                  >
                    <UserPlus className="h-5 w-5" />
                    Create Account
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card className="border border-border rounded-2xl shadow-sm bg-white overflow-hidden">
              <CardHeader className="border-b border-gray-100 p-6 bg-gray-50/50">
                <CardTitle className="font-display text-xl font-bold text-brand-dark">Staff List</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {regeneratedPassword && (
                  <div className="mb-6 bg-emerald-50 border border-emerald-200 p-4 rounded-xl flex items-start gap-3 shadow-sm">
                    <CheckCircle2 className="h-5 w-5 text-emerald-600 mt-0.5 shrink-0" />
                    <div>
                      <h4 className="text-sm font-bold text-emerald-900">Password has been reset</h4>
                      <pre className="mt-2 bg-white/60 p-3 rounded-lg text-sm text-emerald-800 font-mono font-bold whitespace-pre-wrap">{regeneratedPassword}</pre>
                    </div>
                  </div>
                )}
                {staffList.length === 0 ? (
                  <div className="py-12 text-center space-y-2">
                    <Users className="h-11 w-11 text-gray-300 mx-auto" />
                    <p className="text-gray-400 text-sm font-semibold">No staff members registered yet.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                      <thead>
                        <tr className="border-b border-gray-100 text-gray-500 text-xs font-bold uppercase tracking-wider">
                          <th className="py-3.5 px-3">Name</th>
                          <th className="py-3.5 px-3">Email</th>
                          <th className="py-3.5 px-3">Nooca</th>
                          <th className="py-3.5 px-3 text-right">Date</th>
                          <th className="py-3.5 px-3 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50 font-medium">
                        {staffList.map((s) => (
                          <tr key={s.id} className="hover:bg-gray-50/50 transition-colors">
                            <td className="py-4 px-3 font-extrabold text-brand-dark">
                              {s.full_name}
                            </td>
                            <td className="py-4 px-3 text-gray-500">
                              {s.email || 'Email missing'}
                            </td>
                            <td className="py-4 px-3">
                              <span className={`px-3 py-1 rounded-full text-xs font-extrabold border inline-block ${
                                s.role === 'admin' ? 'bg-purple-50 text-purple-600 border-purple-100' : 'bg-blue-50 text-blue-600 border-blue-100'
                              }`}>
                                {s.role.toUpperCase()}
                              </span>
                            </td>
                            <td className="py-4 px-3 text-right text-gray-400 text-xs">
                              {new Date(s.created_at).toLocaleDateString()}
                            </td>
                            <td className="py-4 px-3 text-right">
                              <button
                                onClick={() => handleRegeneratePassword(s.id, s.full_name)}
                                className="inline-flex items-center gap-1 px-3 py-1.5 bg-brand-primary/10 hover:bg-brand-primary/20 text-brand-primary rounded-lg text-xs font-bold transition-colors"
                              >
                                <Key className="h-3.5 w-3.5" />
                                Reset
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* ================= TAB 5: COURSE MODULES ================= */}
        {activeTab === 'modules' && (
          <div className="space-y-8 text-left">
            <Card className="border border-border rounded-2xl shadow-sm bg-white overflow-hidden">
              <CardHeader className="border-b border-gray-100 p-6 bg-gray-50/50">
                <CardTitle className="font-display text-xl font-bold text-brand-dark">Add New Video (Add Course Module)</CardTitle>
                <CardDescription className="text-gray-400 font-medium">Add video lessons (YouTube URLs) to specific courses and let students track their progress.</CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-5">

                {/* ── Unlisted vs Private guidance (English + Somali) ── */}
                <div className="rounded-xl border border-amber-200 bg-amber-50/60 p-4 space-y-3">
                  <div className="flex items-start gap-2.5">
                    <AlertCircle className="h-4.5 w-4.5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div className="space-y-3 text-xs leading-relaxed">
                      <div>
                        <p className="font-bold text-amber-900">
                          Use “Unlisted” videos — “Private” videos will NOT play here.
                        </p>
                        <p className="text-amber-800 mt-1">
                          A <strong>Private</strong> video can only be watched by Google accounts you
                          invite, and YouTube blocks it from being embedded — students will just see
                          “Video unavailable”. An <strong>Unlisted</strong> video is hidden from
                          search and from your channel page, but it still plays inside SomSkool.
                        </p>
                        <p className="text-amber-800 mt-1.5">
                          To change it: YouTube Studio → <em>Content</em> → click the video →
                          <em> Visibility</em> → choose <strong>Unlisted</strong> → <em>Save</em>.
                        </p>
                      </div>

                      <div className="border-t border-amber-200 pt-2.5">
                        <p className="font-bold text-amber-900">
                          Isticmaal muuqaallo “Unlisted” ah — kuwa “Private” halkan kama shaqeeyaan.
                        </p>
                        <p className="text-amber-800 mt-1">
                          Muuqaal <strong>Private</strong> ah waxaa daawan kara oo keliya akoonnada
                          Google ee aad casuunto, YouTube-na wuu diidayaa in la soo dhex geliyo —
                          ardaydu waxay arki doonaan “Video unavailable”. Muuqaal{' '}
                          <strong>Unlisted</strong> ah kama muuqdo raadinta iyo boggaaga kanaalka,
                          laakiin wuu ka shaqeeyaa SomSkool.
                        </p>
                        <p className="text-amber-800 mt-1.5">
                          Sida loo beddelo: YouTube Studio → <em>Content</em> → guji muuqaalka →
                          <em> Visibility</em> → dooro <strong>Unlisted</strong> → <em>Save</em>.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Mode switch */}
                <div className="inline-flex rounded-xl border border-gray-200 bg-gray-50 p-1">
                  {([
                    { id: 'single', label: 'Add one lesson' },
                    { id: 'bulk', label: 'Paste many links' },
                  ] as const).map(m => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => { setModuleMode(m.id); setModuleMessage(null); setBulkResults(null) }}
                      className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        moduleMode === m.id ? 'bg-white text-brand-primary shadow-sm' : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>

                {moduleMessage && (
                  <div className={`p-4 rounded-xl flex items-start gap-2.5 text-sm font-semibold ${
                    moduleMessage.type === 'success' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-red-50 text-red-500 border border-red-100'
                  }`}>
                    {moduleMessage.type === 'success' ? <CheckCircle2 className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
                    <span>{moduleMessage.text}</span>
                  </div>
                )}

                {moduleMode === 'bulk' ? (
                  <form onSubmit={handleBulkSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label htmlFor="bulkCourse" className="text-xs font-bold text-gray-500 uppercase">Select Course</Label>
                        <select
                          id="bulkCourse"
                          value={moduleCourse}
                          onChange={(e) => setModuleCourse(e.target.value)}
                          className="w-full h-10 px-3 border border-gray-200 text-brand-dark font-medium rounded-xl text-sm outline-none focus:ring-2 focus:ring-brand-primary/25 focus:border-brand-primary"
                        >
                          {courses.map(c => (
                            <option key={c.id} value={c.id}>{c.title}</option>
                          ))}
                        </select>
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="bulkPoints" className="text-xs font-bold text-gray-500 uppercase">Points per lesson</Label>
                        <Input
                          id="bulkPoints"
                          type="number"
                          min="0"
                          value={modulePoints}
                          onChange={(e) => setModulePoints(parseInt(e.target.value) || 0)}
                          className="rounded-xl border-gray-200"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="bulkUrls" className="text-xs font-bold text-gray-500 uppercase">
                        YouTube links — one per line
                      </Label>
                      <textarea
                        id="bulkUrls"
                        rows={7}
                        value={bulkUrls}
                        onChange={(e) => setBulkUrls(e.target.value)}
                        placeholder={'https://youtu.be/xxxxxxxxxxx\nhttps://www.youtube.com/watch?v=yyyyyyyyyyy\nhttps://www.youtube.com/shorts/zzzzzzzzzzz'}
                        className="w-full rounded-xl border border-gray-200 p-3 font-mono text-xs text-brand-dark outline-none focus:ring-2 focus:ring-brand-primary/25 focus:border-brand-primary resize-y"
                      />
                      <p className="text-[11px] font-medium text-gray-400">
                        Each lesson is titled automatically from YouTube. Duplicates and private videos are skipped.
                      </p>
                    </div>

                    {bulkResults && bulkResults.length > 0 && (
                      <div className="rounded-xl border border-gray-200 divide-y divide-gray-100 overflow-hidden">
                        {bulkResults.map((r, i) => (
                          <div key={i} className="flex items-center gap-3 p-2.5 text-xs">
                            <span className={`px-2 py-0.5 rounded font-bold shrink-0 ${
                              r.status === 'added' ? 'bg-emerald-50 text-emerald-600'
                                : r.status === 'duplicate' ? 'bg-gray-100 text-gray-500'
                                : 'bg-amber-50 text-amber-700'
                            }`}>
                              {r.status}
                            </span>
                            <span className="font-semibold text-brand-dark truncate flex-1">
                              {r.title || r.input}
                            </span>
                            {r.message && <span className="text-gray-400 truncate hidden sm:block">{r.message}</span>}
                          </div>
                        ))}
                      </div>
                    )}

                    <Button
                      type="submit"
                      disabled={bulkLoading}
                      className="w-full md:w-auto rounded-xl bg-brand-primary hover:bg-brand-primary-dark font-semibold text-white px-8 gap-2 shadow-lg shadow-brand-primary/10 cursor-pointer"
                    >
                      {bulkLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Plus className="h-5 w-5" />}
                      Add All Lessons
                    </Button>
                  </form>
                ) : (
                <form onSubmit={handleModuleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="moduleCourse" className="text-xs font-bold text-gray-500 uppercase">Select Course</Label>
                      <select
                        id="moduleCourse"
                        value={moduleCourse}
                        onChange={(e) => setModuleCourse(e.target.value)}
                        className="w-full h-10 px-3 border border-gray-200 text-brand-dark font-medium rounded-xl text-sm outline-none focus:ring-2 focus:ring-brand-primary/25 focus:border-brand-primary"
                      >
                        {courses.map(c => (
                          <option key={c.id} value={c.id}>{c.title}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="moduleTitle" className="text-xs font-bold text-gray-500 uppercase">Lesson Title</Label>
                      <Input
                        id="moduleTitle"
                        type="text"
                        placeholder="e.g. Introduction to Next.js"
                        value={moduleTitle}
                        onChange={(e) => setModuleTitle(e.target.value)}
                        className="rounded-xl border-gray-200"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="moduleYoutubeId" className="text-xs font-bold text-gray-500 uppercase">YouTube Link or Video ID</Label>
                      <Input
                        id="moduleYoutubeId"
                        type="text"
                        placeholder="Paste any YouTube link"
                        value={moduleYoutubeId}
                        onChange={(e) => setModuleYoutubeId(e.target.value)}
                        onBlur={(e) => handleYoutubeLookup(e.target.value)}
                        onPaste={(e) => {
                          const pasted = e.clipboardData.getData('text')
                          if (pasted) setTimeout(() => handleYoutubeLookup(pasted), 0)
                        }}
                        className="rounded-xl border-gray-200 font-mono"
                        required
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="modulePoints" className="text-xs font-bold text-gray-500 uppercase">Lesson Points</Label>
                      <Input
                        id="modulePoints"
                        type="number"
                        min="0"
                        value={modulePoints}
                        onChange={(e) => setModulePoints(parseInt(e.target.value) || 0)}
                        className="rounded-xl border-gray-200"
                        required
                      />
                    </div>
                  </div>

                  {/* Live preview of the pasted link */}
                  {previewLoading && (
                    <div className="flex items-center gap-2 text-xs font-semibold text-gray-400">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Checking video…
                    </div>
                  )}

                  {!previewLoading && modulePreview && (
                    modulePreview.error ? (
                      <div className="flex items-start gap-2.5 rounded-xl border border-amber-200 bg-amber-50 p-3.5 text-xs font-semibold text-amber-700">
                        <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                        <span>{modulePreview.error}</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-4 rounded-xl border border-emerald-100 bg-emerald-50/50 p-3">
                        <img
                          src={youtubeThumbnail(modulePreview.videoId)}
                          alt=""
                          className="h-16 w-28 rounded-lg object-cover bg-gray-200"
                        />
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-brand-dark truncate">{modulePreview.title}</p>
                          {modulePreview.author && (
                            <p className="text-xs font-medium text-gray-500 truncate">{modulePreview.author}</p>
                          )}
                          <p className="mt-0.5 font-mono text-[11px] text-emerald-600">{modulePreview.videoId}</p>
                        </div>
                      </div>
                    )
                  )}

                  <Button
                    type="submit"
                    className="w-full md:w-auto rounded-xl bg-brand-primary hover:bg-brand-primary-dark font-semibold text-white px-8 gap-2 shadow-lg shadow-brand-primary/10 cursor-pointer"
                  >
                    <Plus className="h-5 w-5" />
                    Add Lesson
                  </Button>
                </form>
                )}
              </CardContent>
            </Card>

            <Card className="border border-border rounded-2xl shadow-sm bg-white overflow-hidden">
              <CardHeader className="border-b border-gray-100 p-6 bg-gray-50/50">
                <CardTitle className="font-display text-xl font-bold text-brand-dark">Course Modules</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {videoList.length === 0 ? (
                  <div className="py-12 text-center space-y-2">
                    <PlayCircle className="h-11 w-11 text-gray-300 mx-auto" />
                    <p className="text-gray-400 text-sm font-semibold">No lessons registered yet.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                      <thead>
                        <tr className="border-b border-gray-100 text-gray-500 text-xs font-bold uppercase tracking-wider">
                          <th className="py-3.5 px-3">Course</th>
                          <th className="py-3.5 px-3">Title</th>
                          <th className="py-3.5 px-3 text-center">Points</th>
                          <th className="py-3.5 px-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50 font-medium">
                        {videoList.map((v) => {
                          const cTitle = courses.find(c => c.id === v.course_id)?.title || 'Unknown Course'
                          return (
                            <tr key={v.id} className="hover:bg-gray-50/50 transition-colors">
                              <td className="py-4 px-3 text-xs font-bold text-gray-500 truncate max-w-[150px]" title={cTitle}>
                                {cTitle}
                              </td>
                              <td className="py-4 px-3 font-extrabold text-brand-dark">
                                {v.title}
                                <div className="text-[10px] text-gray-400 font-mono mt-0.5">{v.youtube_id}</div>
                              </td>
                              <td className="py-4 px-3 text-center text-brand-primary font-bold">
                                +{v.points_awarded}
                              </td>
                              <td className="py-4 px-3 text-right">
                                <div className="flex items-center justify-end gap-2">
                                  <button
                                    onClick={() => setPreviewVideoId(v.youtube_id)}
                                    className="text-brand-primary hover:text-brand-primary-dark bg-brand-primary/10 hover:bg-brand-primary/20 p-2 rounded-lg transition-colors inline-flex"
                                    title="Watch video"
                                  >
                                    <Eye className="h-4 w-4" />
                                  </button>
                                  <button
                                    onClick={() => handleModuleDelete(v.id)}
                                    className="text-red-500 hover:text-red-600 bg-red-50 hover:bg-red-100 p-2 rounded-lg transition-colors inline-flex"
                                    title="Delete lesson"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                </div>
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
          </div>
        )}

        {/* ================= TAB 6: STUDENTS ================= */}
        {activeTab === 'students' && (
          <div className="space-y-8 text-left">
            <Card className="border border-border rounded-2xl shadow-sm bg-white overflow-hidden">
              <CardHeader className="border-b border-gray-100 p-6 bg-gray-50/50">
                <CardTitle className="font-display text-xl font-bold text-brand-dark">Students</CardTitle>
                <CardDescription className="text-gray-400 font-medium">Manage students and edit their points.</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                {students.length === 0 ? (
                  <div className="py-12 text-center space-y-2">
                    <Users className="h-11 w-11 text-gray-300 mx-auto" />
                    <p className="text-gray-400 text-sm font-semibold">No students registered yet.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                      <thead>
                        <tr className="border-b border-gray-100 text-gray-500 text-xs font-bold uppercase tracking-wider">
                          <th className="py-3.5 px-3">Name</th>
                          <th className="py-3.5 px-3">Email</th>
                          <th className="py-3.5 px-3">Points</th>
                          <th className="py-3.5 px-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50 font-medium">
                        {students.map((s) => (
                          <tr key={s.id} className="hover:bg-gray-50/50 transition-colors">
                            <td className="py-4 px-3 font-extrabold text-brand-dark">
                              {s.full_name}
                            </td>
                            <td className="py-4 px-3 text-gray-500">
                              {s.email || 'Email missing'}
                            </td>
                            <td className="py-4 px-3">
                              {editingStudentId === s.id ? (
                                <Input
                                  type="number"
                                  value={editingPoints}
                                  onChange={(e) => setEditingPoints(parseInt(e.target.value) || 0)}
                                  className="w-24 h-8"
                                />
                              ) : (
                                <span className="font-bold text-brand-primary">{s.points || 0}</span>
                              )}
                            </td>
                            <td className="py-4 px-3 text-right">
                              {editingStudentId === s.id ? (
                                <div className="flex items-center justify-end gap-2">
                                  <Button size="sm" onClick={() => handleUpdatePoints(s.id)} className="h-8">Save</Button>
                                  <Button size="sm" variant="ghost" onClick={() => setEditingStudentId(null)} className="h-8">Kanoqo</Button>
                                </div>
                              ) : (
                                <Button size="sm" variant="outline" onClick={() => {
                                  setEditingStudentId(s.id)
                                  setEditingPoints(s.points || 0)
                                }} className="h-8">
                                  Edit
                                </Button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* ================= TAB 7: COURSES ================= */}
        {activeTab === 'courses' && (
          <div className="space-y-8 text-left">
            <Card className="border border-border rounded-2xl shadow-sm bg-white overflow-hidden">
              <CardHeader className="border-b border-gray-100 p-6 bg-gray-50/50">
                <CardTitle className="font-display text-xl font-bold text-brand-dark">Create New Course</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <form onSubmit={handleCourseSubmit} className="space-y-5">
                  {courseMessage && (
                    <div className={`p-4 rounded-xl flex items-start gap-2.5 text-sm font-semibold ${
                      courseMessage.type === 'success' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-red-50 text-red-500 border border-red-100'
                    }`}>
                      {courseMessage.type === 'success' ? <CheckCircle2 className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
                      <span>{courseMessage.text}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="cTitle" className="text-xs font-bold text-gray-500 uppercase">Course Title</Label>
                      <Input
                        id="cTitle"
                        type="text"
                        placeholder="e.g. Next.js Masterclass"
                        value={courseTitle}
                        onChange={(e) => {
                          setCourseTitle(e.target.value)
                          // Keep the slug in sync until the admin edits it directly.
                          if (!courseSlugTouched) setCourseSlug(slugifyTitle(e.target.value))
                        }}
                        className="rounded-xl border-gray-200"
                        required
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="cSlug" className="text-xs font-bold text-gray-500 uppercase">
                        URL Slug <span className="text-gray-400 normal-case font-medium">(auto-filled)</span>
                      </Label>
                      <Input
                        id="cSlug"
                        type="text"
                        placeholder="nextjs-masterclass"
                        value={courseSlug}
                        onChange={(e) => {
                          setCourseSlugTouched(true)
                          setCourseSlug(e.target.value)
                        }}
                        className="rounded-xl border-gray-200 font-mono text-sm"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="cPrice" className="text-xs font-bold text-gray-500 uppercase">Price in $</Label>
                      <Input
                        id="cPrice"
                        type="number"
                        min="0"
                        placeholder="e.g. 50 (or 0 for free)"
                        value={coursePrice}
                        onChange={(e) => setCoursePrice(parseInt(e.target.value) || 0)}
                        className="rounded-xl border-gray-200"
                        required
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="cDuration" className="text-xs font-bold text-gray-500 uppercase">Duration (minutes)</Label>
                      <Input
                        id="cDuration"
                        type="number"
                        min="1"
                        placeholder="e.g. 120"
                        value={courseDuration}
                        onChange={(e) => setCourseDuration(parseInt(e.target.value) || 0)}
                        className="rounded-xl border-gray-200"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="cLevel" className="text-xs font-bold text-gray-500 uppercase">Level</Label>
                      <select
                        id="cLevel"
                        value={courseLevel}
                        onChange={(e) => setCourseLevel(e.target.value as 'Beginner' | 'Intermediate' | 'Advanced')}
                        className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-brand-dark focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
                      >
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Advanced">Advanced</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="cDesc" className="text-xs font-bold text-gray-500 uppercase">Description</Label>
                    <textarea
                      id="cDesc"
                      rows={3}
                      placeholder="A short summary students will see on the course card."
                      value={courseDescription}
                      onChange={(e) => setCourseDescription(e.target.value)}
                      className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm font-medium text-brand-dark placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
                    />
                  </div>

                  <ImageUploadField
                    label="Course Thumbnail"
                    value={courseThumbnail}
                    onChange={setCourseThumbnail}
                    folder="courses"
                    hint="Optional — a default image is used if you skip this. Best at 16:9 (e.g. 1280×720)."
                  />

                  <Button
                    type="submit"
                    disabled={isPending}
                    className="w-full md:w-auto rounded-xl bg-brand-primary hover:bg-brand-primary-dark font-semibold text-white px-8 gap-2 shadow-lg shadow-brand-primary/10 cursor-pointer disabled:opacity-60"
                  >
                    <Plus className="h-5 w-5" />
                    Create Course
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card className="border border-border rounded-2xl shadow-sm bg-white overflow-hidden">
              <CardHeader className="border-b border-gray-100 p-6 bg-gray-50/50">
                <CardTitle className="font-display text-xl font-bold text-brand-dark">Existing Courses</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {courses.length === 0 ? (
                  <div className="py-12 text-center space-y-2">
                    <FileCheck className="h-11 w-11 text-gray-300 mx-auto" />
                    <p className="text-gray-400 text-sm font-semibold">No courses yet.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                      <thead>
                        <tr className="border-b border-gray-100 text-gray-500 text-xs font-bold uppercase tracking-wider">
                          <th className="py-3.5 px-3">Title</th>
                          <th className="py-3.5 px-3">Price</th>
                          <th className="py-3.5 px-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50 font-medium">
                        {courses.map((c) => (
                          <tr key={c.id} className="hover:bg-gray-50/50 transition-colors">
                            <td className="py-4 px-3 font-extrabold text-brand-dark">
                              {c.title}
                              {!c.is_published && (
                                <span className="ml-2 text-[10px] bg-yellow-100 text-yellow-700 font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">Hidden</span>
                              )}
                            </td>
                            <td className="py-4 px-3">
                              {c.is_free ? 'Free' : `$${c.price}`}
                            </td>
                            <td className="py-4 px-3 text-right">
                              <button
                                onClick={() => handleCourseTogglePublish(c.id, c.is_published)}
                                className="mr-2 text-gray-500 hover:text-brand-primary bg-gray-50 hover:bg-gray-100 p-2 rounded-lg transition-colors inline-flex"
                                title={c.is_published ? 'Hide Course' : 'Publish Course'}
                              >
                                {c.is_published ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                              </button>
                              <button
                                onClick={() => handleCourseDelete(c.id)}
                                className="text-red-500 hover:text-red-600 bg-red-50 hover:bg-red-100 p-2 rounded-lg transition-colors inline-flex"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* ================= TAB 8: PAGES ================= */}
        {activeTab === 'pages' && (
          <div className="space-y-6 text-left">
            <Card className="border border-border rounded-2xl shadow-sm bg-white overflow-hidden text-left">
              <CardHeader className="border-b border-gray-100 p-6 bg-gray-50/50">
                <CardTitle className="font-display text-xl font-bold text-brand-dark">Manage About & Contact Pages</CardTitle>
                <CardDescription className="text-gray-400 font-medium">Habeey qoraalada, sawirada, iyo numberka boggaga (About Us iyo Contact Us).</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <form onSubmit={handlePageSubmit} className="space-y-8">
                  {pageMessage && (
                    <div className={`p-4 rounded-xl flex items-start gap-2.5 text-sm font-semibold ${
                      pageMessage.type === 'success' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-red-50 text-red-500 border border-red-100'
                    }`}>
                      {pageMessage.type === 'success' ? <CheckCircle2 className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
                      <span>{pageMessage.text}</span>
                    </div>
                  )}

                  {/* About Section */}
                  <div className="space-y-4">
                    <h3 className="font-bold text-lg border-b pb-2">About Page</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label className="text-xs font-bold text-gray-500">About Title</Label>
                        <Input value={aboutTitle} onChange={(e) => setAboutTitle(e.target.value)} placeholder="e.g. About SomSkool" className="rounded-xl border-gray-200" required />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs font-bold text-gray-500">About Subtitle</Label>
                        <Input value={aboutSubtitle} onChange={(e) => setAboutSubtitle(e.target.value)} placeholder="e.g. Empowering the future" className="rounded-xl border-gray-200" required />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold text-gray-500">About Header Image URL</Label>
                      <Input value={aboutImage} onChange={(e) => setAboutImage(e.target.value)} placeholder="e.g. https://images.unsplash.com/..." className="rounded-xl border-gray-200" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold text-gray-500">About Main Text</Label>
                      <textarea
                        value={aboutText}
                        onChange={(e) => setAboutText(e.target.value)}
                        placeholder="The SomSkool is a diploma skool in adisababa..."
                        className="w-full h-24 p-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
                        required
                      />
                    </div>
                  </div>

                  {/* Contact Section */}
                  <div className="space-y-4">
                    <h3 className="font-bold text-lg border-b pb-2">Contact Page</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label className="text-xs font-bold text-gray-500">Contact Title</Label>
                        <Input value={contactTitle} onChange={(e) => setContactTitle(e.target.value)} placeholder="e.g. La xiriir SomSkool" className="rounded-xl border-gray-200" required />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs font-bold text-gray-500">Contact Subtitle</Label>
                        <Input value={contactSubtitle} onChange={(e) => setContactSubtitle(e.target.value)} placeholder="e.g. Nala soo xiriir haddii aad hayso su'aalo" className="rounded-xl border-gray-200" required />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label className="text-xs font-bold text-gray-500">Contact Phone / WhatsApp</Label>
                        <Input value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} placeholder="e.g. +252 63 XXX XXXX" className="rounded-xl border-gray-200" required />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs font-bold text-gray-500">Contact Header Image URL</Label>
                        <Input value={contactImage} onChange={(e) => setContactImage(e.target.value)} placeholder="e.g. https://images.unsplash.com/..." className="rounded-xl border-gray-200" />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold text-gray-500">Contact Main Text</Label>
                      <textarea
                        value={contactText}
                        onChange={(e) => setContactText(e.target.value)}
                        placeholder="SomSkool waxay diyaar u tahay inay ku caawiso..."
                        className="w-full h-24 p-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label className="text-xs font-bold text-gray-500">Contact Email</Label>
                        <Input value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} placeholder="e.g. support@somskool.com" className="rounded-xl border-gray-200" required />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs font-bold text-gray-500">Contact Address</Label>
                        <Input value={contactAddress} onChange={(e) => setContactAddress(e.target.value)} placeholder="e.g. Hargeisa, Somaliland" className="rounded-xl border-gray-200" required />
                      </div>
                    </div>
                  </div>

                  {/* Social Media Section */}
                  <div className="space-y-4">
                    <h3 className="font-bold text-lg border-b pb-2">Social Media Links</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label className="text-xs font-bold text-gray-500">Facebook URL</Label>
                        <Input value={socialFacebook} onChange={(e) => setSocialFacebook(e.target.value)} placeholder="https://facebook.com/..." className="rounded-xl border-gray-200" />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs font-bold text-gray-500">Instagram URL</Label>
                        <Input value={socialInstagram} onChange={(e) => setSocialInstagram(e.target.value)} placeholder="https://instagram.com/..." className="rounded-xl border-gray-200" />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label className="text-xs font-bold text-gray-500">LinkedIn URL</Label>
                        <Input value={socialLinkedin} onChange={(e) => setSocialLinkedin(e.target.value)} placeholder="https://linkedin.com/company/..." className="rounded-xl border-gray-200" />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs font-bold text-gray-500">YouTube URL</Label>
                        <Input value={socialYoutube} onChange={(e) => setSocialYoutube(e.target.value)} placeholder="https://youtube.com/@..." className="rounded-xl border-gray-200" />
                      </div>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="rounded-xl bg-brand-primary hover:bg-brand-primary-dark font-semibold text-white px-8 gap-2 shadow-lg shadow-brand-primary/10 cursor-pointer"
                  >
                    <LayoutTemplate className="h-5 w-5" />
                    Save Pages
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        )}

        {/* ================= TAB 9: ROLES ================= */}
        {activeTab === 'roles' && (
          <div className="space-y-8 text-left">
            <Card className="border border-border rounded-2xl shadow-sm bg-white overflow-hidden">
              <CardHeader className="border-b border-gray-100 p-6 bg-gray-50/50">
                <CardTitle className="font-display text-xl font-bold text-brand-dark">Create New Role (Add Role)</CardTitle>
                <CardDescription className="text-gray-400 font-medium">Create new staff roles (e.g. moderator, editor).</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <form onSubmit={handleRoleSubmit} className="space-y-5">
                  {roleMessage && (
                    <div className={`p-4 rounded-xl flex items-start gap-2.5 text-sm font-semibold ${
                      roleMessage.type === 'success' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-red-50 text-red-500 border border-red-100'
                    }`}>
                      {roleMessage.type === 'success' ? <CheckCircle2 className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
                      <span>{roleMessage.text}</span>
                    </div>
                  )}

                  <div className="space-y-1.5 max-w-sm">
                    <Label htmlFor="roleName" className="text-xs font-bold text-gray-500 uppercase">Role Name</Label>
                    <Input
                      id="roleName"
                      type="text"
                      placeholder="e.g. moderator"
                      value={roleName}
                      onChange={(e) => setRoleName(e.target.value)}
                      className="rounded-xl border-gray-200"
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    className="rounded-xl bg-brand-primary hover:bg-brand-primary-dark font-semibold text-white px-8 gap-2 shadow-lg shadow-brand-primary/10 cursor-pointer"
                  >
                    <ShieldCheck className="h-5 w-5" />
                    Create Role
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card className="border border-border rounded-2xl shadow-sm bg-white overflow-hidden">
              <CardHeader className="border-b border-gray-100 p-6 bg-gray-50/50">
                <CardTitle className="font-display text-xl font-bold text-brand-dark">Roles List</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {rolesList.length === 0 ? (
                  <div className="py-12 text-center space-y-2">
                    <ShieldCheck className="h-11 w-11 text-gray-300 mx-auto" />
                    <p className="text-gray-400 text-sm font-semibold">No roles yet.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {rolesList.map(r => (
                      <div key={r.id} className="border border-gray-100 rounded-xl p-4 flex items-center justify-between hover:shadow-sm transition-all bg-gray-50/30">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 bg-brand-primary/10 text-brand-primary rounded-lg flex items-center justify-center">
                            <ShieldCheck className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="font-extrabold text-brand-dark uppercase tracking-wide text-sm">{r.name}</p>
                            <p className="text-[10px] text-gray-400 font-medium mt-0.5">{new Date(r.created_at).toLocaleDateString()}</p>
                          </div>
                        </div>
                        {r.name !== 'admin' && (
                          <button
                            onClick={() => handleRoleDelete(r.id, r.name)}
                            className="h-8 w-8 rounded-full bg-red-50 text-red-500 hover:bg-red-100 flex items-center justify-center transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
      
      {/* Video Preview Modal */}
      {previewVideoId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <div 
            className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
            onClick={() => setPreviewVideoId(null)}
          />
          <div className="relative w-full max-w-4xl bg-black rounded-2xl overflow-hidden shadow-2xl border border-white/10 animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setPreviewVideoId(null)}
              className="absolute -top-12 right-0 text-white/70 hover:text-white transition-colors flex items-center gap-2"
            >
              <span className="text-sm font-bold uppercase tracking-widest">Xir</span>
              <XCircle className="h-8 w-8" />
            </button>
            <div className="aspect-video w-full bg-black relative">
              <iframe
                src={`https://www.youtube.com/embed/${previewVideoId}?autoplay=1`}
                title="Video Preview"
                className="absolute inset-0 w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
