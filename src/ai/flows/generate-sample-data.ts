'use server';

/**
 * @fileOverview Defines a Genkit flow to generate sample JSON data for certificate templates using AI.
 *
 * This flow takes a list of template variables (e.g., 'recipient.name') and returns a
 * plausible JSON object string that can be used for live previews.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateSampleDataInputSchema = z.object({
  variables: z.array(z.string()).describe('A list of variable keys found in the template, which may use dot notation.'),
});
export type GenerateSampleDataInput = z.infer<typeof GenerateSampleDataInputSchema>;

const GenerateSampleDataOutputSchema = z.object({
  jsonData: z.string().describe('A string containing a valid, nested JSON object with sample data for the provided variables.'),
});
export type GenerateSampleDataOutput = z.infer<typeof GenerateSampleDataOutputSchema>;

export async function generateSampleData(input: GenerateSampleDataInput): Promise<GenerateSampleDataOutput> {
  return generateSampleDataFlow(input);
}

const generateSampleDataPrompt = ai.definePrompt({
  name: 'generateSampleDataPrompt',
  input: {schema: GenerateSampleDataInputSchema},
  output: {schema: GenerateSampleDataOutputSchema},
  prompt: `You are an AI assistant that generates sample JSON data for testing certificate templates.
Given a list of variable keys, create a single, valid JSON object that provides plausible sample data for each key.
The keys use dot notation (e.g., "recipient.name"), which you MUST convert into nested JSON objects. For example, keys like "firma_1.nombre" and "firma_1.puesto" should be grouped under a "firma_1" object.
For dates, use a YYYY-MM-DD format. For names, use varied and creative fictional names instead of common placeholders. For job titles, use realistic but diverse roles.

Your response MUST be a single JSON object as a string assigned to the 'jsonData' field. Do not include any explanations, comments, or markdown formatting like \`\`\`json.

Variable Keys:
{{#each variables}}
- {{this}}
{{/each}}
`,
});

// Helper function to clean up model output
function cleanJsonString(str: string): string {
    let cleaned = str.trim();
    if (cleaned.startsWith('```json')) {
        cleaned = cleaned.substring(7).trim();
    } else if (cleaned.startsWith('```')) {
        cleaned = cleaned.substring(3).trim();
    }
    if (cleaned.endsWith('```')) {
        cleaned = cleaned.substring(0, cleaned.length - 3).trim();
    }
    return cleaned;
}

const generateSampleDataFlow = ai.defineFlow(
  {
    name: 'generateSampleDataFlow',
    inputSchema: GenerateSampleDataInputSchema,
    outputSchema: GenerateSampleDataOutputSchema,
  },
  async (input) => {
    if (input.variables.length === 0) {
        return {jsonData: "{}"};
    }
    const {output} = await generateSampleDataPrompt(input);
    const cleanedJson = cleanJsonString(output!.jsonData);
    
    try {
        JSON.parse(cleanedJson);
        return { jsonData: cleanedJson };
    } catch (e) {
        console.error("AI generated invalid JSON:", cleanedJson);
        throw new Error("La IA generó una respuesta JSON inválida.");
    }
  }
);
