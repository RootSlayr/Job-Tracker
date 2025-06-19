import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req) {
    const { textContent } = await req.json();

    // console.log("Received textContent:", textContent);

    const genAI = new GoogleGenerativeAI(process.env.GEMINI);
    // console.log(process.env.GEMINI);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `
Extract structured job data from the following job description text and return the result in this exact JSON format:

{
  "title": "",                // Job title as clearly stated or implied
  "company": "",              // Name of the hiring company
  "location": "",             // Location in "City, State/Region, Country" format
  "jobDescription": "",       // Summary of the job, focusing on role, team, and responsibilities
  "requirements": [],         // Array of individual required qualifications, skills, or experience
  "applicationDeadline": "",  // Application deadline, if explicitly stated; otherwise null
  "employmentType": "",       // Full-time, part-time, contract, etc., or null if not stated
  "technologies": [],         // Array of key technologies, languages, frameworks, or methodologies mentioned
  "remoteOption": ""          // "Yes" if remote or hybrid is mentioned, "No" if clearly in-office, "Not specified" otherwise
}
Important Extraction Rules:

For "requirements": extract each bullet point or listed requirement as a separate string in the array. Include both “required” and “nice to have” or “preferred” qualifications.

For "technologies": include programming languages (e.g., C++, Python), methodologies (e.g., Agile), and key technical concepts (e.g., multithreading, OOP). Only include what's explicitly mentioned.

For "remoteOption": If terms like “remote”, “work from home”, or “hybrid” are mentioned, set to "Yes". If the job is clearly in-office, set to "No". If nothing is mentioned, set to "Not specified".

Use exact text when possible, but remove unrelated company awards, benefits, or marketing blurbs from the "jobDescription" unless directly related to the role.

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

    // console.log(cleanedText);

    try {
        const data = JSON.parse(cleanedText);
        return new Response(JSON.stringify(data), { status: 200 });
    } catch (err) {
        console.error("JSON parse error:", err);
        return new Response(JSON.stringify({ error: "Invalid JSON", raw: text }), { status: 500 });
    }
}
