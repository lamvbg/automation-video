import { Code2, Server, Database, Cloud, Smartphone, Wrench } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface TechCategory {
  category: string;
  description: string;
  technologies: string[];
}

interface TechStackSectionProps {
  techStack: TechCategory[];
}

const categoryIcons: Record<string, React.ElementType> = {
  Frontend: Code2,
  Backend: Server,
  Database: Database,
  DevOps: Cloud,
  Mobile: Smartphone,
  Tools: Wrench,
};

export const TechStackSection = ({ techStack }: TechStackSectionProps) => {
  return (
    <section id="skills" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Tech <span className="gradient-text">Stack</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Technologies and tools I use to bring ideas to life
          </p>
        </div>

        {/* Tech Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {techStack.map((category, index) => {
            const Icon = categoryIcons[category.category] || Code2;
            return (
              <div
                key={category.category}
                className="card-glass rounded-2xl p-6 border border-border hover:border-primary/30 transition-all duration-300 group animate-fade-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl gradient-bg flex items-center justify-center shadow-soft group-hover:shadow-elevated transition-shadow">
                    <Icon className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-foreground">{category.category}</h3>
                    <p className="text-sm text-muted-foreground">{category.description}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {category.technologies.map((tech) => (
                    <Badge
                      key={tech}
                      variant="secondary"
                      className="px-3 py-1 text-sm font-medium bg-secondary hover:bg-primary hover:text-primary-foreground transition-colors cursor-default"
                    >
                      {tech}
                    </Badge>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
