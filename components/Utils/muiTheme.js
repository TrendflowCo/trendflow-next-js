import { createTheme } from "@mui/material";

export const muiColors = createTheme({
    palette: {
      trendflowBlack: {
        main: '#262626',
      },
      trendflowWhite: {
        main: '#FAFAFA',
      },
      trendflowGreen: {
        main: '#57FA3E',
      },
      trendflowOrange: {
        main: '#FAB332',
      },
      trendflowBlue: {
        main: '#318AFA',
      },
      trendflowPink: {
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


