import React from 'react'
import getConfig from 'next/config'
import getPageTree from './tree'

const INDEX_SUFFIX = '/index'
const entries = getConfig().publicRuntimeConfig.pages || []

export const pages = entries.map(file => ({
  file: '.' + file,
  path: getPath(file)
}))

export const root = getPageTree(pages)

export function withPages(Component) {
  return props => <Component {...props} pages={pages} />
}

export function withPageTree(Component) {
  return props => <Component {...props} pageTree={getPageTree(pages)} />
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
