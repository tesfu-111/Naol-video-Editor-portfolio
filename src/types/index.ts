export type ProjectCategory =
  | 'Short-Form Content'
  | 'YouTube Editing'
  | 'Reels and TikTok'
  | 'Music Videos'
  | 'Cinematic Edits'
  | 'Promotional Videos'
  | 'Motion Graphics'
  | 'Color Grading';

export const ALL_CATEGORIES: ProjectCategory[] = [
  'Short-Form Content',
  'YouTube Editing',
  'Reels and TikTok',
  'Music Videos',
  'Cinematic Edits',
  'Promotional Videos',
  'Motion Graphics',
  'Color Grading',
];

export type VideoType = 'direct' | 'youtube' | 'vimeo' | 'mp4' | 'drive';

export interface PortfolioProject {
  id: string;
  title: string;
  description: string;
  category: ProjectCategory;
  thumbnail: string;
  previewVideo?: string;
  fullVideoSource: string;
  videoType: VideoType;
  clientName?: string;
  editingSoftware?: string;
  projectDate?: string;
  published: boolean;
  featured: boolean;
  order: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface SiteSettings {
  id: string;
  heroBgMode: 'image' | 'video';
  heroImageUrl: string;
  heroVideoUrl: string;
  heroHeadline: string;
  heroSubtitle: string;
  primaryBtnText: string;
  secondaryBtnText: string;
  siteName: string;
  logoText: string;
  seoTitle: string;
  seoDescription: string;
  accentColor: string;
  // About Me
  aboutPortraitUrl: string;
  aboutBio: string;
  aboutExperience: string;
  aboutSpecialties: string;
  aboutSkills: string;
  aboutCreativeProcess: string;
  aboutLocation: string;
  aboutAvailability: string;
  aboutResumeUrl: string;
  // Contact & Socials
  contactEmail: string;
  contactWhatsapp: string;
  contactTelegram: string;
  contactInstagram: string;
  contactTiktok: string;
  contactYoutube: string;
  contactLinkedin: string;
  updatedAt?: string;
}

export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  category?: string;
  showPricing: boolean;
  priceEstimate?: string;
  features?: string[] | string;
  order: number;
}

export interface ContactInquiry {
  id: string;
  fullName: string;
  email: string;
  company?: string;
  requestedService: string;
  budget?: string;
  deadline?: string;
  description: string;
  referenceLink?: string;
  status: 'new' | 'reviewed' | 'archived';
  createdAt: string;
}

export interface MediaAsset {
  id: string;
  name: string;
  originalName: string;
  fileType: string;
  size: number;
  url: string;
  category: 'image' | 'video' | 'document';
  uploadedAt: string;
}
