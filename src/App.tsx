import { useState, useEffect } from "react";
import CreateRecipe from "./CreateRecipe";

interface Recipe {
  id: number;
  title: string;
  description: string | null;
  instructions: string;
  servings: number | null;
  cook_time_minutes: number | null;
  favorite: boolean;
  created_at: string;
}

type View = "list" | "create";
type Tab = "all" | "favorites";

function App() {
  const [view, setView] = useState<View>("list");
  const [tab, setTab] = useState<Tab>("all");
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecipes();
  }, []);

  async function fetchRecipes() {
    setLoading(true);
    try {
      const res = await fetch("/api/recipes");
      const data = await res.json();
      setRecipes(data);
    } finally {
      setLoading(false);
    }
  }

  async function toggleFavorite(recipe: Recipe) {
    const newFavorite = !recipe.favorite;
    setRecipes(recipes.map((r) => (r.id === recipe.id ? { ...r, favorite: newFavorite } : r)));
    await fetch("/api/recipes", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: recipe.id, favorite: newFavorite }),
    });
  }

  if (view === "create") {
    return (
      <CreateRecipe
        onBack={() => setView("list")}
        onCreated={() => {
          setView("list");
          fetchRecipes();
        }}
      />
    );
  }

  const displayed = tab === "favorites" ? recipes.filter((r) => r.favorite) : recipes;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-10 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-semibold text-gray-900 dark:text-white">Recipes</h1>
          <button
            onClick={() => setView("create")}
            className="rounded-lg bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 active:scale-[0.98] text-white font-medium px-4 py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 transition-all cursor-pointer"
          >
            + Add Recipe
          </button>
        </div>

        <div className="flex gap-1 mb-6 border-b border-gray-200 dark:border-gray-700">
          {(["all", "favorites"] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 text-sm font-medium transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-1 rounded-t capitalize ${
                tab === t
                  ? "text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
              }`}
            >
              {t === "favorites" ? "♥ Favorites" : "All"}
            </button>
          ))}
        </div>

        {loading ? (
          <p className="text-sm text-gray-500 dark:text-gray-400">Loading…</p>
        ) : displayed.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">
            {tab === "favorites"
              ? "No favorites yet. Heart a recipe to save it here."
              : "No recipes yet. Add one to get started."}
          </p>
        ) : (
          <div className="space-y-3">
            {displayed.map((recipe) => (
              <div
                key={recipe.id}
                className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 px-4 py-4 flex items-start justify-between gap-3"
              >
                <div className="min-w-0">
                  <h2 className="text-base font-medium text-gray-900 dark:text-white">
                    {recipe.title}
                  </h2>
                  {recipe.description && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                      {recipe.description}
                    </p>
                  )}
                  {(recipe.servings || recipe.cook_time_minutes) && (
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                      {recipe.cook_time_minutes ? `${recipe.cook_time_minutes} min` : ""}
                      {recipe.cook_time_minutes && recipe.servings ? " · " : ""}
                      {recipe.servings ? `${recipe.servings} servings` : ""}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => toggleFavorite(recipe)}
                  className={`shrink-0 text-xl leading-none transition-all active:scale-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-1 rounded cursor-pointer ${
                    recipe.favorite
                      ? "text-red-500 hover:text-red-400"
                      : "text-gray-300 dark:text-gray-600 hover:text-red-400"
                  }`}
                  aria-label={recipe.favorite ? "Remove from favorites" : "Add to favorites"}
                >
                  ♥
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
