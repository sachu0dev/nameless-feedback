import UserModel from "@/model/User";
import dbConnect from "@/lib/dbConnect";
import { Message } from "@/model/User";

export async function POST(request: Request) {
  await dbConnect();
  const { username, content, rating } = await request.json();

  try {
    const user = await UserModel.findOne({ username });
    
    if (!user) {
      return Response.json({ success: false, message: "User not found" }, { status: 404 });
    }

    if (!user.isAcceptingMessages) {
      return Response.json({ success: false, message: "User is not accepting messages" }, { status: 403 });
    }

    const newMessage: Message = { content, rating, createdAt: new Date() };
    console.log(newMessage);
    
    user.messages.push(newMessage);
    console.log(user);
    const updatedUser = await user.save();
    console.log(updatedUser);
    
    return Response.json({ success: true, message: "Message sent successfully" }, { status: 200 });
  } catch (error) {
    console.error("Failed to send message", error);
    return Response.json({ success: false, message: "Failed to send message" }, { status: 500 });
  }
}
