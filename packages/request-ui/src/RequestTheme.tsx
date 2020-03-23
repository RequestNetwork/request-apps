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
      main: '#001E26',
    },
    secondary: {
      main: '#00CC8E',
    },
    text: {
      primary: '#050B20',
      secondary: '#656565',
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
      fontSize: 56,
      lineHeight: '84px',
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
  props: {
    MuiButton: {
      disableElevation: true,
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
        minWidth: 158,
        minHeight: 56,
        overflow: 'hidden',
      },
      label: {
        fontWeight: 600,
        fontSize: 16,
        lineHeight: '24px',
      },
      contained: {
        padding: '16px 24px',
        backgroundColor: '#fff',
        border: '1px solid #E4E4E4',
        boxSizing: 'border-box',
        borderRadius: 4,
        '&:hover': {
          backgroundColor: '#F7F7F7',
        },
      },
      containedPrimary: {
        minWidth: 280,
        height: 80,
        '&:hover': {
          boxShadow: '0px 5px 5px rgba(0, 30, 38, 0.3) !important',
          backgroundColor: '#001E26',
        },
        '& .MuiTouchRipple-rippleVisible': {
          backgroundColor: '#050B20',
          animation: 'unset',
          opacity: 0,
          '& .MuiTouchRipple-child': {
            display: 'none',
          },
        },
        border: 0,
      },
      containedSecondary: {
        padding: '20px 32px',
        height: 64,
        '&:hover': {
          boxShadow: '0px 5px 5px rgba(0, 30, 38, 0.3)',
        },
        border: 0,
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
    MuiTextField: {
      root: {
        '& > *': {
          fontSize: 14,
        },
      },
    },
    MuiInputLabel: {
      asterisk: {
        display: 'none',
      },
    },
    MuiInput: {
      root: {
        fontSize: 14,
        '&:before': {
          borderBottom: '1px solid #E4E4E4 !important',
        },
      },
    },
  },
});
