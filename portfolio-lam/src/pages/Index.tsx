import portfolioData from "@/data/portfolio.json";
import { Navbar } from "@/components/portfolio/Navbar";
import { HeroSection } from "@/components/portfolio/HeroSection";
import { StatsSection } from "@/components/portfolio/StatsSection";
import { TechStackSection } from "@/components/portfolio/TechStackSection";
import { ProjectsSection } from "@/components/portfolio/ProjectsSection";
import { ExperienceSection } from "@/components/portfolio/ExperienceSection";
import { TestimonialsSection } from "@/components/portfolio/TestimonialsSection";
import { ContactSection } from "@/components/portfolio/ContactSection";
import { Footer } from "@/components/portfolio/Footer";

const Index = () => {
  const { personal, projects, testimonials, techStack, experience, stats } = portfolioData;

  return (
    <div className="min-h-screen">
      <Navbar name={personal.name} />
      <HeroSection personal={personal} />
      <StatsSection stats={stats} />
      <TechStackSection techStack={techStack} />
      <ProjectsSection projects={projects} />
      <ExperienceSection experience={experience} />
      <TestimonialsSection testimonials={testimonials} />
      <ContactSection personal={personal} />
      <Footer name={personal.name} />
    </div>
  );
};

export default Index;
