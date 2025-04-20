'use client';

import {useState} from 'react';
import {identifyIngredients} from '@/ai/flows/identify-ingredients';
import {suggestRecipes} from '@/ai/flows/suggest-recipes';
import {Button} from '@/components/ui/button';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {Input} from '@/components/ui/input';
import {Textarea} from '@/components/ui/textarea';
import {Loader2} from 'lucide-react';

export default function Home() {
  const [photoUrl, setPhotoUrl] = useState('');
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [recipes, setRecipes] = useState<
    {
      name: string;
      description: string;
      ingredients: string[];
      instructions: string;
    }[]
  >([]);
  const [loadingIngredients, setLoadingIngredients] = useState(false);
  const [loadingRecipes, setLoadingRecipes] = useState(false);

  const handleIdentifyIngredients = async () => {
    setLoadingIngredients(true);
    try {
      const result = await identifyIngredients({photoUrl});
      setIngredients(result.ingredients);
    } catch (error) {
      console.error('Error identifying ingredients:', error);
      alert('Failed to identify ingredients. Please check the photo URL and try again.');
    } finally {
      setLoadingIngredients(false);
    }
  };

  const handleSuggestRecipes = async () => {
    setLoadingRecipes(true);
    try {
      const result = await suggestRecipes({ingredients});
      setRecipes(
        result.recipes.map(recipe => ({
          ...recipe,
          ingredients: recipe.ingredients, // Ensure ingredients are not null
        }))
      );
    } catch (error) {
      console.error('Error suggesting recipes:', error);
      alert('Failed to suggest recipes. Please ensure ingredients are identified and try again.');
    } finally {
      setLoadingRecipes(false);
    }
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">Recipe Snap</h1>
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Identify Ingredients</CardTitle>
          <CardDescription>Upload a photo URL to identify the ingredients.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="flex flex-col space-y-2">
            <Input
              type="url"
              placeholder="Enter photo URL"
              value={photoUrl}
              onChange={e => setPhotoUrl(e.target.value)}
            />
            <Button onClick={handleIdentifyIngredients} disabled={loadingIngredients}>
              {loadingIngredients ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Identifying...
                </>
              ) : (
                'Identify Ingredients'
              )}
            </Button>
          </div>
          {ingredients.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Identified Ingredients:</h3>
              <ul className="list-disc list-inside">
                {ingredients.map((ingredient, index) => (
                  <li key={index}>{ingredient}</li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Suggest Recipes</CardTitle>
          <CardDescription>Generate recipes based on the identified ingredients.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={handleSuggestRecipes} disabled={loadingRecipes || ingredients.length === 0}>
            {loadingRecipes ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Suggesting Recipes...
              </>
            ) : (
              'Suggest Recipes'
            )}
          </Button>
        </CardContent>
      </Card>

      {recipes.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Suggested Recipes:</h2>
          <div className="grid gap-4">
            {recipes.map((recipe, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle>{recipe.name}</CardTitle>
                  <CardDescription>{recipe.description}</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Ingredients:</h3>
                    <ul className="list-disc list-inside">
                      {recipe.ingredients.map((ingredient, idx) => (
                        <li key={idx}>{ingredient}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Instructions:</h3>
                    <Textarea className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" value={recipe.instructions} readOnly />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
