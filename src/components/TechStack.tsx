import { motion } from 'framer-motion';
import { Server, Database, Cloud, Wrench } from 'lucide-react';
import type { TechCategory } from '@/types';
import { Section, Badge } from './ui';

interface TechStackProps {
  data: TechCategory[];
}

const categoryIcons: Record<string, typeof Server> = {
  Backend: Server,
  Database: Database,
  DevOps: Cloud,
  Tools: Wrench,
};

export function TechStack({ data }: TechStackProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <Section
      id="tech"
      title="Tech Stack"
      subtitle="Technologies and tools I work with daily"
    >
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
        className="grid md:grid-cols-2 gap-6"
      >
        {data.map((category) => {
          const Icon = categoryIcons[category.category] || Server;

          return (
            <motion.div
              key={category.category}
              variants={itemVariants}
              className="glass rounded-xl p-6 hover:border-emerald-500/50 transition-all duration-300 group"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="p-3 rounded-lg bg-emerald-500/10 text-emerald-400 group-hover:bg-emerald-500/20 transition-colors">
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-100 mb-1">
                    {category.category}
                  </h3>
                  <p className="text-sm text-slate-400">{category.description}</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {category.technologies.map((tech) => (
                  <Badge key={tech} variant="default" size="md">
                    {tech}
                  </Badge>
                ))}
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </Section>
  );
}
