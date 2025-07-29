import type { DBList } from "./interfaces";

export function isIntegerString(str: string): boolean {
  const num = Number(str);
  return Number.isInteger(num) && str.trim() !== "";
}

export function normalizeTime(time: string | Date): Date {
  if (typeof time === "string") {
    return new Date(time)
  }
  else return time
}
