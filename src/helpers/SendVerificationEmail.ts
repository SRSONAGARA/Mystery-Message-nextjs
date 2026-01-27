import VerificationEmail from "@/emails/VerificationEmail";
import { resend } from "../lib/resend";
import { ApiResponse } from "../types/ApiResponse";

export async function SendVerificationEmail(
  email: string,
  username: string,
  verifyCode: string
): Promise<ApiResponse> {
  try {
    const response = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: email,
      subject: 'Mystery Message Verification Code',
      react: VerificationEmail({ username, otp: verifyCode }),
    });

    console.log("Resend email response:", response);

    if (response.error) {
      console.error("Resend error:", response.error);
      return { success: false, message: "Resend failed to send email" };
    }

    return {
      success: true,
      message: "Verification email sent successfully.",
    };
  } catch (emailError) {
    console.error("Error sending verification email:", emailError);
    return {
      success: false,
      message: "Failed to send verification email.",
    };
  }
}
