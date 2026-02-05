import { streamText } from 'ai';
import { openai } from '@ai-sdk/openai';

export const runtime = 'edge';

export async function POST() {
  try {
    const prompt = `
Create a list of three open-ended and engaging questions formatted as a single string.
Each question should be separated by '||'.
These questions are for an anonymous social messaging platform like Qooh.me.
Avoid personal or sensitive topics. Focus on universal, friendly, and positive themes.
`;

    const result = streamText({
      model: openai('gpt-4o'),
      prompt,
      maxOutputTokens: 150,
    });

    // ✅ REQUIRED for useCompletion
    return result.toTextStreamResponse();
  } catch (error) {
    console.error('Error generating suggested messages:', error);

    return Response.json(
      { success: false, message: 'Failed to generate suggestions.' },
      { status: 500 }
    );
  }
}
