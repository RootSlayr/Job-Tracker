import { GoogleGenerativeAI } from "@google/generative-ai";


export async function POST(req) {
    const { textContent } = await req.json();
    let { jobDesc, resumeText } = textContent;
    pageText = JSON.stringify(pageText);

    if (!jobDesc || !resumeText) {
        return new Response(JSON.stringify({ error: "Missing pagetext or resumetext" }), { status: 400 })
    }

    // console.log("Received textContent:", textContent);
    console.log(jobDesc);
    console.log(resumeText);

    const genAI = new GoogleGenerativeAI(process.env.GEMINI);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `
    You are a resume coach. Compare the following job description with the candidate's resume.
    - Identify skills or experiences missing from the resume that are important for this job.
    - Suggest concrete improvements in phrasing, structure, or keywords.
    - Keep feedback specific and actionable.

    Job Description:
    ${jobDesc}

    Resume:
    ${resumeText}
    `;


    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    console.log(text);

    try {
        // const data = JSON.parse(cleanedText);
        return new Response(text, { status: 200 });
    } catch (err) {
        console.error("JSON parse error:", err);
        return new Response(JSON.stringify({ error: "Invalid JSON", raw: text }), { status: 500 });
    }
}
