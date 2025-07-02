import clientPromise from "./utility";

export async function GET(req) {
    try {

        const authHeader = req.headers.get("authorization");
        const token = authHeader?.split(" ")[1];

        if (!token) {
            return new Response(JSON.stringify({ message: "Missing Token" }), { status: 401, })
        }

        const client = await clientPromise;
        const db = client.db("Oohaah");

        const session = await db.collection("sessions").findOne({ token });
        if (!session) {
            return new Response(JSON.stringify({ message: "Invalid Token" }), { status: 401 });
        }

        const collection = db.collection("jobs");

        const savedJobs = await collection.find({ token }).toArray();

        return new Response(JSON.stringify({ savedJobs }), { status: 200 });
    }
    catch (error) {
        console.error("Error saving to MongoDB:", error);
        return new Response(JSON.stringify({ message: "Failed to save" }), { status: 500 });
    }
}
