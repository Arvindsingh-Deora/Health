import { Linkedin, Instagram, Globe } from 'lucide-react';

export function AppFooter() {
  return (
    <footer className="py-6 px-4 md:px-6 bg-muted/50 mt-12 border-t">
      <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center text-center sm:text-left gap-4">
        <p className="text-sm text-muted-foreground">
          Made by{' '}
          <a
            href="https://www.linkedin.com/in/arvindsingh-deora-043707223/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-foreground hover:text-primary"
          >
            Arvind Singh Deora
          </a>
        </p>
        <div className="flex items-center gap-6">
          <a
            href="https://webnew-front.onrender.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-primary transition-colors"
            aria-label="Portfolio Website"
          >
            <Globe className="h-5 w-5" />
          </a>
          <a
            href="https://www.linkedin.com/in/arvindsingh-deora-043707223/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-primary transition-colors"
            aria-label="LinkedIn Profile"
          >
            <Linkedin className="h-5 w-5" />
          </a>
          <a
            href="https://www.instagram.com/arvind_deora_12/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-primary transition-colors"
            aria-label="Instagram Profile"
          >
            <Instagram className="h-5 w-5" />
          </a>
        </div>
      </div>
    </footer>
  );
}
