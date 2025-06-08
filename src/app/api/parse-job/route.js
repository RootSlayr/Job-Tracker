import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req) {
    const { textContent } = await req.json();

    // console.log("Received textContent:", textContent);

    const genAI = new GoogleGenerativeAI(process.env.GEMINI);
    // console.log(process.env.GEMINI);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `
Extract structured job data from the following text and return the result in this JSON format:

{
  "title": "",                // Job title as clearly stated or implied
  "company": "",              // Name of the hiring company
  "location": "",             // Location in "City, State/Region, Country" format
  "jobDescription": "",       // Full job description including role context and responsibilities
  "requirements": "",         // List of required skills, experience, qualifications
  "applicationDeadline": "",  // Application deadline, if available; otherwise null
  "employmentType": "",       // Full-time, part-time, contract, etc., or null if not stated
  "technologies": [],         // Array of key technologies or tools mentioned
  "remoteOption": ""          // "Yes", "No", or "Not specified"
}

Guidelines:
- Extract only what's explicitly present in the text.
- If a field like deadline or remote option is not mentioned, return null or "Not specified" as appropriate.
- For technologies, include programming languages, frameworks, tools, or libraries mentioned in the description or requirements.

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
