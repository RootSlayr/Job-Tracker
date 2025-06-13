'use client';

import { useState } from 'react';
import { usePageText } from '@/context/PagetextContent';

export default function ViewResultPage() {
    const { pageText } = usePageText();
    const [resumeFile, setResumeFile] = useState<File | null>(null);

    const handleResumeUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] ?? null;
        setResumeFile(file);
    };

    if (!pageText) {
        return (
            <div className="p-8 font-mono text-yellow-400 bg-black min-h-screen">
                <h2 className="text-2xl font-bold mb-4">No quest data found!</h2>
                <p>Please go back and scan a quest first.</p>
            </div>
        );
    }

    return (
        <div className="p-8 font-mono text-green-400 bg-black min-h-screen max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold mb-6 tracking-wider">Quest Details</h1>

            <section className="mb-8 bg-black border-4 border-green-400 p-6 rounded-lg" style={{
                clipPath: 'polygon(16px 0%, 100% 0%, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0% 100%, 0% 16px)',
                boxShadow: 'inset -4px -4px 0px rgba(0, 255, 0, 0.3), 0 0 20px rgba(0, 255, 0, 0.3)'
            }}>
                <h2 className="text-2xl font-bold mb-2">{pageText.title}</h2>
                <p><strong>Company:</strong> {pageText.company}</p>
                <p><strong>Location:</strong> {pageText.location}</p>
                {pageText.technologies && <p><strong>Skills:</strong> {pageText.technologies.join(", ")}</p>}
                <div className="mt-4 whitespace-pre-wrap max-h-48 overflow-y-auto border border-green-400 p-2 bg-black rounded">
                    {pageText.jobDescription || pageText.textContent || 'No description available.'}
                </div>
            </section>

            <section>
                <h3 className="text-xl font-bold mb-4">Upload Your Resume</h3>
                <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleResumeUpload}
                    className="mb-4 text-green-400"
                />
                {resumeFile && (
                    <p className="text-green-300">Uploaded: {resumeFile.name}</p>
                )}
            </section>

            {/* You can add your cover letter generation or recommendations UI here using pageText and resumeFile */}

        </div>
    );
}
