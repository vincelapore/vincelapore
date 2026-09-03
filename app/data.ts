type Project = {
  name: string
  description: string
  link: string
  tags: string[]
  /** Path under /public — used for both themes unless imageLight is set */
  image?: string
  /** Optional light-mode image; falls back to `image` */
  imageLight?: string
  /** Hover preview GIF under /public/projects/previews */
  preview?: HoverPreview
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
  preview?: HoverPreview
  id: string
}

export type HoverPreview = {
  src: string
  width: number
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

export const PROJECTS: Project[] = [
  {
    name: 'Grademate',
    description:
      'Grade calculator SaaS, from database and billing to UI, grown through SEO and organic adoption.',
    link: 'https://grademate.dev',
    tags: ['Next.js', 'Stripe API', 'Supabase', 'SEO'],
    image: '/projects/grademate-dark.jpg',
    imageLight: '/projects/grademate-light.jpg',
    preview: {
      src: '/projects/previews/grademate.gif',
      width: 616,
      height: 365,
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
    preview: {
      src: '/projects/previews/yorick.gif',
      width: 616,
      height: 362,
    },
    id: 'project2',
  },
  {
    name: '86: The Bartending App',
    description: 'Spec library SaaS for bar teams.',
    link: 'https://thebartending.app',
    tags: ['Swift', 'Supabase'],
    image: '/projects/eightysix-dark.jpg',
    preview: {
      src: '/projects/previews/eightysix.gif',
      width: 332,
      height: 722,
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
    preview: {
      src: '/projects/previews/nic-davidson.gif',
      width: 616,
      height: 365,
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
    preview: {
      src: '/projects/previews/bartender.gif',
      width: 332,
      height: 719,
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
