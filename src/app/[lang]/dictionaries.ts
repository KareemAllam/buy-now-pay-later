import en from './dictionaries/en.json';
import ar from './dictionaries/ar.json';

const dictionaries = {
  en,
  ar,
} as const;

export type Dictionary = typeof dictionaries[keyof typeof dictionaries];
export type Locale = keyof typeof dictionaries;

export const hasLocale = (locale: string): locale is Locale =>
  locale in dictionaries;

export const getDictionary = (locale: Locale | undefined) => dictionaries[locale ?? 'en'];

