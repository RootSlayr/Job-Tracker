'use client';

import { useState, useEffect } from 'react';
import { usePageText } from '@/context/PagetextContent';

export default function ViewResultPage() {
    const { pageText } = usePageText();
    const [resumeFile, setResumeFile] = useState<File | null>(null);
    const [fileText, setFileText] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const [pdfLib, setPdfLib] = useState<any>(null);
    const [coverLetter, setCoverLetter] = useState<string>('');
    const [linkedinMesasage, setLinkedinMessage] = useState<string>('');
    const [emailMessage, setEmailMessage] = useState<string>('');
    const [activeTab, setActiveTab] = useState('cover-letter');
    const [isGenerating, setIsGenerating] = useState(false);



    // Initialize PDF.js once when component mounts
    useEffect(() => {
        async function initPdfJs() {
            try {
                const pdfjsLib = await import('pdfjs-dist');

                // Use a known working version - 3.4.120 is stable
                // pdfjsLib.GlobalWorkerOptions.workerSrc =
                //     // 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js';
                //     `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.js`;

                pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.js';

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

            setFileText(fullText || 'No text content found in PDF');
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
            setFileText('');
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

    const handleCoverletter = async () => {
        try {
            setIsGenerating(true);
            const parse = await fetch("/api/cover-letter", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    textContent: {
                        pageText: pageText,
                        resumeText: fileText
                    }
                })
            });

            const parsed = await parse.json();
            // console.log('Cover letter generated:', parsed);
            // setExp(prev => prev + 50); // Gain EXP for finding a quest!
            setCoverLetter(parsed.coverLetter);
            setLinkedinMessage(parsed.linkedInMessage);
            setEmailMessage(parsed.emailVersion);
            setIsGenerating(false);
        } catch (error) {
            console.error('Error fetching job data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    if (!pageText) {
        return (
            <div className="p-8 font-mono text-yellow-400 bg-black min-h-screen">
                <h2 className="text-2xl font-bold mb-4">No quest data found!</h2>
                <p>Please go back and scan a quest first.</p>
            </div>
        );
    }

    const tabs = [
        { id: 'cover-letter', label: 'Cover Letter', content: coverLetter, icon: '📄' },
        { id: 'linkedin', label: 'LinkedIn Message', content: linkedinMesasage, icon: '💼' },
        { id: 'email', label: 'Email Message', content: emailMessage, icon: '📧' }
    ];


    return (
        <div className="p-8 font-mono text-green-400 bg-black min-h-screen max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold mb-6 tracking-wider">Quest Details</h1>

            {/* Original Quest Details Section */}
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
            </section>

            {/* Resume Upload Section */}
            <section
                className="mb-8 bg-gradient-to-br from-gray-900 via-black to-gray-800 border-2 border-cyan-400 p-6 rounded-xl relative overflow-hidden group transition-all duration-500 hover:scale-[1.01] hover:shadow-xl"
                style={{
                    boxShadow: `
                    inset -4px -4px 0px rgba(0, 255, 255, 0.3),
                    0 0 20px rgba(0, 255, 255, 0.4),
                    0 0 40px rgba(0, 255, 255, 0.2)
                    `,
                }}
            >
                {/* Background animation */}
                <div className="absolute inset-0 opacity-5">
                    <div className="absolute top-3 right-6 w-1 h-1 bg-cyan-400 rounded-full animate-ping"></div>
                    <div className="absolute bottom-4 left-8 w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse delay-500"></div>
                </div>

                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="font-mono text-cyan-400 text-xl font-bold tracking-wider flex items-center gap-2">
                            <span className="text-yellow-400">{'>'}</span>
                            <span className="animate-pulse">UPLOAD RESUME</span>
                            <span className="text-yellow-400 animate-pulse delay-500">{'_'}</span>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="relative">
                            <input
                                type="file"
                                accept=".pdf"
                                onChange={handleResumeUpload}
                                className="w-full text-green-400 bg-black border-2 border-green-400 rounded-lg p-3 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-800 file:text-green-100 hover:file:bg-green-700 transition-all duration-300 hover:border-green-300 focus:outline-none focus:border-green-300 focus:shadow-lg focus:shadow-green-400/20"
                                disabled={!pdfLib}
                                style={{
                                    boxShadow: 'inset -2px -2px 0px rgba(0, 255, 0, 0.3)'
                                }}
                            />
                        </div>

                        {!pdfLib && (
                            <div className="flex items-center gap-2 text-yellow-400 text-sm">
                                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-yellow-400"></div>
                                <span>Initializing PDF processor...</span>
                            </div>
                        )}

                        {resumeFile && (
                            <div className="flex items-center gap-2 text-green-300 bg-green-900/20 border border-green-400/30 rounded-lg p-3">
                                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                <span>Uploaded: {resumeFile.name}</span>
                            </div>
                        )}

                        {error && (
                            <div className="flex items-center gap-2 text-red-400 bg-red-900/20 border border-red-400/30 rounded-lg p-3">
                                <span>⚠️</span>
                                <span>{error}</span>
                            </div>
                        )}

                        {isLoading && (
                            <div className="flex items-center gap-3 text-cyan-300 bg-cyan-900/20 border border-cyan-400/30 rounded-lg p-3">
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-cyan-400"></div>
                                <span>Extracting text from PDF...</span>
                            </div>
                        )}

                        {resumeFile && !isLoading && (
                            <button
                                onClick={handleCoverletter}
                                disabled={isGenerating}
                                className="w-full px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white font-bold rounded-lg transition-all duration-300 hover:from-green-500 hover:to-green-600 hover:scale-[1.02] hover:shadow-lg hover:shadow-green-400/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                                style={{
                                    boxShadow: 'inset -2px -2px 0px rgba(0, 0, 0, 0.3), 0 4px 15px rgba(34, 197, 94, 0.3)'
                                }}
                            >
                                {isGenerating ? (
                                    <div className="flex items-center justify-center gap-2">
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                        <span>Generating Content...</span>
                                    </div>
                                ) : (
                                    'Generate Cover Letter & Messages'
                                )}
                            </button>
                        )}
                    </div>
                </div>
            </section>

            {/* Tabbed Content Section */}
            {(coverLetter || linkedinMesasage || emailMessage) && (
                <section
                    className="bg-gradient-to-br from-gray-900 via-black to-gray-800 border-2 border-purple-400 rounded-xl relative overflow-hidden group transition-all duration-500 hover:scale-[1.01] hover:shadow-xl"
                    style={{
                        boxShadow: `
                        inset -4px -4px 0px rgba(168, 85, 247, 0.3),
                        0 0 20px rgba(168, 85, 247, 0.4),
                        0 0 40px rgba(168, 85, 247, 0.2)
                        `,
                    }}
                >
                    {/* Background animation */}
                    <div className="absolute inset-0 opacity-5">
                        <div className="absolute top-4 left-8 w-1 h-1 bg-purple-400 rounded-full animate-ping delay-300"></div>
                        <div className="absolute bottom-6 right-10 w-1.5 h-1.5 bg-pink-400 rounded-full animate-pulse"></div>
                    </div>

                    <div className="relative z-10">
                        {/* Tab Header */}
                        <div className="flex items-center gap-3 p-6 pb-0">
                            <div className="font-mono text-purple-400 text-xl font-bold tracking-wider flex items-center gap-2">
                                <span className="text-yellow-400">{'>'}</span>
                                <span className="animate-pulse">GENERATED CONTENT</span>
                                <span className="text-yellow-400 animate-pulse delay-500">{'_'}</span>
                            </div>
                        </div>

                        {/* Tab Navigation */}
                        <div className="flex border-b border-gray-700 mx-6 mt-4">
                            {tabs.map((tab: any) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center gap-2 px-4 py-3 font-mono text-sm font-bold transition-all duration-300 border-b-2 ${activeTab === tab.id
                                        ? 'text-purple-300 border-purple-400 bg-purple-900/20'
                                        : 'text-gray-400 border-transparent hover:text-purple-400 hover:border-purple-400/50'
                                        }`}
                                >
                                    <span className="text-lg">{tab.icon}</span>
                                    <span>{tab.label}</span>
                                </button>
                            ))}
                        </div>

                        {/* Tab Content */}
                        <div className="p-6">
                            {tabs.map((tab) => (
                                <div
                                    key={tab.id}
                                    className={`transition-all duration-300 ${activeTab === tab.id ? 'block' : 'hidden'
                                        }`}
                                >
                                    {tab.content ? (
                                        <div
                                            className="whitespace-pre-wrap max-h-96 overflow-y-auto border-2 border-purple-400 p-4 bg-gradient-to-br from-black via-gray-900 to-black rounded-lg text-purple-100 font-mono text-sm leading-relaxed scrollbar-thin scrollbar-thumb-purple-400 scrollbar-track-gray-800 transition-all duration-300 hover:border-purple-300"
                                            style={{
                                                boxShadow: `
                                                inset -2px -2px 0px rgba(168, 85, 247, 0.3),
                                                inset 2px 2px 0px rgba(168, 85, 247, 0.1),
                                                0 0 15px rgba(168, 85, 247, 0.2)
                                                `
                                            }}
                                        >
                                            {tab.content}
                                        </div>
                                    ) : (
                                        <div className="text-center py-8 text-gray-400">
                                            <div className="text-4xl mb-2">{tab.icon}</div>
                                            <p>No {tab.label.toLowerCase()} generated yet.</p>
                                            <p className="text-sm mt-1">Upload your resume and click generate to create content.</p>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

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
                
                .scrollbar-thumb-purple-400::-webkit-scrollbar-thumb {
                    background-color: #a855f7;
                    border-radius: 3px;
                }
                
                .scrollbar-track-gray-800::-webkit-scrollbar-track {
                    background-color: #1f2937;
                }
            `}
            </style>
        </div>
    );
}