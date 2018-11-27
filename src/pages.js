import React from 'react'
import {withRouter} from 'next/router'

const PAGES_DIR = 'pages'
const INDEX_SUFFIX = '/index'
const FILE_PATTERN = /\.(js|md)x?$/

let pages

export function withPages(Component) {
  return props => {
    if (typeof window !== 'undefined' && !pages) {
      const context = require.context(PAGES_DIR, true, FILE_PATTERN)
      console.warn('context:', context.keys())
      pages = context.keys().map(key => ({
        file: key,
        path: getPath(key),
        component: context(key)
      }))
    }
    return <Component {...props} pages={pages} />
  }
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
