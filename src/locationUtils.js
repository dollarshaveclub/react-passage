import { createLocation } from 'history'

// References:
// https://github.com/ReactTraining/react-router/pull/5368/files#diff-066b73b6b32d50cbba621d56d70e3301R3-R10
// https://github.com/ReactTraining/react-router/blob/ea44618e68f6a112e48404b2ea0da3e207daf4f0/packages/react-router-dom/modules/Link.js#L92-L95

const resolveToLocation = (to, currentLocation) =>
  typeof to === 'function' ? to(currentLocation) : to

const normalizeToLocation = (to, currentLocation) => {
  return typeof to === 'string'
    ? createLocation(to, null, null, currentLocation)
    : to
}

/**
 * Converts any 'to' object (of type string, object or function) and outputs a
 * location object, while retaining `search`, `hash` and `state`.
 */
export const toLocationObject = (to, currentLocation) => {
  const locationObj = normalizeToLocation(
    resolveToLocation(to, currentLocation),
    currentLocation
  )

  return locationObj
}
