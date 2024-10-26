import React from 'react'
import  { hydrateRoot } from 'react-dom/client';
import { CacheProvider } from '@emotion/react'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import theme from './theme'
import { CssBaseline } from "@mui/material";
import App from './App';

const cache = theme.createEmotionCache(true, true)
const theThema = createTheme(theme.variables)
function Main() {
  return (
    <CacheProvider value={cache}>
      <ThemeProvider theme={theThema}>
        {/* CssBaseline kickstart an elegant, consistent, and simple baseline
            to build upon. */}
        <CssBaseline />
        <App />
      </ThemeProvider>
    </CacheProvider>
  );
}
const main = document.getElementById('main')
hydrateRoot(main, <Main />);
