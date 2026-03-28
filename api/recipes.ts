import { neon } from "@neondatabase/serverless";
import type { VercelRequest, VercelResponse } from "@vercel/node";

const sql = neon(process.env.DATABASE_URL!);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === "GET") {
    const recipes = await sql`SELECT * FROM recipes ORDER BY created_at DESC`;
    return res.json(recipes);
  }

  if (req.method === "POST") {
    const { title, description, instructions, servings, cook_time_minutes } = req.body;

    if (!title || !instructions) {
      return res.status(400).json({ error: "title and instructions are required" });
    }

    const [recipe] = await sql`
      INSERT INTO recipes (title, description, instructions, servings, cook_time_minutes)
      VALUES (${title}, ${description}, ${instructions}, ${servings}, ${cook_time_minutes})
      RETURNING *
    `;
    return res.status(201).json(recipe);
  }

  if (req.method === "PATCH") {
    const { id, favorite } = req.body;

    if (id === undefined || favorite === undefined) {
      return res.status(400).json({ error: "id and favorite are required" });
    }

    const [recipe] = await sql`
      UPDATE recipes SET favorite = ${favorite} WHERE id = ${id} RETURNING *
    `;
    return res.json(recipe);
  }

  return res.status(405).json({ error: "Method not allowed" });
}
