const withPlugins = require('next-compose-plugins')
const mdx = require('@zeit/next-mdx')
const pages = require('./dist/plugin')

module.exports = withPlugins([
  mdx({extension: /\.mdx?$/}),
  pages
], {
  pageExtensions: ['js', 'md', 'mdx'],
  webpack(config) {
    config.resolve.alias['next-pages'] = __dirname
    return config
  }
})
