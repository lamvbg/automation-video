import { Github, Linkedin, Twitter, Mail, MapPin, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface HeroSectionProps {
  personal: {
    name: string;
    title: string;
    tagline: string;
    bio: string;
    avatar: string;
    email: string;
    location: string;
    social: {
      github: string;
      linkedin: string;
      twitter: string;
    };
  };
}

export const HeroSection = ({ personal }: HeroSectionProps) => {
  return (
    <section className="gradient-hero min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-primary/10 blur-3xl animate-float" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-accent/10 blur-3xl animate-float" style={{ animationDelay: '-3s' }} />
      </div>

      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Avatar */}
          <div className="mb-8 animate-fade-up">
            <Avatar className="w-32 h-32 mx-auto ring-4 ring-primary/20 shadow-elevated">
              <AvatarImage src={personal.avatar} alt={personal.name} />
              <AvatarFallback className="text-3xl font-bold gradient-bg text-primary-foreground">
                {personal.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
          </div>

          {/* Name & Title */}
          <div className="animate-fade-up" style={{ animationDelay: '0.1s' }}>
            <h1 className="text-4xl md:text-6xl font-bold mb-4 tracking-tight">
              Hi, I'm <span className="gradient-text">{personal.name}</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-2">
              {personal.title}
            </p>
            <p className="text-lg md:text-xl text-primary font-medium mb-6">
              {personal.tagline}
            </p>
          </div>

          {/* Bio */}
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-8 animate-fade-up" style={{ animationDelay: '0.2s' }}>
            {personal.bio}
          </p>

          {/* Location & Email */}
          <div className="flex flex-wrap items-center justify-center gap-6 mb-8 text-muted-foreground animate-fade-up" style={{ animationDelay: '0.3s' }}>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-primary" />
              <span>{personal.location}</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-primary" />
              <a href={`mailto:${personal.email}`} className="hover:text-primary transition-colors">
                {personal.email}
              </a>
            </div>
          </div>

          {/* Social Links */}
          <div className="flex items-center justify-center gap-4 mb-12 animate-fade-up" style={{ animationDelay: '0.4s' }}>
            <Button
              variant="outline"
              size="icon"
              className="rounded-full hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-300"
              asChild
            >
              <a href={personal.social.github} target="_blank" rel="noopener noreferrer">
                <Github className="w-5 h-5" />
              </a>
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="rounded-full hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-300"
              asChild
            >
              <a href={personal.social.linkedin} target="_blank" rel="noopener noreferrer">
                <Linkedin className="w-5 h-5" />
              </a>
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="rounded-full hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-300"
              asChild
            >
              <a href={personal.social.twitter} target="_blank" rel="noopener noreferrer">
                <Twitter className="w-5 h-5" />
              </a>
            </Button>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 animate-fade-up" style={{ animationDelay: '0.5s' }}>
            <Button size="lg" className="gradient-bg text-primary-foreground font-semibold px-8 shadow-elevated hover:opacity-90 transition-opacity">
              <a href="#projects">View My Work</a>
            </Button>
            <Button variant="outline" size="lg" className="font-semibold px-8 hover:bg-secondary transition-colors">
              <a href="#contact">Get In Touch</a>
            </Button>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <ArrowDown className="w-6 h-6 text-muted-foreground" />
        </div>
      </div>
    </section>
  );
};
