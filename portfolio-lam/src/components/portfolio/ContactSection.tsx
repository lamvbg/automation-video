import { Mail, MapPin, Github, Linkedin, Twitter, Send } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ContactSectionProps {
  personal: {
    email: string;
    location: string;
    social: {
      github: string;
      linkedin: string;
      twitter: string;
    };
  };
}

export const ContactSection = ({ personal }: ContactSectionProps) => {
  return (
    <section id="contact" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Let's <span className="gradient-text">Connect</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Have a project in mind? Let's discuss how I can help bring your ideas to life.
            </p>
          </div>

          {/* Contact Card */}
          <div className="card-glass rounded-3xl p-8 md:p-12 border border-border text-center animate-fade-up">
            {/* Contact Info */}
            <div className="flex flex-wrap justify-center gap-8 mb-10">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl gradient-bg flex items-center justify-center shadow-soft">
                  <Mail className="w-6 h-6 text-primary-foreground" />
                </div>
                <div className="text-left">
                  <div className="text-sm text-muted-foreground">Email</div>
                  <a 
                    href={`mailto:${personal.email}`} 
                    className="font-medium text-foreground hover:text-primary transition-colors"
                  >
                    {personal.email}
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl gradient-bg flex items-center justify-center shadow-soft">
                  <MapPin className="w-6 h-6 text-primary-foreground" />
                </div>
                <div className="text-left">
                  <div className="text-sm text-muted-foreground">Location</div>
                  <span className="font-medium text-foreground">{personal.location}</span>
                </div>
              </div>
            </div>

            {/* CTA */}
            <Button 
              size="lg" 
              className="gradient-bg text-primary-foreground font-semibold px-10 py-6 text-lg shadow-elevated hover:opacity-90 transition-opacity mb-10"
              asChild
            >
              <a href={`mailto:${personal.email}`}>
                <Send className="w-5 h-5 mr-2" />
                Send Me a Message
              </a>
            </Button>

            {/* Social Links */}
            <div className="pt-8 border-t border-border">
              <p className="text-muted-foreground mb-4">Or find me on</p>
              <div className="flex items-center justify-center gap-4">
                <Button
                  variant="outline"
                  size="lg"
                  className="rounded-xl hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-300"
                  asChild
                >
                  <a href={personal.social.github} target="_blank" rel="noopener noreferrer">
                    <Github className="w-5 h-5 mr-2" />
                    GitHub
                  </a>
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="rounded-xl hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-300"
                  asChild
                >
                  <a href={personal.social.linkedin} target="_blank" rel="noopener noreferrer">
                    <Linkedin className="w-5 h-5 mr-2" />
                    LinkedIn
                  </a>
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="rounded-xl hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-300"
                  asChild
                >
                  <a href={personal.social.twitter} target="_blank" rel="noopener noreferrer">
                    <Twitter className="w-5 h-5 mr-2" />
                    Twitter
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
