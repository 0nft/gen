import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
  if (!process.env.GEMINI_API_KEY) {
    return NextResponse.json(
      { error: "Gemini API key is not configured" },
      { status: 500 }
    );
  }

  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const result = await model.generateContent(`
      أنت خبير في كتابة الحكم والمواضيع القصيرة الملهمة. 
      قم بتوليد 5 حكم أو مواضيع قصيرة ومؤثرة باللغة العربية مع إضافة إيموجي مناسب. 
      اجعل كل حكمة لا تتجاوز سطرين.
      الموضوع: ${prompt}
      
      قم بكتابة كل حكمة في سطر جديد.
    `);

    const response = await result.response;
    const text = response.text();
    const quotes = text.split("\n").filter((quote) => quote.trim());

    if (quotes.length === 0) {
      return NextResponse.json(
        { error: "لم يتم توليد أي محتوى" },
        { status: 500 }
      );
    }

    return NextResponse.json({ quotes });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "فشل في توليد المحتوى" },
      { status: 500 }
    );
  }
}
