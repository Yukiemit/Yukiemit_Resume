// ─────────────────────────────────────────────────────────────────────────────
//  EDIT ME — every word on the site comes from this file.
//  The Express server sends this to the React app via GET /api/portfolio.
//
//  Sections with no data are hidden automatically. To add one later, fill in:
//    experience:   [{ period, role, company, summary }]
//    posts:        [{ title, excerpt, date: 'YYYY-MM-DD', read: '5 min', href }]
//    testimonials: [{ quote, name, title }]          ← real quotes only
//    achievements: { featured: [{ place, title, year, blurb }],
//                    others:   [{ place, event, year }] }
// ─────────────────────────────────────────────────────────────────────────────

export const portfolio = {
  profile: {
    name: 'Yuki A. Emit',
    short: 'Yuki', // used for the giant footer wordmark
    initials: 'YE',
    role: 'Web & mobile developer',
    location: 'Manila, PH',
    timezone: 'Asia/Manila',
    email: 'yukianenias@gmail.com',
    github: 'Yukiemit', // shows your real GitHub contribution graph
    avatar: '/avatar.jpg', // optional: put a photo in client/public (e.g. avatar.jpg) and write '/avatar.jpg'
    status: 'Seeking a web & mobile internship · Available Dec 2026',
    headline: {
      lead: "Hi, I'm Yuki. I build",
      em: 'web & mobile apps',
      tail: '.',
    },
    bio: 'Information Technology student at FEU Institute of Technology, specializing in web and mobile applications. I design systems and build them full stack — React and Express on the front, PostgreSQL underneath — and I’m looking for an internship where I can ship real features with a real team.',
    socials: [
      { label: 'GitHub', href: 'https://github.com/Yukiemit' },
      { label: 'LinkedIn', href: 'https://www.linkedin.com/in/yukiemit' },
      { label: 'Email', href: 'mailto:yukianenias@gmail.com' },
    ],
    stats: [
      { value: '3', label: 'apps built' },
      { value: '7', label: 'certifications' },
      { value: 'Dec ’26', label: 'available for internship' },
    ],
    focus: [
      'System Design',
      'Database Design',
      'Full-Stack Development',
      'Analytical Problem-Solving',
      'Team Collaboration',
      'Adaptability',
    ],
  },

  projects: [
    {
      name: 'SAVR',
      tag: 'Web & mobile · Food bank platform',
      year: '2026 — Now',
      tint: '#2f7d5b',
      role: 'Full-stack developer & system designer',
      description:
        'A food bank management platform with separate portals for admins, staff, donors and beneficiaries. Donation tracking and approval workflows, PayMongo payments, PDF reports, and an automated truck-allocation algorithm that assigns pickups and deliveries by distance, urgency and capacity.',
      stack: ['React', 'Express', 'PostgreSQL', 'PayMongo'],
      links: [{ label: 'Live site', href: 'https://www.savrdonate.com' }],
    },
    {
      name: 'Teddiursa Airline',
      tag: 'Web app · Space travel booking',
      year: '2025',
      tint: '#2b5fb8',
      role: 'Full-stack developer & system designer',
      description:
        'A fictional space-travel booking platform: browse planets, book flights, get tickets. User and admin logins, a booking and ticket-confirmation flow, and an admin dashboard for flight schedules and passengers. Runs in Docker with scripts to migrate, seed and reset the database.',
      stack: ['PHP', 'PostgreSQL', 'MongoDB', 'Docker'],
      links: [],
    },
    {
      name: 'Brew-Ha',
      tag: 'Web app',
      year: '2025',
      tint: '#9a6b12',
      role: 'Backend & frontend developer',
      description: 'Developed the backend functionality and designed the frontend.',
      stack: [],
      links: [],
    },
  ],

  education: [
    {
      period: 'Current',
      role: 'BS Information Technology',
      company: 'FEU Institute of Technology',
      summary: 'Specializing in Web and Mobile Application development.',
    },
  ],

  coursework: [
    'Data Structures & Algorithms',
    'Software Engineering',
    'Database Systems',
    'Web & Mobile Development',
    'Application Development',
    'Systems Analysis & Design',
  ],

  experience: [],

  stack: {
    Languages: ['JavaScript', 'PHP', 'SQL', 'HTML/CSS'],
    Frontend: ['React', 'Tailwind CSS', 'Vite'],
    Backend: ['Node.js', 'Express.js', 'REST APIs', 'Sequelize'],
    'Data & tools': ['PostgreSQL', 'MongoDB', 'Git', 'Docker'],
    'Familiar with': ['Google Maps API', 'PayMongo API'],
  },

  certifications: [
    { name: 'CCNA: Enterprise Networking, Security, and Automation', issuer: 'Cisco', badge: 'ENSA', year: 'Dec 2025', href: '' },
    { name: 'Linux Essentials', issuer: 'Cisco', badge: 'LNX', year: 'Nov 2025', href: '' },
    { name: 'CCNA: Switching, Routing, and Wireless Essentials', issuer: 'Cisco', badge: 'SRWE', year: 'Mar 2025', href: '' },
    { name: 'IT Specialist — Python', issuer: 'Certiport · Pearson VUE', badge: 'ITS', year: 'Feb 2025', href: '' },
    { name: 'Cisco Certified Support Technician — Networking', issuer: 'Cisco', badge: 'CCST', year: 'Feb 2025', href: '' },
    { name: 'CCNA: Introduction to Networks', issuer: 'Cisco', badge: 'ITN', year: 'Dec 2024', href: '' },
    { name: 'PMI Project Management Ready™', issuer: 'Project Management Institute', badge: 'PMI', year: 'Valid to 2031', href: '' },
  ],

  posts: [],
  testimonials: [],
  achievements: { featured: [], others: [] },
};
