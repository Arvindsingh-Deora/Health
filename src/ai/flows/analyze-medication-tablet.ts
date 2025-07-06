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
      'A photo of a medication tablet, as a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.'
    ),
});
export type AnalyzeMedicationTabletInput = z.infer<typeof AnalyzeMedicationTabletInputSchema>;

const AnalyzeMedicationTabletOutputSchema = z.object({
  benefits: z.string().describe("A summary of the medication's benefits and intended use. List the key points."),
  risks: z.string().describe('A summary of the potential risks, side effects, and contraindications. List the key points.'),
});
export type AnalyzeMedicationTabletOutput = z.infer<typeof AnalyzeMedicationTabletOutputSchema>;

export async function analyzeMedicationTablet(input: AnalyzeMedicationTabletInput): Promise<AnalyzeMedicationTabletOutput> {
  return analyzeMedicationTabletFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeMedicationTabletPrompt',
  input: {schema: AnalyzeMedicationTabletInputSchema},
  output: {schema: AnalyzeMedicationTabletOutputSchema},
  prompt: `You are a pharmacist. A user has provided an image of a medication tablet. You will identify the tablet and provide a summary of its known benefits (pros) and potential risks (cons).

- For benefits, describe what the medication is used for and how it helps.
- For risks, list common side effects and important warnings.
- Structure your response clearly under the headings of benefits and risks.

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
