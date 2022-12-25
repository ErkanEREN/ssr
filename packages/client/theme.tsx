import { red } from '@mui/material/colors';
import createCache from '@emotion/cache';

// Create a theme instance.
const Theme = {
  variables: {
    palette: {
      primary: {
        main: '#d06420',
      },
      secondary: {
        main: '#420d06',
      },
      error: {
        main: red.A400,
      },
    },
    components: {
      // Name of the component
      MuiButtonBase: {
        defaultProps: {
          // The props to change the default for.
          disableRipple: true, // No more ripple!
        },
      },
    }
  },
  createEmotionCache: (prepend = false, speedy = true) => {
    return createCache({ key: 'tomi', prepend, speedy });
  }
};


export default Theme;
