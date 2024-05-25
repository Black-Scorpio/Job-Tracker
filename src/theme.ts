import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  typography: {
    fontFamily: 'Space Mono, serif',
    body1: {
      fontFamily: 'Space Mono, serif',
    },
    h4: {
      fontFamily: 'Space Mono, serif',
    },
    button: {
      fontFamily: 'Space Mono, serif',
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: `
        body {
          font-family: 'Space Mono', serif;
        }
      `,
    },
  },
});

export default theme;
