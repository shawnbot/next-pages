export default function getContext({dir, pattern}) {
  if (typeof require.context === 'function') {
    const context = require.context(dir, true, pattern)
    return [context, context.keys()]
  } else {
    const klawSync = require('klaw-sync')
    const files = klawSync(dir).filter(item => pattern.test(item.path))
    return [
      path => require(join(dir, path)),
      files
    ]
  }
}
