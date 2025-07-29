import type { DBList, DBEntry } from "./interfaces";
import { normalizeTime } from "./misc";

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

export function sortDBEntries(tempLists: DBEntry[], sortMethod: string): void{
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
    case "name-ASC": //A-Z
      tempLists.sort((a, b) => {
        return a.name.localeCompare(b.name)
      })
      break
    case "name-DESC": //Z-A
      tempLists.sort((a, b) => {
        return b.name.localeCompare(a.name)
      })
      break
    case "score-ASC":
      tempLists.sort((a, b) => {
        return a.score - b.score
      })
      break;
    case "score-DESC":
      tempLists.sort((a, b) => {
        return b.score - a.score
      })
      break;
    default://time_modified-DESC
      tempLists.sort((a, b) => {
        return new Date(normalizeTime(b.time_modified)).getTime() - new Date(normalizeTime(a.time_modified)).getTime()
      })
      break;
  }
}
