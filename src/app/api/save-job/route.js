// pages/api/save-job.js
import clientPromise from "./utility";

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).end();
    }

    try {
        const client = await clientPromise;
        const db = client.db("Oohaah");
        const collection = db.collection("jobs");

        const { jobData, userEmail } = req.body;

        const result = await collection.insertOne({
            userEmail,
            jobData,
            savedAt: new Date()
        });

        res.status(200).json({ message: "Saved", id: result.insertedId });
    } catch (error) {
        console.error("Error saving to MongoDB:", error);
        res.status(500).json({ message: "Failed to save" });
    }
}
