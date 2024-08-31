import { MongoClient } from "mongodb";
import { authOptions } from "../auth/[...nextauth]/route";
import { getServerSession } from "next-auth/next";

const mongoUri = process.env.MONGO_CONNECTION_URI;
const client = new MongoClient(mongoUri);

export async function POST(req) {
  // const session = await getServerSession(authOptions);

  // if (!session) {
  //   return new Response(JSON.stringify({ message: "You must be logged in." }), {
  //     status: 401,
  //   });
  // }
  await client.connect();

  const dbName = "jazzee";
  const collectionName = "users";

  const { email, name, role } = await req.json();

  if (!email || !name || !role) {
    return new Response(
      JSON.stringify({ message: "Email, name, and role are required." }),
      { status: 400 }
    );
  }

  const database = client.db(dbName);
  const collection = database.collection(collectionName);

  // Check if the user already exists
  const existingUser = await collection.findOne({email});

  if (existingUser) {
    // Check for role conflict
    if (existingUser.role !== role) {
      return new Response(
        JSON.stringify({
          message: "Role conflict: Existing user has a different role.",
        }),
        { status: 409 }
      );
    }

    if(existingUser.customName == null){
      return new Response(JSON.stringify({ message: "Custom Name Remaining", code: "cname" }), {
        status: 200,
      });
    }

    return new Response(JSON.stringify({ message: "User already exists.", code: "success" }), {
      status: 200,
    });
  }

  // Add new user
  const result = await collection.insertOne({ email, name, role });

  if (result.acknowledged) {
    return new Response(
      JSON.stringify({ message: "User added successfully.", code: "cname" }),
      { status: 201 }
    );
  } else {
    return new Response(JSON.stringify({ message: "Failed to add user." }), {
      status: 500,
    });
  }
}

// Post Body
// {
//   "email": "",
//   "name": "",
//   "role": "buyer/seller"
// }


// Returns with 
// {
//   "message": "User added successfully.",
//   "code": "cname" <---- Means Custom Name Required
// }

// {
//   "message": "User added successfully.",
//   "code": "success" <---- Means All set!
// }