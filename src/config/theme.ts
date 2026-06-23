import { createTheme } from "@mui/material/styles";

// Unified color palette matching Tailwind config
export const themeColors = {
  primary: {
    main: "#FFFFFF",
    50: "#FDFCFB",
    75: "#F8F7F4",
    100: "#F2F1ED",
    200: "#FFFFFF",
    300: "#EBEAE6",
    400: "#D8D6D0",
    500: "#C4C2BB",
  },
  secondary: {
    main: "#1C1C1E",
    50: "#F5F5F5",
    75: "#D1D1D1",
    100: "#9CA3AF",
    200: "#6B7280",
    300: "#3F3F46",
    400: "#1C1C1E",
    500: "#0A0A0B",
  },
  tertiary: {
    main: "#B8963E",
    50: "#FBF6EB",
    75: "#F3E6C8",
    100: "#E5C97A",
    200: "#B8963E",
    300: "#9A7B32",
    400: "#7D6328",
    500: "#5C481C",
  },
  belt: {
    white: "#FFFFFF",
    yellow: "#D4A017",
    orange: "#D35400",
    green: "#1B6B4A",
    blue: "#1E40AF",
    purple: "#5B21B6",
    brown: "#6B4423",
    black: "#0A0A0B",
  },
  success: {
    main: "#1B7F3A",
    50: "#EAF9EB",
    75: "#DFF6E1",
    100: "#BBE6C8",
    200: "#1B7F3A",
    300: "#186F33",
    400: "#145D2B",
    500: "#104A21",
  },
  warning: {
    main: "#C45A00",
    50: "#FFF2E6",
    75: "#FFEBD9",
    100: "#F5CCA7",
    200: "#C45A00",
    300: "#AA4E00",
    400: "#8D4100",
    500: "#723500",
  },
  error: {
    main: "#B42318",
    50: "#FDECEA",
    75: "#F8DDD9",
    100: "#F1BFB8",
    200: "#B42318",
    300: "#9E1F15",
    400: "#861911",
    500: "#6E140E",
  },
  info: {
    main: "#1D4ED8",
    50: "#EAF8FF",
    75: "#A0D4FF",
    100: "#5BA0FB",
    200: "#1D4ED8",
    300: "#1A45BF",
    400: "#163BA4",
    500: "#112D79",
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
  black: "#141414",
  white: "#FFFFFF",
} as const;

// Create MUI theme that matches Tailwind
export const createUnifiedTheme = (isDarkMode: boolean = false) => {
  return createTheme({
    palette: {
      mode: isDarkMode ? "dark" : "light",
      primary: {
        main: themeColors.tertiary.main,
        light: themeColors.tertiary[100],
        dark: themeColors.tertiary[400],
        contrastText: themeColors.secondary[500],
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
        default: isDarkMode ? themeColors.secondary[400] : themeColors.primary[50],
        paper: isDarkMode ? themeColors.secondary[300] : themeColors.primary[200],
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
          contained: {
            backgroundColor: themeColors.tertiary[200],
            color: themeColors.primary[100],
            "&:hover": {
              backgroundColor: themeColors.tertiary[300],
            },
            "&.Mui-disabled": {
              backgroundColor: themeColors.primary[400],
              color: themeColors.secondary[100],
            },
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
