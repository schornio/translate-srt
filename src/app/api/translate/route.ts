import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";

export async function POST(request: Request) {
  const { text, targetLanguage, fullSrt } = await request.json();

  if (!text || !targetLanguage) {
    return Response.json(
      { error: "Missing text or targetLanguage" },
      { status: 400 }
    );
  }

  const contextSection = fullSrt
    ? `Here is the full SRT for context:\n\n${fullSrt}\n\n`
    : "";

  const { text: translatedText } = await generateText({
    model: openai("gpt-4.1-mini"),
    prompt: `${contextSection}Translate the following subtitle text to ${targetLanguage}. Return only the translated text, preserving any line breaks:\n\n${text}`,
  });

  return Response.json({ translatedText });
}
