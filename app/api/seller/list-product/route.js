import { MongoClient } from "mongodb";
import { authOptions } from "../../auth/[...nextauth]/route";
import { getServerSession } from "next-auth/next";
import hash from "object-hash"

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
    let { product } = await req.json();

    if (
      !product.sellerCustomName ||
      !product.categorySlug ||
      !product.categoryName ||
      !product.productName
    ) {
      return new Response(
        JSON.stringify({
          message:
            "Seller custom name, category slug, category name, product name are required.",
        }),
        { status: 400 }
      );
    }

    let email = session.user.email ;
    let sellerHash = hash(email);
    product['sellerCode'] = sellerHash;
    // console.log(sellerHash);


    // Connect to the MongoDB client
    await client.connect();

    // Select the database and collection
    const db = client.db("jazzee");
    const collection = db.collection("products");

    // Insert the product into the collection
    const result = await collection.insertOne(product);

    // console.log(product);

    // Return a success message with the inserted product's ID
    return new Response(
      JSON.stringify({
        message: "Product Added",
        productId: result.insertedId,
      }),
      { status: 201 }
    );
  } catch (error) {
    console.error("Error inserting product:", error);

    // Return an error response if something goes wrong
    return new Response(JSON.stringify({ message: "Failed to add product" }), {
      status: 500,
    });
  } finally {
    // Ensure the client is closed after the operation
    await client.close();
  }
}

// Post Payload
// {
//   "product": {
//   "sellerCustomName": "Atlassian",
//   "categorySlug": "code-collaboration",
//   "categoryName": "Code Collaboration Platforms",
//   "productName": "Bibucket",
//   "IssueTracking": "JIRA Integrated",
//   "CI/CDOption": "Jenkins, CircleCI",
//   "Pricing": "USD 25/user/month"
//   }
// }
