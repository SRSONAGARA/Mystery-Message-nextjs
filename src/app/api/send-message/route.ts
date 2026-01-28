import dbConnect from "@/src/lib/dbConnect";
import UserModel, { Message } from "@/src/models/user.model";
import { success } from "zod";

export async function POST(request: Request) {
    await dbConnect();
    const { username, content } = await request.json();
    try {
        const user = await UserModel.findOne({ username }).exec();
        if (!user) {
            return Response.json(
                {
                    success: false,
                    message: "User not found"
                }, { status: 404 }
            )
        }
        if (!user.isAcceptingMessages) {
            return Response.json({
                success: false,
                message: 'User is not accepting messages'
            }, { status: 403 } // 403 Forbidden status
            );
        }
        const newMessage = {
            content: content,
            createdAt: new Date()
        };

        user.messages.push(newMessage as Message);
        await user.save();
        return Response.json(
            { success: true, message: 'Message sent successfully' },
            { status: 201 }
        );

    } catch (error) {
        console.error('Error adding message:', error);
        return Response.json(
            {
                success: false, message: 'Internal server error'
            },
            { status: 500 }
        );
    }
}