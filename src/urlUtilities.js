export function parseUrl(url) {
  const DEFAULT_BASE = window.location.origin || 'http://localhost'
  const urlObj = new URL(url, DEFAULT_BASE)

  return urlObj
}

export const isSameOriginAsCurrentPage = (url) => {
  if (!window || !window.location) {
    return false
  }

  const inputOrigin = parseUrl(url).origin
  const currentOrigin = window.location.origin

  return inputOrigin === currentOrigin
}
