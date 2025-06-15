'use client';

import { useState, useEffect } from 'react';
import { usePageText } from '@/context/PagetextContent';

export default function ViewResultPage() {
    const { pageText } = usePageText();
    const [resumeFile, setResumeFile] = useState<File | null>(null);
    const [resumeText, setResumeText] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const [pdfLib, setPdfLib] = useState<any>(null);

    // Initialize PDF.js once when component mounts
    useEffect(() => {
        async function initPdfJs() {
            try {
                const pdfjsLib = await import('pdfjs-dist');

                // Use a known working version - 3.4.120 is stable
                pdfjsLib.GlobalWorkerOptions.workerSrc =
                    'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js';

                setPdfLib(pdfjsLib);
            } catch (err) {
                console.error('Failed to initialize PDF.js:', err);
                setError('Failed to initialize PDF processor');
            }
        }

        initPdfJs();
    }, []);

    const extractTextFromPdf = async (fileBuffer: ArrayBuffer) => {
        if (!pdfLib) {
            setError('PDF processor not initialized');
            return;
        }

        try {
            setIsLoading(true);
            setError('');

            const pdf = await pdfLib.getDocument({ data: fileBuffer }).promise;
            const numPages = pdf.numPages;
            let fullText = '';

            for (let i = 1; i <= numPages; i++) {
                const page = await pdf.getPage(i);
                const textContent = await page.getTextContent();
                const pageText = textContent.items
                    .map((item: any) => ('str' in item ? item.str : ''))
                    .join(' ')
                    .trim();

                if (pageText) {
                    fullText += `--- Page ${i} ---\n${pageText}\n\n`;
                }
            }

            setResumeText(fullText || 'No text content found in PDF');
        } catch (err) {
            console.error('PDF extraction error:', err);
            setError('Failed to extract text from PDF. Please try another file.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] ?? null;
        setResumeFile(file);
        setError('');

        if (!file) {
            setResumeText('');
            return;
        }

        // Validate file type
        if (file.type !== "application/pdf") {
            setError("Please upload a PDF file only.");
            return;
        }

        // Check file size (limit to 10MB)
        if (file.size > 10 * 1024 * 1024) {
            setError("File size too large. Please upload a PDF smaller than 10MB.");
            return;
        }

        const reader = new FileReader();

        reader.onerror = () => {
            setError('Failed to read the file. Please try again.');
        };

        reader.onload = async () => {
            if (!reader.result) {
                setError('Failed to read file content.');
                return;
            }

            const buffer = reader.result as ArrayBuffer;
            await extractTextFromPdf(buffer);
        };

        reader.readAsArrayBuffer(file);
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

            <section
                className="mb-8 bg-gradient-to-br from-gray-900 via-black to-gray-800 border-4 border-yellow-400 p-8 rounded-xl relative overflow-hidden group transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl"
                style={{
                    clipPath: 'polygon(20px 0%, 100% 0%, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0% 100%, 0% 20px)',
                    boxShadow: `
                    inset -6px -6px 0px rgba(251, 255, 0, 0.4),
                    0 0 30px rgba(251, 255, 0, 0.6),
                    0 0 60px rgba(251, 255, 0, 0.3),
                    0 10px 25px rgba(0, 0, 0, 0.5)
                    `,
                }}
            >
                {/* Animated background elements */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-4 left-4 w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                    <div className="absolute top-8 right-8 w-1 h-1 bg-green-400 rounded-full animate-ping"></div>
                    <div className="absolute bottom-6 left-1/3 w-1.5 h-1.5 bg-fuchsia-400 rounded-full animate-pulse delay-300"></div>
                    <div className="absolute bottom-4 right-1/4 w-1 h-1 bg-cyan-400 rounded-full animate-ping delay-700"></div>
                </div>

                {/* Glowing border animation */}
                <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{
                        background: 'linear-gradient(45deg, transparent, rgba(251, 255, 0, 0.1), transparent)',
                        animation: 'borderGlow 3s ease-in-out infinite'
                    }}></div>

                {/* Header Section */}
                <div className="relative z-10 mb-6">
                    <h2 className="text-3xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-yellow-200 to-yellow-400 animate-pulse">
                        {pageText.title}
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                            <span className="text-yellow-400 font-semibold">Company:</span>
                            <span className="text-cyan-300 font-mono">{pageText.company}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-fuchsia-400 rounded-full animate-pulse delay-300"></div>
                            <span className="text-yellow-400 font-semibold">Location:</span>
                            <span className="text-cyan-300 font-mono">{pageText.location}</span>
                        </div>
                    </div>
                </div>

                {/* Skills Section */}
                <div className="space-y-4 mb-6 relative z-10">
                    <div className="flex items-center gap-3">
                        <div className="font-mono text-fuchsia-400 text-xl font-bold tracking-wider flex items-center gap-2">
                            <span className="text-green-400">{'>'}</span>
                            <span className="animate-pulse">SKILLS</span>
                            <span className="text-green-400 animate-pulse delay-500">{'_'}</span>
                        </div>
                    </div>

                    <div
                        className="bg-gradient-to-r from-gray-900 via-black to-gray-900 border-2 border-pink-400 p-6 rounded-lg relative overflow-hidden group/skills transition-all duration-300 hover:border-pink-300"
                        style={{
                            boxShadow: `
                            inset -3px -3px 0px rgba(255, 0, 255, 0.4),
                            inset 3px 3px 0px rgba(255, 0, 255, 0.1),
                            0 0 20px rgba(255, 0, 255, 0.2)
                            `
                        }}
                    >
                        {/* Skill container background animation */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-pink-500/5 to-transparent translate-x-full group-hover/skills:translate-x-[-100%] transition-transform duration-1000"></div>

                        <div className="flex flex-wrap gap-3 relative z-10">
                            {pageText.technologies.map((tech: string, index: any) => (
                                <span
                                    key={index}
                                    className="px-3 py-2 bg-black border border-green-400 text-green-400 font-mono text-sm font-bold rounded transition-all duration-300 hover:bg-green-400 hover:text-black hover:scale-105 hover:shadow-lg hover:shadow-green-400/50 cursor-pointer"
                                    style={{
                                        boxShadow: 'inset -2px -2px 0px rgba(0, 255, 0, 0.3)',
                                        animation: `skillPulse 2s ease-in-out infinite ${index * 0.1}s`
                                    }}
                                >
                                    {tech}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Description Section */}
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="font-mono text-cyan-400 text-lg font-bold tracking-wider flex items-center gap-2">
                            <span className="text-yellow-400">{'>'}</span>
                            <span>DESCRIPTION</span>
                            <span className="text-yellow-400 animate-pulse">{'_'}</span>
                        </div>
                    </div>

                    <div
                        className="whitespace-pre-wrap max-h-64 overflow-y-auto border-2 border-green-400 p-4 bg-gradient-to-br from-black via-gray-900 to-black rounded-lg text-green-300 font-mono text-sm leading-relaxed scrollbar-thin scrollbar-thumb-green-400 scrollbar-track-gray-800 transition-all duration-300 hover:border-green-300"
                        style={{
                            boxShadow: `
                            inset -2px -2px 0px rgba(0, 255, 0, 0.3),
                            inset 2px 2px 0px rgba(0, 255, 0, 0.1),
                            0 0 15px rgba(0, 255, 0, 0.2)
                            `
                        }}
                    >
                        {pageText.jobDescription || pageText.textContent || 'No description available.'}
                    </div>
                </div>

                <style jsx>{`
                    @keyframes borderGlow {
                    0%, 100% { transform: translateX(-100%); }
                    50% { transform: translateX(100%); }
                    }
                    
                    @keyframes skillPulse {
                    0%, 100% { box-shadow: inset -2px -2px 0px rgba(0, 255, 0, 0.3); }
                    50% { box-shadow: inset -2px -2px 0px rgba(0, 255, 0, 0.6), 0 0 10px rgba(0, 255, 0, 0.3); }
                    }
                    
                    .scrollbar-thin::-webkit-scrollbar {
                    width: 6px;
                    }
                    
                    .scrollbar-thumb-green-400::-webkit-scrollbar-thumb {
                    background-color: #4ade80;
                    border-radius: 3px;
                    }
                    
                    .scrollbar-track-gray-800::-webkit-scrollbar-track {
                    background-color: #1f2937;
                    }
                `}
                </style>
            </section>


            <section>
                <h3 className="text-xl font-bold mb-4">Upload Your Resume</h3>
                <input
                    type="file"
                    accept=".pdf"
                    onChange={handleResumeUpload}
                    className="mb-4 text-green-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-800 file:text-green-100 hover:file:bg-green-700"
                    disabled={!pdfLib}
                />
                {!pdfLib && (
                    <p className="text-yellow-400 text-sm">Initializing PDF processor...</p>
                )}
                {resumeFile && (
                    <p className="text-green-300">Uploaded: {resumeFile.name}</p>
                )}
                {error && (
                    <p className="text-red-400 mt-2">⚠️ {error}</p>
                )}
            </section>

            {(isLoading || resumeText) && (
                <section className="mt-8">
                    <h3 className="text-xl font-bold mb-4">Extracted Resume Content</h3>
                    {isLoading ? (
                        <div className="flex items-center space-x-2">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-400"></div>
                            <p>Extracting text from PDF...</p>
                        </div>
                    ) : (
                        <div className="whitespace-pre-wrap max-h-96 overflow-y-auto border border-green-400 p-4 bg-black rounded text-sm">
                            {resumeText}
                        </div>
                    )}
                </section>
            )}
        </div>
    );
}