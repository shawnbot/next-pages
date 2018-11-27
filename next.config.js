const getPages = require('./src/config')
const withPlugins = require('next-compose-plugins')
const mdx = require('@zeit/next-mdx')

const pageExtensions = ['js', 'md', 'mdx']

module.exports = withPlugins([
  mdx({extension: /\.mdx?$/})
], {
  pageExtensions,
  publicRuntimeConfig: {
    pages: getPages({pageExtensions})
  }
})
