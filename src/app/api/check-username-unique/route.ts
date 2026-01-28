import dbConnect from "@/src/lib/dbConnect";
import UserModel from "@/src/models/user.model";
import { usernameValidation } from "@/src/schemas/signUpSchema";
import { z } from "zod";

const UsernameQuerySchema = z.object({
    username: usernameValidation
})

export async function GET(request: Request) {
    await dbConnect();

    try {
        const { searchParams } = new URL(request.url);

        const queryParam = {
            username: searchParams.get('username')
        }
        // Validate with zod
        const result = UsernameQuerySchema.safeParse(queryParam);
        console.log(result);
        if (!result.success) {
            const usernameErrors = result.error.format().username?._errors || []
            return Response.json({
                success: false,
                message: usernameErrors?.length > 0 ? usernameErrors.join(', ') : 'Invalid query parameters'
            }, {
                status: 400
            })
        }
        const { username } = result.data

        const existingVerifiedUser = await UserModel.findOne({ username, isVerified: true });

        if (existingVerifiedUser) {
            return Response.json({
                success: true,
                message: "Username is already taken"
            }, {
                status: 200
            })
        }
        return Response.json({
            success: true,
            message: "Username is unique"
        }, { status: 200 })

    } catch (error) {
        console.error("Error checking username", error);
        return Response.json({
            success: false,
            message: "Error checking username"
        }, { status: 500 })

    }

}