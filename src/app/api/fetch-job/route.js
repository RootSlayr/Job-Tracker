export async function POST(req) {
    const { url } = await req.json();

    if (!url) {
        return new Response(JSON.stringify({ error: 'No URL provided' }), { status: 400 });
    }

    try {
        const response = await fetch(url);
        const html = await response.text();

        return new Response(JSON.stringify({ html }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (err) {
        return new Response(JSON.stringify({ error: 'Failed to fetch' }), { status: 500 });
    }
}
