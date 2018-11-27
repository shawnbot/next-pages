import React from 'react'
import App, {Container} from 'next/app'
import {withRouter} from 'next/router'
import {pages, root} from '../src'

export default class extends App {
  static async getInitialProps({Component, ctx}) {
    return {
      pageProps: Component.getInitialProps ? await Component.getInitialProps(ctx) : {}
    }
  }

  render() {
    const {Component, pageProps, router} = this.props
    return (
      <Container>
        <h1>Path: <tt>{router.pathname}</tt></h1>
        <nav>
          <Tree node={root} />
        </nav>
        <main>
          <Component {...pageProps} />
        </main>
      </Container>
    )
  }
}

function Tree({node, depth = 0, link: Link = NavLink, ...rest}) {
  return (
    <>
      <Link node={node} {...rest} />
      {node.children.length ? (
        <ul role="presentation">
          {node.children.map(child => (
            <li role="presentation">
              <Tree node={child} {...rest} depth={depth + 1} />
            </li>
          ))}
        </ul>
      ) : null}
    </>
  )
}

function NavLink({node, ...rest}) {
  return <a href={node.path} {...rest}>{node.path}</a>
}
