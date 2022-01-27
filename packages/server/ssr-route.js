import { Router } from "express";
import { CacheProvider } from '@emotion/react'
import createEmotionServer from '@emotion/server/create-instance';
import { ChunkExtractor } from '@loadable/server'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import { CssBaseline } from "@mui/material";
import React from "react";
import ReactDomServer from 'react-dom/server'
import App from 'Server/Remote/App'
import Theme from 'Server/Remote/Theme'
import Cache from 'Server/Remote/Cache'

const ssrRoute = Router();
const nodeStats = path.resolve(__dirname, '../../build/server/loadable-stats.json')
const webStats = path.resolve(__dirname, '../../build/public/web/loadable-stats.json')

ssrRoute.route("/*").get((req, res) => {
  let cache = Cache(true, false);
  let theme = Theme;
  const { extractCriticalToChunks, constructStyleTagsFromChunks } = createEmotionServer(cache)

  const nodeExtractor = new ChunkExtractor({ statsFile: nodeStats })
  const webExtractor = new ChunkExtractor({ statsFile: webStats })
  const muiTheme = createTheme(theme);
  const html = ReactDomServer.renderToString((nodeExtractor.collectChunks(
    <CacheProvider value={cache}>
      <ThemeProvider theme={muiTheme}>
        <CssBaseline />
        <App />
      </ThemeProvider>
    </CacheProvider>)))
  const emotionCss = constructStyleTagsFromChunks(extractCriticalToChunks(html));

  res.set('content-type', 'text/html')
  res.send(renderFullPage(html, emotionCss, webExtractor.getLinkTags(), webExtractor.getScriptTags()))
})

function renderFullPage(html, css, link, script) {
  return `
      <!DOCTYPE html>
      <html>
        <head>
          <title>My page</title>
          ${css}
          <meta name="viewport" content="initial-scale=1, width=device-width" />
          <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" />
        </head>
        <body>
          <div id="main">${html}</div>
          ${script}
        </body>
      </html>
    `;
}

export default ssrRoute;