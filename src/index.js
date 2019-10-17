import React, { Children, createContext } from 'react'
import { Route, Link as ReactRouterLink, Redirect as ReactRouterRedirect } from 'react-router-dom'
import PropTypes from 'prop-types'
import { matchPath } from 'react-router'

// Create our Context API
const { Provider, Consumer } = createContext()

// Flattens children into a list and filters by Route
const getRoutes = (children, targets, matches = []) => {
  Children.forEach(children, (child) => {
    if (child) {
      matches.push(child)
      if (child.props.children) return getRoutes(child.props.children, targets, matches)
    }
  })
  return matches.filter(child => {
    for (const index in targets) {
      if (targets[index].toString() === child.type.toString()) {
        return true
      }
    }
    return false
  })
}

// Takes in children and returns a function that will be passed via context.
// This function will leverage reacts matchPath function to check if a route
// has been defined for the provided path
const MatchFactory = (routes) => (to, override) =>
  (typeof override === 'boolean')
    ? override
    : Children.map(routes, ({
      props: {
        path,
        exact,
        strict,
      },
    }) => matchPath(to, {
      path,
      exact,
      strict,
    })).some((v) => v)

// Sets the context as the matcher function above
export const Passage =
  ({ children, targets }) =>
    <Provider
      value={MatchFactory(getRoutes(children, targets))}
      children={children} />

Passage.propTypes = {
  targets: PropTypes.array.isRequired,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(
      PropTypes.node
    ),
    PropTypes.node,
  ]),
}
Passage.defaultProps = {
  targets: [Route],
}

// Consumes the matcher function and checks the URL against the defined routes
export const Link =
  ({ to, children, native, ...remainingProps }) =>
    <Consumer>
      {doesMatch => {
        if (!doesMatch || !doesMatch(to, !native)) return <a data-passage-link-type='anchor' href={to} {...remainingProps}>{children}</a>
        return <ReactRouterLink data-passage-link-type='pushState' to={to} {...remainingProps}>{children}</ReactRouterLink>
      }}
    </Consumer>

Link.propTypes = {
  to: PropTypes.string.isRequired,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  native: PropTypes.bool,
}

// Does a react Redirect if possible, otherwise it falls back to props.via, or
// in this case, window.location.assign
export const Redirect =
  ({ to, via, native, ...remainingProps }) =>
    <Consumer>
      {doesMatch => {
        if (!doesMatch || !doesMatch(to, native)) return via(to)
        else return <ReactRouterRedirect to={to} {...remainingProps} />
      }}
    </Consumer>

Redirect.propTypes = {
  to: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.string,
  ]).isRequired,
  via: PropTypes.func.isRequired,
  native: PropTypes.bool,
}

Redirect.defaultProps = {
  via: (to) => window.location.assign(to),
}
