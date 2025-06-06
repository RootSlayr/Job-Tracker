// src/app/page.js
'use client';

import { useState } from 'react';
import { Button } from '@mui/material';

export default function HomePage() {
  const [jobUrl, setJobUrl] = useState('');

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

      const title = doc.querySelector('title')?.innerText || 'No title found';
      const metaDesc = doc.querySelector('meta[name="description"]')?.content || 'No description';
      const company = doc.querySelector('meta[property="og:site_name"]')?.content || 'Unknown company';

      console.log({ title, metaDesc, company });

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
    </div>
  );
}
