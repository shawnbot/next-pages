const getPages = require('./dist/config')
const withPlugins = require('next-compose-plugins')
const mdx = require('@zeit/next-mdx')

const pageExtensions = ['js', 'md', 'mdx']

module.exports = withPlugins([
  mdx({extension: /\.mdx?$/})
], {
  pageExtensions,

  publicRuntimeConfig: {
    pages: getPages({pageExtensions})
  },

  webpack(config) {
    config.resolve.alias['next-pages'] = __dirname
    return config
  }
})
