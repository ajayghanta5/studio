'use server';
/**
 * @fileOverview This file defines a Genkit flow for identifying ingredients from an image.
 *
 * - identifyIngredients - A function that takes an image URL and returns a list of identified ingredients.
 * - IdentifyIngredientsInput - The input type for the identifyIngredients function.
 * - IdentifyIngredientsOutput - The return type for the identifyIngredients function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const IdentifyIngredientsInputSchema = z.object({
  photoUrl: z.string().describe('The URL of the image containing ingredients.'),
});
export type IdentifyIngredientsInput = z.infer<typeof IdentifyIngredientsInputSchema>;

const IdentifyIngredientsOutputSchema = z.object({
  ingredients: z.array(
    z.string().describe('A list of ingredients identified in the image.')
  ).describe('List of identified ingredients')
});
export type IdentifyIngredientsOutput = z.infer<typeof IdentifyIngredientsOutputSchema>;

export async function identifyIngredients(input: IdentifyIngredientsInput): Promise<IdentifyIngredientsOutput> {
  return identifyIngredientsFlow(input);
}

const identifyIngredientsPrompt = ai.definePrompt({
  name: 'identifyIngredientsPrompt',
  input: {
    schema: z.object({
      photoUrl: z.string().describe('The URL of the image containing ingredients.'),
    }),
  },
  output: {
    schema: z.object({
      ingredients: z.array(
        z.string().describe('An ingredient identified in the image.')
      ).describe('List of identified ingredients')
    }),
  },
  prompt: `You are an AI that identifies ingredients from a photo.  The user will provide a URL to a photo, and you should identify the ingredients in the photo.

Consider different visual and contextual clues to accurately name the ingredients.

Return a list of strings representing the identified ingredients.

Photo: {{media url=photoUrl}}`,
});

const identifyIngredientsFlow = ai.defineFlow<
  typeof IdentifyIngredientsInputSchema,
  typeof IdentifyIngredientsOutputSchema
>(
  {
    name: 'identifyIngredientsFlow',
    inputSchema: IdentifyIngredientsInputSchema,
    outputSchema: IdentifyIngredientsOutputSchema,
  },
  async input => {
    const {output} = await identifyIngredientsPrompt(input);
    return output!;
  }
);
