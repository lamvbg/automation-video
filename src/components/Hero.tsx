import { motion } from 'framer-motion';
import { Github, Linkedin, Twitter, MapPin, Mail } from 'lucide-react';
import type { Personal } from '@/types';
import { Button } from './ui';

interface HeroProps {
  data: Personal;
}

export function Hero({ data }: HeroProps) {
  const socialLinks = [
    { url: data.social.github, icon: Github, label: 'GitHub' },
    { url: data.social.linkedin, icon: Linkedin, label: 'LinkedIn' },
    { url: data.social.twitter, icon: Twitter, label: 'Twitter' },
  ].filter((link) => link.url !== '');

  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/5 via-transparent to-transparent" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          {/* Avatar */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="relative"
          >
            <div className="w-48 h-48 md:w-64 md:h-64 rounded-full overflow-hidden border-4 border-emerald-500/30 shadow-2xl shadow-emerald-500/20">
              <img
                src={data.avatar}
                alt={data.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(data.name)}&background=10b981&color=fff&size=256`;
                }}
              />
            </div>
            <div className="absolute inset-0 rounded-full animate-glow" />
          </motion.div>

          {/* Content */}
          <div className="text-center lg:text-left flex-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <p className="text-emerald-400 font-medium mb-2">{data.tagline}</p>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-100 mb-4">
                {data.name}
              </h1>
              <p className="text-xl md:text-2xl text-slate-400 mb-6">{data.title}</p>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-slate-400 text-lg max-w-xl mb-6 mx-auto lg:mx-0"
            >
              {data.bio}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-wrap items-center justify-center lg:justify-start gap-4 mb-8 text-slate-400"
            >
              <span className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-400" />
                {data.location}
              </span>
              <span className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-emerald-400" />
                {data.email}
              </span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex flex-wrap items-center justify-center lg:justify-start gap-4"
            >
              <Button href={`mailto:${data.email}`} variant="primary" size="lg">
                Get in Touch
              </Button>
              <Button href="#projects" variant="outline" size="lg">
                View Projects
              </Button>

              {/* Social Links */}
              {socialLinks.length > 0 && (
                <div className="flex items-center gap-2 ml-2">
                  {socialLinks.map(({ url, icon: Icon, label }) => (
                    <a
                      key={label}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-slate-400 hover:text-emerald-400 hover:bg-slate-800 rounded-lg transition-colors"
                      aria-label={label}
                    >
                      <Icon className="w-5 h-5" />
                    </a>
                  ))}
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
