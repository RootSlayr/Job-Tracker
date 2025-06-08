// src/app/page.js
'use client';

import { useState } from 'react';
import { Button } from '@mui/material';

export default function HomePage() {
  const [jobUrl, setJobUrl] = useState('');
  const [pageText, setPageText] = useState(null);


  const handleFetchJob = async () => {
    console.log('Fetching job info for:', jobUrl);

    try {
      const res = await fetch('/api/fetch-job', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: jobUrl }),
      });

      const data = await res.json();
      const html = data.html;

      if (!html) {
        console.error('No HTML returned');
        return;
      }

      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      const textContent = doc.body.textContent || '';


      console.log(textContent);

      const parse = await fetch("/api/parse-job", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ textContent: textContent }),
      });

      const parsed = await parse.json();
      console.log(parsed);
      setPageText(parsed);


    } catch (error) {
      console.error('Error fetching job data:', error);
    }
  };




  return (
    <div className="min-h-screen bg-white dark:bg-zinc-900 text-black dark:text-white flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6 text-center">Job Tracker</h1>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleFetchJob();
          }}
        >
          <input
            type="text"
            placeholder="Paste job link here"
            value={jobUrl}
            onChange={(e) => setJobUrl(e.target.value)}
            className="w-full p-3 rounded border border-gray-300 dark:border-zinc-600 dark:bg-zinc-800 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <Button type="submit" variant="contained" fullWidth>
            Fetch Job Info
          </Button>
        </form>
      </div>
      {pageText && (
        <div className="mt-6 p-4 bg-zinc-100 dark:bg-zinc-800 rounded shadow">
          <h2 className="text-xl font-semibold mb-2">{pageText.title}</h2>

          <p className="text-sm mb-1 text-gray-600 dark:text-gray-300">
            <span className="font-medium">Company:</span> {pageText.company}
          </p>

          <p className="text-sm mb-1 text-gray-600 dark:text-gray-300">
            <span className="font-medium">Location:</span> {pageText.location}
          </p>

          <div className="mt-3">
            <p className="text-md font-medium mb-1">Job Description:</p>
            <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-line">
              {pageText.jobDescription}
            </p>
          </div>

          <div className="mt-3">
            <p className="text-md font-medium mb-1">Requirements:</p>
            <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-line">
              {pageText.requirements}
            </p>


            
          </div>

          <div className="mt-3">
            <p className="text-md font-medium mb-1">Employment Type:</p>
            <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-line">
              {pageText.employmentType}
            </p>
          </div>

          <div className="mt-3">
            <p className="text-md font-medium mb-1">Technologies:</p>
            <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-line">
              {pageText.technologies.join('\n')}
            </p>
          </div>

          {pageText.applicationDeadline && (
            <p className="text-sm mt-3 text-gray-600 dark:text-gray-300">
              <span className="font-medium">Deadline:</span> {pageText.applicationDeadline}
            </p>
          )}

          <div className="mt-4 flex gap-2">
            <button className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
              Applied
            </button>
            <button className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600">
              Yet to Apply
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
