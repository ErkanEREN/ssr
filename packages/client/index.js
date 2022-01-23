import 'core-js'
import React from 'react'
import { hydrate } from 'react-dom'
// eslint-disable-next-line import/no-extraneous-dependencies
import loadable, { loadableReady } from '@loadable/component'
import { CacheProvider } from '@emotion/react'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import theme from '@workspace/common/theme'
import createEmotionCache from '@workspace/common/createEmotionCache'
import { CssBaseline } from "@mui/material";
const App= loadable(() => import("./App"));
loadableReady(() => {
  const cache = createEmotionCache()
  const root = document.getElementById('main')
  hydrate(
    <CacheProvider value={cache}>
      <ThemeProvider theme={createTheme(theme)}>
        <CssBaseline />
        <App />
      </ThemeProvider>
    </CacheProvider>, root);
  console.log("hydrated")
})