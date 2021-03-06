import React, { Children, createContext, forwardRef } from 'react'
import {
  Route,
  Link as ReactRouterLink,
  Redirect as ReactRouterRedirect,
} from 'react-router-dom'
import { matchPath, useLocation } from 'react-router'
import PropTypes from 'prop-types'
import { isSameOriginAsCurrentPage, removeOriginFromUrl } from './urlUtilities'
import { toLocationObject } from './locationUtils'

// Create our Context API
const { Provider, Consumer } = createContext()

// Flattens children into a list and filters by Route
const getRoutes = (children, targets, matches = []) => {
  Children.forEach(children, (child) => {
    if (child) {
      matches.push(child)
      if (child.props.children)
        return getRoutes(child.props.children, targets, matches)
    }
  })
  return matches.filter((child) => {
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
const MatchFactory = (routes) => (to) => {
  const a = document.createElement('a')
  return Children.map(routes, (route) => {
    const {
      props: { path, exact, strict },
    } = route

    const url = toStringFromLocationObject(to)

    if (!url) return false

    if (!isSameOriginAsCurrentPage(url)) return false

    a.href = url
    const toPath = a.pathname

    return matchPath(toPath, {
      path,
      exact,
      strict,
    })
  }).some((v) => v)
}

// Sets the context as the matcher function above
export const Passage = ({ children, targets }) => (
  <Provider value={MatchFactory(getRoutes(children, targets))}>
    {children}
  </Provider>
)

Passage.propTypes = {
  targets: PropTypes.array.isRequired,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
}
Passage.defaultProps = {
  targets: [Route],
}

export const toStringFromLocationObject = (to, location) => {
  if (typeof to === 'string') return to
  const toObj = 'pathname' in to ? to : to(location)
  if (!toObj) return null

  const toPath = toObj.pathname
  const toSearch = toObj.search ?? ''
  const toHash = toObj.hash ?? ''

  return `${toPath}${toSearch}${toHash}`
}

// Consumes the matcher function and checks the URL against the defined routes
export const Link = forwardRef(
  ({ to, external, children, ...remainingProps }, ref) => {
    const location = useLocation()

    return (
      <Consumer>
        {(doesMatch) => {
          if (!doesMatch || external || !doesMatch(to))
            return (
              <a
                data-safelink-type="a"
                href={toStringFromLocationObject(to, location)}
                {...remainingProps}
                ref={ref}
              >
                {children}
              </a>
            )

          const toLocationObj = toLocationObject(to)
          toLocationObj.pathname = removeOriginFromUrl(toLocationObj.pathname)

          return (
            <ReactRouterLink
              data-safelink-type="link"
              to={toLocationObj}
              {...remainingProps}
              ref={ref}
            >
              {children}
            </ReactRouterLink>
          )
        }}
      </Consumer>
    )
  }
)

Link.displayName = 'PassageLink'

Link.propTypes = {
  to: PropTypes.oneOfType([
    PropTypes.shape({
      pathname: PropTypes.string,
    }),
    PropTypes.string,
    PropTypes.func,
  ]).isRequired,
  external: PropTypes.bool,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
}

// Does a react Redirect if possible, otherwise it falls back to props.via, or
// in this case, window.location.assign
export const Redirect = ({ to, via, ...remainingProps }) => (
  <Consumer>
    {(doesMatch) => {
      if (!doesMatch || !doesMatch(to)) return via(to)
      else return <ReactRouterRedirect to={to} {...remainingProps} />
    }}
  </Consumer>
)

Redirect.propTypes = {
  to: PropTypes.oneOfType([
    PropTypes.shape({
      pathname: PropTypes.string,
    }),
    PropTypes.string,
    PropTypes.func,
  ]).isRequired,
  via: PropTypes.func.isRequired,
}

Redirect.defaultProps = {
  via: (to) => window.location.assign(to),
}
