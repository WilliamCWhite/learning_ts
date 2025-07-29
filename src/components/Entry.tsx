import { useState, type ChangeEvent } from "react";
import type { DBEntry } from "../utils/interfaces";
import { isIntegerString } from "../utils/misc";
interface EntryProps {
  dbEntry: DBEntry;
  stateIndex: number;
  deleteEntry: (entryID: number, stateIndex: number) => Promise<void>;
  editEntry: (updatedEntry: DBEntry, stateIndex: number) => Promise<void>;
}

function Entry(props: EntryProps) {
  const [entryName, setEntryName] = useState<string>(props.dbEntry.name);
  const [entryScore, setEntryScore] = useState<string>(String(props.dbEntry.score));

  function handleNameChange(event: ChangeEvent<HTMLInputElement>) {
    setEntryName(event.target.value);
  }

  function handleNameBlur() {
    const updatedEntry = props.dbEntry;
    updatedEntry.name = entryName;
    props.editEntry(updatedEntry, props.stateIndex);
  }

  function handleScoreChange(event: ChangeEvent<HTMLInputElement>) {
    setEntryScore(event.target.value)
  }

  function handleScoreBlur() {
    if (isIntegerString(entryScore)) {
      const updatedEntry = props.dbEntry;
      updatedEntry.score = Number(entryScore);
      props.editEntry(updatedEntry, props.stateIndex);
    }
    else {
      setEntryScore(String(props.dbEntry.score))
    }
  }

  function incrementScore() {
    const scoreNum = Number(entryScore) + 1
    const updatedEntry = props.dbEntry
    updatedEntry.score = scoreNum
    props.editEntry(updatedEntry, props.stateIndex)
    setEntryScore(String(scoreNum))
  }

  function decrementScore() {
    const scoreNum = Number(entryScore) - 1
    const updatedEntry = props.dbEntry
    updatedEntry.score = scoreNum
    props.editEntry(updatedEntry, props.stateIndex)
    setEntryScore(String(scoreNum))
  }

  return (
    <div>
      <input
        type="text"
        value={entryName}
        onChange={handleNameChange}
        onBlur={handleNameBlur}
      />
      <input
        type="text"
        value={entryScore}
        onChange={handleScoreChange}
        onBlur={handleScoreBlur}
      />
      <button
        onClick={() => {
          props.deleteEntry(props.dbEntry.entry_id, props.stateIndex);
        }}
      >
        DELETE
      </button>
      <button className="w-4" onClick={incrementScore}>+</button>
      <button className="w-4" onClick={decrementScore}>-</button>
    </div>
  );
}

export default Entry;
