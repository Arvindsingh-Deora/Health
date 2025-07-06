// This is a server-side file.
'use server';

/**
 * @fileOverview Analyzes an image of a medication tablet and provides a summary of its benefits, risks, and usage.
 *
 * - analyzeMedicationTablet - A function that handles the medication tablet analysis process.
 * - AnalyzeMedicationTabletInput - The input type for the analyzeMedicationTablet function.
 * - AnalyzeMedicationTabletOutput - The return type for the analyzeMedicationTablet function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeMedicationTabletInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      'A photo of a medication tablet, as a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.'    ),
});
export type AnalyzeMedicationTabletInput = z.infer<typeof AnalyzeMedicationTabletInputSchema>;

const AnalyzeMedicationTabletOutputSchema = z.object({
  summary: z.string().describe('A summary of the medication tablet, including its benefits, risks, and usage guidelines.'),
});
export type AnalyzeMedicationTabletOutput = z.infer<typeof AnalyzeMedicationTabletOutputSchema>;

export async function analyzeMedicationTablet(input: AnalyzeMedicationTabletInput): Promise<AnalyzeMedicationTabletOutput> {
  return analyzeMedicationTabletFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeMedicationTabletPrompt',
  input: {schema: AnalyzeMedicationTabletInputSchema},
  output: {schema: AnalyzeMedicationTabletOutputSchema},
  prompt: `You are a pharmacist. A user has provided an image of a medication tablet. You will provide a summary of the medication tablet, including its known benefits, risks, and usage guidelines.

  Here is the image of the medication tablet: {{media url=photoDataUri}}`,
});

const analyzeMedicationTabletFlow = ai.defineFlow(
  {
    name: 'analyzeMedicationTabletFlow',
    inputSchema: AnalyzeMedicationTabletInputSchema,
    outputSchema: AnalyzeMedicationTabletOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
