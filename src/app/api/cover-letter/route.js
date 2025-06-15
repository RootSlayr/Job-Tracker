import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req) {
    const { textContent } = await req.json();

    // console.log("Received textContent:", textContent);

    const genAI = new GoogleGenerativeAI(process.env.GEMINI);
    // console.log(process.env.GEMINI);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `
    {
    "coverLetter": "",       // Full formal version (250–350 words), ATS-optimized and tailored to the job and company
    "emailVersion": "",      // Condensed version (150–200 words) for email body submissions
    "linkedInMessage": ""    // Brief outreach or referral message (75–100 words) for LinkedIn
    }
    Writing Guidelines:

    Tone: Maintain a tone that is professional, confident, concise, and strategically aligned with the company culture (e.g., corporate, startup, creative, or mission-driven).

    Structure (Cover Letter):

    Opening Hook: State the role, how the candidate found it, and lead with their strongest qualification or value.

    STAR Method Body: Include 1–2 accomplishments using the STAR method (Situation, Task, Action, Result), aligned directly with job requirements.

    Company Fit: Reference specific company initiatives, values, industry challenges, or recent news; explain why the candidate is uniquely positioned to contribute.

    Closing: Reaffirm the candidate’s fit, express enthusiasm, and include a confident call to action.

    ATS Optimization: Naturally include relevant keywords from the job description, industry-standard terminology, and strong action verbs.

    Formatting: Use scannable paragraphing (3–4 sentences each), active voice, and error-free grammar.

    Required Inputs:

    Candidate resume or professional summary

    Full job description (including responsibilities and qualifications)

    Company research (mission, values, news, culture, challenges)

    Industry context (trends, pain points, opportunities)

    Resume: ${textContent}
    Job Description ${textContent}`;

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
        console.error("JSON parse error:", err);
        return new Response(JSON.stringify({ error: "Invalid JSON", raw: text }), { status: 500 });
    }
}
