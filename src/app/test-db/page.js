
"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function TestDatabase() {
  const [status, setStatus] = useState("Connecting...");

  useEffect(() => {
    async function testConnection() {
      const { error } = await supabase
        .from("jobs")
        .select("id")
        .limit(1);

      setStatus(
        error
          ? `Connection failed: ${error.message}`
          : "Database connected successfully!"
      );
    }

    testConnection();
  }, []);

  return (
    <main className="min-h-screen bg-[#090b10] p-10 text-white">
      <h1 className="text-2xl font-bold">
        JobPulse Database Test
      </h1>
      <p className="mt-5">{status}</p>
    </main>
  );
}
