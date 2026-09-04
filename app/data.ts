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
  /** Nested title link rendered as "Name (and Label)" */
  secondaryLink?: {
    label: string
    href: string
  }
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
      'Grade calculator SaaS, from database and billing to UI, grown through SEO and organic adoption. Used by 180+ students.',
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
    name: 'Yorick Live',
    description:
      'A portfolio and discovery platform for indie theatre: structured credits, media uploads, industry-facing profiles. 20 industry users in the first week.',
    link: 'https://yorick.live',
    secondaryLink: {
      label: 'Stage',
      href: 'https://stage.yorick.live/avaryan',
    },
    tags: ['Next.js', 'Supabase', 'Tailwind', 'Python'],
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
    description: 'Cocktail recipes are inconsistent and messy across a bar. A spec library app for bar teams and the solo tender.',
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
      'Commissioned by a theatre artist to showcase their portfolio, with a Sanity CMS integration.',
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
    company: 'LOS, sAme sAme Restaurant, Biànca, Central Restaurant (hatted)',
    title: 'Cocktail Bartender',
    start: '2022',
    end: '2026',
    description:
      'People skills, reliability, and focus under pressure across multiple high-end venues.',
    highlights: [
      ],
    preview: {
      src: '/projects/previews/bartender.gif',
      width: 332,
      height: 590,
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
