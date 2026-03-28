import { neon } from "@neondatabase/serverless";
import type { VercelRequest, VercelResponse } from "@vercel/node";

const sql = neon(process.env.DATABASE_URL!);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === "GET") {
    const recipeId = req.query.recipe_id;
    if (!recipeId) {
      return res.status(400).json({ error: "recipe_id is required" });
    }

    const ingredients = await sql`
      SELECT ri.id, ri.quantity, ri.unit, i.name
      FROM recipe_ingredients ri
      JOIN ingredients i ON i.id = ri.ingredient_id
      WHERE ri.recipe_id = ${recipeId}
      ORDER BY i.name ASC
    `;
    return res.json(ingredients);
  }

  if (req.method === "POST") {
    const { recipe_id, ingredient_id, quantity, unit } = req.body;

    if (!recipe_id || !ingredient_id) {
      return res.status(400).json({ error: "recipe_id and ingredient_id are required" });
    }

    const [row] = await sql`
      INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
      VALUES (${recipe_id}, ${ingredient_id}, ${quantity}, ${unit})
      RETURNING *
    `;
    return res.status(201).json(row);
  }

  if (req.method === "DELETE") {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({ error: "id is required" });
    }

    await sql`DELETE FROM recipe_ingredients WHERE id = ${id}`;
    return res.status(204).end();
  }

  return res.status(405).json({ error: "Method not allowed" });
}
