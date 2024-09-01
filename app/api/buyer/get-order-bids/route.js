import { MongoClient } from "mongodb";
import { authOptions } from "../../auth/[...nextauth]/route";
import { getServerSession } from "next-auth/next";
import hash from "object-hash";

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

    let customerEmail = session.user.email;
    let customerCode = hash(customerEmail);

    // Wait for the MongoDB client to be connected
    const client = await clientPromise;

    // Select the database and collection
    const db = client.db("jazzee");
    const collection = db.collection("orders");

    // Find the products associated with the sellerHash
    const result = await collection.find({
        customerCode: customerCode,
        bids: { $exists: true, $ne: [] } // Ensure 'bids' exists and is not an empty array
      }).toArray();

    if (result.length) {
      return new Response(
        JSON.stringify({ result }),
        { status: 200 }
      );
    } else {
      return new Response(
        JSON.stringify({ message: "No orders found" }),
        { status: 404 }
      );
    }
  } catch (error) {
    console.error("Error fetching orders:", error);

    // Return an error response if something goes wrong
    return new Response(
      JSON.stringify({ message: "Failed to fetch orders" }),
      {
        status: 500,
      }
    );
  }
}


// Simple get call works