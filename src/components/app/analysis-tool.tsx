'use client';

import { useState } from 'react';
import type { AnalyzeSkinConditionOutput } from '@/ai/flows/analyze-skin-condition';
import type { AnalyzeMedicationTabletOutput } from '@/ai/flows/analyze-medication-tablet';
import { analyzeSkinCondition } from '@/ai/flows/analyze-skin-condition';
import { analyzeMedicationTablet } from '@/ai/flows/analyze-medication-tablet';
import { decideAdditionalInfo, type DecideAdditionalInfoOutput } from '@/ai/flows/decide-additional-info';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal, Pill, ScanFace, Loader2 } from 'lucide-react';
import { ImageUploader } from './image-uploader';
import { LoadingSkeleton } from './loading-skeleton';
import { ResultsDisplay } from './results-display';

// Combining output types for state
type AnalysisResult = AnalyzeSkinConditionOutput | AnalyzeMedicationTabletOutput;

export function AnalysisTool() {
  const [analysisType, setAnalysisType] = useState<'skin' | 'tablet'>('skin');
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [additionalDetails, setAdditionalDetails] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<AnalysisResult | null>(null);
  const [additionalInfo, setAdditionalInfo] = useState<DecideAdditionalInfoOutput | null>(null);

  const handleFileChange = (selectedFile: File | null) => {
    if (selectedFile) {
      setFile(selectedFile);
      if (previewUrl) {
          URL.revokeObjectURL(previewUrl);
      }
      setPreviewUrl(URL.createObjectURL(selectedFile));
      // Reset previous results when a new file is uploaded
      setResults(null);
      setError(null);
      setAdditionalInfo(null);
    } else {
      setFile(null);
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      setPreviewUrl(null);
    }
  };
  
  const handleTabChange = (value: string) => {
    setAnalysisType(value as 'skin' | 'tablet');
    handleFileChange(null);
  };

  const handleAnalyze = async () => {
    if (!file) {
      setError('Please upload an image first.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setResults(null);
    setAdditionalInfo(null);

    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = async () => {
        const photoDataUri = reader.result as string;

        try {
          let analysisResult: AnalysisResult;
          let conditionForTool: string = '';
          let analysisResultForTool: string = '';
          
          if (analysisType === 'skin') {
            const result = await analyzeSkinCondition({ photoDataUri, additionalDetails });
            analysisResult = result;
            conditionForTool = result.potentialConditions;
            analysisResultForTool = `Possible Remedies: ${result.possibleRemedies}. Specialists: ${result.recommendedSpecialists}`;
          } else {
            const result = await analyzeMedicationTablet({ photoDataUri });
            analysisResult = result;
            conditionForTool = "Medication Tablet";
            analysisResultForTool = `Benefits: ${result.benefits}\nRisks: ${result.risks}`;
          }

          setResults(analysisResult);
          
          const decision = await decideAdditionalInfo({
            condition: conditionForTool,
            analysisResult: analysisResultForTool
          });
          setAdditionalInfo(decision);

        } catch (e) {
          console.error(e);
          setError('An error occurred during AI analysis. Please try again.');
        } finally {
          setIsLoading(false);
        }
      };
      reader.onerror = () => {
        setError('Failed to read the file.');
        setIsLoading(false);
      };
    } catch (err) {
      setError('An error occurred. Please try again.');
      setIsLoading(false);
    }
  };

  const tabStyle =
    'data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-none';

  return (
    <Card className="bg-white/60 backdrop-blur-sm shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline text-3xl">AI Health Assistant</CardTitle>
        <CardDescription>Upload an image for analysis. Our AI will provide insights into skin conditions or identify medication.</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={analysisType} onValueChange={handleTabChange} className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-primary/5 h-12">
            <TabsTrigger value="skin" className={`${tabStyle} text-base`}><ScanFace className="mr-2 h-5 w-5" /> Skin Analysis</TabsTrigger>
            <TabsTrigger value="tablet" className={`${tabStyle} text-base`}><Pill className="mr-2 h-5 w-5" /> Pill Identifier</TabsTrigger>
          </TabsList>
          <div className="mt-6">
            <TabsContent value="skin" className="m-0 space-y-4">
                <ImageUploader onFileChange={handleFileChange} previewUrl={previewUrl} />
                <div>
                  <label htmlFor="additional-details" className="block text-sm font-medium text-foreground mb-2">Additional Details (Optional)</label>
                  <Textarea
                    id="additional-details"
                    placeholder="e.g., 'It started 3 days ago, it's itchy, no pain...'"
                    value={additionalDetails}
                    onChange={(e) => setAdditionalDetails(e.target.value)}
                  />
                </div>
            </TabsContent>
            <TabsContent value="tablet" className="m-0">
              <ImageUploader onFileChange={handleFileChange} previewUrl={previewUrl} />
            </TabsContent>
          </div>
        </Tabs>
        
        <Button onClick={handleAnalyze} disabled={!file || isLoading} className="w-full mt-6 text-lg py-6 font-bold">
          {isLoading ? <><Loader2 className="mr-2 h-5 w-5 animate-spin" />Analyzing...</> : 'Analyze Image'}
        </Button>

        {error && (
          <Alert variant="destructive" className="mt-6">
            <Terminal className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <div className="mt-8">
          {isLoading && <LoadingSkeleton analysisType={analysisType} />}
          {!isLoading && results && (
            <ResultsDisplay results={results} additionalInfo={additionalInfo} analysisType={analysisType} />
          )}
        </div>
      </CardContent>
    </Card>
  );
}
