const getPages = require('./config')

module.exports = function pagesPlugin(nextConfig = {}) {
  return Object.assign(nextConfig, {
    publicRuntimeConfig: Object.assign({}, nextConfig.publicRuntimeConfig, {
      pages: getPages(nextConfig)
    })
  })
}
