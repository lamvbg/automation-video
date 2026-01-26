import type { PortfolioData } from '@/types';

export const portfolioData: PortfolioData = {
  personal: {
    name: "Lam Vu",
    title: "Middle Golang Developer",
    tagline: "I build Golang, Go & Gin solutions",
    bio: "Backend developer with 4+ years building high-performance services and distributed systems. I focus on clean code and scalable solutions.",
    avatar: "/avatar.jpg",
    email: "son@example.com",
    location: "Vietnam",
    social: {
      github: "https://github.com/psonit",
      linkedin: "",
      twitter: ""
    }
  },
  projects: [
    {
      id: 1,
      title: "E-commerce API",
      description: "High-throughput REST API handling 500K+ requests/day",
      image: "/projects/project-1.jpg",
      tags: ["Go", "Gin", "PostgreSQL", "Redis"],
      link: "",
      github: "https://github.com/psonit/ecommerce-api",
      featured: true,
      year: "2024"
    },
    {
      id: 2,
      title: "Payment Gateway",
      description: "Microservices for fintech with gRPC communication",
      image: "/projects/project-2.jpg",
      tags: ["Go", "gRPC", "Kafka", "Docker"],
      link: "",
      github: "https://github.com/psonit/payment-gateway",
      featured: true,
      year: "2024"
    },
    {
      id: 3,
      title: "Data Pipeline",
      description: "Real-time processing with Kafka",
      image: "/projects/project-3.jpg",
      tags: ["Go", "Kafka", "Kubernetes"],
      link: "",
      github: "https://github.com/psonit/data-pipeline",
      featured: true,
      year: "2024"
    }
  ],
  testimonials: [
    {
      id: 1,
      name: "Nguyen Van Minh",
      role: "Tech Lead",
      company: "FPT Software",
      content: "Phong Son delivered exceptional work on our e-commerce platform. His Go expertise and attention to performance optimization helped us handle peak traffic seamlessly.",
      avatar: "/testimonials/avatar-1.jpg"
    },
    {
      id: 2,
      name: "Tran Hoang Long",
      role: "CTO",
      company: "VNG Corporation",
      content: "Working with Phong was a great experience. He built a robust payment gateway that processes millions of transactions daily with zero downtime.",
      avatar: "/testimonials/avatar-2.jpg"
    },
    {
      id: 3,
      name: "Le Thi Mai",
      role: "Product Manager",
      company: "Grab Vietnam",
      content: "Phong's deep understanding of distributed systems and Kafka made our data pipeline project a success. Highly recommend for backend development.",
      avatar: "/testimonials/avatar-3.jpg"
    }
  ],
  techStack: [
    {
      category: "Backend",
      description: "Scalable server-side applications and APIs",
      technologies: ["Golang", "Go", "Gin", "Echo", "gRPC"]
    },
    {
      category: "Database",
      description: "Data storage and management solutions",
      technologies: ["PostgreSQL", "MySQL", "Redis", "SQL"]
    },
    {
      category: "DevOps",
      description: "Deployment and infrastructure management",
      technologies: ["Docker", "Kubernetes", "AWS", "GCP", "Git"]
    },
    {
      category: "Tools",
      description: "Development and productivity tools",
      technologies: ["RabbitMQ", "Kafka", "Linux"]
    }
  ],
  experience: [
    {
      id: 1,
      company: "Project: E-commerce API",
      role: "Middle Golang Developer",
      period: "2023 - Present",
      description: "Built high-throughput REST API handling 500K+ requests/day using Gin framework"
    },
    {
      id: 2,
      company: "Project: Payment Gateway",
      role: "Middle Golang Developer",
      period: "2022 - 2023",
      description: "Developed microservices architecture with gRPC communication for fintech platform"
    },
    {
      id: 3,
      company: "Project: Data Pipeline",
      role: "Middle Golang Developer",
      period: "2021 - 2022",
      description: "Implemented real-time data processing pipeline with Kafka and Go"
    }
  ],
  stats: {
    yearsExperience: 4,
    projectsCompleted: 6,
    happyClients: 10,
    coffeeConsumed: 800
  }
};
