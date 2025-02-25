import { openai } from "@ai-sdk/openai";
import { createDataStreamResponse, streamText, tool } from "ai";
import z from "zod";

const API_URL = "http://localhost:8000/query";
async function journeyResearcher(query: string) {
  console.log("query", query);
  const response = await fetch(`${API_URL}?query=${query}`);
  return await response.json();
}
export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: openai("gpt-4o-mini"),
    messages,
    system:
      "You are a market researcher who analyzes data and trends to deliver sharp insights and strategic reports.",
    tools: {
      getJourneyInsights: tool({
        description: "Useful to extract insights from market journey data",
        parameters: z.object({
          query: z.string(),
        }),
        execute: async ({ query }) => {
          const res = await journeyResearcher(query);
          return res.answer;
        },
      }),
    },
    maxSteps: 5,
  });

  return result.toDataStreamResponse();
}
