'use server';

/**
 * @fileOverview Este archivo define un flujo de Genkit para refinar el texto de plantillas de certificados usando IA.
 *
 * El flujo toma el texto de un certificado como entrada y devuelve sugerencias impulsadas por IA para mejorar el tono, la claridad y la gramática.
 * Exporta la función `refineTemplateText`, el tipo `RefineTemplateTextInput` y el tipo `RefineTemplateTextOutput`.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RefineTemplateTextInputSchema = z.object({
  templateText: z.string().describe('El contenido de texto estático de la plantilla de certificado a refinar.'),
});
export type RefineTemplateTextInput = z.infer<typeof RefineTemplateTextInputSchema>;

const RefineTemplateTextOutputSchema = z.object({
  refinedText: z.string().describe('El texto refinado por IA con un tono, claridad y gramática mejorados.'),
  suggestions: z.array(z.string()).describe('Sugerencias específicas para mejorar el texto.'),
});
export type RefineTemplateTextOutput = z.infer<typeof RefineTemplateTextOutputSchema>;

export async function refineTemplateText(input: RefineTemplateTextInput): Promise<RefineTemplateTextOutput> {
  return refineTemplateTextFlow(input);
}

const refineTemplateTextPrompt = ai.definePrompt({
  name: 'refineTemplateTextPrompt',
  input: {schema: RefineTemplateTextInputSchema},
  output: {schema: RefineTemplateTextOutputSchema},
  prompt: `Eres un asistente de IA que ayuda a refinar el texto de las plantillas de certificados.

  Dado el siguiente texto de plantilla, proporciona una versión refinada con un tono, claridad y gramática mejorados.
  Además, proporciona sugerencias específicas sobre los cambios que realizaste.

  Texto de la Plantilla: {{{templateText}}}

  Texto Refinado y Sugerencias:`,
});

const refineTemplateTextFlow = ai.defineFlow(
  {
    name: 'refineTemplateTextFlow',
    inputSchema: RefineTemplateTextInputSchema,
    outputSchema: RefineTemplateTextOutputSchema,
  },
  async input => {
    const {output} = await refineTemplateTextPrompt(input);
    return output!;
  }
);
