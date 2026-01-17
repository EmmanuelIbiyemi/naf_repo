export type LandingThemeOption = {
  id: string;
  label: string;
  description: string;
  preview: {
    primary: string;
    secondary: string;
    accent: string;
  };
};

export const LANDING_THEMES: LandingThemeOption[] = [
  {
    id: "navy-gold",
    label: "Navy & Gold",
    description: "Formal, high-contrast palette for institutional branding.",
    preview: {
      primary: "#0b1f38",
      secondary: "#0f172a",
      accent: "#d8a92a",
    },
  },
  {
    id: "sandstone",
    label: "Sandstone",
    description: "Warm, welcoming palette with soft neutrals.",
    preview: {
      primary: "#3b2f2f",
      secondary: "#5a4b3f",
      accent: "#c89b6b",
    },
  },
  {
    id: "forest",
    label: "Forest",
    description: "Calm, modern palette for a natural feel.",
    preview: {
      primary: "#0f2f2a",
      secondary: "#123f36",
      accent: "#68b694",
    },
  },
];
