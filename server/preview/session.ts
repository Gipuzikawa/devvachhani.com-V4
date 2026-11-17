import { createHmac, randomBytes, timingSafeEqual } from 'node:crypto';
import type { PreviewConfig } from '../config';

export const COOKIE_NAME = '__Host-portfolio-preview';
export const SESSION_SECONDS = 3600;
function signature(payload: string, secret: string) {
  return createHmac('sha256', secret).update(payload).digest('base64url');
}
export function issueSession(config: PreviewConfig, now = Date.now()) {
  const iat = Math.floor(now / 1000);
  const payload = Buffer.from(JSON.stringify({ v: 1, projectId: config.projectId, dataset: config.dataset,
    perspective: 'drafts', iat, exp: iat + SESSION_SECONDS, nonce: randomBytes(16).toString('hex') })).toString('base64url');
  return `${payload}.${signature(payload, config.secret)}`;
}
export function verifySession(value: string | undefined, config: PreviewConfig, now = Date.now()) {
  if (!value || value.length > 2048 || !/^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/.test(value)) return false;
  const [payload, supplied] = value.split('.');
  const expected = signature(payload, config.secret);
  if (supplied.length !== expected.length || !timingSafeEqual(Buffer.from(supplied), Buffer.from(expected))) return false;
  try {
    const session: unknown = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
    if (!session || typeof session !== 'object' || Array.isArray(session)) return false;
    const s = session as Record<string, unknown>;
    const seconds = Math.floor(now / 1000);
    return Object.keys(s).sort().join(',') === 'dataset,exp,iat,nonce,perspective,projectId,v' &&
      s.v === 1 && s.projectId === config.projectId && s.dataset === config.dataset && s.perspective === 'drafts' &&
      typeof s.nonce === 'string' && /^[0-9a-f]{32}$/.test(s.nonce) &&
      typeof s.iat === 'number' && Number.isInteger(s.iat) && typeof s.exp === 'number' && Number.isInteger(s.exp) &&
      s.iat <= seconds && s.exp > seconds && s.exp - s.iat === SESSION_SECONDS;
  } catch { return false; }
}
export function readCookie(header?: string) {
  const values = (header ?? '').split(';').map(part => part.trim()).filter(part => part.startsWith(`${COOKIE_NAME}=`));
  if (values.length !== 1) return undefined;
  return values[0].slice(COOKIE_NAME.length + 1);
}
export function sessionExpiresAt(value: string, config: PreviewConfig) {
  if (!verifySession(value, config)) return undefined;
  return (JSON.parse(Buffer.from(value.split('.')[0], 'base64url').toString('utf8')) as { exp: number }).exp * 1000;
}
export function sessionCookie(value: string, clear = false) {
  return `${COOKIE_NAME}=${value}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${clear ? 0 : SESSION_SECONDS}`;
}
