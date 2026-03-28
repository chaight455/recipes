import { neon } from "@neondatabase/serverless";

export default async function handler(req: Request) {
  const sql = neon(process.env.DATABASE_URL!);
  const url = new URL(req.url);
  const recipeId = url.searchParams.get("recipe_id");

  if (req.method === "GET") {
    if (!recipeId) {
      return Response.json({ error: "recipe_id is required" }, { status: 400 });
    }

    const ingredients = await sql`
      SELECT ri.id, ri.quantity, ri.unit, i.name
      FROM recipe_ingredients ri
      JOIN ingredients i ON i.id = ri.ingredient_id
      WHERE ri.recipe_id = ${recipeId}
      ORDER BY i.name ASC
    `;
    return Response.json(ingredients);
  }

  if (req.method === "POST") {
    const { recipe_id, ingredient_id, quantity, unit } = await req.json();

    if (!recipe_id || !ingredient_id) {
      return Response.json({ error: "recipe_id and ingredient_id are required" }, { status: 400 });
    }

    const [row] = await sql`
      INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
      VALUES (${recipe_id}, ${ingredient_id}, ${quantity}, ${unit})
      RETURNING *
    `;
    return Response.json(row, { status: 201 });
  }

  if (req.method === "DELETE") {
    const { id } = await req.json();

    if (!id) {
      return Response.json({ error: "id is required" }, { status: 400 });
    }

    await sql`DELETE FROM recipe_ingredients WHERE id = ${id}`;
    return new Response(null, { status: 204 });
  }

  return Response.json({ error: "Method not allowed" }, { status: 405 });
}
