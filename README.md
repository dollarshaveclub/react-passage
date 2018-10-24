# react-passage
Passage helps when linking or redirecting to routes that may or may not be in your react app.

The idea is simple: Wrap Passage around your routes so it knows what routes have been defined in your app. Then, using the `Link` and `Redirect` components from Passage  will honor the HTML5 history API if the route is within your app, otherwise falling back to other means such as anchor tags or `location` redirects.

## Usage
Passage provides three exports.
* A `Passage` component used for identifying routes in your app
* A `Link` component, use this to safely render react links internal/external routes
* A `Redirect` component, use this to safely redirect to internal/external routes


**Wrap the `Passage` component around your routes**
```js
import React from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'

import { Passage } from '@dollarshaveclub/react-components/dist/components/Passage'

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

**Leverage Passage Links and Redirects**
```js
import React from 'react'

import {
  Link,
  Redirect,
} from '@dollarshaveclub/react-components/dist/components/Passage'

// Renders a React Router Link tag if it can, otherwise falls back to an anchor tag
const About = () => (<Link to='/blog'>Blog</Link>)

// Redirects with react-history if route exists, otherwise, uses window.location.assign
const Blog = () => (<Redirect to='/new-blog' />)

// Change how you redirect
const NewBlog = () => (
  <Redirect to='/new-website' via={(to) => window.location.href = to} />
)
```

# License
MIT
