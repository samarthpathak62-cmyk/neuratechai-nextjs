/**
 * lib/admin-config.ts
 *
 * The simplest way to make yourself (or anyone else) an admin: add their
 * email to ADMIN_EMAILS in .env.local, comma-separated. The next time that
 * person signs in (Google, GitHub, or email/password — doesn't matter),
 * auth.ts automatically sets their role to ADMIN in the database.
 *
 * Example .env.local line:
 *   ADMIN_EMAILS=you@gmail.com,cofounder@gmail.com
 *
 * Once someone is an admin, THEY can also promote other users to admin
 * from /admin/users — you don't have to keep editing this file by hand
 * after the first admin exists.
 */

export const ADMIN_EMAILS = (process.env.ADMIN_EMAILS ?? "")
  .split(",")
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

export function isConfiguredAdmin(email?: string | null): boolean {
  if (!email) return false;
  return ADMIN_EMAILS.includes(email.toLowerCase());
}
