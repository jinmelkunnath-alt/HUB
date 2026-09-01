/**
 * LOCAL PLACEHOLDER DATA — DEVELOPMENT ONLY.
 *
 * This module provides mock UI data so Phase 1 pages can be built and
 * polished. It is intentionally isolated behind `getMedia`, `getCategories`,
 * etc. so that later phases can swap the implementation for real Firestore
 * reads via Cloudflare Workers without touching the UI layer.
 *
 * No real, licensed, or copyrighted media is used. Thumbnails are generated
 * placeholder gradients, not real artwork.
 */

import type { MediaCategory, MediaItem, MediaType } from '@/types/media'

export interface CategoryInfo {
  id: MediaType
  label: string
  tagline: string
  description: string
  count: number
}

const DAY = 86_400_000
const NOW = Date.now()

function item(
  n: number,
  title: string,
  type: MediaType,
  category: MediaCategory,
  sizeBytes: number,
  hue: number,
  duration: string,
  rating: string,
  ageDays: number,
  description: string,
): MediaItem {
  return {
    id: String(n),
    title,
    type,
    category,
    size: `${(sizeBytes / 1024 ** 3).toFixed(1)} GB`,
    sizeBytes,
    addedAt: NOW - ageDays * DAY,
    hue,
    duration,
    rating,
    description,
  }
}

const GB = 1024 ** 3
const MB = 1024 ** 2

/** Order corresponds to "hue" gradient used by the placeholder thumbnail. */
const TITLES = [
  'Stillwater',
  'The Quiet Meridian',
  'Petals in the Rain',
  'Last Light Over the Delta',
  'Monsoon Letters',
  'The Salt Archive',
  'Night Bloom',
  'A Garden in Slow Motion',
  'Embers of the Harbor',
  'The Paper Lantern',
  'Wavelengths',
  'Ordinary Miracles',
  'The Cartographer',
  'Silent Frequencies',
  'A Year in Amber',
  'Northern Colors',
  'The Glass Orchard',
  'Currents',
  'Fragments of Tomorrow',
  'Beneath the Canopy',
]

export const CATEGORIES: CategoryInfo[] = [
  {
    id: 'video',
    label: 'Videos',
    tagline: 'Films, series & documentaries',
    description:
      'A curated collection of films, episodic series, and long-form documentaries.',
    count: 8,
  },
  {
    id: 'image',
    label: 'Images',
    tagline: 'Photography & visual art',
    description:
      'Photography collections, visual essays, and digital art compilations.',
    count: 6,
  },
  {
    id: 'document',
    label: 'Documents',
    tagline: 'Reference & written works',
    description:
      'Reference material, field notes, transcripts, and written collections.',
    count: 4,
  },
  {
    id: 'audio',
    label: 'Audio',
    tagline: 'Music, podcasts & audiobooks',
    description:
      'Music releases, podcast seasons, and audiobook collections.',
    count: 6,
  },
]

const RAW_ITEMS: Array<
  [string, MediaType, MediaCategory, number, number, string, string, number, string]
> = [
  // [title, type, category, sizeBytes, hue, duration, rating, ageDays, description]
  [TITLES[0], 'video', 'Films', 3.4 * GB, 18, '1h 58m', '15', 1, 'A slow-burning drama set on a quiet coastal town.'],
  [TITLES[1], 'video', 'Films', 2.1 * GB, 330, '2h 04m', '15', 3, 'Two strangers navigate a journey across a changing landscape.'],
  [TITLES[2], 'video', 'Series', 1.2 * GB, 200, '45m', '12', 2, 'Episode one of a contemplative anthology series.'],
  [TITLES[3], 'video', 'Documentaries', 2.8 * GB, 40, '1h 22m', 'PG', 5, 'A documentary following a river delta through the seasons.'],
  [TITLES[4], 'video', 'Series', 1.6 * GB, 280, '50m', '15', 7, 'Letters between two far-off correspondents.'],
  [TITLES[5], 'document', 'Reference', 240 * MB, 110, '312 pages', 'PG', 9, 'A comprehensive reference archive with detailed appendices.'],
  [TITLES[6], 'image', 'Photography', 820 * MB, 300, '48 images', 'PG', 4, 'A night photography collection exploring low-light subjects.'],
  [TITLES[7], 'video', 'Films', 4.1 * GB, 90, '1h 46m', '18', 6, 'A meditative feature set in a vast garden estate.'],
  [TITLES[8], 'image', 'Art', 610 * MB, 15, '32 images', 'PG', 8, 'Digital art exploring warmth, texture, and fading light.'],
  [TITLES[9], 'video', 'Films', 1.9 * GB, 55, '1h 31m', '12', 12, 'A story of memory and small rituals.'],
  [TITLES[10], 'audio', 'Music', 320 * MB, 210, '11 tracks', 'PG', 2, 'An ambient music release built on long, evolving tones.'],
  [TITLES[11], 'audio', 'Podcasts', 180 * MB, 340, '6 episodes', 'PG', 5, 'A conversational series on ordinary creative practice.'],
  [TITLES[12], 'document', 'Reference', 95 * MB, 150, '168 pages', 'PG', 15, 'Field notes and illustrated maps from a mapping project.'],
  [TITLES[13], 'audio', 'Audiobooks', 420 * MB, 230, '9h 12m', '12', 11, 'A narrated journey through quiet places.'],
  [TITLES[14], 'image', 'Photography', 1.1 * GB, 45, '60 images', 'PG', 10, 'A year-long study of seasonal color.'],
  [TITLES[15], 'image', 'Art', 740 * MB, 320, '40 images', 'PG', 14, 'A northern landscape series in restrained palettes.'],
  [TITLES[16], 'video', 'Series', 2.4 * GB, 260, '52m', '15', 13, 'Episode one of a mystery set within a glass greenhouse.'],
  [TITLES[17], 'audio', 'Music', 290 * MB, 190, '9 tracks', 'PG', 3, 'Rhythmic electronic compositions with organic textures.'],
  [TITLES[18], 'document', 'Reference', 540 * MB, 60, '480 pages', '12', 18, 'A compiled set of transcripts and appendices.'],
  [TITLES[19], 'image', 'Photography', 980 * MB, 350, '55 images', 'PG', 16, 'Forest interiors photographed in soft natural light.'],
]

export const MEDIA: MediaItem[] = RAW_ITEMS.map((row, i) =>
  item(i + 1, row[0], row[1], row[2], row[3], row[4], row[5], row[6], row[7], row[8]),
)

// ---- Lookup helpers (swap with real data access in later phases) ----

export function getMedia(): MediaItem[] {
  return MEDIA
}

export function getMediaById(id: string): MediaItem | undefined {
  return MEDIA.find((m) => m.id === id)
}

export function getCategories(): CategoryInfo[] {
  return CATEGORIES
}

export function getTrending(): MediaItem[] {
  return [...MEDIA].sort((a, b) => b.addedAt - a.addedAt).slice(0, 8)
}

export function getLatest(): MediaItem[] {
  return [...MEDIA].sort((a, b) => b.addedAt - a.addedAt)
}

export function getByCategory(type: MediaType): MediaItem[] {
  return MEDIA.filter((m) => m.type === type)
}
