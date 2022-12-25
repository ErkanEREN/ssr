import React from 'react'
import { hydrate } from 'react-dom'
import loadable, { loadableReady } from '@loadable/component'
import { CacheProvider } from '@emotion/react'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import theme from './theme'
import { CssBaseline } from "@mui/material";
const App= loadable(() => import("./App"));
loadableReady(() => {
  const cache = theme.createEmotionCache(true, true)
  const root = document.getElementById('main')
  hydrate(
    <CacheProvider value={cache}>
      <ThemeProvider theme={createTheme(theme.variables)}>
        <CssBaseline />
        <App />
      </ThemeProvider>
    </CacheProvider>, root);
  console.log("hydrated")
})
