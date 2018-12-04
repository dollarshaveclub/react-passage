import { LocationDescriptor } from 'history'
import * as React from 'react'
import { LinkProps, RedirectProps as ReactRouterRedirectProps, Route } from 'react-router-dom'

export const Link: React.FunctionComponent<LinkProps>

interface RedirectProps extends ReactRouterRedirectProps, Readonly<{
  via?: (to: LocationDescriptor) => void
}> {}

export const Redirect: React.FunctionComponent<RedirectProps>

interface PassageProps extends Readonly<{
  children: React.ReactNode
  targets?: Array<typeof Route>
}> {}

export const Passage: React.FunctionComponent<PassageProps>
