<img src="https://i.imgur.com/IoreaHU.jpg">

***

[![Greenkeeper badge](https://badges.greenkeeper.io/dollarshaveclub/react-passage.svg)](https://greenkeeper.io/)

Passage helps when linking or redirecting to routes that may or may not be in your react app.

The idea is simple: Wrap Passage around your routes so it knows what routes have been defined in your app. Then, using the `Link` and `Redirect` components from Passage  will honor the HTML5 history API if the route is within your app, otherwise falling back to other means such as anchor tags or `location` redirects.

_Note: There may be some issues with nested react routes. [Read more here](https://github.com/dollarshaveclub/react-passage/issues/1)_.

## Installing

Install via NPM:

```sh

npm i @dollarshaveclub/react-passage@latest --save

```

## Usage

Passage provides three exports.

* A `Passage` component used for identifying routes in your app
* A `Link` component, use this to render react links internal/external routes
* A `Redirect` component, use this to redirect to internal/external routes


### Wrap the `Passage` component around your routes

```js

import React from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'

import { Passage } from '@dollarshaveclub/react-passage'

const App = () => (
  <Passage>
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route path="/about" component={About} />
        <Route path="/topics" component={Topics} />
      </Switch>
    </BrowserRouter>
  </Passage>
)

```

The Passage component accepts an optional prop called `targets`. This is an array of components that you want to search for within your routes file. It has a value of `[Route]` by default.

```js

const App = () => (
  <Passage targets={[ Route, MyCustomRoute ]}>
    <BrowserRouter>
      <Switch>
        <MyCustomRoute exact path="/" component={Home} />
        <MyCustomRoute path="/about" component={About} />
        <Route path="/topics" component={Topics} />
      </Switch>
    </BrowserRouter>
  </Passage>
)

```

### Leverage Passage Links and Redirects

```js

import React from 'react'

import {
  Link,
  Redirect,
} from '@dollarshaveclub/react-passage'

// Renders a React Router Link tag if it can, otherwise falls back to an anchor tag
const aboutExample = () => (<Link to='/about'>About</Link>)

// Redirects with react-history if route exists, otherwise, uses window.location.assign
const externalExample = () => (<Redirect to='/external-path' />)

// Change how you redirect
const changeRedirectExample = () => (
  <Redirect to='/new-website' via={(to) => window.location.href = to} />
)

```

# License

MIT
