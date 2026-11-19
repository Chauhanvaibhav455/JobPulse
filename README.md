# JobPulse

### Find Opportunities. Apply with Confidence.

JobPulse is a fresher-focused job discovery platform designed to help students and recent graduates find job and internship opportunities with clearer listing information.

## About the Project

Finding genuine and relevant entry-level opportunities can be challenging. JobPulse aims to make job discovery more transparent by providing job details, listing status, official application links and reporting functionality.

## Features

- Browse job and internship opportunities.
- Search and filter job listings.
- View detailed job information.
- Check job verification status.
- View last-checked information.
- Access official application links.
- Report potentially expired or misleading listings.
- Admin dashboard to add, edit and delete job listings.

## Technology Stack

- **Frontend:** Next.js, React.js
- **Styling:** Tailwind CSS
- **Database:** Supabase
- **Authentication:** Supabase Authentication
- **Deployment:** Vercel

## Project Structure

```text
jobpulse/
├── src/
│   ├── app/
│   │   ├── admin/
│   │   ├── test-db/
│   │   ├── page.js
│   │   ├── layout.js
│   │   └── globals.css
│   └── lib/
│       └── supabase.js
├── public/
├── .gitignore
├── package.json
└── README.md
```

## Getting Started

Clone the repository:

```bash
git clone https://github.com/Chauhanvaibhav455/JobPulse.git
cd JobPulse
```

Install dependencies:

```bash
npm install
```

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_publishable_key
```

Start the development server:

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

## Project Status

JobPulse is currently an MVP. Its core job discovery and administrative functionality has been implemented. Further improvements will be guided by student interviews and user testing.

## Author

Developed as a student product-building project.