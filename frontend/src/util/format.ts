// Formatting + deterministic mock-metadata helpers used across the UI.

/** Stable 32-bit hash of a string so the same video always gets the same
 *  synthesized views/duration/date instead of flickering on every reshuffle. */
export function hashStr(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (h * 31 + s.charCodeAt(i)) >>> 0;
  }
  return h;
}

/** 1234 -> "1.2K", 2_500_000 -> "2.5M" (YouTube-style compact counts). */
export function formatCount(n: number): string {
  if (!Number.isFinite(n) || n < 0) return "0";
  if (n < 1000) return String(n);
  if (n < 1_000_000) return trim(n / 1000) + "K";
  if (n < 1_000_000_000) return trim(n / 1_000_000) + "M";
  return trim(n / 1_000_000_000) + "B";
}

function trim(n: number): string {
  // one decimal, but drop a trailing ".0"
  return n.toFixed(1).replace(/\.0$/, "");
}

/** "1.2M views" — accepts a number or an already-formatted string. */
export function formatViews(views: string | number): string {
  if (typeof views === "number") return `${formatCount(views)} views`;
  const asNum = Number(views);
  if (views !== "" && views !== "—" && Number.isFinite(asNum)) {
    return `${formatCount(asNum)} views`;
  }
  return views && views !== "—" ? `${views} views` : "";
}

/** seconds -> "9:05" or "1:02:07". */
export function formatDuration(totalSeconds: number): string {
  const s = Math.max(0, Math.floor(totalSeconds));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  const mm = h > 0 ? String(m).padStart(2, "0") : String(m);
  const ss = String(sec).padStart(2, "0");
  return h > 0 ? `${h}:${mm}:${ss}` : `${mm}:${ss}`;
}

/** ISO date -> "3 days ago". */
export function timeAgo(iso?: string): string {
  if (!iso) return "";
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return "";
  const diff = Math.max(0, Date.now() - then);
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(mins / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);
  if (years >= 1) return plural(years, "year");
  if (months >= 1) return plural(months, "month");
  if (days >= 1) return plural(days, "day");
  if (hours >= 1) return plural(hours, "hour");
  if (mins >= 1) return plural(mins, "minute");
  return "just now";
}

function plural(n: number, unit: string): string {
  return `${n} ${unit}${n === 1 ? "" : "s"} ago`;
}

/** Deterministic view count derived from a video id/seed. */
export function synthViews(seed: string): number {
  const h = hashStr(seed);
  return 1_000 + (h % 4_800_000);
}

/** Deterministic duration (2–42 min) derived from a video id/seed. */
export function synthDuration(seed: string): string {
  const h = hashStr(seed + "d");
  return formatDuration(120 + (h % (40 * 60)));
}

/** Deterministic upload date within the last ~2 years. */
export function synthPublishedAt(seed: string): string {
  const h = hashStr(seed + "p");
  const daysAgo = h % 730;
  return new Date(Date.now() - daysAgo * 86_400_000).toISOString();
}

/** A stable accent color for an initials avatar, from a name. */
const AVATAR_COLORS = [
  "#e57373", "#f06292", "#ba68c8", "#9575cd", "#7986cb",
  "#64b5f6", "#4dd0e1", "#4db6ac", "#81c784", "#ffb74d",
  "#ff8a65", "#a1887f",
];
export function avatarColor(name: string): string {
  return AVATAR_COLORS[hashStr(name || "?") % AVATAR_COLORS.length];
}

export function initial(name?: string): string {
  const c = (name || "?").trim()[0];
  return (c || "?").toUpperCase();
}
