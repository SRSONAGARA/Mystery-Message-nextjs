// import OpenAI from 'openai';
// import { streamText  } from 'ai';
// import { NextResponse } from 'next/server';

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });

// export const runtime = 'edge';

// export async function POST(req: Request) {
//   try {
//     const prompt =
//       "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What’s a hobby you’ve recently started?||If you could have dinner with any historical figure, who would it be?||What’s a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.";

//     const response = await openai.completions.create({
//     //   model: 'gpt-3.5-turbo-instruct',
//       model: 'gpt-4o',
//       max_tokens: 400,
//       stream: true,
//       prompt,
//     });

//     const stream = OpenAIStream(response);


//     return new StreamingTextResponse(stream);
//   } catch (error) {
//     if (error instanceof OpenAI.APIError) {
//       // OpenAI API error handling
//       const { name, status, headers, message } = error;
//       return NextResponse.json({ name, status, headers, message }, { status });
//     } else {
//       // General error handling
//       console.error('An unexpected error occurred:', error);
//       throw error;
//     }
//   }
// }


import { streamText } from 'ai';
import { openai } from '@ai-sdk/openai';

export const runtime = 'edge';

export async function POST(req: Request) {
    try {
        const prompt =
            "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction.";

        const result = streamText({
            model: openai('gpt-4o'),
            prompt,
            maxOutputTokens: 400,
        });

        //   return result.toTextStreamResponse();
        return result.toUIMessageStreamResponse();
    } catch (error) {
        console.error('Error in generating messages:', error);

        // return new Response(
        //     JSON.stringify({
        //         error: 'Failed to generate questions. Please try again later.',
        //     }),
        //     {
        //         status: 500,
        //         headers: {
        //             'Content-Type': 'application/json',
        //         },
        //     }
        // );
        return Response.json(
            {
                success: false, message: 'Failed to generate questions. Please try again later.'
            },
            { status: 500 }
        );
    }
}
