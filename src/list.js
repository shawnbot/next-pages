import {join} from 'path'
import {NEXT_PROJECT_ROOT} from 'next/constants'

const PAGES_DIR = join(NEXT_PROJECT_ROOT, 'pages')
// .md, .mdx, .js, .jsx
const DEFAULT_PAGE_PATTERN = /\.(md|js)x?$/
const INDEX_SUFFIX = '/index'
const INDEX_PATTERN = /\/index(\.[a-z]+)?$/

export function getPageList(options = {}) {
  const {
    dir = PAGES_DIR,
    pattern = DEFAULT_PAGE_PATTERN
  } = options
  const [req, files] = getContext({dir, pattern})
  return files.map(file => ({
    file,
    path: getPath(file),
    component: req(file)
  }))
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


function pathSort(a, b) {
  return a.path.localeCompare(b.path)
}
