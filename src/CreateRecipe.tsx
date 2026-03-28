import { useState } from "react";

interface Ingredient {
  name: string;
  quantity: string;
  unit: string;
}

interface Props {
  onBack: () => void;
  onCreated: () => void;
}

export default function CreateRecipe({ onBack, onCreated }: Props) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [instructions, setInstructions] = useState("");
  const [servings, setServings] = useState("");
  const [cookTime, setCookTime] = useState("");
  const [ingredients, setIngredients] = useState<Ingredient[]>([
    { name: "", quantity: "", unit: "" },
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function addIngredient() {
    setIngredients([...ingredients, { name: "", quantity: "", unit: "" }]);
  }

  function removeIngredient(index: number) {
    setIngredients(ingredients.filter((_, i) => i !== index));
  }

  function updateIngredient(index: number, field: keyof Ingredient, value: string) {
    setIngredients(ingredients.map((ing, i) => (i === index ? { ...ing, [field]: value } : ing)));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Create the recipe
      const recipeRes = await fetch("/api/recipes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description: description || null,
          instructions,
          servings: servings ? parseInt(servings) : null,
          cook_time_minutes: cookTime ? parseInt(cookTime) : null,
        }),
      });

      if (!recipeRes.ok) {
        const data = await recipeRes.json();
        throw new Error(data.error || "Failed to create recipe");
      }

      const recipe = await recipeRes.json();

      // Create and link each non-empty ingredient
      const filledIngredients = ingredients.filter((ing) => ing.name.trim());
      for (const ing of filledIngredients) {
        // Upsert ingredient
        const ingRes = await fetch("/api/ingredients", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: ing.name.trim() }),
        });
        if (!ingRes.ok) throw new Error("Failed to create ingredient");
        const ingredient = await ingRes.json();

        // Link to recipe
        const linkRes = await fetch("/api/recipe-ingredients", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            recipe_id: recipe.id,
            ingredient_id: ingredient.id,
            quantity: ing.quantity || null,
            unit: ing.unit || null,
          }),
        });
        if (!linkRes.ok) throw new Error("Failed to link ingredient");
      }

      onCreated();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-10 px-4">
      <div className="max-w-2xl mx-auto">
        <button
          onClick={onBack}
          className="mb-6 flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 active:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 rounded transition-colors cursor-pointer"
        >
          ← Back
        </button>

        <h1 className="text-3xl font-semibold text-gray-900 dark:text-white mb-8">New Recipe</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="e.g. Pasta Carbonara"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Description
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Brief description of the recipe"
            />
          </div>

          {/* Servings + Cook Time */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Servings
              </label>
              <input
                type="number"
                min="1"
                value={servings}
                onChange={(e) => setServings(e.target.value)}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="4"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Cook Time (minutes)
              </label>
              <input
                type="number"
                min="1"
                value={cookTime}
                onChange={(e) => setCookTime(e.target.value)}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="30"
              />
            </div>
          </div>

          {/* Instructions */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Instructions <span className="text-red-500">*</span>
            </label>
            <textarea
              required
              rows={6}
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-y"
              placeholder="Step 1: ..."
            />
          </div>

          {/* Ingredients */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Ingredients
            </label>
            <div className="space-y-2">
              {ingredients.map((ing, i) => (
                <div key={i} className="flex gap-2">
                  <input
                    type="text"
                    value={ing.name}
                    onChange={(e) => updateIngredient(i, "name", e.target.value)}
                    className="flex-1 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Ingredient"
                  />
                  <input
                    type="text"
                    value={ing.quantity}
                    onChange={(e) => updateIngredient(i, "quantity", e.target.value)}
                    className="w-20 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Qty"
                  />
                  <input
                    type="text"
                    value={ing.unit}
                    onChange={(e) => updateIngredient(i, "unit", e.target.value)}
                    className="w-20 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Unit"
                  />
                  {ingredients.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeIngredient(i)}
                      className="px-2 text-gray-400 hover:text-red-500 active:text-red-700 active:scale-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:ring-offset-1 rounded transition-all cursor-pointer"
                      aria-label="Remove ingredient"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={addIngredient}
              className="mt-2 text-sm text-indigo-600 dark:text-indigo-400 hover:underline active:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-1 rounded transition-opacity cursor-pointer"
            >
              + Add ingredient
            </button>
          </div>

          {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed text-white font-medium py-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 transition-all cursor-pointer"
            >
              {loading ? "Saving…" : "Save Recipe"}
            </button>
            <button
              type="button"
              onClick={onBack}
              className="px-5 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 active:bg-gray-200 dark:active:bg-gray-700 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 transition-all cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
