import type { PortfolioData } from '@/types';

export const portfolioData: PortfolioData = {
  personal: {
    name: "Vũ Bảo Lâm",
    title: "Back-end Developer",
    tagline: "I build scalable backend systems with Python & Go",
    bio: "Back-end Developer with strong experience in Python and Go. Skilled in building scalable backend systems, microservices, event-driven workflows, and cloud-native architecture. Responsible, quick learner, and focused on writing clean, maintainable, production-grade code.",
    avatar: "/avatar.jpg",
    email: "tungseo201@gmail.com",
    location: "Da Nang, Vietnam",
    social: {
      github: "https://github.com/lamvbg",
      linkedin: "",
      twitter: ""
    }
  },
  projects: [
    {
      id: 1,
      title: "Lamigo — AI Training Platform",
      description: "Built AI-driven modules for training sales employees using dynamic conversation scenarios. Integrated VAPI for auto-generating training flows and sales practice simulations.",
      image: "/projects/project-1.jpg",
      tags: ["Python", "FastAPI", "PostgreSQL", "Celery", "Docker"],
      link: "",
      github: "https://github.com/lamvbg",
      featured: true,
      year: "2024"
    },
    {
      id: 2,
      title: "Shefit — Fitness Application",
      description: "Developed backend for workout programs, nutrition plans, and progress tracking. Built API for trainers, personalized fitness suggestions and client dashboards.",
      image: "/projects/project-2.jpg",
      tags: ["Django", "PostgreSQL", "Redis", "Docker"],
      link: "",
      github: "https://github.com/lamvbg",
      featured: true,
      year: "2024"
    },
    {
      id: 3,
      title: "Cosmo BE — Marketing Platform",
      description: "Implemented backend services for marketing campaigns using Go. Built automated email pipelines with bulk sending, reply tracking, and message parsing.",
      image: "/projects/project-3.jpg",
      tags: ["Go", "Fiber", "PostgreSQL", "Redis", "Docker"],
      link: "",
      github: "https://github.com/lamvbg",
      featured: true,
      year: "2024"
    }
  ],
  testimonials: [
    {
      id: 1,
      name: "Nguyen Van Minh",
      role: "Tech Lead",
      company: "Rockship",
      content: "Lâm delivered exceptional work on our internal tooling and automation pipelines. His expertise in event-driven systems and background workers significantly improved our workflow.",
      avatar: "/testimonials/avatar-1.jpg"
    },
    {
      id: 2,
      name: "Tran Hoang Long",
      role: "Project Manager",
      company: "Freelance Client",
      content: "Working with Lâm was a great experience. He built robust APIs and data pipelines with excellent code quality. Very reliable and professional.",
      avatar: "/testimonials/avatar-2.jpg"
    },
    {
      id: 3,
      name: "Le Thi Mai",
      role: "Product Owner",
      company: "Lamigo",
      content: "Lâm's deep understanding of Python and FastAPI made our AI training platform a success. His clean code and attention to detail are impressive.",
      avatar: "/testimonials/avatar-3.jpg"
    }
  ],
  techStack: [
    {
      category: "Backend",
      description: "Scalable server-side applications and APIs",
      technologies: ["Python", "Go", "FastAPI", "Django", "Fiber", "NestJS"]
    },
    {
      category: "Database",
      description: "Data storage and caching solutions",
      technologies: ["PostgreSQL", "Redis"]
    },
    {
      category: "DevOps",
      description: "Deployment and infrastructure management",
      technologies: ["Docker", "Ubuntu VPS", "CI/CD", "Git"]
    },
    {
      category: "Tools",
      description: "Development and productivity tools",
      technologies: ["Celery", "Message Queues", "VAPI", "Linux"]
    }
  ],
  experience: [
    {
      id: 1,
      company: "Rockship",
      role: "Backend Developer",
      period: "Apr 2024 - Present",
      description: "Contributed to internal tooling, automation pipelines. Worked with event-driven systems using message queues and background workers. Maintained production services, improved performance and optimized database queries."
    },
    {
      id: 2,
      company: "Freelance",
      role: "Backend Developer",
      period: "Oct 2023 - Apr 2024",
      description: "Built and delivered multiple commercial backend projects in Python and Go. Developed APIs, data pipelines, authentication systems and worker services. Managed deployments using Ubuntu VPS, Docker and CI/CD pipelines."
    },
    {
      id: 3,
      company: "Company",
      role: "Intern - Backend Developer",
      period: "Nov 2023 - Jan 2024",
      description: "Participated in building the Human Resource Management System. Developed backend features such as personnel management, authorization, authentication and internal data processing using NestJS, PostgreSQL, Docker."
    }
  ],
  stats: {
    yearsExperience: 1,
    projectsCompleted: 5,
    happyClients: 8,
    coffeeConsumed: 500
  }
};
