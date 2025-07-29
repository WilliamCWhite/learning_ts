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

export function sortDBLists(tempLists: DBList[], sortMethod: string): void{
  switch (sortMethod) {
    case "time_modified-ASC":
      tempLists.sort((a, b) => {
        return new Date(normalizeTime(a.time_modified)).getTime() - new Date(normalizeTime(b.time_modified)).getTime()
      })
      break;
    case "time_modified-DESC":
      tempLists.sort((a, b) => {
        return new Date(normalizeTime(b.time_modified)).getTime() - new Date(normalizeTime(a.time_modified)).getTime()
      })
      break;
    case "time_created-ASC":
      tempLists.sort((a, b) => {
        return new Date(normalizeTime(a.time_created)).getTime() - new Date(normalizeTime(b.time_created)).getTime()
      })
      break;
    case "time_created-DESC":
      tempLists.sort((a, b) => {
        return new Date(normalizeTime(b.time_created)).getTime() - new Date(normalizeTime(a.time_created)).getTime()
      })
      break;
    case "title-ASC": //A-Z
      tempLists.sort((a, b) => {
        return a.title.localeCompare(b.title)
      })
      break
    case "title-DESC": //Z-A
      tempLists.sort((a, b) => {
        return b.title.localeCompare(a.title)
      })
      break
    default://time_modified-DESC
      tempLists.sort((a, b) => {
        return new Date(normalizeTime(b.time_modified)).getTime() - new Date(normalizeTime(a.time_modified)).getTime()
      })
      break;
  }
  }
