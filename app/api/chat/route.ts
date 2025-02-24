import { openai } from "@ai-sdk/openai";
import { createDataStreamResponse, streamText } from "ai";

export async function POST(req: Request) {
  const { messages } = await req.json();

  return createDataStreamResponse({
    execute: async (dataStream) => {
      const result = streamText({
        model: openai("gpt-4o-mini"),
        messages,
        system:
          "You are a sustainabilty analyst. You provide detailed insights regarding sustainability regulations.",
      });

      result.mergeIntoDataStream(dataStream);
    },
  });
}
