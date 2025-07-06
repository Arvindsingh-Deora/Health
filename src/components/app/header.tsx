import { HeartPulse } from 'lucide-react';

export function AppHeader() {
  return (
    <header className="py-4 px-4 md:px-6 border-b border-primary/10 shadow-sm bg-white/30">
      <div className="container mx-auto flex items-center gap-3">
        <HeartPulse className="h-8 w-8 text-primary" />
        <h1 className="text-2xl font-bold font-headline text-foreground">
          Healthcare AI
        </h1>
      </div>
    </header>
  );
}
