import type { DBEntry } from "../utils/interfaces"
interface EntryProps {
  dbEntry: DBEntry;
  stateIndex: number;
  deleteEntry: (entryID: number, stateIndex: number) => Promise<void>
  editEntry: (entryID: number, stateIndex: number) => Promise<void>
}

function Entry(props: EntryProps) {
  return (
    <div>
      <p>{props.dbEntry.name} {props.dbEntry.score}</p>
      <button onClick={() => {props.deleteEntry(props.dbEntry.entry_id, props.stateIndex)}}>DELETE</button>
      <button onClick={() => {props.editEntry(props.dbEntry.entry_id, props.stateIndex)}}>EDIT</button>
    </div>
  )
}

export default Entry
