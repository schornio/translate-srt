import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";

export async function POST(request: Request) {
  const { text, targetLanguage } = await request.json();

  if (!text || !targetLanguage) {
    return Response.json(
      { error: "Missing text or targetLanguage" },
      { status: 400 }
    );
  }

  const { text: translatedText } = await generateText({
    model: openai("gpt-4o-mini"),
    prompt: `Translate the following subtitle text to ${targetLanguage}. Return only the translated text, preserving any line breaks:\n\n${text}`,
  });

  return Response.json({ translatedText });
}
