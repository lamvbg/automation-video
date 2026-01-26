import { motion } from 'framer-motion';
import { Calendar, FolderGit2, Users, Coffee } from 'lucide-react';
import type { Stats as StatsType } from '@/types';

interface StatsProps {
  data: StatsType;
}

export function Stats({ data }: StatsProps) {
  const stats = [
    {
      label: 'Years Experience',
      value: data.yearsExperience,
      suffix: '+',
      icon: Calendar,
    },
    {
      label: 'Projects Completed',
      value: data.projectsCompleted,
      suffix: '+',
      icon: FolderGit2,
    },
    {
      label: 'Happy Clients',
      value: data.happyClients,
      suffix: '+',
      icon: Users,
    },
    {
      label: 'Coffee Consumed',
      value: data.coffeeConsumed,
      suffix: '+',
      icon: Coffee,
    },
  ];

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
    <section className="py-16 border-y border-slate-800 bg-slate-900/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8"
        >
          {stats.map((stat) => (
            <motion.div
              key={stat.label}
              variants={itemVariants}
              className="text-center group"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 mb-4 rounded-xl bg-emerald-500/10 text-emerald-400 group-hover:bg-emerald-500/20 transition-colors">
                <stat.icon className="w-6 h-6" />
              </div>
              <div className="text-3xl md:text-4xl font-bold text-slate-100 mb-1">
                {stat.value}
                <span className="text-emerald-400">{stat.suffix}</span>
              </div>
              <div className="text-slate-400 text-sm">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
