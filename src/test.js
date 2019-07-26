import React from 'react'
import { Link as ReactRouterLink, MemoryRouter, Switch, Route } from 'react-router-dom'
import { Passage, Link, Redirect } from '.'
import renderer from 'react-test-renderer'

describe('react-passage', () => {
  describe('when there is no context', () => {
    const href = '/blades'
    const component = renderer.create(<Link to={href}>Blades</Link>)

    it('renders an anchor tag', () => {
      expectComponentToRenderSafeLink(component, 'a', href)
    })

    it('matches the snapshot', () => {
      expect(component.toJSON()).toMatchSnapshot()
    })
  })

  describe('when a route is unmatched', () => {
    const href = '/blades'
    const component = renderer.create(
      <Passage>
        <MemoryRouter>
          <Switch>
            <Route path='/get-started' exact render={() => {}} />
            <Route render={() => <Link to={href}>Blades</Link>} />
          </Switch>
        </MemoryRouter>
      </Passage>
    )

    it('renders an anchor tag', () => {
      expectComponentToRenderSafeLink(component, 'a', href)
    })

    it('matches the snapshot', () => {
      expect(component.toJSON()).toMatchSnapshot()
    })
  })

  describe('when a route is matched', () => {
    const href = '/get-started/plan/shave'

    const component = renderer.create(
      <Passage>
        <MemoryRouter>
          <Switch>
            <Route path='/get-started/plan/:planId' exact render={() => {}} />
            <Route path='/users/:id' exact render={() => {}} />

            <Route render={() => (
              <Link to={href}>Shave Core</Link>
            )} />
          </Switch>
        </MemoryRouter>
      </Passage>
    )

    it('renders a Link tag', () => {
      expectComponentToRenderSafeLink(component, ReactRouterLink, href)
    })

    it('matches the snapshot', () => {
      expect(component.toJSON()).toMatchSnapshot()
    })
  })

  it('redirects to a route without context', () => {
    const mockVia = jest.fn()
    renderer.create(<Redirect to='/our-products/shave' via={mockVia} />)
    expect(mockVia).toHaveBeenCalledWith('/our-products/shave')
  })

  it('redirects to a matched react route', () => {
    const component = renderer.create(
      <Passage>
        <MemoryRouter>
          <Switch>
            <Route path='/get-started' exact render={() => <p>Redirected!</p>} />
            <Route render={() => <Redirect to='/get-started' />} />
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
            <Route path='/get-started' exact render={() => <p>Redirected!</p>} />
            <Route render={() => <Redirect to='/our-products' via={mockVia} />} />
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
              <Route path='/get-started' exact render={() => <p>Redirected!</p>} />
            </Switch>
          </MemoryRouter>
        </Passage>
      )
    })
  })
})

/**
 * Asserts that the component contains a child link-like element of type componentType with the provided href as a prop.
 * @param {renderer.ReactTestRenderer} component
 * @param {string | React.ComponentClass<any, any> | React.FunctionComponent<any>} componentType
 * @param {string} href
 * @example const component = renderer.create(<Link to='/foo'>Blades</Link>)
 * expectComponentToRenderSafeLink(component, Link, '/foo') // passes
 * expectComponentToRenderSafeLink(component, 'a', '/foo') // does not pass
 */
function expectComponentToRenderSafeLink (component, componentType, href) {
  const safeLink = component.root.findByType(componentType)
  expect(safeLink).toBeTruthy()
  const linkHref = safeLink.props.href || safeLink.props.to
  expect(linkHref).toBe(href)
}
