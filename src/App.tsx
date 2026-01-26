import {
  Hero,
  Stats,
  ProjectGrid,
  TechStack,
  Testimonials,
  ExperienceTimeline,
  Footer,
} from '@/components';
import { portfolioData } from '@/data/portfolio';

function App() {
  const { personal, projects, techStack, testimonials, experience, stats } = portfolioData;

  return (
    <div className="min-h-screen bg-slate-950">
      <main>
        <Hero data={personal} />
        <Stats data={stats} />
        <ProjectGrid projects={projects} />
        <TechStack data={techStack} />
        <Testimonials data={testimonials} />
        <ExperienceTimeline data={experience} />
      </main>
      <Footer data={personal} />
    </div>
  );
}

export default App;
