import { createTheme, ThemeOptions } from "@mui/material/styles";

// Unified color palette matching Tailwind config
export const themeColors = {
  primary: {
    main: "#FFD001",
    50: "#FFFFD4",
    75: "#FFFC7F",
    100: "#FFF22A",
    200: "#FFD001",
    300: "#EDC000",
    400: "#D3AC00",
    500: "#BF9C01",
  },
  secondary: {
    main: "#191919",
    50: "#F8F8F8",
    75: "#AAAAAA",
    100: "#707070",
    200: "#2D2D2D",
    300: "#202020",
    400: "#191919",
    500: "#101010",
  },
  success: {
    main: "#2AC534",
    50: "#EAF9EB",
    75: "#DFF6E1",
    100: "#BDEDC0",
    200: "#2AC534",
    300: "#26B12F",
    400: "#229E2A",
    500: "#209427",
  },
  warning: {
    main: "#FF7803",
    50: "#FFF2E6",
    75: "#FFEBD9",
    100: "#FFD5B1",
    200: "#FF7803",
    300: "#E66C03",
    400: "#CC6002",
    500: "#BF5A02",
  },
  error: {
    main: "#F1005D",
    50: "#FDEAEF",
    75: "#FCDFE7",
    100: "#F9BECE",
    200: "#FB374B",
    300: "#ED2C62",
    400: "#BE234E",
    500: "#B2214A",
  },
  info: {
    main: "#3B82F6",
    50: "#EAF8FF",
    75: "#A0D4FF",
    100: "#5BA0FB",
    200: "#3B82F6",
    300: "#326EDF",
    400: "#295AC6",
    500: "#1A3891",
  },
  neutral: {
    main: "#7A7A7A",
    50: "#F7F7F7",
    75: "#EBEBEB",
    100: "#DCDCDC",
    200: "#A0A0A0",
    300: "#909090",
    400: "#767676",
    500: "#5C5C5C",
  },
  black: "#2D2D2D",
  white: "#FFF",
} as const;

// Create MUI theme that matches Tailwind
export const createUnifiedTheme = (isDarkMode: boolean = false) => {
  return createTheme({
    palette: {
      mode: isDarkMode ? "dark" : "light",
      primary: {
        main: themeColors.primary.main,
        light: themeColors.primary[100],
        dark: themeColors.primary[400],
        contrastText: themeColors.black,
      },
      secondary: {
        main: themeColors.secondary.main,
        light: themeColors.secondary[50],
        dark: themeColors.secondary[500],
        contrastText: themeColors.white,
      },
      success: {
        main: themeColors.success.main,
        light: themeColors.success[100],
        dark: themeColors.success[400],
        contrastText: themeColors.white,
      },
      warning: {
        main: themeColors.warning.main,
        light: themeColors.warning[100],
        dark: themeColors.warning[400],
        contrastText: themeColors.black,
      },
      error: {
        main: themeColors.error.main,
        light: themeColors.error[100],
        dark: themeColors.error[400],
        contrastText: themeColors.white,
      },
      info: {
        main: themeColors.info.main,
        light: themeColors.info[100],
        dark: themeColors.info[400],
        contrastText: themeColors.white,
      },
      background: {
        default: isDarkMode ? themeColors.secondary[400] : themeColors.white,
        paper: isDarkMode ? themeColors.secondary[300] : themeColors.white,
      },
      text: {
        primary: isDarkMode ? themeColors.white : themeColors.black,
        secondary: isDarkMode ? themeColors.secondary[75] : themeColors.secondary[200],
        disabled: isDarkMode ? themeColors.secondary[100] : themeColors.neutral[200],
      },
    },
    typography: {
      fontFamily: ["var(--font-primary)", "var(--font-inter)", "sans-serif"].join(", "),
      h1: {
        fontSize: "3.125rem",
        lineHeight: "3rem",
        letterSpacing: "0em",
      },
      h2: {
        fontSize: "2rem",
        lineHeight: "2.5rem",
        letterSpacing: "0em",
      },
      h3: {
        fontSize: "1.625rem",
        lineHeight: "1.5rem",
        letterSpacing: "0em",
      },
      h4: {
        fontSize: "1.5rem",
        lineHeight: "2rem",
        letterSpacing: "0em",
      },
      h5: {
        fontSize: "1.25rem",
        lineHeight: "1.5rem",
        letterSpacing: "0em",
      },
      h6: {
        fontSize: "1.125rem",
        lineHeight: "1.375rem",
        letterSpacing: "0em",
      },
      body1: {
        fontSize: "1rem",
        lineHeight: "1.5rem",
        letterSpacing: "0em",
      },
      body2: {
        fontSize: "0.875rem",
        lineHeight: "1.25rem",
        letterSpacing: "0em",
      },
    },
    shape: {
      borderRadius: 6, // 0.375rem = 6px (button-rounding from your config)
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: "0.375rem", // button-rounding
            textTransform: "none", // Keep original text case
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            "& .MuiOutlinedInput-root": {
              borderRadius: "0.375rem", // input-rounding
              // Style calendar picker icons for date/datetime-local inputs (Chrome/Safari/Edge)
              "& input[type='date']::-webkit-calendar-picker-indicator": {
                cursor: "pointer",
                opacity: 0.9,
                filter: isDarkMode ? "invert(1) brightness(1.5)" : "invert(0) brightness(0.8)",
              },
              "& input[type='datetime-local']::-webkit-calendar-picker-indicator": {
                cursor: "pointer",
                opacity: 0.9,
                filter: isDarkMode ? "invert(1) brightness(1.5)" : "invert(0) brightness(0.8)",
              },
              // Firefox support
              "& input[type='date']::-moz-calendar-picker-indicator": {
                cursor: "pointer",
                opacity: 0.9,
                filter: isDarkMode ? "invert(1) brightness(1.5)" : "invert(0) brightness(0.8)",
              },
              "& input[type='datetime-local']::-moz-calendar-picker-indicator": {
                cursor: "pointer",
                opacity: 0.9,
                filter: isDarkMode ? "invert(1) brightness(1.5)" : "invert(0) brightness(0.8)",
              },
            },
          },
        },
      },
    },
  });
};
