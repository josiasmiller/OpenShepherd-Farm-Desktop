import {
  alpha,
  buttonBaseClasses,
  chipClasses,
  iconButtonClasses,
  svgIconClasses,
  typographyClasses
} from '@mui/material';
import { ThemeOptions } from '@mui/material/styles';

const themeOptions: ThemeOptions = {
  palette: {
    mode: 'light',
    primary: {
      main: '#3DAFB9',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#7f9597',
    },
    error: {
      main: '#ff5449',
    },
    info: {
      main: '#8491AD',
    },
    success: {
      main: '#c6e9be',
      contrastText: '#000000',
    },
    warning: {
      main: '#ffaa7b',
    },
  },
  typography: {
    fontFamily: 'Roboto Mono',
  },
  components: {
    MuiAppBar: {
      defaultProps: {
        color: 'inherit'
      },
      styleOverrides: {
        colorInherit: {
          backgroundColor: '#689f38',
          color: '#fff',
        },
      }
    },
    MuiList: {
      styleOverrides: {
        root: {
          padding: '8px',
          display: 'flex',
          flexDirection: 'column',
          gap: 0,
        },
      },
    },
    MuiListItem: {
      styleOverrides: {
        root: ({ theme }) => ({
          [`& .${svgIconClasses.root}`]: {
            width: '24px',
            height: '24px',
            color: (theme.vars || theme).palette.text.secondary,
          },
          [`& .${typographyClasses.root}`]: {
            fontWeight: 500,
          },
          [`& .${buttonBaseClasses.root}`]: {
            display: 'flex',
            gap: 8,
            padding: '2px 8px',
            borderRadius: (theme.vars || theme).shape.borderRadius,
            opacity: 0.7,
            '&.Mui-selected': {
              opacity: 1,
              backgroundColor: alpha(theme.palette.action.selected, 0.3),
              [`& .${svgIconClasses.root}`]: {
                color: (theme.vars || theme).palette.text.primary,
              },
              '&:focus-visible': {
                backgroundColor: alpha(theme.palette.action.selected, 0.3),
              },
              '&:hover': {
                backgroundColor: alpha(theme.palette.action.selected, 0.5),
              },
            },
            '&:focus-visible': {
              backgroundColor: 'transparent',
            },
          },
        }),
      },
    },
    MuiListItemText: {
      styleOverrides: {
        primary: ({ theme }) => ({
          fontSize: theme.typography.body1.fontSize,
          fontWeight: 500,
          lineHeight: theme.typography.body1.lineHeight,
        }),
        secondary: ({ theme }) => ({
          fontSize: theme.typography.caption.fontSize,
          lineHeight: theme.typography.caption.lineHeight,
        }),
      },
    },
    MuiListSubheader: {
      styleOverrides: {
        root: ({ theme }) => ({
          backgroundColor: 'transparent',
          padding: '4px 8px',
          fontSize: theme.typography.caption.fontSize,
          fontWeight: 500,
          lineHeight: theme.typography.caption.lineHeight,
        }),
      },
    },
    MuiListItemIcon: {
      styleOverrides: {
        root: {
          minWidth: 0,
        },
      },
    },
    MuiTablePagination: {
      styleOverrides: {
        actions: {
          display: 'flex',
          gap: 8,
          marginRight: 6,
          [`& .${iconButtonClasses.root}`]: {
            minWidth: 0,
            width: 36,
            height: 36,
          },
        },
      },
    },
    MuiIcon: {
      defaultProps: {
        fontSize: 'small',
      },
      styleOverrides: {
        root: {
          variants: [
            {
              props: {
                fontSize: 'small',
              },
              style: {
                fontSize: '1rem',
              },
            },
          ],
        },
      },
    },
  },
};

export default themeOptions;
