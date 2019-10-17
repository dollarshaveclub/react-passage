import { LocationDescriptor } from 'history'
import { FunctionComponent, ReactNode } from 'react'
import { LinkProps as ReactRouterLinkProps, RedirectProps as ReactRouterRedirectProps, Route } from 'react-router-dom'

type NativeOverride = {
  native?: boolean
}

type RedirectProps = ReactRouterRedirectProps & NativeOverride & {
  via?: (to: LocationDescriptor) => void
}

type LinkProps = ReactRouterLinkProps & NativeOverride

interface PassageProps extends Readonly<{
  children: ReactNode
  targets?: Array<typeof Route>
}> {}

export const Redirect: FunctionComponent<RedirectProps>
export const Link: FunctionComponent<LinkProps>
export const Passage: FunctionComponent<PassageProps>
