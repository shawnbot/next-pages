# next-pages

## Usage
Due to the... _complicated_ nature of Next.js's server/client compilation split, it's currently necessary to inject the list of available pages via `publicRuntimeConfig.pages` in `next.config.js`:

```js
// next.config.js
const getPages = require('next-pages/config')
const pageExtensions = ['js', 'jsx']

module.exports = {
  pageExtensions,
  publicRuntimeConfig: {
    pages: getPages({pageExtensions})
  }
}
```

Note: If you don't use custom page extensions (`.md`, `.mdx`, etc.) you can omit any of the references to `pageExtensions`.

Then, in `pages/_app.js`, you can import the `pages` and `root` variables from `next-pages/app`:

```js
// pages/_app.js
import React from 'react'
import App, {Container} from 'next/app'
import {pages} from 'next-pages/app'

export default class extends App {
  render() {
    const {Component, router} = this.props
    const current = pages.find(page => page.path === router.pathname)
    return (
      <Container>
        <h1>{router.pathname}</h1>
        <p>Current page: {JSON.stringify(current)}</p>
        <Component />
      </Container>
    )
  }
}
```

Good luck!
