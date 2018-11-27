import Document, {Main, NextScript} from 'next/document'

export default class extends Document {
  render() {
    return (
      <html lang="en">
        <head>
          <title>next-pages</title>
          <meta charSet="utf8" />
          <link rel="stylesheet" href="https://unpkg.com/primer/build/build.css" />
        </head>
        <body>
          <Main />
          <NextScript />
        </body>
      </html>
    )
  }
}
