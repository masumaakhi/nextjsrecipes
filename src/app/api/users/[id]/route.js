// /src/app/api/users/[id]/route.js

import connectDb from "@/lib/connectDb";
import User from "@/models/user";

export async function GET(req, { params }) {
  await connectDb();

  try {
    const user = await User.findById(params.id);
    if (!user) {
      return new Response(JSON.stringify({ success: false, message: "User not found" }), {
        status: 404,
      });
    }

    return new Response(JSON.stringify({ success: true, user }), {
      status: 200,
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ success: false, message: err.message }),
      { status: 500 }
    );
  }
}
