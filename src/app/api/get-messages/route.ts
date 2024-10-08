import { getServerSession } from "next-auth";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from 'next-auth';
import { authOptions } from "../auth/[...nextauth]/options";
import mongoose from "mongoose";

export async function GET() {
  await dbConnect();
  const session = await getServerSession(authOptions);
  const user: User = session?.user as User;

  if(!session || !user) {
    return Response.json({ success: false, message: "Not Authenticated" },{status: 401});
  }

  const userId = new mongoose.Types.ObjectId(user._id);
  

  try {
    const checkUser = await UserModel.findById(userId);

    if(!checkUser) {
      return Response.json({ success: false, message: "User not found" },{status: 404});
    }
    const user = await UserModel.aggregate([
      { $match: { _id: userId } },
      { $unwind: "$messages" },
      { $sort: { "messages.createdAt": -1 } },
      { $group: {_id: '$_id', messages: { $push: "$messages" } } },
    ])
    

    if(!user || user.length === 0) {
      return Response.json({ success: true, message: "No messages found" },{status: 200});
    }

    return Response.json({ success: true, message: "User found", messages: user[0].messages },{status: 200});

  } catch (error) {
    console.error("Failed to get messages", error);
    return Response.json({ success: false, message: "Failed to get messages" },{status: 500});
    
  }
}