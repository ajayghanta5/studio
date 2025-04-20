'use server';
/**
 * @fileOverview This file defines the suggestRecipes flow, which suggests recipes based on a list of ingredients.
 *
 * - suggestRecipes - A function that suggests recipes based on the identified ingredients.
 * - SuggestRecipesInput - The input type for the suggestRecipes function.
 * - SuggestRecipesOutput - The return type for the suggestRecipes function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const SuggestRecipesInputSchema = z.object({
  ingredients: z.array(
    z.string().describe('A list of ingredients identified from the image.')
  ).describe('The list of ingredients to generate recipes for.'),
});
export type SuggestRecipesInput = z.infer<typeof SuggestRecipesInputSchema>;

const SuggestRecipesOutputSchema = z.object({
  recipes: z.array(
    z.object({
      name: z.string().describe('The name of the recipe.'),
      description: z.string().describe('A short description of the recipe.'),
      ingredients: z.array(z.string()).describe('The list of ingredients for the recipe.'),
      instructions: z.string().describe('The instructions for the recipe.'),
    })
  ).describe('A list of suggested recipes.'),
});
export type SuggestRecipesOutput = z.infer<typeof SuggestRecipesOutputSchema>;

export async function suggestRecipes(input: SuggestRecipesInput): Promise<SuggestRecipesOutput> {
  return suggestRecipesFlow(input);
}

const suggestRecipesPrompt = ai.definePrompt({
  name: 'suggestRecipesPrompt',
  input: {
    schema: z.object({
      ingredients: z.array(
        z.string().describe('A list of ingredients identified from the image.')
      ).describe('The list of ingredients to generate recipes for.'),
    }),
  },
  output: {
    schema: z.object({
      recipes: z.array(
        z.object({
          name: z.string().describe('The name of the recipe.'),
          description: z.string().describe('A short description of the recipe.'),
          ingredients: z.array(z.string()).describe('The list of ingredients for the recipe.'),
          instructions: z.string().describe('The instructions for the recipe.'),
        })
      ).describe('A list of suggested recipes.'),
    }),
  },
  prompt: `You are a recipe suggestion AI. Given the following list of ingredients, suggest some recipes that can be made with them.

Ingredients: {{{ingredients}}}

Recipes:`,
});

const suggestRecipesFlow = ai.defineFlow<
  typeof SuggestRecipesInputSchema,
  typeof SuggestRecipesOutputSchema
>(
  {
    name: 'suggestRecipesFlow',
    inputSchema: SuggestRecipesInputSchema,
    outputSchema: SuggestRecipesOutputSchema,
  },
  async input => {
    const {output} = await suggestRecipesPrompt(input);
    return output!;
  }
);
