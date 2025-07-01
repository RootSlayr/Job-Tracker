"use client"
import { usePageText } from '@/context/PagetextContent';


export default function TrackApplPage() {

    const text = usePageText();
    console.log(text)
    return (
        <div className="p-8 font-mono text-yellow-400 bg-black min-h-screen">
            <h2 className="text-2xl font-bold mb-4">Coming Soon</h2>
            {/* <p>{pageText}</p> */}
            <p>{JSON.stringify(text, null, 2)}</p>
        </div>
    );
}
