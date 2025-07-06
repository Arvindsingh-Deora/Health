'use client';

import { useRef, useState } from 'react';
import type { AnalyzeSkinConditionOutput } from '@/ai/flows/analyze-skin-condition';
import type { AnalyzeMedicationTabletOutput } from '@/ai/flows/analyze-medication-tablet';
import type { DecideAdditionalInfoOutput } from '@/ai/flows/decide-additional-info';
import { translateText } from '@/ai/flows/translate-text';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, HeartPulse, Pill, Stethoscope, Info, Download, Languages, ThumbsUp, ThumbsDown, Loader2 } from 'lucide-react';

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

type AnalysisResult = AnalyzeSkinConditionOutput | AnalyzeMedicationTabletOutput;

interface ResultsDisplayProps {
  results: AnalysisResult;
  additionalInfo: DecideAdditionalInfoOutput | null;
  analysisType: 'skin' | 'tablet';
}

function isSkinCondition(result: AnalysisResult, type: string): result is AnalyzeSkinConditionOutput {
  return type === 'skin';
}

export function ResultsDisplay({ results, additionalInfo, analysisType }: ResultsDisplayProps) {
  const resultsRef = useRef<HTMLDivElement>(null);
  const [isTranslating, setIsTranslating] = useState(false);
  const [isTranslated, setIsTranslated] = useState(false);
  const [translatedContent, setTranslatedContent] = useState<AnalysisResult | null>(null);

  const handleDownloadPdf = () => {
    const input = resultsRef.current;
    if (input) {
      html2canvas(input, { scale: 2, useCORS: true, backgroundColor: '#ffffff' }).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const imgWidth = canvas.width;
        const imgHeight = canvas.height;
        const ratio = imgWidth / imgHeight;
        
        let width = pdfWidth - 20;
        let height = width / ratio;
        
        if (height > pdfHeight - 20) {
            height = pdfHeight - 20;
            width = height * ratio;
        }

        const x = (pdfWidth - width) / 2;
        const y = 10;
        
        pdf.addImage(imgData, 'PNG', x, y, width, height);
        pdf.save('Health-Analysis-Results.pdf');
      });
    }
  };

  const handleTranslate = async () => {
    if (isTranslated) {
      setIsTranslated(false);
      setTranslatedContent(null);
      return;
    }

    if (!results) return;
    setIsTranslating(true);
    
    try {
        const targetLanguage = 'Hindi';
        let translatedResult: AnalysisResult;

        const translate = async (text: string | undefined): Promise<string> => {
            if (!text) return '';
            const res = await translateText({ text, targetLanguage });
            return res.translatedText;
        };

        if (isSkinCondition(results, analysisType)) {
            const [potentialConditions, possibleRemedies, recommendedSpecialists] = await Promise.all([
                translate(results.potentialConditions),
                translate(results.possibleRemedies),
                translate(results.recommendedSpecialists),
            ]);
            translatedResult = { potentialConditions, possibleRemedies, recommendedSpecialists };
        } else {
            const [benefits, risks] = await Promise.all([
                translate((results as AnalyzeMedicationTabletOutput).benefits),
                translate((results as AnalyzeMedicationTabletOutput).risks),
            ]);
            translatedResult = { benefits, risks };
        }
        setTranslatedContent(translatedResult);
        setIsTranslated(true);
    } catch (error) {
        console.error("Translation failed:", error);
        // You could add a user-facing error message here (e.g., using a toast)
    } finally {
        setIsTranslating(false);
    }
  };

  const currentResults = isTranslated && translatedContent ? translatedContent : results;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
        <h2 className="text-3xl font-bold font-headline text-center">Analysis Results</h2>
        <div className="flex gap-2">
            <Button onClick={handleTranslate} variant="outline" disabled={isTranslating}>
              {isTranslating ? <Loader2 className="animate-spin" /> : <Languages />}
              <span>{isTranslated ? 'Show Original' : 'Translate to Hindi'}</span>
            </Button>
            <Button onClick={handleDownloadPdf} variant="outline">
              <Download />
              <span>Download PDF</span>
            </Button>
        </div>
      </div>
      
      <div className="space-y-4" ref={resultsRef}>
        {isSkinCondition(currentResults, analysisType) ? (
          <>
            <ResultCard icon={<HeartPulse />} title="Potential Conditions" content={currentResults.potentialConditions} />
            <ResultCard icon={<Pill />} title="Possible Remedies" content={currentResults.possibleRemedies} />
            <ResultCard icon={<Stethoscope />} title="Recommended Specialists" content={currentResults.recommendedSpecialists}>
              {!isTranslated && (
                <a href="#" className="inline-block mt-4">
                  <Button className="w-full md:w-auto font-bold">
                      Book an Appointment
                  </Button>
                </a>
              )}
            </ResultCard>
          </>
        ) : (
          <>
            <ResultCard icon={<ThumbsUp className="text-green-500" />} title="Benefits" content={(currentResults as AnalyzeMedicationTabletOutput).benefits} />
            <ResultCard icon={<ThumbsDown className="text-red-500" />} title="Risks & Side Effects" content={(currentResults as AnalyzeMedicationTabletOutput).risks} />
          </>
        )}

        {additionalInfo?.includeAdditionalInfo && (
          <Card className="bg-accent/20 border-accent/30">
            <CardHeader>
                <CardTitle className="flex items-center gap-3 text-accent-foreground">
                    <Info/>
                    <span className="font-headline">Additional Information</span>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-accent-foreground/80">{additionalInfo.reason}</p>
            </CardContent>
          </Card>
        )}

        <Card className="bg-yellow-50 border-yellow-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-yellow-900">
              <AlertCircle className="text-yellow-600" /> 
              <span className="font-headline">Disclaimer</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-yellow-800">
              The analysis provided is generated by AI and is for informational purposes only. It is not a substitute for professional medical diagnosis or advice. Please consult with a qualified healthcare provider for any health concerns.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

interface ResultCardProps {
    icon: React.ReactNode;
    title: string;
    content: string;
    children?: React.ReactNode;
}

function ResultCard({ icon, title, content, children }: ResultCardProps) {
    return (
        <Card className="bg-white shadow-md print:shadow-none print:border">
            <CardHeader>
                <CardTitle className="flex items-center gap-3 text-primary">
                    <span className="flex-shrink-0">{icon}</span>
                    <span className="font-headline text-xl">{title}</span>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="text-foreground/90 space-y-2">
                    {content?.split('\n').filter(line => line.trim() !== '').map((line, index) => (
                        <p key={index}>{line.replace(/(\*\*|__)(.*?)\1/g, '<strong>$2</strong>')}</p>
                    ))}
                </div>
                {children}
            </CardContent>
        </Card>
    );
}
