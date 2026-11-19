
"use client";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";
import {
  Activity,
  Search,
  Bookmark,
  MapPin,
  Clock,
  ShieldCheck,
  ExternalLink,
  BriefcaseBusiness,
  Filter,
  AlertTriangle,
  X,
  Menu,
  ChevronDown,
} from "lucide-react";

const initialJobs = [
  {
    id: 1,
    title: "Software Engineer",
    company: "Example Technology",
    location: "Bangalore",
    category: "Software",
    experience: "Fresher",
    type: "Full-time",
    status: "Recently checked",
    checkedAt: "Demo data",
    source: "#",
    description: "Entry-level software engineering opportunity.",
  },
  {
    id: 2,
    title: "Data Analyst",
    company: "Example Analytics",
    location: "Remote",
    category: "Data",
    experience: "0–1 years",
    type: "Full-time",
    status: "Needs recheck",
    checkedAt: "Demo data",
    source: "#",
    description: "Entry-level opportunity in data analytics.",
  },
  {
    id: 3,
    title: "Frontend Developer",
    company: "Example Digital",
    location: "Gurugram",
    category: "Software",
    experience: "Fresher",
    type: "Full-time",
    status: "Recently checked",
    checkedAt: "Demo data",
    source: "#",
    description: "Build responsive user interfaces.",
  },
  {
    id: 4,
    title: "Business Analyst",
    company: "Example Consulting",
    location: "Noida",
    category: "Business",
    experience: "0–1 years",
    type: "Full-time",
    status: "Unconfirmed",
    checkedAt: "Demo data",
    source: "#",
    description: "Support business analysis and reporting.",
  },
];

const categories = [
  "All",
  "Software",
  "Data",
  "Business",
];

export default function Home() {
  const [jobs, setJobs] = useState([]);
const [loading, setLoading] = useState(true);
const [loadError, setLoadError] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [saved, setSaved] = useState([]);
  const [showSaved, setShowSaved] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [reportJob, setReportJob] = useState(null);
  const [reportReason, setReportReason] = useState("Expired listing");
  const [reports, setReports] = useState([]);
  const [reportError, setReportError] = useState("");
const [reportSuccess, setReportSuccess] = useState("");


useEffect(() => {
  async function fetchJobs() {
    setLoading(true);
    setLoadError("");

    const { data, error } = await supabase
      .from("jobs")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      setLoadError(error.message);
      setLoading(false);
      return;
    }

    const formattedJobs = data.map((job) => ({
      id: job.id,
      title: job.title,
      company: job.company,
      location: job.location || "Location not specified",
      category: job.category || "Other",
      experience: job.experience || "Not specified",
      type: job.employment_type || "Not specified",
      status: {
        recently_checked: "Recently checked",
        needs_recheck: "Needs recheck",
        unconfirmed: "Unconfirmed",
        expired: "Expired",
      }[job.verification_status] || "Unconfirmed",
      checkedAt: job.last_checked_at
        ? new Date(job.last_checked_at).toLocaleDateString("en-IN")
        : "Not checked yet",
      source: job.source_url,
      description: job.description || "No description available.",
    }));

    setJobs(formattedJobs);
    setLoading(false);
  }

  fetchJobs();
}, []);
  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const matchesSearch = [
        job.title,
        job.company,
        job.location,
      ]
        .join(" ")
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesCategory =
        category === "All" || job.category === category;

      const matchesSaved =
        !showSaved || saved.includes(job.id);

      return matchesSearch && matchesCategory && matchesSaved;
    });
  }, [jobs, search, category, showSaved, saved]);

  function toggleSave(id) {
    setSaved((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id]
    );
  }

