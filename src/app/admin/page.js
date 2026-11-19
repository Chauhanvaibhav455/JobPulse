
"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import {
  BriefcaseBusiness,
  Plus,
  Pencil,
  Trash2,
  LogOut,
  ShieldCheck,
  RefreshCw,
  Flag,
} from "lucide-react";

const emptyForm = {
  title: "",
  company: "",
  location: "",
  category: "Software",
  experience: "Fresher",
  employment_type: "Full-time",
  description: "",
  source_url: "",
  source_name: "",
  verification_status: "unconfirmed",
};

export default function AdminPage() {
  const [user, setUser] = useState(null);
  const [authorized, setAuthorized] = useState(false);
  const [checking, setChecking] = useState(true);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const [jobs, setJobs] = useState([]);
  const [reports, setReports] = useState([]);

  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    let active = true;

    async function checkSession() {
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        if (active) {
          setError(error.message);
          setChecking(false);
        }
        return;
      }

      if (data.session?.user) {
        await verifyAdmin(data.session.user);
      } else if (active) {
        setChecking(false);
      }
    }

    async function verifyAdmin(currentUser) {
      const { data, error } = await supabase
        .from("admin_users")
        .select("user_id")
        .eq("user_id", currentUser.id)
        .maybeSingle();

      if (!active) return;

      if (error || !data) {
        setError(
          error?.message || "This account is not authorized as an admin."
        );
        await supabase.auth.signOut();
        setChecking(false);
        return;
      }

      setUser(currentUser);
      setAuthorized(true);
      setChecking(false);
      await loadDashboard();
    }

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT" && active) {
        setUser(null);
        setAuthorized(false);
        setJobs([]);
        setReports([]);
      }
    });

    checkSession();

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  async function loadDashboard() {
    setError("");

    const [jobsResult, reportsResult] = await Promise.all([
      supabase
        .from("jobs")
        .select("*")
        .order("created_at", { ascending: false }),

      supabase
        .from("job_reports")
        .select("id, job_id, reason, created_at")
        .order("created_at", { ascending: false }),
    ]);

    if (jobsResult.error) {
      setError(jobsResult.error.message);
      return;
    }

    if (reportsResult.error) {
      setError(reportsResult.error.message);
      return;
    }

    setJobs(jobsResult.data || []);
    setReports(reportsResult.data || []);
  }

  async function handleLogin(e) {
    e.preventDefault();
    setError("");
    setChecking(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setChecking(false);
      return;
    }

    if (!data.user) {
      setError("Unable to identify your account.");
      setChecking(false);
      return;
    }

    const { data: admin, error: adminError } = await supabase
      .from("admin_users")
      .select("user_id")
      .eq("user_id", data.user.id)
      .maybeSingle();

    if (adminError || !admin) {
      await supabase.auth.signOut();
      setError(
        adminError?.message || "This account is not registered as an admin."
      );
      setChecking(false);
      return;
    }

    setUser(data.user);
    setAuthorized(true);
    setChecking(false);
    await loadDashboard();
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    setUser(null);
    setAuthorized(false);
    setJobs([]);
    setReports([]);
  }

  function updateField(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSaveJob(e) {
    e.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");

    const payload = {
      ...form,
      last_checked_at: form.verification_status === "recently_checked"
        ? new Date().toISOString()
        : null,
    };

    const result = editingId
      ? await supabase
          .from("jobs")
          .update(payload)
          .eq("id", editingId)
      : await supabase.from("jobs").insert(payload);

    if (result.error) {
      setError(result.error.message);
      setSaving(false);
      return;
    }

    setMessage(editingId ? "Job updated successfully." : "Job added successfully.");
    setForm(emptyForm);
    setEditingId(null);
    await loadDashboard();
    setSaving(false);
  }

  function startEdit(job) {
    setEditingId(job.id);
    setForm({
      title: job.title || "",
      company: job.company || "",
      location: job.location || "",
      category: job.category || "Software",
      experience: job.experience || "Fresher",
      employment_type: job.employment_type || "Full-time",
      description: job.description || "",
      source_url: job.source_url || "",
      source_name: job.source_name || "",
      verification_status: job.verification_status || "unconfirmed",
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function deleteJob(id) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this job listing?"
    );

    if (!confirmed) return;

    const { error } = await supabase
      .from("jobs")
      .delete()
      .eq("id", id);

    if (error) {
      setError(error.message);
      return;
    }

    setMessage("Job deleted successfully.");
    await loadDashboard();
  }

  async function updateStatus(job, status) {
    const { error } = await supabase
      .from("jobs")
      .update({
        verification_status: status,
        last_checked_at:
          status === "recently_checked"
            ? new Date().toISOString()
            : job.last_checked_at,
      })
      .eq("id", job.id);

    if (error) {
      setError(error.message);
      return;
    }

    setMessage("Verification status updated.");
    await loadDashboard();
  }

  if (checking) {
    return (
      <main className="min-h-screen bg-[#090b10] p-10 text-center text-white">
        Checking admin access...
      </main>
    );
  }

  if (!authorized) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#090b10] px-5 text-white">
        <form
          onSubmit={handleLogin}
          className="w-full max-w-md rounded-2xl border border-white/10 bg-[#121620] p-8"
        >
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-xl bg-blue-600 p-3">
              <ShieldCheck size={25} />
            </div>
            <div>
              <h1 className="text-2xl font-bold">JobPulse Admin</h1>
              <p className="text-sm text-gray-400">Sign in to manage jobs</p>
            </div>
          </div>

          <label className="mb-2 block text-sm">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mb-5 w-full rounded-xl border border-white/10 bg-[#202634] p-3 outline-none"
            placeholder="Admin email"
          />

          <label className="mb-2 block text-sm">Password</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mb-5 w-full rounded-xl border border-white/10 bg-[#202634] p-3 outline-none"
            placeholder="Password"
          />

          {error && (
            <p className="mb-4 text-sm text-red-400">{error}</p>
          )}

          <button
            type="submit"
            className="w-full rounded-xl bg-blue-600 py-3 font-medium hover:bg-blue-500"
          >
            Sign in
          </button>
        </form>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#090b10] px-5 py-8 text-white">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">JobPulse Admin</h1>
            <p className="mt-2 text-sm text-gray-400">
              Manage opportunities and user reports.
            </p>
            <p className="mt-1 text-xs text-gray-500">{user?.email}</p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={loadDashboard}
              className="rounded-xl border border-white/10 p-3 hover:bg-white/5"
              title="Refresh"
            >
              <RefreshCw size={18} />
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 rounded-xl border border-white/10 px-4 py-3 text-sm hover:bg-white/5"
            >
              <LogOut size={17} /> Logout
            </button>
          </div>
        </header>

        {error && (
          <p className="mb-5 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400">
            {error}
          </p>
        )}

        {message && (
          <p className="mb-5 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-sm text-emerald-400">
            {message}
          </p>
        )}

        <div className="mb-8 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-[#121620] p-5">
            <BriefcaseBusiness className="mb-3 text-blue-400" />
            <p className="text-3xl font-bold">{jobs.length}</p>
            <p className="text-sm text-gray-400">Total job listings</p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#121620] p-5">
            <Flag className="mb-3 text-amber-400" />
            <p className="text-3xl font-bold">{reports.length}</p>
            <p className="text-sm text-gray-400">User reports</p>
          </div>
        </div>

        <section className="mb-10 rounded-2xl border border-white/10 bg-[#121620] p-6">
          <h2 className="mb-6 flex items-center gap-2 text-xl font-semibold">
            <Plus size={21} />
            {editingId ? "Edit job listing" : "Add a new job"}
          </h2>

          <form onSubmit={handleSaveJob} className="grid gap-4 sm:grid-cols-2">
            <input
              name="title"
              value={form.title}
              onChange={updateField}
              placeholder="Job title"
              required
              className="rounded-xl border border-white/10 bg-[#202634] p-3"
            />

            <input
              name="company"
              value={form.company}
              onChange={updateField}
              placeholder="Company name"
              required
              className="rounded-xl border border-white/10 bg-[#202634] p-3"
            />

            <input
              name="location"
              value={form.location}
              onChange={updateField}
              placeholder="Location"
              className="rounded-xl border border-white/10 bg-[#202634] p-3"
            />

            <select
              name="category"
              value={form.category}
              onChange={updateField}
              className="rounded-xl border border-white/10 bg-[#202634] p-3"
            >
              <option>Software</option>
              <option>Data</option>
              <option>Business</option>
              <option>Engineering</option>
              <option>Finance</option>
              <option>Other</option>
            </select>

            <input
              name="experience"
              value={form.experience}
              onChange={updateField}
              placeholder="Experience requirement"
              className="rounded-xl border border-white/10 bg-[#202634] p-3"
            />

            <select
              name="employment_type"
              value={form.employment_type}
              onChange={updateField}
              className="rounded-xl border border-white/10 bg-[#202634] p-3"
            >
              <option>Full-time</option>
              <option>Internship</option>
              <option>Part-time</option>
              <option>Contract</option>
            </select>

            <input
              name="source_name"
              value={form.source_name}
              onChange={updateField}
              placeholder="Source name (e.g. Company Careers)"
              className="rounded-xl border border-white/10 bg-[#202634] p-3"
            />

            <input
              name="source_url"
              type="url"
              value={form.source_url}
              onChange={updateField}
              placeholder="Official application URL"
              required
              className="rounded-xl border border-white/10 bg-[#202634] p-3"
            />

            <select
              name="verification_status"
              value={form.verification_status}
              onChange={updateField}
              className="rounded-xl border border-white/10 bg-[#202634] p-3 sm:col-span-2"
            >
              <option value="unconfirmed">Unconfirmed</option>
              <option value="recently_checked">Recently checked</option>
              <option value="needs_recheck">Needs recheck</option>
              <option value="expired">Expired</option>
            </select>

            <textarea
              name="description"
              value={form.description}
              onChange={updateField}
              placeholder="Job description"
              rows={4}
              className="rounded-xl border border-white/10 bg-[#202634] p-3 sm:col-span-2"
            />

            <div className="flex gap-3 sm:col-span-2">
              <button
                type="submit"
                disabled={saving}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 font-medium hover:bg-blue-500 disabled:opacity-50"
              >
                <Plus size={18} />
                {saving ? "Saving..." : editingId ? "Update job" : "Add job"}
              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingId(null);
                    setForm(emptyForm);
                  }}
                  className="rounded-xl border border-white/10 px-5"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </section>

        <section className="mb-10">
          <h2 className="mb-5 text-xl font-semibold">
            Manage job listings
          </h2>

          <div className="space-y-3">
            {jobs.map((job) => (
              <article
                key={job.id}
                className="rounded-xl border border-white/10 bg-[#121620] p-5"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <h3 className="font-semibold">{job.title}</h3>
                    <p className="mt-1 text-sm text-gray-400">
                      {job.company} · {job.location}
                    </p>
                    <p className="mt-2 text-xs text-gray-500">
                      Status: {job.verification_status}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <select
                      value={job.verification_status || "unconfirmed"}
                      onChange={(e) => updateStatus(job, e.target.value)}
                      className="rounded-lg border border-white/10 bg-[#202634] p-2 text-xs"
                    >
                      <option value="unconfirmed">Unconfirmed</option>
                      <option value="recently_checked">Recently checked</option>
                      <option value="needs_recheck">Needs recheck</option>
                      <option value="expired">Expired</option>
                    </select>

                    <button
                      onClick={() => startEdit(job)}
                      className="rounded-lg border border-white/10 p-2 hover:bg-white/5"
                      title="Edit"
                    >
                      <Pencil size={16} />
                    </button>

                    <button
                      onClick={() => deleteJob(job.id)}
                      className="rounded-lg border border-red-500/20 p-2 text-red-400 hover:bg-red-500/10"
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </article>
            ))}

            {jobs.length === 0 && (
              <p className="py-8 text-center text-gray-500">
                No job listings yet.
              </p>
            )}
          </div>
        </section>

        <section>
          <h2 className="mb-5 text-xl font-semibold">User reports</h2>

          <div className="space-y-3">
            {reports.map((report) => {
              const job = jobs.find((item) => item.id === report.job_id);

              return (
                <div
                  key={report.id}
                  className="rounded-xl border border-white/10 bg-[#121620] p-5"
                >
                  <p className="font-medium">
                    {job?.title || `Job ID: ${report.job_id}`}
                  </p>
                  <p className="mt-1 text-sm text-amber-400">
                    {report.reason}
                  </p>
                  <p className="mt-2 text-xs text-gray-500">
                    {new Date(report.created_at).toLocaleString("en-IN")}
                  </p>
                </div>
              );
            })}

            {reports.length === 0 && (
              <p className="py-8 text-center text-gray-500">
                No reports submitted yet.
              </p>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
