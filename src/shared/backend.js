// The Neon backend the browser talks to: the enquiries API (a Neon Function, see
// functions/api/) and Neon Auth for the /admin/ inbox. Both addresses are set at build
// time in vite.config.js; empty strings mean "not configured".
export const API_URL = import.meta.env.VITE_NEON_API_URL || '';
export const AUTH_URL = import.meta.env.VITE_NEON_AUTH_URL || '';

// Files people can attach to an enquiry. The API checks the same list and limit.
export const ATTACH_ACCEPT = '.pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.odt,.rtf,.txt,.csv,.png,.jpg,.jpeg,.webp';
export const ATTACH_MAX_MB = 10;

export function attachmentProblem(file) {
  if (!file || !file.size) return null;
  const ext = (file.name.match(/\.([A-Za-z0-9]+)$/)?.[1] || '').toLowerCase();
  if (!ATTACH_ACCEPT.split(',').includes(`.${ext}`)) return 'Attach a PDF, Office document, text file or image.';
  if (file.size > ATTACH_MAX_MB * 1024 * 1024) return `Attachments can be up to ${ATTACH_MAX_MB} MB.`;
  return null;
}

// Sends an enquiry (FormData, optionally with an "attachment" file) to the enquiries API.
export async function sendEnquiry(formData) {
  if (!API_URL) throw new Error('Enquiries API is not configured');
  const res = await fetch(`${API_URL}/enquiries`, { method: 'POST', body: formData });
  if (!res.ok) throw new Error(`Enquiries API answered ${res.status}`);
  return res.json();
}