async function submitReport() {
  if (!reportJob) return;

  setReportError("");
  setReportSuccess("");

  const { error } = await supabase
    .from("job_reports")
    .insert({
      job_id: reportJob.id,
      reason: reportReason,
    });

  if (error) {
    setReportError(error.message);
    return;
  }

  setReportSuccess("Report submitted successfully!");
  setReportJob(null);
}

  return (
    <main className="min-h-screen bg-[#090b10] text-white">
    
{/* Navigation */}
<header className="sticky top-0 z-30 border-b border-white/10 bg-[#090b10]/95 backdrop-blur">
  <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">

    {/* Logo */}
    <a href="/" className="flex items-center gap-3">
      <div className="rounded-xl bg-blue-600 p-2">
        <Activity size={23} />
      </div>

      <span className="text-xl font-bold tracking-tight">
        JobPulse
      </span>
    </a>

    {/* Desktop Navigation */}
    <nav className="hidden items-center gap-7 text-sm text-gray-400 md:flex">

      <button
        onClick={() => {
          setShowSaved(false);
          setCategory("All");
        }}
        className="hover:text-white"
      >
        Explore jobs
      </button>

      <button
        onClick={() => setShowSaved(true)}
        className="hover:text-white"
      >
        Saved jobs ({saved.length})
      </button>

      <a href="/submit-job" className="hover:text-white">
        Submit a Job
      </a>

      <a
        href="/track"
        className="rounded-lg bg-blue-600 px-4 py-2.5 font-medium text-white hover:bg-blue-500"
      >
        Track Submission
      </a>
    </nav>

    {/* Mobile Menu Button */}
    <button
      onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
      className="rounded-lg border border-white/10 p-2 hover:bg-white/5 md:hidden"
      aria-label="Toggle navigation"
      aria-expanded={mobileMenuOpen}
    >
      {mobileMenuOpen ? <X size={21} /> : <Menu size={21} />}
    </button>
  </div>

  {/* Mobile Dropdown */}
  {mobileMenuOpen && (
    <nav className="border-t border-white/10 bg-[#121620] px-5 py-4 md:hidden">
      <div className="flex flex-col gap-4 text-sm text-gray-300">

        <button
          onClick={() => {
            setShowSaved(false);
            setCategory("All");
            setMobileMenuOpen(false);
          }}
          className="text-left hover:text-white"
        >
          Explore jobs
        </button>

        <button
          onClick={() => {
            setShowSaved(true);
            setMobileMenuOpen(false);
          }}
          className="text-left hover:text-white"
        >
          Saved jobs ({saved.length})
        </button>

        <a href="/submit-job" className="hover:text-white">
          Submit a Job
        </a>

        <a href="/track" className="font-medium text-blue-400">
          Track Submission →
        </a>

      </div>
    </nav>
  )}
</header>


      {/* Hero */}
      <section className="mx-auto max-w-7xl px-5 pb-12 pt-16">
        <div className="max-w-3xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-2 text-sm text-blue-400">
            <ShieldCheck size={16} />
            Built for fresh graduates
          </div>

          <h1 className="text-4xl font-bold leading-tight sm:text-6xl">
            Your next opportunity,
            <span className="block text-blue-500">
              without the noise.
            </span>
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-7 text-gray-400 sm:text-lg">
            Discover entry-level jobs with transparent source
            information, listing status and last-checked dates.
          </p>
        </div>

        {/* Search */}
        <div className="mt-10 flex max-w-3xl items-center gap-3 rounded-2xl border border-white/10 bg-[#151923] px-4 py-2 focus-within:border-blue-500">
          <Search className="shrink-0 text-gray-500" size={21} />

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search job title, company or location..."
            className="w-full bg-transparent py-3 text-sm outline-none placeholder:text-gray-500"
          />

          <Filter className="shrink-0 text-gray-500" size={19} />
        </div>
      </section>

      {/* Job listings */}
      <section className="mx-auto max-w-7xl px-5 pb-24">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-5">
          <div>
            <h2 className="text-2xl font-semibold">
              {showSaved ? "Saved opportunities" : "Explore opportunities"}
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              {filteredJobs.length} opportunities found
            </p>
          </div>

          <button
            onClick={() => setShowSaved(!showSaved)}
            className={`rounded-xl border px-4 py-2.5 text-sm ${
              showSaved
                ? "border-blue-500 bg-blue-500/10 text-blue-400"
                : "border-white/10 text-gray-400 hover:bg-white/5"
            }`}
          >
            <Bookmark className="mr-2 inline" size={16} />
            {showSaved ? "Show all jobs" : "Saved jobs"}
          </button>
        </div>

        {/* Category filters */}
        <div className="mb-8 flex flex-wrap gap-2">
          {categories.map((item) => (
            <button
              key={item}
              onClick={() => setCategory(item)}
              className={`rounded-full px-5 py-2.5 text-sm transition ${
                category === item
                  ? "bg-blue-600 text-white"
                  : "border border-white/10 bg-[#151923] text-gray-400 hover:text-white"
              }`}
            >
              {item}
            </button>
          ))}
        </div>
        

{/* Cards */}
<div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
  {!loading && !loadError && filteredJobs.map((job) => (
    <article
      key={job.id}
      className="rounded-2xl border border-white/10 bg-[#121620] p-6 transition hover:-translate-y-1 hover:border-blue-500/40"
    >
      <div className="mb-5 flex items-start justify-between">
        <div className="rounded-xl bg-blue-500/10 p-3 text-blue-400">
          <BriefcaseBusiness size={24} />
        </div>

        <button
          onClick={() => toggleSave(job.id)}
          aria-label="Save job"
          className="text-gray-500 hover:text-blue-400"
        >
          <Bookmark
            size={21}
            fill={saved.includes(job.id) ? "currentColor" : "none"}
          />
        </button>
      </div>

      <h3 className="text-lg font-semibold">{job.title}</h3>

      <p className="mt-1 text-sm text-gray-400">
        {job.company}
      </p>

      <div className="mt-5 flex flex-wrap gap-3 text-xs text-gray-400">
        <span className="flex items-center gap-1">
          <MapPin size={14} />
          {job.location}
        </span>

        <span>{job.experience}</span>
        <span>{job.type}</span>
      </div>

      <div className="mt-6 border-t border-white/10 pt-5">
        <div className="flex items-center justify-between">
          <span className="text-xs text-emerald-400">
            <ShieldCheck size={15} className="mr-1 inline" />
            {job.status}
          </span>

          <span className="text-xs text-gray-500">
            {job.checkedAt}
          </span>
        </div>
      </div>

      <button
        onClick={() => setSelectedJob(job)}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 text-sm font-medium hover:bg-blue-500"
      >
        View details
        <ExternalLink size={16} />
      </button>
    </article>
  ))}
</div>

{!loading && !loadError && filteredJobs.length === 0 && (
  <div className="rounded-2xl border border-white/10 py-16 text-center">
    <Search className="mx-auto text-gray-600" size={35} />
    <h3 className="mt-4 font-semibold">No jobs found</h3>
    <p className="mt-2 text-sm text-gray-500">
      Try another search or category.
    </p>
  </div>
)}
</section>

      {/* Job details modal */}
      {selectedJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-[#151923] p-7">
            <div className="flex justify-between">
              <h2 className="text-xl font-semibold">Job details</h2>
              <button onClick={() => setSelectedJob(null)}>
                <X />
              </button>
            </div>

            <h3 className="mt-6 text-2xl font-bold">
              {selectedJob.title}
            </h3>

            <p className="mt-2 text-gray-400">
              {selectedJob.company}
            </p>

            <p className="mt-5 text-sm leading-7 text-gray-400">
              {selectedJob.description}
            </p>

            <div className="mt-5 rounded-xl bg-[#202634] p-4 text-sm">
              <p className="text-gray-400">Listing status</p>
              <p className="mt-2">{selectedJob.status}</p>
              <p className="mt-2 text-xs text-gray-500">
                {selectedJob.checkedAt}
              </p>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => {
                  setReportJob(selectedJob);
                  setSelectedJob(null);
                }}
                className="flex-1 rounded-xl border border-white/10 py-3 text-sm"
              >
                <AlertTriangle className="mr-2 inline" size={16} />
                Report listing
              </button>

              <a
                href={selectedJob.source}
                target="_blank"
                rel="noreferrer"
                className="flex-1 rounded-xl bg-blue-600 py-3 text-center text-sm"
              >
                Visit source
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Report modal */}
      {reportJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#151923] p-6">
            <div className="flex justify-between">
              <h2 className="text-lg font-semibold">Report a listing</h2>
              <button onClick={() => setReportJob(null)}>
                <X />
              </button>
            </div>

            <p className="mt-3 text-sm text-gray-400">
              {reportJob.title} at {reportJob.company}
            </p>

            <label className="mt-6 block text-sm text-gray-300">
              What's wrong with this listing?
            </label>

            <select
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
              className="mt-3 w-full rounded-xl border border-white/10 bg-[#202634] p-3 text-sm"
            >
              <option>Expired listing</option>
              <option>Duplicate listing</option>
              <option>Broken application link</option>
              <option>Suspicious listing</option>
            </select>

            <button
              onClick={submitReport}
              className="mt-5 w-full rounded-xl bg-blue-600 py-3 text-sm"
            >
              Submit report
            </button>
          </div>
        </div>
      )}

      <footer className="border-t border-white/10 px-5 py-8 text-center text-sm text-gray-500">
        JobPulse — Better information for your first career move.
      </footer>
    </main>
  );
}
