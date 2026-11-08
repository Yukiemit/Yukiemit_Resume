// Order here = order on the page and in the sidebar index.
// A section only appears when `has(data)` is true, so empty sections hide themselves.
export const ALL_SECTIONS = [
  { id: 'work', label: 'Projects', has: (d) => d.projects?.length },
  { id: 'background', label: 'Background', has: (d) => d.education?.length || d.experience?.length },
  { id: 'writing', label: 'Writing', has: (d) => d.posts?.length },
  { id: 'certifications', label: 'Certifications', has: (d) => d.certifications?.length },
  { id: 'kind-words', label: 'Kind words', has: (d) => d.testimonials?.length },
  {
    id: 'achievements',
    label: 'Achievements',
    has: (d) => d.achievements?.featured?.length || d.achievements?.others?.length,
  },
  { id: 'activity', label: 'Activity', has: () => true },
  { id: 'contact', label: 'Contact', has: () => true },
];

export const getSections = (data) => ALL_SECTIONS.filter((s) => s.has(data));
