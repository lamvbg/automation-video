import type { Project } from '@/types';
import { Section } from '../ui';
import { ProjectCard } from './ProjectCard';

interface ProjectGridProps {
  projects: Project[];
}

export function ProjectGrid({ projects }: ProjectGridProps) {
  const featuredProjects = projects.filter((project) => project.featured);

  return (
    <Section
      id="projects"
      title="Featured Projects"
      subtitle="A selection of my recent work and personal projects"
    >
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {featuredProjects.map((project, index) => (
          <ProjectCard key={project.id} project={project} index={index} />
        ))}
      </div>
    </Section>
  );
}
