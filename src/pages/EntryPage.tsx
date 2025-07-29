import { useNavigate } from "react-router-dom";
import { useEffect, useState, type ChangeEvent } from "react";
import Header from "../components/Header";
import type { DBEntry, FetchParams } from "../utils/interfaces";
import Entry from "../components/Entry";
import { entryDelete, entryGet, entryPost, entryPut } from "../utils/entryRequests";
import { sortDBEntries } from "../utils/sorting";

interface EntryProps {
  jwtToken: string;
  handleJwtFailure: (
    statusCode: number,
    navigate: (path: string) => void,
  ) => void;
  signOut: (navigate: (path: string) => void) => void;
  setSelectedListID: any;
  selectedListID: number;
}

function EntryPage(props: EntryProps) {
  const navigate = useNavigate();

  const fetchParams: FetchParams = {
    jwtToken: props.jwtToken,
    handleJwtFailure: props.handleJwtFailure,
    navigate: navigate
  }

  const [entries, setEntries] = useState<DBEntry[]>([]);
  const [sortMethod, setSortMethod] = useState<string>("time_created-ASC")

  useEffect(() => {
    if (props.selectedListID === -1) return; // was making request before App.tsx could navigate out
    const fetchData = async () => {
      const fetchedEntries = await entryGet(fetchParams, props.selectedListID);
      sortAndSetEntries(fetchedEntries)
    };
    fetchData();
  }, []);

  useEffect(() => {
    sortAndSetEntries([...entries]);
  }, [sortMethod])


  const componentList = entries.map((entry: DBEntry, index: number) => {
    return (
      <Entry
        key={index}
        dbEntry={entry}
        stateIndex={index}
        deleteEntry={deleteEntry}
        editEntry={editEntry}
      />
    );
  });

  function sortAndSetEntries(entriesDupe: DBEntry[]) {
    sortDBEntries(entriesDupe, sortMethod);
    setEntries(entriesDupe);
  }

  function goBack() {
    props.setSelectedListID(-1);
    navigate("/lists");
  }

  async function createEntry() {
    const entry: Partial<DBEntry> = {
      name: "Unnamed Entry",
      score: 0
    }
    try {
      const newEntry = await entryPost(fetchParams, props.selectedListID, entry)
      const newEntries = [newEntry, ...entries];
      sortAndSetEntries(newEntries);
    } catch (error) {
      console.error(error);
    }
  }

  async function editEntry(updatedEntry: DBEntry, stateIndex: number) {
    updatedEntry.time_modified = new Date()
    try {
      await entryPut(fetchParams, props.selectedListID, updatedEntry)

      const newEntries = [
        ...entries.slice(0, stateIndex),
        updatedEntry,
        ...entries.slice(stateIndex + 1),
      ];
      sortAndSetEntries(newEntries);
    } catch (error) {
      console.error(error);
    }
  }

  async function deleteEntry(entryID: number, stateIndex: number) {
    try {
      await entryDelete(fetchParams, props.selectedListID, entryID)

      const newEntries = [
        ...entries.slice(0, stateIndex),
        ...entries.slice(stateIndex + 1),
      ];
      sortAndSetEntries(newEntries);
    } catch (error) {
      console.error(error);
    }
  }

  function handleSortMethodChange(event: ChangeEvent<HTMLSelectElement>) {
    setSortMethod(event.target.value);
  }

  return (
    <div className="w-screen h-screen flex justify-center items-center bg-white">
      <main className="w-5xl h-full my-16 bg-gray-100">
        <Header />
        <button
          onClick={() => {
            props.signOut(navigate);
          }}
          className="w-10 h-10 border-2"
        ></button>
        <button onClick={goBack} className="w-10 h-10 border-2">
          Back
        </button>
        <button onClick={createEntry} className="w-10 h-10 border-2">
          Create
        </button>
        <select defaultValue={sortMethod} onChange={handleSortMethodChange}>
          <option value="time_modified-DESC">Time Modified (new to old)</option>
          <option value="time_modified-ASC">Time Modified (old to new)</option>
          <option value="time_created-DESC">Time Created (new to old)</option>
          <option value="time_created-ASC">Time Created (old to new)</option>
          <option value="name-ASC">Title (A to Z)</option>
          <option value="name-DESC">Title (Z to A)</option>
          <option value="score-DESC">Score (High to Low)</option>
          <option value="score-ASC">Score (Low to High)</option>
        </select>
        <p>selectedListID: {props.selectedListID}</p>
        {componentList}
      </main>
    </div>
  );
}

export default EntryPage;
