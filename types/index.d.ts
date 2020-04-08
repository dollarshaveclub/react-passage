import { FunctionComponent, ReactNode, RefObject } from 'react'
import {
  LinkProps,
  RedirectProps as ReactRouterRedirectProps,
  Route,
} from 'react-router-dom'

export const Link: FunctionComponent<LinkProps & {
  ref?: RefObject<any>
}>

type RedirectProps = {} & ReactRouterRedirectProps &
  Readonly<{
    via?: (to: LinkProps['to']) => void
  }>

export const Redirect: FunctionComponent<RedirectProps>

type PassageProps = {} & Readonly<{
  children: ReactNode
  targets?: Array<typeof Route>
}>

export const Passage: FunctionComponent<PassageProps>
