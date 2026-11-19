
"use client";

import { useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function SubmitJobPage() {
  const [url, setUrl] = useState("");
  const [company, setCompany] = useState("");
  const [title, setTitle] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [trackingCode, setTrackingCode] = useState("");
  const [messageType, setMessageType] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    setMessage("");
    setTrackingCode("");
    setMessageType("");

    try {
      const parsedUrl = new URL(url.trim());

      if (!["http:", "https:"].includes(parsedUrl.protocol)) {
        throw new Error("Invalid URL");
      }

      setLoading(true);

   const { data, error } = await supabase.rpc("submit_job_link", {
  p_job_url: url.trim(),
  p_company_name: company.trim() || null,
  p_job_title: title.trim() || null,
});

if (error) throw error;

if (!data) {
  throw new Error("Submission received, but tracking code could not be retrieved.");
}

      setTrackingCode(data);
      setMessage("Your job link was submitted successfully!");
      setMessageType("success");

      setUrl("");
      setCompany("");
      setTitle("");

    } catch (error) {
      setMessage(
        error.message === "Invalid URL"
          ? "Please enter a valid job URL."
          : error.message || "Something went wrong. Please try again."
      );

      setMessageType("error");

    } finally {
      setLoading(false);
    }
  }

  async function copyTrackingCode() {
    try {
      await navigator.clipboard.writeText(trackingCode);
      setMessage("Tracking code copied successfully!");
      setMessageType("success");
    } catch {
      setMessage("Unable to copy automatically. Please select and copy your code.");
      setMessageType("error");
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 px-5 py-16 text-white">
      <div className="mx-auto max-w-xl">

        <p className="mb-3 font-semibold tracking-wider text-blue-400">
          JOBPULSE CHECK
        </p>

        <h1 className="mb-3 text-4xl font-bold">
          Found a job opportunity?
        </h1>

        <p className="mb-8 text-slate-400">
          Share its link with us. We'll review the source and update
          its status so other freshers can make informed decisions.
        </p>

        <form
          onSubmit={handleSubmit}
          className="space-y-5 rounded-2xl border border-slate-800 bg-slate-900 p-6"
        >

          <div>
            <label className="mb-2 block text-sm">
              Job URL *
            </label>

            <input
              type="url"
              required
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://company.com/careers/job"
              className="w-full rounded-lg border border-slate-700 bg-slate-800 p-3 outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm">
              Company name
            </label>

            <input
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="e.g. Microsoft"
              className="w-full rounded-lg border border-slate-700 bg-slate-800 p-3 outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm">
              Job title
            </label>

            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Software Engineer Intern"
              className="w-full rounded-lg border border-slate-700 bg-slate-800 p-3 outline-none focus:border-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-blue-600 p-3 font-semibold transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Submitting..." : "Submit job link"}
          </button>

          {message && (
            <div
              role="status"
              className={`rounded-xl border p-4 ${
                messageType === "success"
                  ? "border-emerald-500/20 bg-emerald-500/10"
                  : "border-red-500/20 bg-red-500/10"
              }`}
            >
              <p
                className={`text-sm ${
                  messageType === "success"
                    ? "text-emerald-300"
                    : "text-red-300"
                }`}
              >
                {message}
              </p>

              {trackingCode && (
                <div className="mt-4">
                  <p className="mb-2 text-sm text-slate-300">
                    Your submission tracking code:
                  </p>

                  <div className="flex flex-wrap items-center gap-2">
                    <code className="min-w-0 flex-1 break-all rounded-lg bg-slate-800 p-3 text-xs text-white">
                      {trackingCode}
                    </code>

                    <button
                      type="button"
                      onClick={copyTrackingCode}
                      className="rounded-lg bg-blue-600 px-4 py-3 text-sm font-medium hover:bg-blue-500"
                    >
                      Copy code
                    </button>
                  </div>

                  <p className="mt-3 text-xs text-slate-400">
                    Save this code. You'll need it to check your
                    submission status.
                  </p>
                </div>
              )}
            </div>
          )}

        </form>

        <p className="mt-5 text-xs text-slate-500">
          Submissions are reviewed manually. A submitted link is not
          automatically verified.
        </p>

      </div>
    </main>
  );
}

