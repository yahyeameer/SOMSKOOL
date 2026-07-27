import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** A YouTube video id is always exactly 11 URL-safe characters. */
const YOUTUBE_ID = /^[A-Za-z0-9_-]{11}$/

/**
 * Pulls the 11-character video id out of any common YouTube link.
 *
 * Handles watch/share/embed/shorts/live/mobile URLs, extra query params
 * (?t=, ?si=, &list=), surrounding whitespace, and bare ids.
 * Returns '' when no valid id can be found, so callers can validate.
 */
export function extractYoutubeId(urlOrId: string): string {
  if (!urlOrId) return ''
  const input = urlOrId.trim()

  // Already a bare id
  if (YOUTUBE_ID.test(input)) return input

  // youtu.be/<id>, /embed/<id>, /shorts/<id>, /live/<id>, /v/<id>, /e/<id>
  const pathMatch = input.match(
    /(?:youtu\.be\/|\/(?:embed|shorts|live|v|e)\/)([A-Za-z0-9_-]{11})/
  )
  if (pathMatch) return pathMatch[1]

  // ?v=<id> or &v=<id>
  const queryMatch = input.match(/[?&]v=([A-Za-z0-9_-]{11})/)
  if (queryMatch) return queryMatch[1]

  return ''
}

/** True when the string yields a usable YouTube video id. */
export function isValidYoutubeInput(urlOrId: string): boolean {
  return extractYoutubeId(urlOrId) !== ''
}

/** Thumbnail URL for a video id (no API key required). */
export function youtubeThumbnail(
  id: string,
  quality: 'default' | 'mq' | 'hq' | 'sd' | 'maxres' = 'mq'
): string {
  const file = quality === 'default' ? 'default' : `${quality}default`
  return `https://img.youtube.com/vi/${id}/${file}.jpg`
}
