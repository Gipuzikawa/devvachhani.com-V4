import { readFileSync } from 'node:fs';
import { request } from 'node:https';

// Trust only the local Vite certificate when exercising Secure preview cookies.
export function localPreviewRequest(origin: string) {
  if (origin !== 'https://localhost:3000') throw new Error('Local preview origin required.');
  const certificate = readFileSync('../node_modules/.vite/basic-ssl/_cert.pem', 'utf8')
    .match(/-----BEGIN CERTIFICATE-----[\s\S]*?-----END CERTIFICATE-----/)?.[0];
  if (!certificate) throw new Error('Start the local HTTPS server first.');
  return async function call(path: string, method = 'GET', cookie?: string, value?: unknown) {
    const body = value === undefined ? undefined : JSON.stringify(value);
    return new Promise<{ status: number; headers: import('node:http').IncomingHttpHeaders; text: string }>((resolve, reject) => {
      const req = request(new URL(path, origin), { ca: certificate, method, headers: { Origin: origin!,
        ...(cookie ? { Cookie: cookie } : {}), ...(body ? { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) } : {}) } }, res => {
        let text = ''; res.on('data', chunk => { text += chunk; });
        res.on('end', () => resolve({ status: res.statusCode ?? 0, headers: res.headers, text }));
      });
      req.on('error', () => reject(new Error('Local request failed.')));
      req.setTimeout(15_000, () => { req.destroy(); reject(new Error('Local request timed out.')); }); req.end(body);
    });
  };
}
