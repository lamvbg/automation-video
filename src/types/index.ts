export interface Social {
  github: string;
  linkedin: string;
  twitter: string;
}

export interface Personal {
  name: string;
  title: string;
  tagline: string;
  bio: string;
  avatar: string;
  email: string;
  location: string;
  social: Social;
}

export interface Project {
  id: number;
  title: string;
  description: string;
  image: string;
  tags: string[];
  link: string;
  github: string;
  featured: boolean;
  year: string;
}

export interface Testimonial {
  id: number;
  name: string;
  role: string;
  company: string;
  content: string;
  avatar: string;
}

export interface TechCategory {
  category: string;
  description: string;
  technologies: string[];
}

export interface Experience {
  id: number;
  company: string;
  role: string;
  period: string;
  description: string;
}

export interface Stats {
  yearsExperience: number;
  projectsCompleted: number;
  happyClients: number;
  coffeeConsumed: number;
}

export interface PortfolioData {
  personal: Personal;
  projects: Project[];
  testimonials: Testimonial[];
  techStack: TechCategory[];
  experience: Experience[];
  stats: Stats;
}
