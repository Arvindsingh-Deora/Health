// 'use server';

/**
 * @fileOverview Analyzes an image of a skin condition to identify potential conditions, remedies, and specialists.
 *
 * - analyzeSkinCondition - A function that handles the skin condition analysis process.
 * - AnalyzeSkinConditionInput - The input type for the analyzeSkinCondition function.
 * - AnalyzeSkinConditionOutput - The return type for the analyzeSkinCondition function.
 */

'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeSkinConditionInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      'A photo of a skin condition, as a data URI that must include a MIME type and use Base64 encoding. Expected format: data:<mimetype>;base64,<encoded_data>.'
    ),
  additionalDetails: z
    .string()
    .optional()
    .describe('Any additional details about the skin condition.'),
});

export type AnalyzeSkinConditionInput = z.infer<typeof AnalyzeSkinConditionInputSchema>;

const AnalyzeSkinConditionOutputSchema = z.object({
  potentialConditions: z
    .string()
    .describe('Potential skin conditions based on the image.'),
  possibleRemedies: z.string().describe('Possible remedies for the identified conditions.'),
  recommendedSpecialists: z
    .string()
    .describe('Recommended medical specialists for further consultation.'),
});

export type AnalyzeSkinConditionOutput = z.infer<typeof AnalyzeSkinConditionOutputSchema>;

export async function analyzeSkinCondition(
  input: AnalyzeSkinConditionInput
): Promise<AnalyzeSkinConditionOutput> {
  return analyzeSkinConditionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeSkinConditionPrompt',
  input: {schema: AnalyzeSkinConditionInputSchema},
  output: {schema: AnalyzeSkinConditionOutputSchema},
  prompt: `You are a dermatology expert analyzing skin conditions based on images.

Analyze the following image and provide potential conditions, possible remedies, and recommended specialists.

Image: {{media url=photoDataUri}}

Additional Details: {{{additionalDetails}}}

Ensure your response is clear, concise, and easy to understand for a non-medical professional.
`,
});

const analyzeSkinConditionFlow = ai.defineFlow(
  {
    name: 'analyzeSkinConditionFlow',
    inputSchema: AnalyzeSkinConditionInputSchema,
    outputSchema: AnalyzeSkinConditionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
