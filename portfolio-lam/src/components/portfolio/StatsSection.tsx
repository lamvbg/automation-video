import { Coffee, Briefcase, Users, Calendar } from "lucide-react";

interface StatsSectionProps {
  stats: {
    yearsExperience: number;
    projectsCompleted: number;
    happyClients: number;
    coffeeConsumed: number;
  };
}

export const StatsSection = ({ stats }: StatsSectionProps) => {
  const statItems = [
    { icon: Calendar, value: stats.yearsExperience, label: "Years Experience", suffix: "+" },
    { icon: Briefcase, value: stats.projectsCompleted, label: "Projects Completed", suffix: "+" },
    { icon: Users, value: stats.happyClients, label: "Happy Clients", suffix: "+" },
    { icon: Coffee, value: stats.coffeeConsumed, label: "Cups of Coffee", suffix: "+" },
  ];

  return (
    <section className="py-16 bg-card border-y border-border">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {statItems.map((item, index) => (
            <div
              key={item.label}
              className="text-center animate-fade-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl gradient-bg mb-4 shadow-soft">
                <item.icon className="w-7 h-7 text-primary-foreground" />
              </div>
              <div className="text-3xl md:text-4xl font-bold text-foreground mb-1">
                {item.value.toLocaleString()}{item.suffix}
              </div>
              <div className="text-muted-foreground text-sm md:text-base">
                {item.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
