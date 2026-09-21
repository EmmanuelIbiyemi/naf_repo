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
    description: "Professional and modern with deep blue tones and golden accents.",
    preview: {
      primary: "#1e40af",
      secondary: "#0f172a",
      accent: "#fbbf24",
    },
  },
  {
    id: "sandstone",
    label: "Sandstone",
    description: "Warm and earthy palette with terracotta and neutral tones.",
    preview: {
      primary: "#c2694f",
      secondary: "#57534e",
      accent: "#f59e0b",
    },
  },
  {
    id: "forest",
    label: "Forest",
    description: "Natural and calming with emerald green and dark forest tones.",
    preview: {
      primary: "#10b981",
      secondary: "#14342b",
      accent: "#34d399",
    },
  },
  {
    id: "classic",
    label: "Classic",
    description: "Clean light theme with navy accents and soft neutral surfaces.",
    preview: {
      primary: "#0b1f38",
      secondary: "#ffffff",
      accent: "#1d4ed8",
    },
  },
];
