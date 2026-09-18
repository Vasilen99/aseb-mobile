import {
  MD3DarkTheme,
  MD3LightTheme,
  configureFonts,
  useTheme,
  type MD3Theme,
} from 'react-native-paper';

/* -------------------------------------------------------------------------- */
/*                               Brand palette                                */
/* -------------------------------------------------------------------------- */

export const palette = {
  // Primary brand color
  primary: '#1E6FD9',
  primaryLight: '#8FBAF5',
  primaryDark: '#0B3D80',

  // Secondary / accent
  secondary: '#00A38C',
  secondaryLight: '#7FE0D1',
  secondaryDark: '#005E50',

  // Tertiary
  tertiary: '#B54ACB',
  tertiaryLight: '#E8B5F2',
  tertiaryDark: '#5E1A6C',

  // Semantic
  error: '#D32F2F',
  errorLight: '#FFB4AB',
  errorDark: '#93000A',
  success: '#2E7D32',
  warning: '#ED6C02',
  info: '#0288D1',

  // Neutrals
  white: '#FFFFFF',
  black: '#000000',
  grey50: '#FAFAFA',
  grey100: '#F5F5F5',
  grey200: '#EEEEEE',
  grey300: '#E0E0E0',
  grey400: '#BDBDBD',
  grey500: '#9E9E9E',
  grey600: '#757575',
  grey700: '#616161',
  grey800: '#424242',
  grey900: '#212121',
  grey950: '#121212',
};

/* -------------------------------------------------------------------------- */
/*                              Design tokens                                 */
/* -------------------------------------------------------------------------- */

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const radius = {
  sm: 4,
  md: 8,
  lg: 16,
  xl: 24,
  full: 9999,
};

export const fonts = configureFonts({
  config: {
    fontFamily: 'System',
  },
});

/* -------------------------------------------------------------------------- */
/*                              Theme typing                                  */
/* -------------------------------------------------------------------------- */

export type AppColors = MD3Theme['colors'] & {
  success: string;
  warning: string;
  info: string;
};

export type AppTheme = Omit<MD3Theme, 'colors'> & {
  colors: AppColors;
  spacing: typeof spacing;
  radius: typeof radius;
};

/* -------------------------------------------------------------------------- */
/*                               Light theme                                  */
/* -------------------------------------------------------------------------- */

export const lightTheme: AppTheme = {
  ...MD3LightTheme,
  roundness: radius.md,
  fonts,
  spacing,
  radius,
  colors: {
    ...MD3LightTheme.colors,

    primary: palette.primary,
    onPrimary: palette.white,
    primaryContainer: '#D6E4FF',
    onPrimaryContainer: palette.primaryDark,

    secondary: palette.secondary,
    onSecondary: palette.white,
    secondaryContainer: '#C2F5EC',
    onSecondaryContainer: palette.secondaryDark,

    tertiary: palette.tertiary,
    onTertiary: palette.white,
    tertiaryContainer: '#F8D8FF',
    onTertiaryContainer: palette.tertiaryDark,

    error: palette.error,
    onError: palette.white,
    errorContainer: '#FFDAD6',
    onErrorContainer: '#410002',

    background: palette.grey50,
    onBackground: palette.grey900,

    surface: palette.white,
    onSurface: palette.grey900,
    surfaceVariant: palette.grey200,
    onSurfaceVariant: palette.grey700,
    surfaceDisabled: 'rgba(33, 33, 33, 0.12)',
    onSurfaceDisabled: 'rgba(33, 33, 33, 0.38)',

    outline: palette.grey500,
    outlineVariant: palette.grey300,

    inverseSurface: palette.grey900,
    inverseOnSurface: palette.grey100,
    inversePrimary: palette.primaryLight,

    shadow: palette.black,
    scrim: palette.black,
    backdrop: 'rgba(0, 0, 0, 0.4)',

    elevation: {
      level0: 'transparent',
      level1: '#F4F7FC',
      level2: '#EDF2FA',
      level3: '#E6EDF8',
      level4: '#E3EBF7',
      level5: '#DFE8F6',
    },

    success: palette.success,
    warning: palette.warning,
    info: palette.info,
  },
};

/* -------------------------------------------------------------------------- */
/*                               Dark theme                                   */
/* -------------------------------------------------------------------------- */

export const darkTheme: AppTheme = {
  ...MD3DarkTheme,
  roundness: radius.md,
  fonts,
  spacing,
  radius,
  colors: {
    ...MD3DarkTheme.colors,

    primary: palette.primaryLight,
    onPrimary: palette.primaryDark,
    primaryContainer: '#14509E',
    onPrimaryContainer: '#D6E4FF',

    secondary: palette.secondaryLight,
    onSecondary: palette.secondaryDark,
    secondaryContainer: '#00796A',
    onSecondaryContainer: '#C2F5EC',

    tertiary: palette.tertiaryLight,
    onTertiary: palette.tertiaryDark,
    tertiaryContainer: '#8B2FA0',
    onTertiaryContainer: '#F8D8FF',

    error: palette.errorLight,
    onError: '#690005',
    errorContainer: palette.errorDark,
    onErrorContainer: '#FFDAD6',

    background: palette.grey950,
    onBackground: palette.grey100,

    surface: palette.grey950,
    onSurface: palette.grey100,
    surfaceVariant: palette.grey800,
    onSurfaceVariant: palette.grey400,
    surfaceDisabled: 'rgba(245, 245, 245, 0.12)',
    onSurfaceDisabled: 'rgba(245, 245, 245, 0.38)',

    outline: palette.grey600,
    outlineVariant: palette.grey800,

    inverseSurface: palette.grey100,
    inverseOnSurface: palette.grey900,
    inversePrimary: palette.primary,

    shadow: palette.black,
    scrim: palette.black,
    backdrop: 'rgba(0, 0, 0, 0.6)',

    elevation: {
      level0: 'transparent',
      level1: '#1C1F26',
      level2: '#21252E',
      level3: '#262B36',
      level4: '#282D39',
      level5: '#2B313E',
    },

    success: '#81C784',
    warning: '#FFB74D',
    info: '#4FC3F7',
  },
};

/* -------------------------------------------------------------------------- */
/*                                  Hook                                      */
/* -------------------------------------------------------------------------- */

/** Typed replacement for `useTheme` that exposes custom colors & tokens. */
export const useAppTheme = () => useTheme<AppTheme>();
