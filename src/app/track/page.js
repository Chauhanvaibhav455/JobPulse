
"use client";

import { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import {
  Search,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  BriefcaseBusiness,
} from "lucide-react";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const statusConfig = {
  pending: {
    label: "Pending Review",
    description: "Your opportunity is waiting for our team to review it.",
    icon: Clock,
    color: "text-amber-400",
    background: "bg-amber-500/10",
    border: "border-amber-500/20",
  },
  active: {
    label: "Active & Published",
    description: "Your opportunity has been approved and published on JobPulse.",
    icon: CheckCircle2,
    color: "text-emerald-400",
    background: "bg-emerald-500/10",
    border: "border-emerald-500/20",
  },
  closed: {
    label: "Closed",
    description: "This opportunity has been marked as closed.",
    icon: XCircle,
    color: "text-red-400",
    background: "bg-red-500/10",
    border: "border-red-500/20",
  },
  unable_to_verify: {
    label: "Unable to Verify",
    description: "We could not confirm whether this opportunity is currently active.",
    icon: AlertCircle,
    color: "text-orange-400",
    background: "bg-orange-500/10",
    border: "border-orange-500/20",
  },
};

export default function TrackSubmissionPage() {
  const [trackingCode, setTrackingCode] = useState("");
  const [submission, setSubmission] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleTrack(e) {
    e.preventDefault();

    setError("");
    setSubmission(null);

    const code = trackingCode.trim();

    const uuidPattern =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

    if (!uuidPattern.test(code)) {
      setError("Please enter a valid tracking code.");
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase.rpc(
        "get_submission_status",
        {
          p_tracking_code: code,
        }
      );

      if (error) throw error;

      if (!data || data.length === 0) {
        setError("No submission found. Please check your tracking code.");
        return;
      }

      setSubmission(data[0]);
    } catch (err) {
      console.error("Tracking error:", err);
      setError(
        "Unable to retrieve your submission. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  function formatDate(date) {
    if (!date) return "Not checked yet";

    return new Date(date).toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  }

  const currentStatus = submission
    ? statusConfig[submission.submission_status]
    : null;

  const StatusIcon = currentStatus?.icon;

  return (
    <main className="min-h-screen bg-slate-950 px-5 py-16 text-white">
      <div className="mx-auto max-w-xl">

        <div className="mb-8 text-center">
          <div className="mb-4 inline-flex rounded-2xl bg-blue-600/10 p-4 text-blue-400">
            <BriefcaseBusiness size={30} />
          </div>

          <p className="mb-3 font-semibold tracking-wider text-blue-400">
            JOBPULSE CHECK
          </p>

          <h1 className="mb-3 text-4xl font-bold">
            Track your submission
          </h1>

          <p className="text-slate-400">
            Enter your tracking code to check the latest status
            of your submitted opportunity.
          </p>
        </div>

        <form
          onSubmit={handleTrack}
          className="space-y-5 rounded-2xl border border-slate-800 bg-slate-900 p-6"
        >
          <div>
            <label className="mb-2 block text-sm font-medium">
              Tracking code
            </label>

            <input
              type="text"
              required
              value={trackingCode}
              onChange={(e) => setTrackingCode(e.target.value)}
              placeholder="Enter your UUID tracking code"
              className="w-full rounded-lg border border-slate-700 bg-slate-800 p-3 text-sm outline-none focus:border-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading || !trackingCode.trim()}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 p-3 font-semibold transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Search size={18} />
            {loading ? "Checking..." : "Check submission status"}
          </button>

          {error && (
            <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4">
              <p className="text-sm text-red-300">
                {error}
              </p>
            </div>
          )}

          {submission && currentStatus && (
            <div className="mt-5 rounded-xl border border-slate-700 bg-slate-800/70 p-5">

              <div className="mb-4 flex items-center justify-between gap-3">
                <h2 className="font-semibold">
                  Submission Details
                </h2>

                <span className="text-xs text-slate-400">
                  JobPulse
                </span>
              </div>

              <h3 className="mb-1 text-lg font-bold">
                {submission.job_title || "Untitled opportunity"}
              </h3>

              <p className="mb-5 text-sm text-slate-400">
                {submission.company_name || "Company not provided"}
              </p>

              <div
                className={`rounded-xl border p-4 ${currentStatus.background} ${currentStatus.border}`}
              >
                <div className="mb-2 flex items-center gap-2">
                  <StatusIcon
                    size={20}
                    className={currentStatus.color}
                  />

                  <span className={`font-semibold ${currentStatus.color}`}>
                    {currentStatus.label}
                  </span>
                </div>

                <p className="text-sm text-slate-300">
                  {currentStatus.description}
                </p>
              </div>

              <div className="mt-5 space-y-3 border-t border-slate-700 pt-4">
                <div className="flex justify-between gap-3 text-sm">
                  <span className="text-slate-400">
                    Submitted
                  </span>

                  <span className="text-right">
                    {formatDate(submission.submitted_at)}
                  </span>
                </div>

                <div className="flex justify-between gap-3 text-sm">
                  <span className="text-slate-400">
                    Last checked
                  </span>

                  <span className="text-right">
                    {formatDate(submission.checked_at)}
                  </span>
                </div>
              </div>

            </div>
          )}
        </form>

        <p className="mt-6 text-center text-xs text-slate-500">
          Keep your tracking code safe. It is required to
          retrieve your submission status.
        </p>

      </div>
    </main>
  );
}
