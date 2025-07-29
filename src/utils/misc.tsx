export function isIntegerString(str: string): boolean {
  const num = Number(str);
  return Number.isInteger(num) && str.trim() !== "";
}
