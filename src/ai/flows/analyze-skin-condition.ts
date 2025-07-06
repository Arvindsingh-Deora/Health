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
  prompt: `You are a dermatology expert analyzing skin conditions based on images. Your goal is to provide helpful, clear, and empathetic information.

Analyze the following image and provide:
1.  **Potential Conditions**: List the most likely skin conditions. Be clear that this is not a diagnosis.
2.  **Possible Remedies**: Provide a structured list of remedies. Break this down into three clear sub-sections:
    - **Over-the-Counter Solutions**: Suggest specific types of creams or products.
    - **Home Care & Lifestyle**: Offer practical advice for daily care, like cleansing routines or diet suggestions.
    - **Important Considerations**: Mention things to avoid that might worsen the condition.
3.  **Recommended Specialists**: Suggest the type of medical professional to consult for a proper diagnosis and treatment.

Image: {{media url=photoDataUri}}

Additional Details: {{{additionalDetails}}}

Ensure your response is clear, concise, and easy for a non-medical professional to understand. Use a supportive and reassuring tone.
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
