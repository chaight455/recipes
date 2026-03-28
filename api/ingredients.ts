import { neon } from "@neondatabase/serverless";
import type { VercelRequest, VercelResponse } from "@vercel/node";

const sql = neon(process.env.DATABASE_URL!);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === "GET") {
    const ingredients = await sql`SELECT * FROM ingredients ORDER BY name ASC`;
    return res.json(ingredients);
  }

  if (req.method === "POST") {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ error: "name is required" });
    }

    const [ingredient] = await sql`
      INSERT INTO ingredients (name)
      VALUES (${name})
      ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
      RETURNING *
    `;
    return res.status(201).json(ingredient);
  }

  return res.status(405).json({ error: "Method not allowed" });
}
