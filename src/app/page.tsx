"use client";

import { useState } from 'react';
import { usePageText } from '@/context/PagetextContent';
import { useRouter } from 'next/navigation';



export default function HomePage() {
  const [jobUrl, setJobUrl] = useState('');
  // const [pageText, setPageText] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [applicationStatus, setApplicationStatus] = useState(null);
  // const [exp, setExp] = useState(0);
  const [jobDescription, setJobDescription] = useState('');

  const { pageText, setPageText } = usePageText();
  const router = useRouter();


  const handleFetchJob = async () => {
    setIsLoading(true);
    try {
      const parse = await fetch("/api/parse-job", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ textContent: jobDescription }),
      });

      const parsed = await parse.json();
      setPageText(parsed);
      // setExp(prev => prev + 50); // Gain EXP for finding a quest!
    } catch (error) {
      console.error('Error fetching job data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusUpdate = (status) => {
    setApplicationStatus(status);
    if (status === 'applied') {
      // setExp(prev => prev + 100); // Big EXP gain for completing quest!
      // setPageText(pageText);
      router.push('/viewResult');
    }
  };

  const getStatusDisplay = () => {
    if (applicationStatus === 'applied') return { text: 'QUEST COMPLETE!', color: 'text-green-400', bg: 'bg-green-400' };
    if (applicationStatus === 'pending') return { text: 'QUEST ACTIVE', color: 'text-yellow-400', bg: 'bg-yellow-400' };
    return { text: 'NEW QUEST', color: 'text-cyan-400', bg: 'bg-cyan-400' };
  };

  return (
    <div className="min-h-screen bg-black relative overflow-hidden" style={{
      backgroundImage: `
        radial-gradient(circle at 25% 25%, rgba(0, 255, 0, 0.1) 0%, transparent 50%),
        radial-gradient(circle at 75% 75%, rgba(0, 255, 255, 0.1) 0%, transparent 50%),
        linear-gradient(90deg, transparent 50%, rgba(255, 0, 255, 0.02) 50%),
        linear-gradient(rgba(0, 255, 0, 0.02) 50%, transparent 50%)
      `,
      backgroundSize: '200px 200px, 250px 250px, 8px 8px, 8px 8px'
    }}>
      {/* Scanlines overlay */}
      <div className="absolute inset-0 opacity-30" style={{
        backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 255, 0, 0.1) 2px, rgba(0, 255, 0, 0.1) 4px)',
        animation: 'scanlines 0.1s linear infinite'
      }}></div>

      {/* Floating pixels */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-2 h-2 bg-green-400 animate-bounce animation-delay-1"></div>
        <div className="absolute top-40 right-20 w-2 h-2 bg-cyan-400 animate-bounce animation-delay-2"></div>
        <div className="absolute bottom-32 left-32 w-2 h-2 bg-yellow-400 animate-bounce animation-delay-3"></div>
        <div className="absolute bottom-20 right-10 w-2 h-2 bg-pink-400 animate-bounce animation-delay-4"></div>
      </div>

      <div className="relative z-10 px-4 py-8 flex flex-col items-center justify-start min-h-screen pt-24">

        {/* Game Header */}
        <div className="text-center mb-8">
          {/* <div className="inline-block p-4 bg-black border-4 border-green-400 mb-4" style={{
            clipPath: 'polygon(16px 0%, 100% 0%, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0% 100%, 0% 16px)',
            boxShadow: 'inset -4px -4px 0px rgba(0, 255, 0, 0.3), 0 0 20px rgba(0, 255, 0, 0.3)'
          }}>
            <div className="text-6xl animate-pulse">🎮</div>
          </div> */}
          <h1 className="font-mono text-4xl font-bold text-green-400 mb-2 tracking-wider" style={{
            textShadow: '3px 3px 0px #000, 0 0 10px rgba(0, 255, 0, 0.5)'
          }}>
            JOB QUEST TRACKER
          </h1>
          <p className="font-mono text-cyan-400 text-lg tracking-wide">
            ► FIND YOUR DREAM QUEST ◄
          </p>

          {/* EXP Bar */}
          {/* <div className="mt-4 font-mono text-sm">
            <div className="flex items-center justify-center gap-2 text-yellow-400">
              <span>EXP:</span>
              <div className="w-48 h-4 bg-black border-2 border-yellow-400 relative">
                <div
                  className="h-full bg-yellow-400 transition-all duration-500"
                  style={{ width: `${Math.min((exp % 200) / 200 * 100, 100)}%` }}
                ></div>
                <span className="absolute inset-0 flex items-center justify-center text-xs text-black font-bold">
                  {exp}/200
                </span>
              </div>
            </div>
          </div> */}
        </div>

        {/* Input Terminal */}
        <div className="w-full max-w-2xl mb-8">
          <div className="bg-black border-4 border-cyan-400 p-6" style={{
            clipPath: 'polygon(12px 0%, 100% 0%, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0% 100%, 0% 12px)',
            boxShadow: 'inset -4px -4px 0px rgba(0, 255, 255, 0.3), 0 0 15px rgba(0, 255, 255, 0.2)'
          }}>
            <div className="font-mono text-green-400 text-sm mb-4 tracking-wider">
              ► ANALYZE QUEST ◄
            </div>

            <div className="space-y-4">
              <div className="relative">
                {/* <input
                  type="text"
                  placeholder="https://example.com/job-posting"
                  value={jobUrl}
                  onChange={(e) => setJobUrl(e.target.value)}
                  className="w-full p-4 bg-black border-2 border-green-400 text-green-400 font-mono placeholder-green-600 focus:outline-none focus:border-yellow-400 focus:text-yellow-400 transition-colors"
                  style={{
                    boxShadow: 'inset -2px -2px 0px rgba(0, 255, 0, 0.3)'
                  }}
                /> */}
                <textarea
                  placeholder="Paste the full job description here..."
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  className="w-full p-4 h-48 resize-y bg-black border-2 border-green-400 text-green-400 font-mono placeholder-green-600 focus:outline-none focus:border-yellow-400 focus:text-yellow-400 transition-colors"
                  style={{
                    boxShadow: 'inset -2px -2px 0px rgba(0, 255, 0, 0.3)'
                  }}
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-400 animate-pulse">
                  █
                </div>
              </div>

              <button
                onClick={handleFetchJob}
                // disabled={isLoading || !jobUrl.trim()}
                disabled={isLoading || !jobDescription.trim()}

                className="w-full py-4 bg-black border-4 border-green-400 text-green-400 font-mono font-bold text-lg tracking-wider hover:bg-green-400 hover:text-black transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
                style={{
                  clipPath: 'polygon(12px 0%, 100% 0%, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0% 100%, 0% 12px)',
                  textShadow: '2px 2px 0px #000'
                }}
              >
                <div className="absolute inset-0 bg-green-400 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 -z-10"></div>
                <span className="relative z-10">
                  {isLoading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-current border-t-transparent animate-spin"></div>
                      SCANNING QUEST...
                    </div>
                  ) : (
                    '► START QUEST SCAN ◄'
                  )}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Quest Details */}
        {pageText && (
          <div className="w-full max-w-5xl">
            <div className="bg-black border-4 border-yellow-400" style={{
              clipPath: 'polygon(16px 0%, 100% 0%, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0% 100%, 0% 16px)',
              boxShadow: 'inset -4px -4px 0px rgba(255, 255, 0, 0.3), 0 0 20px rgba(255, 255, 0, 0.2)'
            }}>

              {/* Quest Header */}
              <div className="bg-yellow-400 text-black p-4 font-mono font-bold">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">🏆</div>
                    <div>
                      <h2 className="text-xl tracking-wider">{pageText.title}</h2>
                      <div className="text-sm flex gap-4 mt-1">
                        <span>🏢 {pageText.company}</span>
                        <span>📍 {pageText.location}</span>
                        {pageText.applicationDeadline && (
                          <span>⏰ {pageText.applicationDeadline}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {applicationStatus && (
                    <div className={`px-4 py-2 ${getStatusDisplay().bg} text-black font-bold text-sm border-2 border-black`}>
                      {getStatusDisplay().text}
                    </div>
                  )}
                </div>
              </div>

              {/* Quest Content */}
              <div className="p-6 space-y-6">
                <div className="grid md:grid-cols-2 gap-6">

                  {/* Quest Description */}
                  <div className="space-y-3">
                    <div className="font-mono text-cyan-400 text-lg font-bold tracking-wider flex items-center gap-2">
                      📜 QUEST DESCRIPTION
                    </div>
                    <div className="bg-gray-900 border-2 border-cyan-400 p-4" style={{
                      boxShadow: 'inset -2px -2px 0px rgba(0, 255, 255, 0.3)'
                    }}>
                      <p className="text-green-400 font-mono text-sm leading-relaxed whitespace-pre-line">
                        {pageText.jobDescription}
                      </p>
                    </div>
                  </div>

                  {/* Quest Requirements */}
                  <div className="space-y-3">
                    <div className="font-mono text-green-400 text-lg font-bold tracking-wider flex items-center gap-2">
                      ⚔️ REQUIREMENTS
                    </div>
                    <div className="bg-gray-900 border-2 border-green-400 p-4" style={{
                      boxShadow: 'inset -2px -2px 0px rgba(0, 255, 0, 0.3)'
                    }}>
                      <p className="text-cyan-400 font-mono text-sm leading-relaxed whitespace-pre-line">
                        {pageText.requirements.join('\n')}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">

                  {/* Quest Type */}
                  <div className="space-y-3">
                    <div className="font-mono text-yellow-400 text-lg font-bold tracking-wider flex items-center gap-2">
                      💼 QUEST TYPE
                    </div>
                    <div className="bg-gray-900 border-2 border-yellow-400 p-4" style={{
                      boxShadow: 'inset -2px -2px 0px rgba(255, 255, 0, 0.3)'
                    }}>
                      <p className="text-green-400 font-mono text-sm">{pageText.employmentType}</p>
                    </div>
                  </div>

                  {/* Skills/Tech Stack */}
                  <div className="space-y-3">
                    <div className="font-mono text-pink-400 text-lg font-bold tracking-wider flex items-center gap-2">
                      🔧 SKILL ITEMS
                    </div>
                    <div className="bg-gray-900 border-2 border-pink-400 p-4" style={{
                      boxShadow: 'inset -2px -2px 0px rgba(255, 0, 255, 0.3)'
                    }}>
                      <div className="flex flex-wrap gap-2">
                        {pageText.technologies.map((tech, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-black border border-green-400 text-green-400 font-mono text-xs font-bold"
                            style={{
                              boxShadow: 'inset -1px -1px 0px rgba(0, 255, 0, 0.3)'
                            }}
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 pt-4">
                  <button
                    onClick={() => handleStatusUpdate('applied')}
                    className={`flex-1 py-4 px-6 font-mono font-bold text-lg tracking-wider border-4 transition-all duration-200 hover:scale-105 ${applicationStatus === 'applied'
                      ? 'bg-green-400 text-black border-green-400'
                      : 'bg-black text-green-400 border-green-400 hover:bg-green-400 hover:text-black'
                      }`}
                    style={{
                      clipPath: 'polygon(12px 0%, 100% 0%, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0% 100%, 0% 12px)',
                      textShadow: applicationStatus === 'applied' ? 'none' : '2px 2px 0px #000'
                    }}
                  >
                    ACCEPT QUEST
                  </button>
                  <button
                    onClick={() => handleStatusUpdate('pending')}
                    className={`flex-1 py-4 px-6 font-mono font-bold text-lg tracking-wider border-4 transition-all duration-200 hover:scale-105 ${applicationStatus === 'pending'
                      ? 'bg-yellow-400 text-black border-yellow-400'
                      : 'bg-black text-yellow-400 border-yellow-400 hover:bg-yellow-400 hover:text-black'
                      }`}
                    style={{
                      clipPath: 'polygon(12px 0%, 100% 0%, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0% 100%, 0% 12px)',
                      textShadow: applicationStatus === 'pending' ? 'none' : '2px 2px 0px #000'
                    }}
                  >
                    DECLINE QUEST
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes scanlines {
          0% { transform: translateY(0px); }
          100% { transform: translateY(4px); }
        }
        
        .animation-delay-1 { animation-delay: 0.5s; }
        .animation-delay-2 { animation-delay: 1s; }
        .animation-delay-3 { animation-delay: 1.5s; }
        .animation-delay-4 { animation-delay: 2s; }
        
        .text-pink-400 { color: #ff00ff; }
        .bg-pink-400 { background-color: #ff00ff; }
        .border-pink-400 { border-color: #ff00ff; }
      `}</style>
    </div>
  );
}