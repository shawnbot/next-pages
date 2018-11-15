import React from 'react'
import {withRouter} from 'next/router'
import memoize from 'memoize'

const getPageTree = memoize(require('./tree'))
const getPageList = memoize(require('./list'))

export function withPageTree(Component, options) {
  return withRouter(({pageOptions = options, ...rest}) => {
    const tree = getPageTree(options)
    const currentPath = rest.router.pathname || '/'
    tree.walk(page => updatePageStatus(page, currentPath))
    return <Component {...rest} pageTree={tree} />
  })
}

export function withPageList(Component, options) {
  return withRouter(({pageOptions = options, ...rest}) => {
    const list = getPageList(pageOptions)
    const currentPath = rest.router.pathname || '/'
    for (const page of list) {
      updatePageStatus(page, currentPath)
    }
    return <Component {...rest} pageList={list} />
  })
}

export function withCurrentPage(Component, options) {
  return withPageTree(props => {
    const {router, pageTree} = props
    const currentPage = pageTree.find(page => page.path === router.pathname)
    return <Component {...props} currentPage={currentPage} />
  }, options)
}

export {getPageTree, getPageList}

function updatePageStatus(page, currentPath) {
  page.active = currentPath.startsWith(page.path)
  page.selected = page.path === currentPath
}
