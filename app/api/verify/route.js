import { authOptions } from "../auth/[...nextauth]/route";
import { getServerSession } from "next-auth/next";

export async function GET(req, res) {
  const session = await getServerSession( authOptions);

  if (!session) {
    // res.status(401).json({ message: "You must be logged in." })
    // return
    return new Response(
      JSON.stringify({ message: "You must be logged in." })
    );
  }

  //   return res.json({
  //     message: "Success",
  //   })

  return new Response(
    JSON.stringify({ message: "Success" })
  );
}
