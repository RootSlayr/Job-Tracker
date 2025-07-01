import clientPromise from "./utility";
import { v4 } from UUID;

let sessionCollection;

export async function GET() {

    const client = await clientPromise;
    const db = client.db("Oohaah");

    if (!sessionCollection) {
        sessionCollection = db.collection("sessions");
    }

    const token = v4();

    await sessionCollection.insertOne({
        token,
        createdAt: new Date(),
        lastUsedAt: new Date(),
        data: {},
    });

    return new Response(JSON.stringify({ token }), { status: 200 });
}
