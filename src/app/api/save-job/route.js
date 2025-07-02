import clientPromise from "./utility";

export async function POST(req) {
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

        // console.log(await req.json())
        const body = await req.json();
        // console.log(body)
        const jobData = body.pageText;
        console.log(jobData);

        const collection = db.collection("jobs");

        // updating the token and job data
        const result = await collection.insertOne({
            token,
            jobData,
            savedAt: new Date(),
        });

        //updating the last used  will use later I think
        await collection.updateOne(
            { token },
            { $set: { lastUsedAt: new Date() } }
        );

        return new Response(JSON.stringify({ message: "Saved", id: result.insertedId }), { status: 200 });
    }
    catch (error) {
        console.error("Error saving to MongoDB:", error);
        return new Response(JSON.stringify({ message: "Failed to save" }), { status: 500 });
    }
}
