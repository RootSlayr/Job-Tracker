# Gamified Job Application Tracker & AI-Powered Career Manager

This is a Next.js application that turns job hunting into something more engaging — like progressing through a set of quests. It blends career tools with RPG-style progression and uses AI to help you write cover letters, LinkedIn messages, and follow-ups without the usual hassle.

## What it does

- Lets users track job applications like quests, with different statuses and stages
- Generates personalized cover letters using Google’s Gemini API
- Helps draft follow-up messages or outreach DMs with built-in AI tools
- Saves application data tied to a session token (no login required)
- Designed with a responsive UI and fast, client-side rendering

## Why this exists

Job hunting is repetitive, stressful, and often feels like a grind. This app aims to make the process more manageable and a bit more fun by borrowing mechanics from RPG games, while giving users smart tools that reduce the manual work.

## Tech stack

- Next.js (App Router)
- React
- MongoDB
- Google Gemini API (for AI-generated text)
- Tailwind CSS
- TypeScript
- Client-side rendering with token-based session state

## How it works

- When a user lands on the site, a random UUID token is generated and saved to localStorage
- That token is used to associate any jobs they save or apply to
- Users can "Accept" or "Decline" quests (i.e. job posts) and save them
- On applying, they’re given the option to generate a cover letter or just track the job
- Saved jobs are stored in MongoDB with timestamps and retrieved via that session token

## Local development

1. Clone the repo  
2. Run `npm install`  
3. Set up your `.env` file (you’ll need a MongoDB URI and Gemini API key)  
4. Run `npm run dev` to start the development server  

## Status

This project is a work-in-progress. The core job tracking, AI generation, and session logic are in place, but more features like EXP gain, role-based dashboards, and UI polish are in development.

## License

GPL 3.0