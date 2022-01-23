import { red } from '@mui/material/colors';

// Create a theme instance.
const theme = {
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
  },

};

export default theme;