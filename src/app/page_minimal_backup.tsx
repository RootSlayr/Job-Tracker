// 'use client';

// import { useState } from 'react';
// import { Search, Briefcase, MapPin, Clock, Code, Building2, FileText, CheckCircle, AlertCircle } from 'lucide-react';

// export default function HomePage() {
//   const [jobUrl, setJobUrl] = useState('');
//   const [pageText, setPageText] = useState(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const [applicationStatus, setApplicationStatus] = useState(null);

//   const handleFetchJob = async () => {
//     setIsLoading(true);
//     try {
//       const res = await fetch('/api/fetch-job', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ url: jobUrl }),
//       });

//       const data = await res.json();
//       const html = data.html;
//       if (!html) return;

//       const parser = new DOMParser();
//       const doc = parser.parseFromString(html, 'text/html');
//       const textContent = doc.body.textContent || '';

//       const parse = await fetch("/api/parse-job", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ textContent }),
//       });

//       const parsed = await parse.json();
//       setPageText(parsed);
//     } catch (error) {
//       console.error('Error fetching job data:', error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleStatusUpdate = (status) => {
//     setApplicationStatus(status);
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
//       {/* Animated background elements */}
//       <div className="absolute inset-0 overflow-hidden">
//         <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
//         <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
//         <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
//       </div>

//       <div className="relative z-10 px-4 py-12 flex flex-col items-center justify-start min-h-screen">
//         {/* Header */}
//         <div className="text-center mb-12">
//           <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl mb-4 shadow-2xl">
//             <Briefcase className="w-8 h-8 text-white" />
//           </div>
//           <h1 className="text-5xl font-bold bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent mb-2">
//             Job Tracker Pro
//           </h1>
//           <p className="text-lg text-purple-200/80">Transform job hunting into success</p>
//         </div>

//         <form
//           onSubmit={(e) => {
//             e.preventDefault(); // Prevent page reload
//             handleFetchJob();
//           }}
//           className="w-full max-w-2xl mb-8"
//         >
//           {/* Search Form */}
//           <div className="w-full max-w-2xl mb-8">
//             <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8 shadow-2xl hover:shadow-purple-500/10 transition-all duration-500 hover:bg-white/15">
//               <div className="space-y-6">
//                 <div className="relative">
//                   <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-purple-300 w-5 h-5" />
//                   <input
//                     type="text"
//                     placeholder="Paste your dream job link here..."
//                     value={jobUrl}
//                     onChange={(e) => setJobUrl(e.target.value)}
//                     className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/30 text-white placeholder-purple-200/60 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300 backdrop-blur-sm"
//                   />
//                 </div>
//                 <button
//                   type="submit"
//                   disabled={isLoading || !jobUrl.trim()}
//                   className="w-full py-4 bg-gradient-to-r from-purple-600 via-purple-500 to-blue-500 text-white font-semibold rounded-2xl hover:from-purple-700 hover:via-purple-600 hover:to-blue-600 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none relative overflow-hidden group"
//                 >
//                   <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
//                   <span className="relative">
//                     {isLoading ? (
//                       <div className="flex items-center justify-center gap-2">
//                         <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
//                         Analyzing Job...
//                       </div>
//                     ) : (
//                       'Fetch Job Details'
//                     )}
//                   </span>
//                 </button>
//               </div>
//             </div>
//           </div>
//         </form>

//         {/* Job Details */}
//         {pageText && (
//           <div className="w-full max-w-4xl">
//             <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl shadow-2xl overflow-hidden transform animate-fadeInUp">
//               {/* Header Section */}
//               <div className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 p-8 border-b border-white/10">
//                 <div className="flex items-start justify-between">
//                   <div className="flex-1">
//                     <h2 className="text-3xl font-bold text-white mb-3">{pageText.title}</h2>
//                     <div className="flex flex-wrap gap-4 text-purple-200">
//                       <div className="flex items-center gap-2">
//                         <Building2 className="w-4 h-4" />
//                         <span>{pageText.company}</span>
//                       </div>
//                       <div className="flex items-center gap-2">
//                         <MapPin className="w-4 h-4" />
//                         <span>{pageText.location}</span>
//                       </div>
//                       {pageText.applicationDeadline && (
//                         <div className="flex items-center gap-2">
//                           <Clock className="w-4 h-4" />
//                           <span>{pageText.applicationDeadline}</span>
//                         </div>
//                       )}
//                     </div>
//                   </div>

