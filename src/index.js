import React from 'react'
import {withRouter} from 'next/router'
import getConfig from 'next/config'
import getPageTree from './tree'

const INDEX_SUFFIX = '/index'

// this is the raw list of page filenames relative to ./pages
const entries = (getConfig().publicRuntimeConfig.pages || [])
  .map(file => ({
    file: '.' + file,
    path: getPath(file)
  }))

export const root = getPageTree(entries)
export const pages = root.all(node => true)

export function withPages(Component) {
  return withRouter(props => <Component {...props} pages={pages} />)
}

export function withPageTree(Component) {
  return withRouter(props => <Component {...props} pageTree={root} />)
}

function getPath(file) {
  // strip the last "." and filename extension (".js", etc.)
  const path = file.substr(0, file.lastIndexOf('.'))
  // "/index" === "/"
  if (path === INDEX_SUFFIX) {
    return '/'
  } else {
    // strip the trailing "/index" part
    return path.endsWith(INDEX_SUFFIX)
      ? path.substr(0, path.length - INDEX_SUFFIX.length)
      : path
  }
}
