import TreeModel from 'tree-model'
import getPageList from './list'

export default function getPageTree(options) {
  const pages = getPageList(options)
  const map = nest(pages)
  const tree = new TreeModel()
  const root = tree.parse(map)
  root.walk(node => {
    const {model} = node
    for (const key of Object.keys(model)) {
      if (!node.hasOwnProperty(key)) {
        node[key] = model[key]
      }
    }
    delete node.model
    node.ancestors = node.getPath().reverse()
    node.lineage = [node, ...ancestors]
    node.depth = node.ancestors.length
  })
  return root
}

function nest(pages) {
  const nodeMap = {}
  const nodes = pages.sort(pathSort).map(page => {
    const {file, path} = page
    const keys = path.substr(1).split('/')
    return nodeMap[path] = {
      path,
      file,
      isIndex: INDEX_PATTERN.test(file),
      parent: '/' + keys.slice(0, keys.length - 1).join('/'),
      children: []
    }
  })

  let root = nodeMap['/']
  if (root) {
    nodes.splice(nodes.indexOf(root), 1)
  } else {
    console.warn('no root node found in:', nodeMap)
    root = {path: '/', parent: null, children: []}
  }

  const rest = []
  while (nodes.length) {
    const node = nodes.shift()
    const parent = nodeMap[node.parent]
    if (parent) {
      parent.children.push(node)
    } else {
      rest.push(node)
    }
  }

  if (rest.length) {
    console.warn('unable to nest some pages:', rest)
  }

  return root
}
