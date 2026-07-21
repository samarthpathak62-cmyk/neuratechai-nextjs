"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ShieldCheck, Shield } from "lucide-react";

interface UserRow {
  id: string;
  name: string | null;
  email: string | null;
  role: "USER" | "ADMIN";
  createdAt: string;
  subscription: { tier: string } | null;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserRow[] | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/users")
      .then((r) => r.json())
      .then((d) => setUsers(d.users ?? []));
  }, []);

  async function toggleRole(user: UserRow) {
    setBusyId(user.id);
    const newRole = user.role === "ADMIN" ? "USER" : "ADMIN";
    const res = await fetch("/api/admin/users", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user.id, role: newRole }),
    });
    setBusyId(null);
    if (res.ok) {
      setUsers((prev) => prev?.map((u) => (u.id === user.id ? { ...u, role: newRole } : u)) ?? null);
    } else {
      const data = await res.json();
      alert(data.error ?? "Failed to update role.");
    }
  }

  return (
    <div>
      <h1 className="font-display text-[1.7rem] mb-1.5">Users</h1>
      <p className="text-ink-dim text-sm mb-8">Grant or revoke admin access. Admins can manage all content and other users.</p>

      {!users ? (
        <p className="text-ink-dim text-sm">Loading…</p>
      ) : (
        <div className="glass overflow-hidden">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-white/[0.08]">
                <th className="text-left px-5 py-3 text-ink-faint text-xs uppercase tracking-wider">Name</th>
                <th className="text-left px-5 py-3 text-ink-faint text-xs uppercase tracking-wider">Email</th>
                <th className="text-left px-5 py-3 text-ink-faint text-xs uppercase tracking-wider">Plan</th>
                <th className="text-left px-5 py-3 text-ink-faint text-xs uppercase tracking-wider">Role</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-b border-white/[0.06] last:border-0">
                  <td className="px-5 py-3.5 text-sm">{u.name ?? "—"}</td>
                  <td className="px-5 py-3.5 text-sm text-ink-dim">{u.email}</td>
                  <td className="px-5 py-3.5 text-sm font-mono">{u.subscription?.tier ?? "FREE"}</td>
                  <td className="px-5 py-3.5 text-sm">
                    <span className={u.role === "ADMIN" ? "text-cyan" : "text-ink-dim"}>{u.role}</span>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <Button variant="ghost" size="sm" disabled={busyId === u.id} onClick={() => toggleRole(u)}>
                      {u.role === "ADMIN" ? <Shield size={13} /> : <ShieldCheck size={13} />}
                      {u.role === "ADMIN" ? "Revoke admin" : "Make admin"}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
