// Base
export const BG0 = "#070C1A";
export const BG1 = "#0B1224";
export const SURFACE = "rgba(255,255,255,0.04)";
export const BORDER  = "rgba(255,255,255,0.10)";
export const TX1 = "#E6ECFF";
export const TX2 = "#9DA9C0";

// Métodos (colores sólidos exactos)
export const META   = "#1877F2";   // Meta Ads (azul meta)
export const PROSPE = "#34A853";   // Prospección (verde)
export const ORGAN  = "#FF6F61";   // Orgánico (coral)

// Estado de indicador
export const GOOD   = "#58F178";   // Bueno
export const WARN   = "#FFD84D";   // A revisar
export const BAD    = "#FF6B6B";   // Malo

// Mapa por método
export const METHOD_COLOR: Record<string,string> = {
  "Meta Ads":   META,
  "Prospección": PROSPE,
  "Orgánico":   ORGAN,
};

// Transparencias para glow
export const A10 = (hex: string) => hex + "1A"; // ~10%
export const A25 = (hex: string) => hex + "40"; // ~25%
export const A45 = (hex: string) => hex + "73"; // ~45% 