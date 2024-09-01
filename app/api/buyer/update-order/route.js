import { MongoClient, ObjectId } from "mongodb";
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
  const session = await getServerSession(authOptions);

  if (!session) {
    return new Response(JSON.stringify({ message: "You must be logged in." }), {
      status: 401,
    });
  }

  let { _id, price, productName, decision } = await req.json();

  if (!_id || !price || !productName || !decision) {
    return new Response(
      JSON.stringify({
        message: "Order ID, price, productName, Decision are required.",
      })
    );
  }

  try {
    let sellerEmail = session.user.email;
    let sellerCode = hash(sellerEmail);

    // let userDetails = await collection.findOne({ email: sellerEmail });
    // console.log(userDetails);

    const client = await clientPromise;
    const db = client.db("jazzee");
    const collection = db.collection("orders");

    const objectId = new ObjectId(_id);

    let result;

    if (decision == "accept") {
      result = await collection.updateOne(
        { _id: objectId }, // Use the ObjectId in the query
        {
          $set: {
            orderStatus: "successful",
            sellerCode: sellerCode,
            finalPrice: price,
            finalProductName: productName,
          },

          // $push: {
          //   bids: {
          //     [sellerCode]: {
          //       price: price,
          //       productName: productName,
          //     },
          //   },
          // },
        }
      );
    }
    else if(decision == "reject"){
      result = await collection.updateOne(
        { _id: objectId }, // Use the ObjectId in the query
        {
          $set: {
            orderStatus: "failed",
            // sellerCode: sellerCode,
            // finalPrice: price,
            // finalProductName: productName,
          },

          // $push: {
          //   bids: {
          //     [sellerCode]: {
          //       price: price,
          //       productName: productName,
          //     },
          //   },
          // },
        }
      );
    }

    if (result.matchedCount === 0) {
      return new Response(JSON.stringify({ message: "Order not found." }), {
        status: 404,
      });
    }

    if (result.modifiedCount === 1) {
      return new Response(
        JSON.stringify({ message: "Order status updated successfully." }),
        { status: 200 }
      );
    } else {
      return new Response(
        JSON.stringify({ message: "No changes made to the bid." }),
        { status: 200 }
      );
    }
  } catch (error) {
    return new Response(
      JSON.stringify({ message: "An error occurred.", error: error.message }),
      { status: 500 }
    );
  }
}

// POST Payload
// {
//     _id: "66d4360df196191e96b2842b",
//     price: "USD 1000"
//     productName: "Random Product",
//   };
