"use client"
import { usePageText } from '@/context/PagetextContent';
import { useEffect, useState } from 'react';


export default function TrackApplPage() {

    type JobEntry = {
        _id: string;
        token: string;
        jobData: {
            title: string;
            company: string;
            [key: string]: any;
        } | null;
        savedAt: string;
    };

    const [jobs, setJobs] = useState<JobEntry[]>([]);
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
                setJobs(data.savedJobs || [])
            })
    }, []);

    // console.log(jobs);

    const filteredJobs = jobs.filter((j) => (j).jobData);
    // console.log(filteredJobs)

    return (
        <>
            <div className="min-h-screen bg-black relative overflow-hidden" style={{
                backgroundImage: `
              radial-gradient(circle at 25% 25%, rgba(0, 255, 0, 0.1) 0%, transparent 50%),
              radial-gradient(circle at 75% 75%, rgba(0, 255, 255, 0.1) 0%, transparent 50%),
              linear-gradient(90deg, transparent 50%, rgba(255, 0, 255, 0.02) 50%),
              linear-gradient(rgba(0, 255, 0, 0.02) 50%, transparent 50%)
            `,
                backgroundSize: '200px 200px, 250px 250px, 8px 8px, 8px 8px'
            }}>
                <div className="p-8 font-mono text-green-400 bg-black min-h-screen max-w-4xl mx-auto">
                    <h1 className="text-4xl font-bold mb-8 tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-cyan-300 to-green-400 animate-pulse">
                        Quest Journal
                    </h1>

                    {jobs.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="text-6xl mb-4 text-gray-600">¯\_(ツ)_/¯</div>
                            <p className="text-xl text-cyan-300 font-mono">No quests are tracked for now...</p>
                            <div className="mt-4 text-yellow-400 animate-pulse">{'>'} Awaiting data transmission {'_'}</div>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {/* Terminal-style header */}
                            <div className="flex items-center gap-3 mb-6">
                                <div className="font-mono text-fuchsia-400 text-xl font-bold tracking-wider flex items-center gap-2">
                                    <span className="text-green-400">{'>'}</span>
                                    <span className="animate-pulse">Quest log</span>
                                    <span className="text-green-400 animate-pulse delay-500">{'_'}</span>
                                </div>
                            </div>

                            <ul className="space-y-4">
                                {jobs
                                    .filter(job => job.jobData)
                                    .map((job, index) => (
                                        <li
                                            key={job._id}
                                            className="bg-gradient-to-br from-gray-900 via-black to-gray-800 border-2 border-cyan-400 p-6 rounded-xl relative overflow-hidden group transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl"
                                            style={{
                                                clipPath: 'polygon(15px 0%, 100% 0%, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0% 100%, 0% 15px)',
                                                boxShadow: `
                                                inset -4px -4px 0px rgba(0, 255, 255, 0.4),
                                                0 0 20px rgba(0, 255, 255, 0.4),
                                                0 0 40px rgba(0, 255, 255, 0.2),
                                                0 8px 20px rgba(0, 0, 0, 0.5)
                                            `,
                                                animationDelay: `${index * 200}ms`
                                            }}
                                        >
                                            {/* Animated background elements */}
                                            <div className="absolute inset-0 opacity-10">
                                                <div className="absolute top-3 left-3 w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse"></div>
                                                <div className="absolute top-6 right-6 w-1 h-1 bg-green-400 rounded-full animate-ping"></div>
                                                <div className="absolute bottom-4 left-1/4 w-1 h-1 bg-fuchsia-400 rounded-full animate-pulse delay-300"></div>
                                            </div>

                                            {/* Glowing border animation on hover */}
                                            <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                                                style={{
                                                    background: 'linear-gradient(45deg, transparent, rgba(0, 255, 255, 0.1), transparent)',
                                                    animation: 'borderGlow 3s ease-in-out infinite'
                                                }}></div>

                                            <div className="relative z-10">
                                                {/* Job title and company */}
                                                <h2 className="text-xl font-bold mb-3 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-cyan-200 to-cyan-400">
                                                    <span className="text-yellow-400 font-mono text-sm">COMPANY:</span>{" "}
                                                    <span className="text-cyan-300">{job.jobData?.company}</span>
                                                </h2>

                                                <div className="flex items-center gap-2 mb-3">
                                                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                                    <span className="text-yellow-400 font-semibold">ROLE:</span>
                                                    <span className="text-green-300 font-mono">{job.jobData?.title}</span>
                                                </div>

                                                {/* Application date */}
                                                <div className="flex items-center gap-2">
                                                    <div className="w-2 h-2 bg-fuchsia-400 rounded-full animate-pulse delay-300"></div>
                                                    <span className="text-yellow-400 font-semibold">SUBMITTED:</span>
                                                    <span className="text-fuchsia-300 font-mono">
                                                        {new Date(job.savedAt).toLocaleDateString("en-AU", {
                                                            year: "numeric",
                                                            month: "short",
                                                            day: "numeric",
                                                        })}
                                                    </span>
                                                </div>

                                                {/* Status indicator */}
                                                {/* <div className="mt-4 flex items-center gap-2">
                                                    <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
                                                    <span className="text-yellow-400 font-mono text-sm tracking-wider">
                                                        STATUS: PENDING_RESPONSE
                                                    </span>
                                                </div> */}
                                            </div>

                                            {/* Decorative corner elements */}
                                            <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-cyan-400 opacity-60"></div>
                                            <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-cyan-400 opacity-60"></div>
                                        </li>
                                    ))}
                            </ul>

                            {/* Terminal-style footer */}
                            <div className="mt-8 pt-6 border-t border-gray-700">
                                <div className="flex items-center gap-2 text-sm">
                                    <span className="text-green-400">{'>'}</span>
                                    <span className="text-gray-400">Total applications tracked:</span>
                                    <span className="text-cyan-300 font-bold">{filteredJobs.length}</span>
                                    <span className="text-green-400 animate-pulse ml-2">{'_'}</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <style jsx>{`
                @keyframes borderGlow {
                    0%, 100% { transform: translateX(-100%); }
                    50% { transform: translateX(100%); }
                }
            `}</style>
            </div>

        </>
    );
}
