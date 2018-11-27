# next-pages

## Usage
Due to the... _complicated_ nature of Next.js's server/client compilation split, it's currently necessary to inject the list of available pages via `publicRuntimeConfig.pages` in your Next config. There's a configuration plugin available, which respects your `pageExtension` config option:

```js
// next.config.js
const pages = require('next-pages/plugin')
module.exports = withPages({
  pageExtensions: ['js', 'jsx'],
})
```

The plugin also works nicely with [next-compose-plugins](https://www.npmjs.com/package/next-compose-plugins):

```js
// next.config.js
const withPlugins = require('next-compose-plugins')
const mdx = require('@zeit/next-mdx')
const pages = require('next-pages/plugin')

module.exports = withPlugins([
  mdx({extension: /\.mdx?$/}),
  pages
], {
  pageExtensions: ['js', 'md', 'mdx']
})
```

Note: If you don't use custom page extensions (`.md`, `.mdx`, etc.) you can omit any of the references to `pageExtensions`. The most minimal installation looks like:

```js
// next.config.js
module.exports = require('next-pages/plugin')()
```

Then, in `pages/_app.js`, you can import the `pages` and `root` variables from `next-pages/app`:

```js
// pages/_app.js
import React from 'react'
import App, {Container} from 'next/app'
import {pages, root} from 'next-pages/app'

export default class extends App {
  render() {
    const {Component, router} = this.props
    // pages.find() works here, too:
    const current = root.first(page => page.path === router.pathname)
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

## Page objects
Page objects are modified [tree-model] nodes with the shape:

```js
{
  path: '/absolute/uri',
  file: './absolute/uri.js',
  isIndex: Boolean,
  parent: Node,
  children: [Node]
}
```

Nodes have some useful methods, including:

* `getPath()` returns an array of nodes representing the "path" from the root node to this one, and is useful for building breadcrumb navigation
* `hasChildren()` is a couple of characters shorter than `children.length > 0`
* `isRoot()` should be self-explanatory

A node's `path` should correspond to `next/router`'s `Router.pathname` or `props.router.pathname` when you wrap a component in [withRouter]. See the [page tree](#page-tree) methods for some examples.


## Pages list
The `pages` export is an array of [page objects](#page-objects) sorted alphabetically by their `path`.

## Page tree
The `root` export is the top-most [page object](#page-objects), and likely represents the `/` URL of your app. You can access the `children` Array of this object to get the list of top-level pages, or you can walk the tree with the following methods:

* `root.first(func)` returns the first node for which `func(node)` returns `true`. For instance, to get the current page inside a component decorated with [withRouter]:

    ```js
    import {root} from 'next-pages/app'
    import {withRouter} from 'next/router'

    export default withRouter(({router}) => {
      const page = root.first(node => node.path === router.pathname)
      // do something with the page object
    })
    ```

* `root.all(func)` returns all nodes for which `func(node)` returns `true`. This is useful for finding all of the descendents of a path, e.g.

    ```js
    import {root} from 'next-pages/app'
    import {withRouter} from 'next/router'
    export default withRouter(({router}) => {
      const pages = root.all(node => node.path.startsWith(router.pathname))
      // do something with the pages array
    })
    ```

* `root.walk(func)` executes `func(node)` for each node in the tree, and takes [some additional options](https://www.npmjs.com/package/tree-model#walk-the-tree). You can use this to `require()` the files and metadata exported by your page components:

    ```js
    // pages/_app.js
    import {root} from 'next-pages/app'
    const context = require.context('.', true, /\.(js|md)x?$/)
    root.walk(node => node.component = context(node.file))
    ```

    **Note:** you will need to call `require.context('.', ...)` from the `pages` directory for this to work properly!

[tree-model]: https://www.npmjs.com/package/tree-model
[withRouter]: https://github.com/zeit/next.js/#using-a-higher-order-component
