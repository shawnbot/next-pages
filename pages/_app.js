import React from 'react'
import App, {Container} from 'next/app'
import {pages, root} from 'next-pages/app'

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
        <div className="m-4 markdown-body">
          <h1>Path: <tt>{router.pathname}</tt></h1>
          <main>
            <Component {...pageProps} />
          </main>

          <h2>Tree</h2>
          <Tree node={root} />

          <h2>List</h2>
          <ul>
            {pages.map(node => <li key={node.path}><NavLink node={node} /></li>)}
          </ul>

        </div>
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
            <li role="presentation" key={child.path}>
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
