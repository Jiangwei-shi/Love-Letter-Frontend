'use client';

import { createTheme } from '@mantine/core';

export const theme = createTheme({
  primaryColor: 'pink',
  defaultRadius: 'md',
  fontFamily: "var(--font-inter), Inter, 'Segoe UI', sans-serif",
  colors: {
    pink: [
      '#fff0f6',
      '#ffe3ef',
      '#ffc9de',
      '#faa2c1',
      '#f783ac',
      '#f06595',
      '#e64980',
      '#d6336c',
      '#c2255c',
      '#a61e4d',
    ],
  },
  components: {
    Card: {
      defaultProps: {
        withBorder: true,
        shadow: 'sm',
        radius: 'lg',
      },
    },
    Button: {
      defaultProps: {
        radius: 'xl',
      },
    },
    TextInput: {
      defaultProps: {
        radius: 'md',
      },
    },
    Textarea: {
      defaultProps: {
        radius: 'md',
      },
    },
  },
});
