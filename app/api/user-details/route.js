import { MongoClient } from "mongodb";
import { authOptions } from "../auth/[...nextauth]/route";
import { getServerSession } from "next-auth/next";

const mongoUri = process.env.MONGO_CONNECTION_URI;
let client;
let clientPromise;

if (!global._mongoClientPromise) {
  client = new MongoClient(mongoUri);
  global._mongoClientPromise = client.connect();
}
clientPromise = global._mongoClientPromise;

export async function GET(req) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new Response(JSON.stringify({ message: "You must be logged in." }), {
      status: 401,
    });
  }

  try {
    const email = session.user.email;

    // Wait for the MongoDB client to be connected
    const client = await clientPromise;

    // Select the database and collection
    const db = client.db("jazzee");
    const collection = db.collection("users");

    // Find the user associated with the email
    const user = await collection.findOne({ email });

    if (user) {
      return new Response(JSON.stringify(user), { status: 200 });
    } else {
      return new Response(
        JSON.stringify({ message: "User not found" }),
        { status: 404 }
      );
    }
  } catch (error) {
    console.error("Error fetching user:", error);

    // Return an error response if something goes wrong
    return new Response(
      JSON.stringify({ message: "Failed to fetch user" }),
      {
        status: 500,
      }
    );
  }
}
