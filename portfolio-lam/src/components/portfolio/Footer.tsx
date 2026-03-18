import { Heart } from "lucide-react";

interface FooterProps {
  name: string;
}

export const Footer = ({ name }: FooterProps) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-8 bg-card border-t border-border">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-muted-foreground text-sm">
            © {currentYear} {name}. All rights reserved.
          </p>
          <p className="text-muted-foreground text-sm flex items-center gap-1">
            Made with <Heart className="w-4 h-4 text-primary fill-primary" /> using React & TailwindCSS
          </p>
        </div>
      </div>
    </footer>
  );
};
