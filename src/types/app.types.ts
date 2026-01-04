/**
 * Type utilities for Next.js page params
 * 
 * Usage:
 * ```ts
 * // Simple case
 * export default async function MyPage({
 *   params,
 * }: AwaitedPageParams<{ id: string }>) {
 *   const { lang, id } = await params;
 * }
 * 
 * // Multiple params with different types (note: URL params are always strings at runtime)
 * export default async function MyPage({
 *   params,
 * }: AwaitedPageParams<{ id: string; planId: string; numParam: number }>) {
 *   const { lang, id, planId, numParam } = await params;
 *   // All values are strings at runtime, but types provide better DX
 * }
 * ```
 */

type LangParam = {
  lang: "en" | "ar";
};

/**
 * Converts a type object to include lang and preserve property types
 * Note: URL params are always strings at runtime, but we can type them for better DX
 */
export type PageParams<T extends Record<string, string | number | boolean>> = LangParam & {
  [K in keyof T]: string; // URL params are always strings, but T provides type hints
};

/**
 * Promise version of PageParams for Next.js async params
 * This is the type for the entire props object of a page component
 * 
 * @example
 * ```ts
 * export default async function MyPage({
 *   params,
 * }: AwaitedPageParams<{ id: string; planId: string }>) {
 *   const { lang, id, planId } = await params;
 * }
 * ```
 */
export type AwaitedPageParams<T extends Record<string, string | number | boolean> = {}> = {
  params: Promise<PageParams<T>>;
};

/**
 * Legacy type for backwards compatibility
 * @deprecated Use AwaitedPageParams instead
 */
export type GenericParams<T extends string> = LangParam & {
  [key in T]: string;
};


