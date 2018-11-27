import TreeModel from 'tree-model'

const INDEX_PATTERN = /\/index(\.[a-z]+)?$/

export default function getPageTree(pages) {
  const map = nest(pages)
  const tree = new TreeModel()
  const root = tree.parse(map)
  root.walk(node => {
    const {model} = node
    for (const [key, val] of Object.entries(model)) {
      if (!node.hasOwnProperty(key)) {
        node[key] = val
      }
    }
    delete node.model
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

function pathSort(a, b) {
  return a.path.localeCompare(b.path)
}
