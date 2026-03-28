import { neon } from "@neondatabase/serverless";

export const config = { runtime: "edge" };

export default async function handler(req: Request) {
  const sql = neon(process.env.DATABASE_URL!);

  if (req.method === "GET") {
    const ingredients = await sql`SELECT * FROM ingredients ORDER BY name ASC`;
    return Response.json(ingredients);
  }

  if (req.method === "POST") {
    const { name } = await req.json();

    if (!name) {
      return Response.json({ error: "name is required" }, { status: 400 });
    }

    const [ingredient] = await sql`
      INSERT INTO ingredients (name)
      VALUES (${name})
      ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
      RETURNING *
    `;
    return Response.json(ingredient, { status: 201 });
  }

  return Response.json({ error: "Method not allowed" }, { status: 405 });
}
