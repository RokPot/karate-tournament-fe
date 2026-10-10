import { createTheme } from "@mui/material/styles";

// Unified color palette matching Tailwind config
export const themeColors = {
  primary: {
    main: "#B8963E",
    50: "#FBF6EB",
    75: "#F3E6C8",
    100: "#E5C97A",
    200: "#B8963E",
    300: "#9A7B32",
    400: "#7D6328",
    500: "#5C481C",
  },
  secondary: {
    main: "#FFFFFF",
    50: "#FDFCFB",
    75: "#F8F7F4",
    100: "#F2F1ED",
    200: "#FFFFFF",
    300: "#EBEAE6",
    400: "#D8D6D0",
    500: "#C4C2BB",
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
    main: "#4E7A5B",
    50: "#F2F6F3",
    75: "#E3EDE6",
    100: "#C5D6C9",
    200: "#4E7A5B",
    300: "#3E6249",
    400: "#314E3A",
    500: "#24382A",
  },
  warning: {
    main: "#B07540",
    50: "#F7F1EA",
    75: "#EFE4D6",
    100: "#E0C8A8",
    200: "#B07540",
    300: "#955F34",
    400: "#7A4D2B",
    500: "#5C3A21",
  },
  error: {
    main: "#A14A43",
    50: "#F7F1F0",
    75: "#EFE3E1",
    100: "#DCC3C0",
    200: "#A14A43",
    300: "#863C37",
    400: "#6C302C",
    500: "#522421",
  },
  info: {
    main: "#4A6280",
    50: "#F0F3F6",
    75: "#E2E8EE",
    100: "#C5D0DB",
    200: "#4A6280",
    300: "#3C516A",
    400: "#2F4054",
    500: "#232F3E",
  },
  neutral: {
    main: "#1C1C1E",
    50: "#F5F5F5",
    75: "#D1D1D1",
    100: "#9CA3AF",
    200: "#6B7280",
    300: "#3F3F46",
    400: "#1C1C1E",
    500: "#0A0A0B",
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
        main: themeColors.primary.main,
        light: themeColors.primary[100],
        dark: themeColors.primary[400],
        contrastText: themeColors.neutral[500],
      },
      secondary: {
        main: themeColors.neutral.main,
        light: themeColors.neutral[50],
        dark: themeColors.neutral[500],
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
        default: isDarkMode ? themeColors.neutral[400] : themeColors.secondary[50],
        paper: isDarkMode ? themeColors.neutral[300] : themeColors.secondary[200],
      },
      text: {
        primary: isDarkMode ? themeColors.white : themeColors.black,
        secondary: isDarkMode ? themeColors.neutral[75] : themeColors.neutral[200],
        disabled: isDarkMode ? themeColors.neutral[100] : themeColors.neutral[200],
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
          containedPrimary: {
            backgroundColor: themeColors.primary[200],
            color: themeColors.secondary[100],
            "&:hover": {
              backgroundColor: themeColors.primary[300],
            },
            "&.Mui-disabled": {
              backgroundColor: themeColors.secondary[400],
              color: themeColors.neutral[100],
            },
          },
          outlinedSecondary: {
            borderColor: themeColors.secondary[400],
            color: themeColors.neutral[200],
            "&:hover": {
              borderColor: themeColors.primary[400],
              color: themeColors.primary[500],
            },
            "&.Mui-disabled": {
              borderColor: themeColors.neutral[100],
              color: themeColors.neutral[100],
            },
          },
          contained: {},
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