//                   {/* Status Badge */}
//                   {applicationStatus && (
//                     <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${applicationStatus === 'applied'
//                       ? 'bg-green-500/20 text-green-300 border border-green-500/30'
//                       : 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
//                       }`}>
//                       {applicationStatus === 'applied' ? (
//                         <>
//                           <CheckCircle className="w-4 h-4" />
//                           Applied
//                         </>
//                       ) : (
//                         <>
//                           <AlertCircle className="w-4 h-4" />
//                           Pending
//                         </>
//                       )}
//                     </div>
//                   )}
//                 </div>
//               </div>

//               {/* Content Section */}
//               <div className="p-8 space-y-8">
//                 <div className="grid md:grid-cols-2 gap-8">
//                   {/* Job Description */}
//                   <div className="space-y-4">
//                     <div className="flex items-center gap-3">
//                       <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
//                         <FileText className="w-4 h-4 text-blue-400" />
//                       </div>
//                       <h3 className="text-xl font-semibold text-white">Description</h3>
//                     </div>
//                     <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
//                       <p className="text-purple-100/90 leading-relaxed whitespace-pre-line text-sm">
//                         {pageText.jobDescription}
//                       </p>
//                     </div>
//                   </div>

//                   {/* Requirements */}
//                   <div className="space-y-4">
//                     <div className="flex items-center gap-3">
//                       <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center">
//                         <CheckCircle className="w-4 h-4 text-purple-400" />
//                       </div>
//                       <h3 className="text-xl font-semibold text-white">Requirements</h3>
//                     </div>
//                     <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
//                       <p className="text-purple-100/90 leading-relaxed whitespace-pre-line text-sm">
//                         {pageText.requirements}
//                       </p>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Employment Type & Technologies */}
//                 <div className="grid md:grid-cols-2 gap-8">
//                   <div className="space-y-4">
//                     <div className="flex items-center gap-3">
//                       <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
//                         <Briefcase className="w-4 h-4 text-green-400" />
//                       </div>
//                       <h3 className="text-xl font-semibold text-white">Employment Type</h3>
//                     </div>
//                     <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
//                       <p className="text-purple-100/90 text-sm">{pageText.employmentType}</p>
//                     </div>
//                   </div>

//                   <div className="space-y-4">
//                     <div className="flex items-center gap-3">
//                       <div className="w-8 h-8 bg-orange-500/20 rounded-lg flex items-center justify-center">
//                         <Code className="w-4 h-4 text-orange-400" />
//                       </div>
//                       <h3 className="text-xl font-semibold text-white">Technologies</h3>
//                     </div>
//                     <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
//                       <div className="flex flex-wrap gap-2">
//                         {pageText.technologies.map((tech, index) => (
//                           <span
//                             key={index}
//                             className="px-3 py-1 bg-gradient-to-r from-purple-500/20 to-blue-500/20 text-purple-200 rounded-full text-xs border border-purple-400/30"
//                           >
//                             {tech}
//                           </span>
//                         ))}
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Action Buttons */}
//                 <div className="flex gap-4 pt-6">
//                   <button
//                     onClick={() => handleStatusUpdate('applied')}
//                     className={`flex-1 py-4 px-6 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-[1.02] ${applicationStatus === 'applied'
//                       ? 'bg-green-500 text-white shadow-lg shadow-green-500/25'
//                       : 'bg-green-500/20 text-green-300 border border-green-500/30 hover:bg-green-500/30'
//                       }`}
//                   >
//                     <div className="flex items-center justify-center gap-2">
//                       <CheckCircle className="w-5 h-5" />
//                       Mark as Applied
//                     </div>
//                   </button>
//                   <button
//                     onClick={() => handleStatusUpdate('pending')}
//                     className={`flex-1 py-4 px-6 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-[1.02] ${applicationStatus === 'pending'
//                       ? 'bg-yellow-500 text-white shadow-lg shadow-yellow-500/25'
//                       : 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30 hover:bg-yellow-500/30'
//                       }`}
//                   >
//                     <div className="flex items-center justify-center gap-2">
//                       <AlertCircle className="w-5 h-5" />
//                       Yet to Apply
//                     </div>
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>

//       <style jsx>{`
//         @keyframes fadeInUp {
//           from {
//             opacity: 0;
//             transform: translateY(30px);
//           }
//           to {
//             opacity: 1;
//             transform: translateY(0);
//           }
//         }
        
//         .animate-fadeInUp {
//           animation: fadeInUp 0.6s ease-out;
//         }
        
//         .animation-delay-2000 {
//           animation-delay: 2s;
//         }
        
//         .animation-delay-4000 {
//           animation-delay: 4s;
//         }
//       `}</style>
//     </div>
//   );
// }