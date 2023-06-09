import { createTheme } from "@mui/material";

export const muiColors = createTheme({
    palette: {
      dokusoBlack: {
        main: '#262626',
      },
      dokusoWhite: {
        main: '#FAFAFA',
      },
      dokusoGreen: {
        main: '#57FA3E',
      },
      dokusoOrange: {
        main: '#FAB332',
      },
      dokusoBlue: {
        main: '#318AFA',
      },
      dokusoPink: {
        main: '#FA39BE',
      },
    },
    breakpoints: { // same as tailwind
      values: {
        xs: 0,
        sm: 640,
        md: 768,
        lg: 1024,
        xl: 1280,
        xxl: 1536
      },
    },
  });


