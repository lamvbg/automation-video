import { Github, Linkedin, Twitter, Mail, MapPin, Heart } from 'lucide-react';
import type { Personal } from '@/types';

interface FooterProps {
  data: Personal;
}

export function Footer({ data }: FooterProps) {
  const socialLinks = [
    { url: data.social.github, icon: Github, label: 'GitHub' },
    { url: data.social.linkedin, icon: Linkedin, label: 'LinkedIn' },
    { url: data.social.twitter, icon: Twitter, label: 'Twitter' },
  ].filter((link) => link.url !== '');

  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-800 bg-slate-900/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl py-12">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <h3 className="text-xl font-bold text-slate-100 mb-2">{data.name}</h3>
            <p className="text-slate-400 mb-4">{data.title}</p>
            <p className="text-slate-500 text-sm">{data.tagline}</p>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-4">
              Contact
            </h4>
            <ul className="space-y-3">
              <li>
                <a
                  href={`mailto:${data.email}`}
                  className="flex items-center gap-2 text-slate-400 hover:text-emerald-400 transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  {data.email}
                </a>
              </li>
              <li className="flex items-center gap-2 text-slate-400">
                <MapPin className="w-4 h-4" />
                {data.location}
              </li>
            </ul>
          </div>

          {/* Social */}
          {socialLinks.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-4">
                Connect
              </h4>
              <div className="flex gap-3">
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
            </div>
          )}
        </div>

        {/* Copyright */}
        <div className="pt-8 border-t border-slate-800 text-center">
          <p className="text-slate-500 text-sm flex items-center justify-center gap-1">
            <span>&copy; {currentYear} {data.name}. Built with</span>
            <Heart className="w-4 h-4 text-red-500 fill-red-500" />
            <span>using React & TailwindCSS</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
