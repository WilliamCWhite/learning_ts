import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Header from "../components/Header";
import type { DBEntry, FetchParams } from "../utils/interfaces";
import Entry from "../components/Entry";
import { entryDelete, entryPost, entryPut } from "../utils/entryRequests";

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

  useEffect(() => {
    if (props.selectedListID === -1) return; // was making request before App.tsx could navigate out
    const fetchData = async () => {
      const apiResponse = await getEntries();
      setEntries(apiResponse);
    };
    fetchData();
  }, []);

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

  function goBack() {
    props.setSelectedListID(-1);
    navigate("/lists");
  }

  async function getEntries(): Promise<DBEntry[]> {
    try {
      const response = await fetch(
        `http://localhost:7070/api/entries/${props.selectedListID}`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${props.jwtToken}` },
        },
      );
      props.handleJwtFailure(response.status, navigate);
      const data = (await response.json()) as DBEntry[];
      console.log(data);
      return data;
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  async function createEntry() {
    const entry: Partial<DBEntry> = {
      name: "function made entry",
      score: 0
    }
    try {
      const newEntry = await entryPost(fetchParams, props.selectedListID, entry)
      const newEntries = [newEntry, ...entries];
      setEntries(newEntries);
    } catch (error) {
      console.error(error);
    }
  }

  async function editEntry(entryID: number, stateIndex: number) {
    console.log(entryID)
    const updatedEntry: DBEntry = entries[stateIndex]
    updatedEntry.name = "newly updated"
    updatedEntry.score = 8
    updatedEntry.time_modified = new Date()
    try {
      await entryPut(fetchParams, props.selectedListID, updatedEntry)

      const newEntries = [
        ...entries.slice(0, stateIndex),
        updatedEntry,
        ...entries.slice(stateIndex + 1),
      ];
      setEntries(newEntries);
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
      setEntries(newEntries);
    } catch (error) {
      console.error(error);
    }
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
        <p>selectedListID: {props.selectedListID}</p>
        {componentList}
      </main>
    </div>
  );
}

export default EntryPage;
