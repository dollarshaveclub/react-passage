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

/**
 * Remove origin, to keep the "absolute path", including: pathname, search and hash
 * Returns Example: /get-started?q=monday#description
 */
export const removeOriginFromUrl = (url) => {
  if (typeof url !== 'string') {
    throw new TypeError('removeOriginFromUrl(): url must be string')
  }

  const objUrl = parseUrl(url)
  const result = objUrl.href.replace(objUrl.origin, '')

  return result
}
