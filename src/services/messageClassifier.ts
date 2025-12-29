import { GoogleGenAI } from "@google/genai";
import prisma from "../db/prisma";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

export type Result = {
  id: string;
  name: string;
};

export async function routeMessage(message: string): Promise<Result> {
  const prompt = `
You are an AI assistant for a business chat routing system.

Classify the customer message into ONE of the following departments:
- Sales
- Support
- Billing
- Technical
- General

Respond ONLY in valid JSON:
{
  "department": "<department_name>",
  "confidence": <number_between_0_and_1>
}

Message:
"${message}"
`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
    });

    const text = response.text;
    if (!text) throw new Error("Empty AI response");

    console.log(text);

    const jsonMatch = text.match(/\{[\s\S]*\}/);

    if (!jsonMatch) {
      throw new Error("No JSON found in AI response");
    }

    const result: { department: string; confidence: number } = JSON.parse(
      jsonMatch[0]
    );

    const departmentName =
      result.confidence >= 0.5 ? result.department : "General";

    const department = await prisma.department.findFirst({
      where: { name: departmentName },
    });

    if (!department) {
      throw new Error(`Department not found: ${departmentName}`);
    }

    return {
      id: department.id,
      name: departmentName,
    };
  } catch (error) {
    console.error("AI routing failed:", error);

    const general = await prisma.department.findFirst({
      where: { name: "General" },
    });

    if (!general) {
      throw new Error("General department missing in DB");
    }

    return {
      id: general.id,
      name: "General",
    };
  }
}
