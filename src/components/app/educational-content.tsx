import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Lightbulb } from 'lucide-react';

export function EducationalContent() {
  return (
    <Card className="bg-white/60 backdrop-blur-sm sticky top-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-headline text-xl">
          <Lightbulb className="text-primary" />
          Health & Safety Guidance
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full" defaultValue="item-1">
          <AccordionItem value="item-1">
            <AccordionTrigger className="font-semibold text-left">Tips for Healthy Skin</AccordionTrigger>
            <AccordionContent className="space-y-3 text-muted-foreground">
              <p>
                <strong>Stay Hydrated:</strong> Drink plenty of water throughout the day to keep your skin hydrated from the inside out.
              </p>
              <p>
                <strong>Protect from Sun:</strong> Use a broad-spectrum sunscreen with SPF 30 or higher every day, even when it's cloudy.
              </p>
              <p>
                <strong>Gentle Cleansing:</strong> Wash your face with a gentle cleanser and lukewarm water. Avoid harsh soaps and scrubbing.
              </p>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger className="font-semibold text-left">Medication Safety 101</AccordionTrigger>
            <AccordionContent className="space-y-3 text-muted-foreground">
              <p>
                <strong>Follow Instructions:</strong> Always take medication exactly as prescribed by your doctor and as directed on the label.
              </p>
              <p>
                <strong>Check for Interactions:</strong> Inform your doctor and pharmacist about all other medications, supplements, and vitamins you are taking.
              </p>
              <p>
                <strong>Store Properly:</strong> Keep medicines in a cool, dry place, away from children and pets. Do not use expired medication.
              </p>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger className="font-semibold text-left">When to See a Doctor</AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              <p>
                While this AI tool can provide preliminary information, it's crucial to consult a healthcare professional for persistent, severe, or concerning symptoms. Early diagnosis and treatment are key to managing health conditions effectively.
              </p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
}
