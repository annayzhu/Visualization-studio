import {journalThemes, type JournalThemeId} from './visualization-studio';
export type CustomPalette = {
  id: string;
  name: string;
  sourceThemeId: JournalThemeId;
  categoricalColors: string[];
  continuousLow: string;
  continuousHigh: string;
  divergingLow: string;
  divergingMid: string;
  divergingHigh: string;
  barBorderColor: string;
  createdAt: string;
  updatedAt: string;
};

function isHexColor(value: unknown): value is string {
  return typeof value === "string" && /^#[0-9A-F]{6}$/i.test(value);
}

export function isCustomPalette(value: unknown): value is CustomPalette {
  if (!value || typeof value !== "object") return false;
  const palette = value as Partial<CustomPalette>;
  return (
    typeof palette.id === "string" &&
    typeof palette.name === "string" &&
    typeof palette.sourceThemeId === 'string' && Object.hasOwn(journalThemes,palette.sourceThemeId) &&
    Array.isArray(palette.categoricalColors) &&
    palette.categoricalColors.length > 0 &&
    palette.categoricalColors.every(isHexColor) &&
    isHexColor(palette.continuousLow) &&
    isHexColor(palette.continuousHigh) &&
    isHexColor(palette.divergingLow) &&
    isHexColor(palette.divergingMid) &&
    isHexColor(palette.divergingHigh) &&
    isHexColor(palette.barBorderColor) &&
    typeof palette.createdAt === "string" &&
    typeof palette.updatedAt === "string"
  );
}


/** Import only known palette data. Never write imported keys into browser storage. */
export function decodeLegacyPreferences(value:unknown):CustomPalette[] {
 if(!value || typeof value!=='object')throw new Error('Invalid preferences file.');
 const file=value as Record<string,unknown>;
 if(file.format!=='visualization-studio-preferences'||file.schemaVersion!==1||!file.preferences||typeof file.preferences!=='object')throw new Error('Unsupported preferences format/version.');
 const preferences=file.preferences as Record<string,unknown>;
 const palettes=preferences['labnest:visualization-studio:custom-palettes'] ?? [];
 if(!Array.isArray(palettes)||!palettes.every(isCustomPalette))throw new Error('Invalid custom palette. No preferences changed.');
 return palettes;
}
