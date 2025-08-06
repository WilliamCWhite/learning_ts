import { useState, useEffect, type ChangeEvent } from "react";
import type { DBEntry } from "../utils/interfaces";
import { isIntegerString } from "../utils/misc";
import Icon from "./Icon";

interface EntryProps {
  dbEntry: DBEntry;
  stateIndex: number;
  deleteEntry: (entryID: number, stateIndex: number) => Promise<void>;
  editEntry: (updatedEntry: DBEntry, stateIndex: number) => Promise<void>;
}

function Entry(props: EntryProps) {
  const [entryName, setEntryName] = useState<string>(props.dbEntry.name);
  const [entryScore, setEntryScore] = useState<string>(
    String(props.dbEntry.score),
  );

  useEffect(() => {
    setEntryName(props.dbEntry.name);
  }, [props.dbEntry.name]);

  useEffect(() => {
    setEntryScore(String(props.dbEntry.score));
  }, [props.dbEntry.score]);

  function handleNameChange(event: ChangeEvent<HTMLInputElement>) {
    setEntryName(event.target.value);
  }

  function handleNameBlur() {
    const updatedEntry = props.dbEntry;
    updatedEntry.name = entryName;
    props.editEntry(updatedEntry, props.stateIndex);
  }

  function handleScoreChange(event: ChangeEvent<HTMLInputElement>) {
    setEntryScore(event.target.value);
  }

  function handleScoreBlur() {
    if (isIntegerString(entryScore)) {
      const updatedEntry = props.dbEntry;
      updatedEntry.score = Number(entryScore);
      props.editEntry(updatedEntry, props.stateIndex);
    } else {
      setEntryScore(String(props.dbEntry.score));
    }
  }

  function incrementScore() {
    const scoreNum = Number(entryScore) + 1;
    const updatedEntry = props.dbEntry;
    updatedEntry.score = scoreNum;
    props.editEntry(updatedEntry, props.stateIndex);
    setEntryScore(String(scoreNum));
  }

  function decrementScore() {
    const scoreNum = Number(entryScore) - 1;
    const updatedEntry = props.dbEntry;
    updatedEntry.score = scoreNum;
    props.editEntry(updatedEntry, props.stateIndex);
    setEntryScore(String(scoreNum));
  }

  return (
    <div className="flex font-rubik font-medium justify-between items-center max-w-full h-18 py-2 border-b-1 border-gray-400 gap-2">
      <div className="flex items-center gap-1 grow-4">
        <button
          className="w-3 h-14 text-gray-400 hover:text-red-300 active:text-red-500"
          onClick={() => {
            props.deleteEntry(props.dbEntry.entry_id, props.stateIndex);
          }}
        >
          <Icon iconName={"delete"} classes={""} />
        </button>
        <div className="flex w-full h-14 items-center">
          <input
            className="text-lg xs:text-xl w-full h-fit overflow-ellipsis outline-0 px-2 rounded-xl focus:bg-gray-200"
            type="text"
            value={entryName}
            onChange={handleNameChange}
            onBlur={handleNameBlur}
          />
        </div>
      </div>
      <div className="flex items-center grow">
        <button
          className="w-14 h-14 rounded-2xl border-6 border-red-400 flex justify-center items-center text-red-400 hover:bg-red-200 active:bg-red-400 active:text-gray-100"
          onClick={decrementScore}
        >
          <Icon iconName={"minus"} classes={"w-8 h-8"} />
        </button>
        <input
          className="text-xl text-center w-14 grow h-14 bg-gray-200 rounded-xl mx-2 outline-0 focus:border-blue-400 focus:border-4 overflow-ellipsis"
          type="text"
          value={entryScore}
          onChange={handleScoreChange}
          onBlur={handleScoreBlur}
        />
        <button
          className="w-14 h-14 rounded-2xl border-6 border-green-500 flex justify-center items-center text-green-500 hover:bg-green-200 active:bg-green-500 active:text-gray-100"
          onClick={incrementScore}
        >
          <Icon iconName={"plus"} classes={"w-8 h-8"} />
        </button>
      </div>
    </div>
  );
}

export default Entry;
