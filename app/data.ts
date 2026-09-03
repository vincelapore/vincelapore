type Project = {
  name: string
  description: string
  link: string
  tags: string[]
  /** Path under /public — used for both themes unless imageLight is set */
  image?: string
  /** Optional light-mode image; falls back to `image` */
  imageLight?: string
  /** Hover preview video (Blob URL + intrinsic pixel size) */
  video?: HoverVideo
  id: string
}

type WorkExperience = {
  company: string
  title: string
  start?: string
  end?: string
  link?: string
  description?: string
  highlights?: string[]
  video?: HoverVideo
  id: string
}

export type HoverVideo = {
  src: string
  /** Intrinsic width of the compressed preview file */
  width: number
  /** Intrinsic height of the compressed preview file */
  height: number
}

type BlogPost = {
  title: string
  description: string
  link: string
  uid: string
}

type SocialLink = {
  label: string
  link: string
}

const HLS =
  'https://ktimyrrm7b44q4zu.public.blob.vercel-storage.com/hls'

export const PROJECTS: Project[] = [
  {
    name: 'Grademate',
    description:
      'Grade calculator SaaS, from database and billing to UI, grown through SEO and organic adoption.',
    link: 'https://grademate.dev',
    tags: ['Next.js', 'Stripe API', 'Supabase', 'SEO'],
    image: '/projects/grademate-dark.jpg',
    imageLight: '/projects/grademate-light.jpg',
    video: {
      src: `${HLS}/grademate/master.m3u8`,
      width: 1216,
      height: 720,
    },
    id: 'project1',
  },
  {
    name: 'yorick.live',
    description:
      'Discovery and portfolio platform for actors, built for casting-ready personal brands.',
    link: 'https://yorick.live',
    tags: ['Next.js', 'Supabase', 'Tailwind'],
    image: '/projects/yorick-dark.jpg',
    imageLight: '/projects/yorick-light.jpg',
    video: {
      src: `${HLS}/yorick/master.m3u8`,
      width: 1226,
      height: 720,
    },
    id: 'project2',
  },
  {
    name: '86: The Bartending App',
    description: 'Spec library SaaS for bar teams.',
    link: 'https://eightysix.bar',
    tags: ['Swift', 'Supabase'],
    image: '/projects/eightysix-dark.jpg',
    video: {
      src: `${HLS}/eightysix/master.m3u8`,
      width: 332,
      height: 720,
    },
    id: 'project3',
  },
  {
    name: 'Nic Davidson',
    description:
      'Theatre artist portfolio spanning acting, directing, and playwriting, with a Sanity-backed catalogue of productions.',
    link: 'https://nic-davidson.com',
    tags: ['Next.js', 'Sanity'],
    image: '/projects/nic-davidson.jpg',
    video: {
      src: `${HLS}/nic-davidson/master.m3u8`,
      width: 1216,
      height: 720,
    },
    id: 'project4',
  },
]

export const WORK_EXPERIENCE: WorkExperience[] = [
  {
    company: 'Grademate',
    title: 'Founder & Digital Strategist',
    start: '2026',
    end: 'Present',
    link: 'https://grademate.dev',
    id: 'work1',
  },
  {
    company: 'Lamoise Studio',
    title: 'Freelance Designer',
    start: '2026',
    end: 'Present',
    link: 'https://vincelapore.com',
    id: 'work2',
  },
  {
    company: 'Anyday Group',
    title: 'Cocktail Bartender',
    description:
      'People skills, flexibility, and focus across Central Restaurant (hatted), LOS, sAme sAme & Biànca.',
    highlights: [
      'Addressed challenging customers while maintaining hospitality',
      'Learned extensive, evolving spirit and wine lists, memorising up to 100 classic and house cocktail recipes',
      'Balanced academics, late-night hours, and long commutes with social commitments',
    ],
    video: {
      src: `${HLS}/bartender/master.m3u8`,
      width: 332,
      height: 720,
    },
    id: 'work3',
  },
]

export const BLOG_POSTS: BlogPost[] = []

export const SOCIAL_LINKS: SocialLink[] = [
  {
    label: 'Github',
    link: 'https://github.com/vincelapore',
  },
  {
    label: 'LinkedIn',
    link: 'https://www.linkedin.com/in/vincelapore/',
  },
]

export const EMAIL = 'hello@vincelapore.com'
