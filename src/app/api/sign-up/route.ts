import dbConnect from "@/src/lib/dbConnect";
import bcrypt from "bcryptjs";
import { ApiResponse } from "@/src/types/ApiResponse";
import UserModel from "@/src/models/user.model";
import { success } from "zod";
import { SendVerificationEmail } from "@/src/helpers/SendVerificationEmail";


export async function POST(request: Request) {
    await dbConnect();
    try {
        const { username, email, password } = await request.json();

        const existingUserVerifiedByUsername = await UserModel.findOne({ username, isVerified: true });

        if (existingUserVerifiedByUsername) {
            return Response.json({
                success: false,
                message: "This username already taken"
            }, {
                status: 400
            });
        }

        const existingUserByEmail = await UserModel.findOne({ email });
        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

        if (existingUserByEmail) {
            if (existingUserByEmail.isVerified) {
                return Response.json({
                    success: false,
                    message: "User already exist with this email"
                }, {
                    status: 400
                })
            } else {
                const hasedPassword = await bcrypt.hash(password, 10);

                existingUserByEmail.password = hasedPassword;
                existingUserByEmail.verifyCode = verifyCode;
                existingUserByEmail.verifyCodeExpiry  = new Date(Date.now() +3600000)

                await existingUserByEmail.save();
            }
        } else {
            const hasedPassword = await bcrypt.hash(password, 10);
            const verifyExpiry = new Date();
            verifyExpiry.setHours(verifyExpiry.getHours() + 1);

            const newUser = new UserModel({
                username,
                email,
                password: hasedPassword,
                verifyCode,
                verifyCodeExpiry: verifyExpiry,
                isVerified: false,
                isAcceptingMessages: true,
                messages: []
            });
            await newUser.save();
        }

        //Send verification code
        const emailResponse = await SendVerificationEmail(email, username, verifyCode);

        if (!emailResponse.success) {
            return Response.json({
                success: false,
                message: emailResponse.message
            }, {
                status: 500
            });
        }
        return Response.json({
            success: true,
            message: "User registered successfully. Please verify your email"
        }, {
            status: 201
        })

    } catch (error) {
        console.log("Error registering User", error);
        return Response.json({
            success: false,
            message: "Error registering User"
        }, { status: 500 })
    }
}