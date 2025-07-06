import { AnalysisTool } from '@/components/app/analysis-tool';
import { EducationalContent } from '@/components/app/educational-content';
import { AppFooter } from '@/components/app/footer';
import { AppHeader } from '@/components/app/header';

export default function Home() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <AppHeader />
      <main className="flex-1 container mx-auto px-4 py-8 md:py-12">
        <div className="grid gap-12 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <AnalysisTool />
          </div>
          <div className="lg:col-span-2">
            <EducationalContent />
          </div>
        </div>
      </main>
      <AppFooter />
    </div>
  );
}
