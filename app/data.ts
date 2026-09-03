type Project = {
  name: string
  description: string
  link: string
  /** Path under /public, e.g. `/videos/grademate.mp4` */
  video?: string
  id: string
}

type WorkExperience = {
  company: string
  title: string
  start: string
  end: string
  link: string
  id: string
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
      'Grade calculator SaaS — from database and billing to UI, grown through SEO and organic adoption.',
    link: 'https://grademate.dev',
    video: '/videos/grademate.mp4',
    id: 'project1',
  },
  {
    name: 'yorick.live',
    description:
      'Discovery and portfolio platform for actors, built for casting-ready personal brands.',
    link: 'https://yorick.live',
    video: '/videos/yorick.mp4',
    id: 'project2',
  },
  {
    name: 'eightysix.bar',
    description: 'Spec library SaaS for bar teams.',
    link: 'https://eightysix.bar',
    video: '/videos/eightysix.mp4',
    id: 'project3',
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
]

export const BLOG_POSTS: BlogPost[] = []

export const SOCIAL_LINKS: SocialLink[] = [
  {
    label: 'Github',
    link: 'https://github.com/vincelapore',
  },
]

export const EMAIL = 'vmelapore@gmail.com'
