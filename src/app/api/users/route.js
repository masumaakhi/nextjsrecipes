//src/app/api/users/route.js

import connectDb from "@/lib/connectDb";
import User from "@/models/user";

export async function GET() {
    await connectDb();
    const users = await User.find({});
    return new Response(JSON.stringify({ success: true, users }), {
        status: 200,
    });
}

export async function POST(req) {
    await connectDb();
    const data = await req.json();
    const user = await User.create(data);
    return new Response(JSON.stringify({ success: true, user }), {
        status: 200,
    });
}
