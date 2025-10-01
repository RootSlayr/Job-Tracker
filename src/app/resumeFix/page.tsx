"use client"
import { useState, useEffect } from "react";
import type {
    TextContent,
    TextItem,
} from 'pdfjs-dist/types/src/display/api';



export default function ResumeFixerPage() {

    type PdflibModule = typeof import('pdfjs-dist')

    const [file, setFile] = useState<File | null>(null);
    const [fileText, setFileText] = useState<string>("");
    const [pdfLib, setPdfLib] = useState<PdflibModule | null>(null);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        async function initPdfJs() {
            try {
                const pdfjsLib = await import('pdfjs-dist');

                pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.js";

                setPdfLib(pdfjsLib)
            } catch (err) {
                console.error("Pdfjslib error in the resume processing page")
            }
        }

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
                const textContent: TextContent = await page.getTextContent();
                const pageText = (textContent.items as TextItem[])
                    .map((item) => ('str' in item ? item.str : ''))
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
        setFile(file);
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

    return (
        <div
            className="min-h-screen bg-black relative overflow-hidden"
            style={{
                backgroundImage: `
          radial-gradient(circle at 25% 25%, rgba(0, 255, 0, 0.05) 0%, transparent 50%),
          radial-gradient(circle at 75% 75%, rgba(0, 255, 255, 0.05) 0%, transparent 50%),
          linear-gradient(90deg, transparent 50%, rgba(255, 0, 255, 0.02) 50%),
          linear-gradient(rgba(0, 255, 0, 0.02) 50%, transparent 50%)
        `,
                backgroundSize: '200px 200px, 250px 250px, 8px 8px, 8px 8px'
            }}
        >
            <div className="p-8 font-mono text-green-400 bg-black min-h-screen max-w-4xl mx-auto">
                <h1 className="text-4xl font-bold mb-8 tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-cyan-300 to-green-400 animate-pulse">
                    Resume Fixer
                </h1>

                {/* Upload Card */}
                <div className="bg-gradient-to-br from-gray-900 via-black to-gray-800 border-2 border-cyan-400 p-6 rounded-xl relative overflow-hidden mb-6">
                    <label className="block text-cyan-300 font-mono mb-2">Upload your resume (PDF only):</label>
                    <input
                        type="file"
                        accept=".pdf"
                        onChange={handleResumeUpload}
                        className="hidden"
                        id="resume-upload"
                    />
                    <label
                        htmlFor="resume-upload"
                        className="inline-block cursor-pointer border border-green-400 text-green-300 px-4 py-2 rounded-md font-mono hover:bg-green-900"
                    >
                        {file ? `> ${file.name}` : '> Choose a file'}
                    </label>

                    {error && (
                        <p className="text-red-500 mt-2 font-mono">{error}</p>
                    )}

                    {isLoading && (
                        <p className="text-cyan-300 mt-2 font-mono animate-pulse">{'> Extracting text...'}</p>
                    )}

                    {file && !isLoading && (
                        <p className="text-green-300 mt-2 font-mono">
                            {`> Uploaded file: ${file.name} _`}
                        </p>
                    )}
                </div>

                {/* Extracted Text */}
                {fileText && (
                    <div className="bg-gradient-to-br from-gray-900 via-black to-gray-800 border-2 border-cyan-400 p-6 rounded-xl relative overflow-hidden">
                        <h2 className="text-cyan-300 font-mono font-bold mb-2">{'> Extracted Text:'}</h2>
                        <pre className="whitespace-pre-wrap bg-black p-4 rounded-md max-h-96 overflow-y-auto text-green-400 font-mono">
                            {fileText}
                        </pre>
                    </div>
                )}
            </div>
        </div>
    );
} 