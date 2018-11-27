const klaw = require('klaw-sync')
const {join} = require('path')

const IGNORE_PATTERN = /\/_/
const DEFAULT_PAGE_EXTENSIONS = ['js', 'jsx']

module.exports = function getPages(options = {}) {
  const {
    dir = join(process.cwd(), 'pages'),
    pageExtensions = DEFAULT_PAGE_EXTENSIONS
  } = options

  const pattern = new RegExp(`\.(${pageExtensions.join('|')})$`)
  const match = ({path}) => !IGNORE_PATTERN.test(path) && pattern.test(path)

  return klaw(dir)
    .filter(match)
    .map(item => item.path.substr(dir.length))
}
