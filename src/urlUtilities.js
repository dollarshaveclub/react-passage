export function parseUrl(url) {
  const DEFAULT_BASE = window.location.origin || 'http://localhost'
  const urlObj = new URL(url, DEFAULT_BASE)

  return urlObj
}
