import { CacheProvider } from '@emotion/react'
import createEmotionServer from '@emotion/server/create-instance';
import { ChunkExtractor } from '@loadable/server'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import { CssBaseline } from "@mui/material";
import path from 'path'
import React from "react";
import ReactDomServer from 'react-dom/server'
import App from '@tomi/client/App'
import Theme from '@tomi/client/theme'

// const serverRenderer = Router();
const nodeStats = path.resolve(__dirname, '../../build/server/loadable-stats.json')
const webStats = path.resolve(__dirname, '../../build/public/web/loadable-stats.json')


const serverRenderer = {
  all: {
    method: 'get',
    handler: (req, res) => {
      const cache = Theme.createEmotionCache(true, false);
      const { extractCriticalToChunks, constructStyleTagsFromChunks } = createEmotionServer(cache)

      const nodeExtractor = new ChunkExtractor({ statsFile: nodeStats })
      const webExtractor = new ChunkExtractor({ statsFile: webStats })
      const muiTheme = createTheme(Theme.variables);
      const html = ReactDomServer.renderToString((nodeExtractor.collectChunks(
        <CacheProvider value={cache}>
          <ThemeProvider theme={muiTheme}>
            <CssBaseline />
            <App />
          </ThemeProvider>
        </CacheProvider>)))
      const emotionCss = constructStyleTagsFromChunks(extractCriticalToChunks(html));

      const renderFullPage = (html, css, link, script) => {
        return `
      <!DOCTYPE html>
      <html lang="en">
        <head>
            <meta charset="utf-8">
            <title>My page</title>
            ${css}
            <link rel="shortcut icon" href="#">
            <meta name="viewport" content="initial-scale=1, width=device-width" />
        </head>
        <body>
            <div id="main">${html}</div>
            ${script}
            <!--{JSON.stringify(link,null,2)}-->
        </body>
      </html>`;
      }

      // res.set('content-type', 'text/html')
      // res.send(renderFullPage(html, emotionCss, webExtractor.getLinkTags(), webExtractor.getScriptTags()))
      return renderFullPage(html, emotionCss, webExtractor.getLinkTags(), webExtractor.getScriptTags());
    }
  }
}

export default serverRenderer;