import { parseUrl } from './urlUtilities'

describe('parseUrl()', () => {
  describe('parsing relative urls', () => {
    const RELATIVE_URL = '/get-started'

    it('returns pathname', () => {
      const result = parseUrl(RELATIVE_URL)
      expect(result.pathname).toBe('/get-started')
    })

    it('returns origin', () => {
      const result = parseUrl(RELATIVE_URL)
      expect(result.origin).toBe('http://localhost')
    })
  })

  describe('parsing fully qualified urls', () => {
    const FULL_URL = 'http://www.shave.com/get-started'

    it('returns pathname', () => {
      const result = parseUrl(FULL_URL)
      expect(result.pathname).toBe('/get-started')
    })

    it('returns origin', () => {
      const result = parseUrl(FULL_URL)
      expect(result.origin).toBe('http://www.shave.com')
    })
  })
})
