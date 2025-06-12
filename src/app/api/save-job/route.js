import clientPromise from "./utility";

export async function POST(req) {
    try {
        const body = await req.json();
        const { jobData, userEmail } = body;

        const client = await clientPromise;
        const db = client.db("Oohaah");
        const collection = db.collection("jobs");

        const result = await collection.insertOne({
            userEmail,
            jobData,
            savedAt: new Date(),
        });

        return new Response(JSON.stringify({ message: "Saved", id: result.insertedId }), { status: 200 });
    } catch (error) {
        console.error("Error saving to MongoDB:", error);
        return new Response(JSON.stringify({ message: "Failed to save" }), { status: 500 });
    }
}
