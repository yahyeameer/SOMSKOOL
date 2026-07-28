'use client'

import { useRef, useState } from 'react'
import { Upload, Link2, X, Loader2, ImageIcon, AlertCircle } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { uploadImage } from '@/lib/actions/admin'

interface ImageUploadFieldProps {
  label: string
  value: string
  onChange: (url: string) => void
  /** Storage prefix so course art and promo art stay separated. */
  folder?: 'courses' | 'promo'
  hint?: string
}

/**
 * Image picker that accepts a file straight from the admin's computer
 * (uploaded to Supabase Storage) or, as a fallback, a pasted image URL.
 */
export function ImageUploadField({
  label,
  value,
  onChange,
  folder = 'courses',
  hint,
}: ImageUploadFieldProps) {
  const [mode, setMode] = useState<'upload' | 'url'>('upload')
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fileName, setFileName] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFile = async (file: File | undefined) => {
    if (!file) return
    setError(null)
    setUploading(true)
    setFileName(file.name)

    try {
      const formData = new FormData()
      formData.append('file', file)
      const res = await uploadImage(formData, folder)

      if (res.success && res.url) {
        onChange(res.url)
      } else {
        setError(res.error || 'Upload failed.')
        setFileName(null)
      }
    } catch {
      setError('Upload failed. Please check your connection and try again.')
      setFileName(null)
    } finally {
      setUploading(false)
    }
  }

  const clear = () => {
    onChange('')
    setFileName(null)
    setError(null)
    if (inputRef.current) inputRef.current.value = ''
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-3">
        <Label className="text-xs font-bold text-gray-500 uppercase">{label}</Label>
        <div className="flex rounded-lg bg-gray-100 p-0.5">
          {([
            { id: 'upload', icon: Upload, text: 'Upload' },
            { id: 'url', icon: Link2, text: 'Paste link' },
          ] as const).map(({ id, icon: Icon, text }) => (
            <button
              key={id}
              type="button"
              onClick={() => setMode(id)}
              className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 text-[11px] font-bold transition-colors ${
                mode === id ? 'bg-white text-brand-primary shadow-sm' : 'text-gray-500 hover:text-brand-dark'
              }`}
            >
              <Icon className="h-3 w-3" />
              {text}
            </button>
          ))}
        </div>
      </div>

      {mode === 'upload' ? (
        <div>
          <input
            ref={inputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp,image/gif,image/avif"
            className="hidden"
            onChange={(e) => handleFile(e.target.files?.[0])}
          />
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-200 bg-gray-50/50 px-4 py-6 text-sm font-semibold text-gray-500 transition-colors hover:border-brand-primary/40 hover:bg-brand-primary/[0.03] hover:text-brand-primary disabled:cursor-not-allowed disabled:opacity-60"
          >
            {uploading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Uploading…
              </>
            ) : (
              <>
                <Upload className="h-4 w-4" />
                {fileName || 'Choose an image from your computer'}
              </>
            )}
          </button>
          <p className="mt-1.5 text-[11px] font-medium text-gray-400">
            PNG, JPG, WEBP, GIF or AVIF — up to 5 MB.
          </p>
        </div>
      ) : (
        <Input
          type="url"
          placeholder="https://images.unsplash.com/photo-123..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="rounded-xl border-gray-200"
        />
      )}

      {error && (
        <div className="flex items-start gap-1.5 rounded-lg border border-red-100 bg-red-50 p-2.5 text-[11px] font-semibold text-red-500">
          <AlertCircle className="h-3.5 w-3.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {hint && !error && (
        <p className="text-[11px] font-medium text-gray-400">{hint}</p>
      )}

      {value && (
        <div className="relative max-w-xs overflow-hidden rounded-xl border border-gray-200">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt="Preview" className="h-32 w-full object-cover" />
          <button
            type="button"
            onClick={clear}
            title="Remove image"
            className="absolute right-2 top-2 rounded-full bg-black/60 p-1.5 text-white transition-colors hover:bg-black/80"
          >
            <X className="h-3.5 w-3.5" />
          </button>
          <div className="flex items-center gap-1.5 bg-gray-50 p-2 text-[11px] font-medium text-gray-500">
            <ImageIcon className="h-3 w-3" />
            Preview
          </div>
        </div>
      )}
    </div>
  )
}
