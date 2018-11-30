import React from 'react'
import App, {Container} from 'next/app'
import {pages, root} from '../src'

const context = require.context('.', true, /\.(js|md)x?$/)
root.walk(node => node.component = context(node.file))

export default class extends App {
  render() {
    const {Component, router} = this.props
    const current = root.first(node => node.path === router.pathname)
    return (
      <Container>
        <div className="m-4 markdown-body">
          <h2><tt>{router.pathname}</tt></h2>

          <h3>Current</h3>
          {current ? (
            <ul>
              <li><b>path</b>: <tt>{current.path}</tt></li>
              <li><b>file</b>: <tt>{current.file}</tt></li>
              <li><b>meta:</b> <tt>{JSON.stringify(current.component.meta)}</tt></li>
            </ul>
          ) : <p className="flash flash-warn">no current!</p>}

          <main>
            <h3>Content</h3>
            <Component />
          </main>

          <h3>Tree</h3>
          <Tree node={root} />

          <h3>List</h3>
          <ul>
            {pages.map(node => <li key={node.path}><NavLink node={node} /></li>)}
          </ul>

        </div>
      </Container>
    )
  }
}

function Tree({node, link: Link = NavLink, ...rest}) {
  return (
    <>
      <Link node={node} {...rest} />
      {node.children.length ? (
        <ul role="presentation">
          {node.children.map(child => (
            <li role="presentation" key={child.path}>
              <Tree node={child} {...rest} />
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
