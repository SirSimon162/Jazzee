import { MongoClient } from "mongodb";
import { authOptions } from "../auth/[...nextauth]/route";
import { getServerSession } from "next-auth/next";

const mongoUri = process.env.MONGO_CONNECTION_URI;
const client = new MongoClient(mongoUri);

export async function POST(req) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new Response(JSON.stringify({ message: "You must be logged in." }), {
      status: 401,
    });
  }
  
  try {
    await client.connect();

    const dbName = "jazzee";
    const collectionName = "users";

    const { email, customName } = await req.json();

    if (!email || !customName) {
      return new Response(
        JSON.stringify({ message: "Email and Custom Name are required." }),
        { status: 400 }
      );
    }

    const database = client.db(dbName);
    const collection = database.collection(collectionName);

    const result = await collection.updateOne(
      { email: email },
      { $set: { customName: customName } }
    );

    if (result.matchedCount === 0) {
      return new Response(
        JSON.stringify({ message: "User not found." }),
        { status: 404 }
      );
    }

    if (result.modifiedCount === 1) {
      return new Response(
        JSON.stringify({ message: "Custom name updated successfully." }),
        { status: 200 }
      );
    } else {
      return new Response(
        JSON.stringify({ message: "No changes made to the custom name." }),
        { status: 200 }
      );
    }

  } catch (error) {
    return new Response(
      JSON.stringify({ message: "An error occurred.", error: error.message }),
      { status: 500 }
    );
  } finally {
    await client.close();
  }
}


// Post Body
// {
//   "email": "<email>",
//   "customName": "<CustomName>"
// }