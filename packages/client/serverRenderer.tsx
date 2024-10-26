import { CacheProvider } from '@emotion/react'
import createEmotionServer from '@emotion/server/create-instance';
import { ThemeProvider, createTheme } from '@mui/material/styles'
import { CssBaseline } from "@mui/material";
import React from "react";
import ReactDomServer from 'react-dom/server'
import App from '@tomi/client/App'
import Theme from '@tomi/client/theme'

const serverRenderer = {
  all: {
    method: 'get',
    handler: () => {
      const cache = Theme.createEmotionCache(true, false);
      const { extractCriticalToChunks, constructStyleTagsFromChunks } = createEmotionServer(cache)

      const muiTheme = createTheme(Theme.variables);
      const html = ReactDomServer.renderToString((
        <CacheProvider value={cache}>
          <ThemeProvider theme={muiTheme}>
            <CssBaseline />
            <App />
          </ThemeProvider>
        </CacheProvider>))
      const emotionCss = constructStyleTagsFromChunks(extractCriticalToChunks(html));

      const renderFullPage = (html: string, css: string) => {
        return `
      <!DOCTYPE html>
      <html lang="en">
        <head>
            <meta charset="utf-8">
            <title>My page</title>
            ${css}
            <meta name="viewport" content="initial-scale=1, width=device-width" />
        </head>
        <body>
            <div id="main">${html}</div>
        </body>
      </html>`;
      }

      // res.set('content-type', 'text/html')
      // res.send(renderFullPage(html, emotionCss, webExtractor.getLinkTags(), webExtractor.getScriptTags()))
      return renderFullPage(html, emotionCss);
    }
  }
}

export default serverRenderer;
