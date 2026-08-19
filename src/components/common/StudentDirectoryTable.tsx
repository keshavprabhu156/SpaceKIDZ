"use client";

import { useState } from "react";
import type { StudentDirectoryRow } from "@/types/admin";

/**
 * Filters an already-loaded array client-side. Fine at this scale (tens to a
 * few hundred rows); a platform with thousands of students would need a real
 * server-side search endpoint instead of shipping the whole table to the
 * browser.
 */
export default function StudentDirectoryTable({ rows }: { rows: StudentDirectoryRow[] }) {
  const [query, setQuery] = useState("");

  const filtered = rows.filter((r) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return (
      r.name.toLowerCase().includes(q) ||
      r.email.toLowerCase().includes(q) ||
      r.schoolName.toLowerCase().includes(q) ||
      r.countryName.toLowerCase().includes(q)
    );
  });

  return (
    <div>
      <input
        type="text"
        placeholder="Search by name, email, school or country…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="input-holo max-w-sm"
      />

      <div className="mt-4 overflow-hidden rounded-lg border border-star/10">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-star/10 bg-white/[0.02] text-left text-xs text-star/45">
              <th className="px-4 py-2 font-medium">Student</th>
              <th className="px-4 py-2 font-medium">Grade</th>
              <th className="px-4 py-2 font-medium">Class</th>
              <th className="px-4 py-2 font-medium">School</th>
              <th className="px-4 py-2 font-medium">Country</th>
              <th className="px-4 py-2 font-medium">XP</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((s) => (
              <tr key={s.id} className="border-b border-star/[0.06] last:border-0">
                <td className="px-4 py-2.5">
                  <p className="font-medium text-star">{s.name}</p>
                  <p className="mt-0.5 text-xs text-star/40">{s.email}</p>
                </td>
                <td className="px-4 py-2.5 text-star/70">{s.grade}</td>
                <td className="px-4 py-2.5 text-star/70">{s.className ?? "—"}</td>
                <td className="px-4 py-2.5 text-star/70">{s.schoolName}</td>
                <td className="px-4 py-2.5 text-star/70">{s.countryName}</td>
                <td className="px-4 py-2.5 text-star/70">{s.xp.toLocaleString()}</td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-star/45">
                  {rows.length === 0 ? "No students yet." : "No students match that search."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
