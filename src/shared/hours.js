// Working-hours wording and time-zone maths, shared by the public site and the admin preview.
export const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
export const DAY_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const mondayFirst = (d) => (d + 6) % 7;

// [1,2,3,4,5] -> "Monday to Friday" (or "Mon–Fri"); [1,3,5] -> "Monday, Wednesday and Friday".
export function formatDays(days, short = false) {
  const names = short ? DAY_SHORT : DAY_NAMES;
  const sorted = [...new Set(days)].sort((a, b) => mondayFirst(a) - mondayFirst(b));
  const runs = [];
  for (const d of sorted) {
    const last = runs[runs.length - 1];
    if (last && mondayFirst(d) === mondayFirst(last[last.length - 1]) + 1) last.push(d); else runs.push([d]);
  }
  const parts = runs.flatMap((r) => (r.length >= 3 ? [`${names[r[0]]}${short ? '–' : ' to '}${names[r[r.length - 1]]}`] : r.map((d) => names[d])));
  if (short || parts.length < 2) return parts.join(', ');
  return `${parts.slice(0, -1).join(', ')} and ${parts[parts.length - 1]}`;
}

// Hours ahead of UTC in a time zone at a moment (rounded to the quarter hour).
export function utcOffset(date, timeZone) {
  const p = Object.fromEntries(new Intl.DateTimeFormat('en-US', { timeZone, hourCycle: 'h23', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })
    .formatToParts(date).map((x) => [x.type, x.value]));
  const asUtc = Date.UTC(+p.year, +p.month - 1, +p.day, +p.hour, +p.minute);
  return Math.round((asUtc - Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes())) / 36e5 * 4) / 4;
}

// 2 -> "UTC+2", -5 -> "UTC-5", 5.5 -> "UTC+5:30"
export function formatOffset(h) {
  const a = Math.abs(h), m = Math.round((a % 1) * 60);
  return `UTC${h < 0 ? '-' : '+'}${Math.floor(a)}${m ? `:${String(m).padStart(2, '0')}` : ''}`;
}

export const toHours = (hhmm) => { const [h, m] = hhmm.split(':').map(Number); return h + m / 60; };

// "Monday to Friday, 08:00–17:00 CAT (UTC+2)". `offset` is hours ahead of UTC.
export const hoursText = (h, offset) => `${formatDays(h.days)}, ${h.open}–${h.close} ${h.zoneLabel} (${formatOffset(offset)})`;
