Here are the steps to run this on your local machine:

Prerequisites

Node.js 18+ installed
pnpm installed — if you don't have it: npm install -g pnpm
PostgreSQL running locally (or use a free cloud Postgres like Neon or Supabase)
1. Clone or download the project

git clone <your-repo-url>
cd <project-folder>

2. Install dependencies

pnpm install

3. Set up environment variables

Create a file called .env inside artifacts/api-server/:

DATABASE_URL=postgresql://your_user:your_password@localhost:5432/jsplayground
PORT=8080
SESSION_SECRET=any-random-string-here

4. Set up the database

# Push the schema to your Postgres database
pnpm --filter @workspace/db run push
# Seed DSA problems
pnpm --filter @workspace/scripts run seed-problems

5. Start the API server (in one terminal)

cd artifacts/api-server
PORT=8080 pnpm run dev

6. Start the frontend (in a second terminal)

cd artifacts/js-playground
BASE_PATH=/ PORT=5173 pnpm run dev

7. Open in browser

Go to http://localhost:5173

A note on the frontend connecting to the API: The frontend expects the API at /api. In development locally, you may need to add a Vite proxy so requests to /api go to localhost:8080. Add this to artifacts/js-playground/vite.config.ts:

server: {
  proxy: {
    '/api': 'http://localhost:8080'
  }
}

That's it — the full app with the editor, DSA problems, snippets, and npm package installer will all work locally.

Next, I can add a test runner to the problem pages that automatically evaluates your solution against each test case and shows pass/fail results with timing. Would you like me to do that?


Worked for 18 seconds
provide me database import script for local machine

1 day ago

10 actions
Now I have everything I need. Let me generate the complete SQL import script.


3 actions
The file has been saved to scripts/import.sql in the project. Here's how to use it on your local machine:

Run the import in one command:

psql -U your_user -d jsplayground -f scripts/import.sql

Or if you need to create the database first:

# Create the database
createdb -U your_user jsplayground
# Run the import
psql -U your_user -d jsplayground -f scripts/import.sql

What the script does — in order:

Creates the 3 tables — problems, test_cases, and snippets (uses IF NOT EXISTS so it's safe to re-run)
Inserts all 13 DSA problems — Two Sum, Valid Parentheses, Reverse Linked List, Maximum Subarray, Climbing Stairs, Binary Search, Merge Intervals, LRU Cache, Word Search, Number of Islands, Longest Substring, Trapping Rain Water, Median of Two Sorted Arrays
Inserts all test cases for each problem
The script is fully idempotent — you can run it multiple times without duplicating data. It uses ON CONFLICT DO UPDATE for problems and DELETE + INSERT for test cases.

After running it, you can skip the pnpm --filter @workspace/scripts run seed-problems step from the local setup guide since the SQL script covers it directly.

Next, I can add a test runner to the problem pages that automatically evaluates your solution against each test case and shows pass/fail results with timing. Would you like me to do that?


