import React from 'react'
import { MemoryRouter, Switch, Route } from 'react-router-dom'
import { useLocation } from 'react-router'
import { Passage, Link, Redirect } from '.'
import renderer from 'react-test-renderer'

jest.mock('react-router', () => {
  const reactRouter = jest.requireActual('react-router')

  return {
    ...reactRouter,
    useLocation: jest.fn((location) => ({
      pathname: '/',
    })),
  }
})

describe('react-passage', () => {
  describe('when there is no context', () => {
    const href = '/blades'
    const component = renderer.create(<Link to={href}>Blades</Link>)

    it('renders an anchor tag', () => {
      expectAnchorWith(component, href)
    })

    it('matches the snapshot', () => {
      expect(component.toJSON()).toMatchSnapshot()
    })
  })

  describe('when a route is unmatched', () => {
    const renderDummyRouteTree = (link) =>
      renderer.create(
        <Passage>
          <MemoryRouter>
            <Switch>
              <Route path="/get-started" exact render={() => {}} />
              <Route render={() => <Link to={link}>Dummy Link</Link>} />
            </Switch>
          </MemoryRouter>
        </Passage>
      )

    it('renders an anchor tag, when path does not match', () => {
      const href = '/blades'
      expectAnchorWith(renderDummyRouteTree(href), href)
    })

    it('renders an anchor tag, when path the same, but origin is different', () => {
      const href = 'https://www.google.com/get-started'
      expectAnchorWith(renderDummyRouteTree(href), href)
    })

    it('matches the snapshot', () => {
      expect(renderDummyRouteTree('/blades').toJSON()).toMatchSnapshot()
    })
  })

  describe('when a route is matched', () => {
    const hrefRelativeMatch = '/get-started/plan/shave'
    const hrefFullyQualifiedMatch =
      'https://uk.dollarshaveclub.com/get-started/plan/shave'

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

    const renderDummyRoutes = (link) =>
      renderer.create(
        <Passage>
          <MemoryRouter>
            <Switch>
              <Route path="/get-started/plan/:planId" exact render={() => {}} />
              <Route path="/get-started" exact render={() => {}} />
              <Route path="/users/:id" exact render={() => {}} />

              <Route render={() => link} />
            </Switch>
          </MemoryRouter>
        </Passage>
      )

    it('renders a Link tag, when relative path matches', () => {
      expectLinkWith(
        renderDummyRoutes(<Link to={hrefRelativeMatch}>Shave Core</Link>),
        { pathname: hrefRelativeMatch, hash: '', search: '', state: null }
      )

      expectLinkWith(
        renderDummyRoutes(<Link to={hrefRelativeMatch}>Shave Core</Link>),
        { pathname: hrefRelativeMatch, hash: '', search: '', state: null }
      )
    })

    it('renders a Link tag, when fully qualified url matches', () => {
      expectLinkWith(
        renderDummyRoutes(<Link to={hrefFullyQualifiedMatch}>Shave Core</Link>),
        { pathname: hrefRelativeMatch, hash: '', search: '', state: null }
      )
    })

    it('renders a Link tag with Query Parementers', () => {
      const hrefWithQueryParams = '/get-started?source=foo&medium=nav'
      const LinkComponent = <Link to={hrefWithQueryParams}>Shave Core</Link>
      expectLinkWith(renderDummyRoutes(LinkComponent), {
        pathname: '/get-started',
        hash: '',
        search: '?source=foo&medium=nav',
        state: null,
      })
      expect(LinkComponent).toMatchSnapshot()
    })

    it('matches the snapshot', () => {
      expect(
        renderDummyRoutes(
          <Link to={hrefRelativeMatch}>Shave Core</Link>
        ).toJSON()
      ).toMatchSnapshot()
    })

    it('matches with a location object', () => {
      expect(
        renderDummyRoutes(
          <Link
            to={{
              pathname: hrefRelativeMatch,
            }}
          >
            Shave Core
          </Link>
        ).toJSON()
      ).toMatchSnapshot()
    })

    it('matches with a function that returns a location object', () => {
      expect(
        renderDummyRoutes(
          <Link to={(location) => location}>Shave Core</Link>
        ).toJSON()
      ).toMatchSnapshot()
      expect(useLocation).toHaveBeenCalled()
    })

    it('matches but is overridden with external flag', () => {
      expectAnchorWith(
        renderDummyRoutes(
          <Link external to={hrefRelativeMatch}>
            Shave Core
          </Link>
        ),
        hrefRelativeMatch
      )
    })
  })

  it('redirects to a route without context', () => {
    const mockVia = jest.fn()
    renderer.create(<Redirect to="/our-products/shave" via={mockVia} />)
    expect(mockVia).toHaveBeenCalledWith('/our-products/shave')
  })

  it('redirects to a matched react route', () => {
    const component = renderer.create(
      <Passage>
        <MemoryRouter>
          <Switch>
            <Route
              path="/get-started"
              exact
              render={() => <p>Redirected!</p>}
            />
            <Route render={() => <Redirect to="/get-started" />} />
          </Switch>
        </MemoryRouter>
      </Passage>
    )
    expect(component.toJSON()).toMatchSnapshot()
  })

  it('redirects to an unmatched react route', () => {
    const mockVia = jest.fn()
    renderer.create(
      <Passage>
        <MemoryRouter>
          <Switch>
            <Route
              path="/get-started"
              exact
              render={() => <p>Redirected!</p>}
            />
            <Route
              render={() => <Redirect to="/our-products" via={mockVia} />}
            />
          </Switch>
        </MemoryRouter>
      </Passage>
    )
    expect(mockVia).toHaveBeenCalledWith('/our-products')
  })

  describe('Children types', () => {
    it('can handle null children types', () => {
      renderer.create(
        <Passage>
          {null}
          <MemoryRouter>
            <Switch>
              <Route
                path="/get-started"
                exact
                render={() => <p>Redirected!</p>}
              />
            </Switch>
          </MemoryRouter>
        </Passage>
      )
    })
  })
})

// ---Helpers---
function expectAnchorWith(componentTree, href) {
  const foundAnchor = componentTree.root.findByProps({
    'data-safelink-type': 'a',
  })
  expect(foundAnchor.props.href).toBe(href)
}

function expectLinkWith(componentTree, toLocationObject) {
  const foundLink = componentTree.root.findByProps({
    'data-safelink-type': 'link',
  })
  expect(foundLink.props.to).toEqual(toLocationObject)
}
