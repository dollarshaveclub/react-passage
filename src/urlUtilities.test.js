import {
  parseUrl,
  isSameOriginAsCurrentPage,
  removeOriginFromUrl,
} from './urlUtilities'

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

describe('isSameOriginAsCurrentPage()', () => {
  const MOCK_LOCATION = {
    hash: '',
    host: 'uk.dollarshaveclub.com',
    hostname: 'uk.dollarshaveclub.com',
    href: 'https://uk.dollarshaveclub.com/',
    origin: 'https://uk.dollarshaveclub.com',
    pathname: '/',
    port: '',
    protocol: 'https:',
  }

  let realLocation

  beforeAll(() => {
    realLocation = window.location
    delete window.location
    window.location = MOCK_LOCATION
  })

  afterAll(() => {
    window.location = realLocation
  })

  it('META: mocks correctly', () => {
    expect(window.location.host).toEqual('uk.dollarshaveclub.com')
  })

  it('retuns true, when origins match', () => {
    const result = isSameOriginAsCurrentPage(
      'https://uk.dollarshaveclub.com/get-started'
    )
    expect(result).toBe(true)
  })

  it('returns false, when origins do not match (V1)', () => {
    const result = isSameOriginAsCurrentPage(
      'https://ca.dollarshaveclub.com/get-started'
    )
    expect(result).toBe(false)
  })

  it('returns false, when origins do not match (V2)', () => {
    const result = isSameOriginAsCurrentPage('http://www.google.com')
    expect(result).toBe(false)
  })

  it('returns true, when relative url sent', () => {
    const result = isSameOriginAsCurrentPage('/get-started')
    expect(result).toBe(true)
  })

  it('returns true, when hash sent', () => {
    const result = isSameOriginAsCurrentPage('#main')
    expect(result).toBe(true)
  })
})

describe('removeOriginFromUrl()', () => {
  it('returns correctly, when no path is present', () => {
    const mockInput = 'http://www.google.com'
    const result = removeOriginFromUrl(mockInput)
    expect(result).toBe('/')
  })

  it('returns correctly, when path is forward slash', () => {
    const mockInput = 'http://www.google.com/'
    const result = removeOriginFromUrl(mockInput)
    expect(result).toBe('/')
  })

  it('returns correctly, when path is simple string', () => {
    const mockInput = 'http://www.google.com/now'
    const result = removeOriginFromUrl(mockInput)
    expect(result).toBe('/now')
  })

  it('returns correctly, when path is search param only', () => {
    const mockInput = 'http://www.google.com?q=chicken'
    const result = removeOriginFromUrl(mockInput)
    expect(result).toBe('/?q=chicken')
  })

  it('returns correctly, when path is hash', () => {
    const mockInput = 'http://www.google.com#title'
    const result = removeOriginFromUrl(mockInput)
    expect(result).toBe('/#title')
  })

  it('returns correctly, when path is complex', () => {
    const mockInput = 'http://www.google.com/now?q=chicken#title'
    const result = removeOriginFromUrl(mockInput)
    expect(result).toBe('/now?q=chicken#title')
  })

  it('returns correctly, when url contains no origin', () => {
    const mockInput = '/shop/all-products'
    const result = removeOriginFromUrl(mockInput)
    expect(result).toBe('/shop/all-products')
  })

  it('throws, when url passed in is an object', () => {
    const mockInput = { isObject: true }
    const funcUnderTest = () => {
      return removeOriginFromUrl(mockInput)
    }
    expect(funcUnderTest).toThrow()
  })
})
