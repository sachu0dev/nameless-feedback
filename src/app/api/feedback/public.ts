import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

export async function GET(request: Request) {
  await dbConnect();

  const { searchParams } = new URL(request.url);
  const username = searchParams.get('username');

  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  try {
    const user = await UserModel.findOne({ username }).select('messages');

    if (!user) {
      return new Response(JSON.stringify({ message: 'User not found' }), { status: 404, headers });
    }

    const recentFeedback = user.messages.slice(-5);

    return new Response(JSON.stringify({ feedback: recentFeedback }), { status: 200, headers });
  } catch (error) {
    console.error('Error fetching user feedback:', error);
    return new Response(JSON.stringify({ message: 'Internal Server Error' }), { status: 500, headers });
  }
}
