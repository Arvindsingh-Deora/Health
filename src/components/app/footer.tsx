export function AppFooter() {
  return (
    <footer className="py-6 px-4 md:px-6 bg-muted/50 mt-12">
      <div className="container mx-auto text-center">
        <p className="text-sm text-muted-foreground">
          This is an AI-powered tool and not a substitute for professional medical advice. Always consult a healthcare provider for any health concerns.
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          Built with Next.js and Firebase
        </p>
      </div>
    </footer>
  );
}
