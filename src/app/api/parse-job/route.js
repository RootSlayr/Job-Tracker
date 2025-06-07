import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req) {
    const { textContent } = await req.json();

    // console.log("Received textContent:", textContent);

    const genAI = new GoogleGenerativeAI(process.env.GEMINI);
    // console.log(process.env.GEMINI);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `
Extract structured job data from this text and return these fields:

  "title": "",
  "company": "",
  "location": "",
  "jobDescription": "",
  "requirements": "",
  "applicationDeadline": ""


Text:
${textContent}
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    const cleanedText = text
        .replace(/^```(?:json)?\s*/, "")
        .replace(/```$/, "")
        .trim();

    console.log(cleanedText);

    try {
        const data = JSON.parse(cleanedText);
        return new Response(JSON.stringify(data), { status: 200 });
    } catch (err) {
        return new Response(JSON.stringify({ error: "Invalid JSON", raw: text }), { status: 500 });
    }
}
