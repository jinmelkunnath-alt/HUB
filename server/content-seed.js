/**
 * Content catalog seed — original, fictional placeholder metadata only.
 *
 * No real, licensed, or copyrighted media is used. Items are clearly original
 * fictional titles. Thumbnails are represented by a `hue` (used to render an
 * original abstract gradient in the UI) with `thumbnailUrl` left null so real
 * artwork can be added later without touching this module.
 *
 * This seed runs once into the content database the first time the server
 * starts; afterwards the catalog lives in the database.
 */

const DAY = 86_400_000
const BASE = Date.now()

function c({
  id,
  title,
  description,
  type,
  category,
  tags,
  fileSize,
  provider = 'Lotus Originals',
  featured = false,
  hue = 220,
  duration = '',
  rating = 'PG',
  ageDays,
}) {
  const created = BASE - ageDays * DAY
  return {
    id,
    title,
    description,
    type,
    category,
    thumbnailUrl: null,
    tags,
    fileSize,
    provider,
    featured,
    published: true,
    hue,
    duration,
    rating,
    createdAt: created,
    updatedAt: created,
  }
}

const GB = 1024 ** 3
const MB = 1024 ** 2

export const contentSeed = [
  // ---- Videos / Films ----
  c({
    id: 'stillwater',
    title: 'Stillwater',
    type: 'video',
    category: 'Films',
    description:
      'A slow-burning drama set on a quiet coastal town where a lighthouse keeper confronts the past he left behind.',
    tags: ['drama', 'coastal', 'feature', 'atmospheric'],
    fileSize: 3.4 * GB,
    hue: 18,
    duration: '1h 58m',
    rating: '15',
    ageDays: 1,
    featured: true,
  }),
  c({
    id: 'the-quiet-meridian',
    title: 'The Quiet Meridian',
    type: 'video',
    category: 'Films',
    description:
      'Two strangers navigate an unmarked journey across a shifting desert landscape, bound by a promise neither fully remembers.',
    tags: ['drama', 'journey', 'feature'],
    fileSize: 2.1 * GB,
    hue: 330,
    duration: '2h 04m',
    rating: '15',
    ageDays: 3,
  }),
  c({
    id: 'night-bloom',
    title: 'Night Bloom',
    type: 'video',
    category: 'Films',
    description:
      'A meditative feature set in a vast garden estate where a night gardener uncovers a family secret beneath the blooms.',
    tags: ['drama', 'mystery', 'feature'],
    fileSize: 4.1 * GB,
    hue: 90,
    duration: '1h 46m',
    rating: '18',
    ageDays: 6,
    featured: true,
  }),
  c({
    id: 'the-paper-lantern',
    title: 'The Paper Lantern',
    type: 'video',
    category: 'Films',
    description:
      'A story of memory and small rituals, told through the quiet friendship between a calligrapher and a young courier.',
    tags: ['drama', 'feature', 'slice-of-life'],
    fileSize: 1.9 * GB,
    hue: 55,
    duration: '1h 31m',
    rating: '12',
    ageDays: 12,
  }),

  // ---- Videos / Series ----
  c({
    id: 'petals-in-the-rain',
    title: 'Petals in the Rain',
    type: 'video',
    category: 'Series',
    description:
      'Episode one of a contemplative anthology series — each episode a standalone story about seasons of change.',
    tags: ['series', 'anthology', 'episode'],
    fileSize: 1.2 * GB,
    hue: 200,
    duration: '45m',
    rating: '12',
    ageDays: 2,
  }),
  c({
    id: 'monsoon-letters',
    title: 'Monsoon Letters',
    type: 'video',
    category: 'Series',
    description:
      'Two far-off correspondents trade letters across a monsoon season, each revealing more than they intend.',
    tags: ['series', 'drama', 'episode'],
    fileSize: 1.6 * GB,
    hue: 280,
    duration: '50m',
    rating: '15',
    ageDays: 7,
  }),
  c({
    id: 'the-glass-orchard',
    title: 'The Glass Orchard',
    type: 'video',
    category: 'Series',
    description:
      'Episode one of a mystery set within a vast glass greenhouse where plants behave in impossible ways.',
    tags: ['series', 'mystery', 'episode'],
    fileSize: 2.4 * GB,
    hue: 260,
    duration: '52m',
    rating: '15',
    ageDays: 13,
    featured: true,
  }),

  // ---- Videos / Documentaries ----
  c({
    id: 'last-light-over-the-delta',
    title: 'Last Light Over the Delta',
    type: 'video',
    category: 'Documentaries',
    description:
      'A documentary following a river delta through the seasons and the communities shaped by its tides.',
    tags: ['documentary', 'nature', 'feature'],
    fileSize: 2.8 * GB,
    hue: 40,
    duration: '1h 22m',
    rating: 'PG',
    ageDays: 5,
  }),
  c({
    id: 'a-garden-in-slow-motion',
    title: 'A Garden in Slow Motion',
    type: 'video',
    category: 'Documentaries',
    description:
      'A time-lapse study of a single garden over a full year, capturing growth, decay and regrowth.',
    tags: ['documentary', 'nature', 'feature'],
    fileSize: 1.4 * GB,
    hue: 130,
    duration: '58m',
    rating: 'PG',
    ageDays: 9,
  }),

  // ---- Images / Photography ----
  c({
    id: 'petals-une',
    title: 'Petals & Shadow',
    type: 'image',
    category: 'Photography',
    description:
      'A black-and-white study of flowers against hard light, exploring form and negative space.',
    tags: ['photography', 'botanical', 'black-and-white'],
    fileSize: 640 * MB,
    hue: 150,
    duration: '44 images',
    ageDays: 4,
  }),
  c({
    id: 'a-year-in-amber',
    title: 'A Year in Amber',
    type: 'image',
    category: 'Photography',
    description:
      'A year-long series documenting shifting light and color in a single valley across four seasons.',
    tags: ['photography', 'landscape', 'seasons'],
    fileSize: 1.1 * GB,
    hue: 45,
    duration: '60 images',
    ageDays: 10,
  }),
  c({
    id: 'northern-colors',
    title: 'Northern Colors',
    type: 'image',
    category: 'Photography',
    description:
      'A restrained northern landscape series in muted palettes and long exposures.',
    tags: ['photography', 'landscape', 'northern'],
    fileSize: 740 * MB,
    hue: 320,
    duration: '40 images',
    ageDays: 14,
  }),
  c({
    id: 'fragments-of-tomorrow',
    title: 'Fragments of Tomorrow',
    type: 'image',
    category: 'Photography',
    description:
      'Urban fragments photographed at dusk — architecture, reflections and the spaces in between.',
    tags: ['photography', 'urban', 'architecture'],
    fileSize: 870 * MB,
    hue: 210,
    duration: '52 images',
    ageDays: 8,
  }),

  // ---- Images / Art ----
  c({
    id: 'embers-of-the-harbor',
    title: 'Embers of the Harbor',
    type: 'image',
    category: 'Art',
    description:
      'A digital art collection exploring warmth, texture and fading light at the edge of a harbor.',
    tags: ['art', 'digital', 'abstract'],
    fileSize: 610 * MB,
    hue: 15,
    duration: '32 images',
    ageDays: 8,
  }),
  c({
    id: 'wavelengths',
    title: 'Wavelengths',
    type: 'image',
    category: 'Art',
    description:
      'Generative color studies translating sound frequencies into visual rhythm.',
    tags: ['art', 'generative', 'color'],
    fileSize: 540 * MB,
    hue: 250,
    duration: '36 images',
    ageDays: 3,
  }),
  c({
    id: 'silent-frequencies',
    title: 'Silent Frequencies',
    type: 'image',
    category: 'Art',
    description:
      'Minimal geometric prints inspired by the quiet hum of empty rooms.',
    tags: ['art', 'minimal', 'geometry'],
    fileSize: 390 * MB,
    hue: 210,
    duration: '24 images',
    ageDays: 6,
  }),

  // ---- Documents / Reference ----
  c({
    id: 'the-salt-archive',
    title: 'The Salt Archive',
    type: 'document',
    category: 'Reference',
    description:
      'A comprehensive illustrated reference on coastal ecosystems with detailed appendices and field maps.',
    tags: ['reference', 'nature', 'illustrated'],
    fileSize: 240 * MB,
    hue: 110,
    duration: '312 pages',
    ageDays: 9,
  }),
  c({
    id: 'the-cartographer',
    title: 'The Cartographer',
    type: 'document',
    category: 'Reference',
    description:
      'Field notes and illustrated maps from an ambitious mapping project of unmapped valleys.',
    tags: ['reference', 'maps', 'field-notes'],
    fileSize: 95 * MB,
    hue: 150,
    duration: '168 pages',
    ageDays: 15,
  }),
  c({
    id: 'ordinary-miracles',
    title: 'Ordinary Miracles',
    type: 'document',
    category: 'Reference',
    description:
      'A compiled set of transcripts and appendices exploring everyday acts of quiet creativity.',
    tags: ['reference', 'transcripts', 'collection'],
    fileSize: 540 * MB,
    hue: 60,
    duration: '480 pages',
    ageDays: 18,
  }),

  // ---- Audio / Music ----
  c({
    id: 'currents',
    title: 'Currents',
    type: 'audio',
    category: 'Music',
    description:
      'An ambient release built on long, evolving tones and the rhythm of moving water.',
    tags: ['music', 'ambient', 'album'],
    fileSize: 320 * MB,
    hue: 210,
    duration: '11 tracks',
    ageDays: 2,
    featured: true,
  }),
  c({
    id: 'beneath-the-canopy',
    title: 'Beneath the Canopy',
    type: 'audio',
    category: 'Music',
    description:
      'Rhythmic electronic compositions with organic, field-recorded textures.',
    tags: ['music', 'electronic', 'album'],
    fileSize: 290 * MB,
    hue: 190,
    duration: '9 tracks',
    ageDays: 3,
  }),

  // ---- Audio / Podcasts ----
  c({
    id: 'night-frequencies-podcast',
    title: 'Night Frequencies',
    type: 'audio',
    category: 'Podcasts',
    description:
      'A conversational series on ordinary creative practice, recorded late at night.',
    tags: ['podcast', 'conversation', 'season'],
    fileSize: 180 * MB,
    hue: 340,
    duration: '6 episodes',
    ageDays: 5,
  }),

  // ---- Audio / Audiobooks ----
  c({
    id: 'the-salt-archive-audio',
    title: 'The Salt Archive (Audio)',
    type: 'audio',
    category: 'Audiobooks',
    description:
      'A narrated journey through quiet places, bringing field notes to life in audio.',
    tags: ['audiobook', 'narration', 'nature'],
    fileSize: 420 * MB,
    hue: 230,
    duration: '9h 12m',
    ageDays: 11,
  }),
]
