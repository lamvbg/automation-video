import { motion } from 'framer-motion';
import { Briefcase } from 'lucide-react';
import type { Experience } from '@/types';
import { Section } from './ui';

interface ExperienceTimelineProps {
  data: Experience[];
}

export function ExperienceTimeline({ data }: ExperienceTimelineProps) {
  return (
    <Section
      id="experience"
      title="Experience"
      subtitle="My professional journey and key projects"
    >
      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-px bg-slate-800 transform md:-translate-x-1/2" />

        <div className="space-y-12">
          {data.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`relative flex flex-col md:flex-row gap-8 ${
                index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
              }`}
            >
              {/* Timeline dot */}
              <div className="absolute left-0 md:left-1/2 w-4 h-4 bg-emerald-500 rounded-full border-4 border-slate-950 transform -translate-x-1/2 md:-translate-x-1/2 z-10" />

              {/* Content card */}
              <div
                className={`ml-8 md:ml-0 md:w-1/2 ${
                  index % 2 === 0 ? 'md:pr-12' : 'md:pl-12'
                }`}
              >
                <div className="glass rounded-xl p-6 hover:border-emerald-500/50 transition-all duration-300">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                      <Briefcase className="w-4 h-4" />
                    </div>
                    <span className="text-sm text-emerald-400 font-medium">
                      {item.period}
                    </span>
                  </div>

                  <h3 className="text-lg font-semibold text-slate-100 mb-1">
                    {item.role}
                  </h3>
                  <p className="text-slate-400 text-sm mb-3">{item.company}</p>
                  <p className="text-slate-400">{item.description}</p>
                </div>
              </div>

              {/* Spacer for alternating layout */}
              <div className="hidden md:block md:w-1/2" />
            </motion.div>
          ))}
        </div>
      </div>
    </Section>
  );
}
