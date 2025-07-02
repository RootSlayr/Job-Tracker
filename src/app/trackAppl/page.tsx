"use client"
import { usePageText } from '@/context/PagetextContent';
import { useEffect, useState } from 'react';


export default function TrackApplPage() {

    const [jobs, setJobs] = useState([]);
    const text = usePageText();
    // console.log(text)

    useEffect(() => {
        const token = localStorage.getItem("session_token");
        fetch("/api/fetch-job", {
            headers: {
                Authorization: `Bearer ${token}`
            },
        })
            .then((res) => res.json())
            .then((data) => {
                setJobs(data || [])
            })
    }, []);

    console.log(jobs);


    return (
        <div className="p-8 font-mono text-yellow-400 bg-black min-h-screen">
            <h2 className="text-2xl font-bold mb-4">Coming Soon</h2>
            {/* <p>{pageText}</p> */}
            <p>{JSON.stringify(text, null, 2)}</p>
        </div>
    );
}
