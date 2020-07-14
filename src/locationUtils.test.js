import { toLocationObject } from './locationUtils'

// Reference: https://reactrouter.com/web/api/Link
describe('toLocationObject()', () => {
  const mockCurrentLocation = {
    pathname: '/account',
  }

  it('converts from string', () => {
    const mockTo = '/home'

    const result = toLocationObject(mockTo, mockCurrentLocation)

    expect(result.pathname).toEqual('/home')
    expect(result.search).toEqual('')
    expect(result.hash).toEqual('')
    expect(result.state).toEqual(null)
  })

  it('converts from string (with query param and hash)', () => {
    const mockTo = '/home?sort=name#555'

    const result = toLocationObject(mockTo, mockCurrentLocation)

    expect(result.pathname).toEqual('/home')
    expect(result.search).toEqual('?sort=name')
    expect(result.hash).toEqual('#555')
    expect(result.state).toEqual(null)
  })

  it('converts from function', () => {
    const mockTo = (location) => {
      return {
        pathname: '/join',
        hash: '',
        state: {
          modal: true,
          background: location,
        },
      }
    }

    const result = toLocationObject(mockTo, mockCurrentLocation)

    expect(result.pathname).toEqual('/join')
    expect(result.search).toEqual(undefined)
    expect(result.hash).toEqual('')
    expect(result.state).toEqual({
      modal: true,
      background: { pathname: '/account' },
    })
  })

  it('converts from object', () => {
    const mockTo = {
      pathname: '/courses',
      search: '?sort=name',
      hash: '#the-hash',
      state: { fromDashboard: true },
    }

    const result = toLocationObject(mockTo, mockCurrentLocation)

    expect(result.pathname).toEqual('/courses')
    expect(result.search).toEqual('?sort=name')
    expect(result.hash).toEqual('#the-hash')
    expect(result.state).toEqual({ fromDashboard: true })
  })
})
