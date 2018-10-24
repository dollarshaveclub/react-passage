import React from 'react'
import { MemoryRouter, Switch, Route } from 'react-router-dom'
import { Passage, Link, Redirect } from './index'
import renderer from 'react-test-renderer'

describe('react-passage', () => {
  it('renders an anchor tag without context', () => {
    const component = renderer.create(<Link to='/blades'>Blades</Link>)
    expect(component.toJSON()).toMatchSnapshot()
  })

  it('renders an anchor tag when a route is unmatched', () => {
    const component = renderer.create(
      <Passage>
        <MemoryRouter>
          <Switch>
            <Route path='/get-started' exact render={() => {}} />
            <Route render={() => <Link to='/blades'>Blades</Link>} />
          </Switch>
        </MemoryRouter>
      </Passage>
    )
    expect(component.toJSON()).toMatchSnapshot()
  })

  it('renders a Link tag when a route is matched', () => {
    const component = renderer.create(
      <Passage>
        <MemoryRouter>
          <Switch>
            <Route path='/get-started/plan/:planId' exact render={() => {}} />
            <Route path='/users/:id' exact render={() => {}} />

            <Route render={() => (
              <div>
                <Link to='/get-started/plan/shave'>Shave Core</Link>
                <Link to='/users/6'>User 6</Link>
              </div>
            )} />
          </Switch>
        </MemoryRouter>
      </Passage>
    )
    expect(component.toJSON()).toMatchSnapshot()
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
})
