import React from 'react'
import App, {Container} from 'next/app'
import {pages, root} from 'next-pages/app'

const context = require.context('.', true, /.(js|md)x?$/)
for (const page of pages) {
  page.component = context(page.file)
}

export default class extends App {
  render() {
    const {Component, router} = this.props
    const current = pages.find(node => node.path === router.pathname)
    return (
      <Container>
        <div className="m-4 markdown-body">
          <h1><tt>{router.pathname}</tt></h1>

          <h2>Current</h2>
          {current ? (
            <ul>
              <li><b>path</b>: <tt>{current.path}</tt></li>
              <li><b>file</b>: <tt>{current.file}</tt></li>
              <li><b>component:</b> <tt>{typeof current.component}</tt></li>
            </ul>
          ) : null}

          <main>
            <h2>Content</h2>
            <Component />
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
