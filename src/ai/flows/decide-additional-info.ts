// This is a server action.
'use server';

/**
 * @fileOverview A tool to decide whether to include additional relevant health information in the AI results.
 *
 * - decideAdditionalInfo - A function that decides whether to include additional health information.
 * - DecideAdditionalInfoInput - The input type for the decideAdditionalInfo function.
 * - DecideAdditionalInfoOutput - The return type for the decideAdditionalInfo function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DecideAdditionalInfoInputSchema = z.object({
  condition: z.string().describe('The identified skin condition or medication tablet.'),
  analysisResult: z.string().describe('The AI analysis result.'),
});
export type DecideAdditionalInfoInput = z.infer<typeof DecideAdditionalInfoInputSchema>;

const DecideAdditionalInfoOutputSchema = z.object({
  includeAdditionalInfo: z
    .boolean()
    .describe('Whether or not to include additional relevant health information.'),
  reason: z
    .string()
    .describe('The reason for the decision to include or not include additional information.'),
});
export type DecideAdditionalInfoOutput = z.infer<typeof DecideAdditionalInfoOutputSchema>;

export async function decideAdditionalInfo(input: DecideAdditionalInfoInput): Promise<DecideAdditionalInfoOutput> {
  return decideAdditionalInfoFlow(input);
}

const prompt = ai.definePrompt({
  name: 'decideAdditionalInfoPrompt',
  input: {schema: DecideAdditionalInfoInputSchema},
  output: {schema: DecideAdditionalInfoOutputSchema},
  prompt: `You are an AI assistant that helps decide whether to include additional relevant health information based on the AI analysis result.

  Condition: {{{condition}}}
  Analysis Result: {{{analysisResult}}}

  Based on the provided condition and analysis result, determine whether additional health information should be included.
  Consider factors such as the severity of the condition, potential risks, and the user's understanding of the information.
  Return a boolean value indicating whether to include additional information and a brief reason for your decision.

  {{output}}
  `,
});

const decideAdditionalInfoFlow = ai.defineFlow(
  {
    name: 'decideAdditionalInfoFlow',
    inputSchema: DecideAdditionalInfoInputSchema,
    outputSchema: DecideAdditionalInfoOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
