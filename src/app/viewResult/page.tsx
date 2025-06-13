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
                className="mb-8 bg-black border-4 border-green-400 p-6 rounded-lg"
                style={{
                    clipPath: 'polygon(16px 0%, 100% 0%, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0% 100%, 0% 16px)',
                    boxShadow: 'inset -4px -4px 0px rgba(0, 255, 0, 0.3), 0 0 20px rgba(0, 255, 0, 0.3)',
                }}
            >
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