'use server';
/**
 * @fileOverview Defines a Genkit flow to suggest a color scheme for a certificate based on a background image.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestOverlayColorInputSchema = z.object({
  photoDataUri: z.string().describe("The background image of the certificate, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."),
});
export type SuggestOverlayColorInput = z.infer<typeof SuggestOverlayColorInputSchema>;

const SuggestOverlayColorOutputSchema = z.object({
  overlayHexColor: z.string().describe('A hex color code for a semi-transparent overlay that complements the image. e.g., #RRGGBB'),
  titleHexColor: z.string().describe('A hex color for the main title that has excellent contrast over the overlay and image. e.g., #RRGGBB'),
  bodyHexColor: z.string().describe('A hex color for paragraph text that is also readable and harmonious. e.g., #RRGGBB'),
});
export type SuggestOverlayColorOutput = z.infer<typeof SuggestOverlayColorOutputSchema>;

export async function suggestOverlayColor(input: SuggestOverlayColorInput): Promise<SuggestOverlayColorOutput> {
  return suggestColorsFlow(input);
}

const suggestColorsPrompt = ai.definePrompt({
  name: 'suggestColorsPrompt',
  input: {schema: SuggestOverlayColorInputSchema},
  output: {schema: SuggestOverlayColorOutputSchema},
  prompt: `You are a design expert specializing in color theory.
Analyze the provided image and its dominant colors.
Based on this analysis, suggest a color palette for a certificate template:
1.  **overlayHexColor**: A hex color for a semi-transparent overlay that complements the image.
2.  **titleHexColor**: A hex color for the main title that has excellent contrast when placed over the semi-transparent overlay on top of the background image.
3.  **bodyHexColor**: A hex color for paragraph text that is also readable and harmonious.

Provide only the hex codes in the format #RRGGBB.

Image: {{media url=photoDataUri}}`,
});

const suggestColorsFlow = ai.defineFlow(
  {
    name: 'suggestColorsFlow',
    inputSchema: SuggestOverlayColorInputSchema,
    outputSchema: SuggestOverlayColorOutputSchema,
  },
  async (input) => {
    const {output} = await suggestColorsPrompt(input);
    return output!;
  }
);
