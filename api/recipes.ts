import { neon } from "@neondatabase/serverless";

export default async function handler(req: Request) {
  const sql = neon(process.env.DATABASE_URL!);

  if (req.method === "GET") {
    const recipes = await sql`SELECT * FROM recipes ORDER BY created_at DESC`;
    return Response.json(recipes);
  }

  if (req.method === "POST") {
    const { title, description, instructions, servings, cook_time_minutes } = await req.json();

    if (!title || !instructions) {
      return Response.json({ error: "title and instructions are required" }, { status: 400 });
    }

    const [recipe] = await sql`
      INSERT INTO recipes (title, description, instructions, servings, cook_time_minutes)
      VALUES (${title}, ${description}, ${instructions}, ${servings}, ${cook_time_minutes})
      RETURNING *
    `;
    return Response.json(recipe, { status: 201 });
  }

  return Response.json({ error: "Method not allowed" }, { status: 405 });
}
