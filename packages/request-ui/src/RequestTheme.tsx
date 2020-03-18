import { createMuiTheme } from '@material-ui/core/styles';

export const theme = createMuiTheme({
  palette: {
    action: {
      disabled: '#656565',
      disabledBackground: '#E4E4E4',
    },
    common: {
      black: '#050B20',
    },
    primary: {
      main: '#00CC8E',
    },
    secondary: {
      main: '#001E26',
    },
  },
  typography: {
    fontFamily: "'Inter', sans-serif",
    body1: {
      fontWeight: 'normal',
      fontSize: 12,
      lineHeight: '16px',
    },
    body2: {
      fontWeight: 'normal',
      fontSize: 14,
      lineHeight: '20px',
    },
    caption: {
      fontWeight: 'normal',
      fontSize: 16,
      lineHeight: '24px',
    },
    subtitle1: {
      fontWeight: 'normal',
      fontSize: 20,
      lineHeight: '32px',
    },
    h1: {
      fontWeight: 600,
      fontSize: 40,
      lineHeight: '60px',
    },
    h2: {
      fontWeight: 600,
      fontSize: 32,
      lineHeight: '48px',
    },
    h3: {
      fontWeight: 600,
      fontSize: 24,
      lineHeight: '36px',
    },
    h4: {
      fontWeight: 600,
      fontSize: 16,
      lineHeight: '24px',
    },
    h5: {
      fontWeight: 600,
      fontSize: 14,
      lineHeight: '20px',
    },
    h6: {
      fontWeight: 600,
      fontSize: 12,
      lineHeight: '16px',
    },
  },
  overrides: {
    MuiCssBaseline: {
      '@global': {
        html: {
          height: '100%',
        },
        body: {
          height: '100%',
        },
        '#root': {
          height: '100%',
        },
      },
    },
    MuiButton: {
      root: {
        textTransform: 'none',
        fontSize: '16px',
      },
    },
    MuiTypography: {},
    MuiDialogContentText: {
      root: {
        marginTop: 0,
        textTransform: 'initial',
      },
    },
    MuiDialogTitle: {
      root: {},
    },
  },
});
