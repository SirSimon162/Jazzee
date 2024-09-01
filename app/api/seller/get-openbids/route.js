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
    const email = session.user.email;
    const sellerHash = hash(email);

    // Select the database and collection
    const client = await clientPromise;
    const db = client.db("jazzee");

    const orderCollection = db.collection("orders");
    const openOrders = await orderCollection
      .find({ orderStatus: { $in: ["placed", "bidded"] } })
      .toArray();

    const productCollection = db.collection("products");
    const sellerProducts = await productCollection
      .find({ sellerCode: sellerHash })
      .toArray();

      const sellerProductCategories = new Set(sellerProducts.map(product => product.categoryName));

      const filteredOrders = openOrders.filter(order => 
          sellerProductCategories.has(order.categoryName)
      );
      
      // console.log(filteredOrders);

    return new Response(JSON.stringify({
      filteredOrders,
      sellerProducts
    }), { status: 200 });

    // return new Response(JSON.stringify(orderObject));
  } catch (error) {
    console.error("Error fetching schemas:", error);

    // Return an error response if something goes wrong
    return new Response(JSON.stringify({ message: "Failed to fetch" }), {
      status: 500,
    });
  }
}

// Post Payload
// {
//   "categoryName": "sd",
//   "key1":  {
//     "key": "DD",
//     "value": "AA"
//   },
//   "key2": {
//     "key": "KK",
//     "value": "VV"
//   },
//   "price": "100"
// }
