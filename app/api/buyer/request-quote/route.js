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

export async function POST(req) {
//   const session = await getServerSession(authOptions);

//   if (!session) {
//     return new Response(JSON.stringify({ message: "You must be logged in." }), {
//       status: 401,
//     });
//   }

  try {
    let {categoryName, key1, key2, price } = await req.json();

    if(!categoryName || !key1 || !key2 || !price){
        return new Response(JSON.stringify({message: "Category Name, key1, key2, price are required."}), {status: 400});
    }

    // let customerEmail = session.user.email;

    let orderObject = {
        categoryName: categoryName,
        details: {
            [key1['key']]: key1['value'],
            [key2['key']]: key2['value'],
            price: price
        },
        orderStatus: "placed"
    };

    // Select the database and collection
    const client = await clientPromise;
    const db = client.db("jazzee");
    const collection = db.collection("orders");

    // Insert the product into the collection
    const result = await collection.insertOne(orderObject);

    return new Response(
        JSON.stringify({
          message: "Order Placed",
          productId: result.insertedId,
        }),
        { status: 201 }
      );

    // return new Response(JSON.stringify(orderObject));

  } catch (error) {
    console.error("Error fetching schemas:", error);

    // Return an error response if something goes wrong
    return new Response(
      JSON.stringify({ message: "Failed to " }),
      {
        status: 500,
      }
    );
  }
}

// Simple get call works
