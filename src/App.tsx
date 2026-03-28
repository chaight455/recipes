import { useState } from "react";
import CreateRecipe from "./CreateRecipe";

type View = "list" | "create";

function App() {
  const [view, setView] = useState<View>("list");

  if (view === "create") {
    return <CreateRecipe onBack={() => setView("list")} onCreated={() => setView("list")} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-10 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-semibold text-gray-900 dark:text-white">Recipes</h1>
          <button
            onClick={() => setView("create")}
            className="rounded-lg bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 active:scale-[0.98] text-white font-medium px-4 py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 transition-all cursor-pointer"
          >
            + Add Recipe
          </button>
        </div>

        <p className="text-gray-500 dark:text-gray-400">No recipes yet. Add one to get started.</p>
      </div>
    </div>
  );
}

export default App;
