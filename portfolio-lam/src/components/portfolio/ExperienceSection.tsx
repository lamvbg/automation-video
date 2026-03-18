import { Building2, Calendar } from "lucide-react";

interface Experience {
  id: number;
  company: string;
  role: string;
  period: string;
  description: string;
}

interface ExperienceSectionProps {
  experience: Experience[];
}

export const ExperienceSection = ({ experience }: ExperienceSectionProps) => {
  return (
    <section id="experience" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Work <span className="gradient-text">Experience</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            My professional journey and career milestones
          </p>
        </div>

        {/* Timeline */}
        <div className="max-w-3xl mx-auto">
          {experience.map((exp, index) => (
            <div
              key={exp.id}
              className="relative pl-8 pb-12 last:pb-0 animate-fade-up"
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              {/* Timeline line */}
              {index !== experience.length - 1 && (
                <div className="absolute left-[11px] top-10 bottom-0 w-0.5 bg-gradient-to-b from-primary to-accent/30" />
              )}

              {/* Timeline dot */}
              <div className="absolute left-0 top-1 w-6 h-6 rounded-full gradient-bg flex items-center justify-center shadow-soft">
                <div className="w-2 h-2 rounded-full bg-primary-foreground" />
              </div>

              {/* Content */}
              <div className="card-glass rounded-2xl p-6 border border-border hover:border-primary/30 transition-all duration-300 ml-4">
                <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
                  <div>
                    <h3 className="text-xl font-semibold text-foreground">{exp.role}</h3>
                    <div className="flex items-center gap-2 text-primary">
                      <Building2 className="w-4 h-4" />
                      <span className="font-medium">{exp.company}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground text-sm bg-secondary px-3 py-1 rounded-full">
                    <Calendar className="w-4 h-4" />
                    <span>{exp.period}</span>
                  </div>
                </div>
                <p className="text-muted-foreground">{exp.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
