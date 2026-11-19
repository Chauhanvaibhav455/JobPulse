# JobPulse

### Find opportunities. Apply with confidence.

JobPulse is a fresher-focused job and internship discovery platform designed to help students find opportunities and reduce the time wasted on expired, duplicate, and misleading job listings.

**Live Website:** https://jobpulse-blue-six.vercel.app/  
**GitHub Repository:** https://github.com/Chauhanvaibhav455/JobPulse

---

## About the Project

Finding entry-level jobs and internships can be frustrating. Students often encounter outdated vacancies, broken application links, duplicate listings, and unclear job statuses.

JobPulse aims to make opportunity discovery more transparent by displaying job information alongside its source and verification status.

The platform also allows students to submit job links for review and track their submission status.

## Key Features

### For Students
- Browse fresher-focused job opportunities.
- Search and filter available listings.
- View job details and official application links.
- Save interesting opportunities.
- Report incorrect or expired listings.
- Submit job links for verification.
- Receive a unique tracking code.
- Track submitted job links.

### For Administrators
- Secure admin login.
- Add, edit, and delete job listings.
- Review student-submitted job links.
- Approve and publish verified submissions.
- Update listing statuses.
- Review reported job listings.

## Technology Stack

| Technology | Purpose |
|---|---|
| Next.js | Frontend and application framework |
| React | UI development |
| Tailwind CSS | Styling |
| Supabase | Database, authentication and backend |
| PostgreSQL | Data storage |
| Vercel | Deployment |
| GitHub | Version control |

## How It Works

1. Students browse available opportunities.
2. They open the official source link to apply.
3. Students can submit additional job links.
4. Administrators review submitted opportunities.
5. Approved listings are published on JobPulse.
6. Students track submissions using their tracking codes.

**Note:** Job verification currently involves administrative review. JobPulse does not claim automatic verification.

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/Chauhanvaibhav455/JobPulse.git
```

### 2. Navigate to the project

```bash
cd JobPulse
```

### 3. Install dependencies

```bash
npm install
```

### 4. Configure environment variables

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Add your own Supabase project credentials.

### 5. Start the development server

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

## Project Routes

| Route | Description |
|---|---|
| `/` | Browse job opportunities |
| `/submit-job` | Submit a job link |
| `/track` | Track a submission |
| `/admin` | Administrator dashboard |

## Project Goals

JobPulse was developed to explore a practical problem faced by students entering the job market.

The primary goal is to improve trust in job discovery by making listing sources, review status, and submission progress more transparent.

## Future Improvements

- Expand verified job and internship listings.
- Add location and employment-type filters.
- Improve job categorisation.
- Strengthen duplicate listing detection.
- Improve the student feedback experience.

## Author

**Vaibhav Chauhan**

---

*Built to make fresher opportunity discovery more transparent and accessible.*