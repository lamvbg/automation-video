import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';
import type { Testimonial } from '@/types';
import { Section } from './ui';

interface TestimonialsProps {
  data: Testimonial[];
}

export function Testimonials({ data }: TestimonialsProps) {
  if (data.length === 0) return null;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
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
      id="testimonials"
      title="Testimonials"
      subtitle="What clients and colleagues say about working with me"
    >
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
        className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {data.map((testimonial) => (
          <motion.div
            key={testimonial.id}
            variants={itemVariants}
            className="glass rounded-xl p-6 hover:border-emerald-500/50 transition-all duration-300 group relative"
          >
            {/* Quote icon */}
            <div className="absolute top-4 right-4 text-emerald-500/20 group-hover:text-emerald-500/30 transition-colors">
              <Quote className="w-8 h-8" />
            </div>

            {/* Content */}
            <p className="text-slate-300 mb-6 leading-relaxed relative z-10">
              "{testimonial.content}"
            </p>

            {/* Author */}
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-emerald-500/30">
                <img
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(testimonial.name)}&background=10b981&color=fff&size=96`;
                  }}
                />
              </div>
              <div>
                <h4 className="font-semibold text-slate-100">{testimonial.name}</h4>
                <p className="text-sm text-slate-400">
                  {testimonial.role} at {testimonial.company}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </Section>
  );
}
