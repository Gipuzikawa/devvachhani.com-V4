const route = /^(?:\/|\/about|\/work|\/writing|\/(?:work|writing)\/[a-z0-9]+(?:-[a-z0-9]+)*)$/;
export function safeRedirect(value: string = '/', origin: string) {
  if (value.length > 1024 || !value.startsWith('/') || value.startsWith('//') || /[\\%]/.test(value) ||
    [...value].some(character => character.charCodeAt(0) <= 32)) {
    throw new Error('Invalid preview redirect');
  }
  const url = new URL(value, origin);
  if (url.origin !== origin || !route.test(url.pathname)) throw new Error('Invalid preview route');
  // Only a bounded anchor survives; strip secret/perspective and all query parameters.
  const hash = /^#[a-z0-9-]{1,80}$/i.test(url.hash) ? url.hash : '';
  return `${url.pathname}${hash}`;
}
