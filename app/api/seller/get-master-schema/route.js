import { MongoClient } from "mongodb";
import { authOptions } from "../../auth/[...nextauth]/route";
import { getServerSession } from "next-auth/next";

const mongoUri = process.env.MONGO_CONNECTION_URI;
const client = new MongoClient(mongoUri);

export async function GET(req) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new Response(JSON.stringify({ message: "You must be logged in." }), {
      status: 401,
    });
  }
  try {

    // Establish the database connection
    await client.connect();
    const db = client.db("jazzee");
    const collection = db.collection("master-schema");

    // Fetch all documents from the master-schema collection
    const schemas = await collection.find({}).toArray();

    if (!schemas.length) {
      return new Response(JSON.stringify({ message: "No schemas found" }), {
        status: 404,
      });
    }

    // Return the list of schemas in the response
    return new Response(JSON.stringify(schemas), { status: 200 });
  } catch (error) {
    console.error("Error fetching master schemas:", error);

    // Return an error response if something goes wrong
    return new Response(
      JSON.stringify({ message: "Failed to fetch master schemas" }),
      { status: 500 }
    );
  } finally {
    // Ensure the client is closed after the operation
    await client.close();
  }
}

// Make simple blank GET call...
