export function isString(value: unknown): value is string {
  return typeof value === "string";
}

export function parseString(value: unknown): string {
  return isString(value) ? value : "";
}

export function parseStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.map((item) => parseString(item));
}
