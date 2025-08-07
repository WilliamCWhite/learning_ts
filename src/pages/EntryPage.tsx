import { useNavigate } from "react-router-dom";
import { useEffect, useState, type ChangeEvent } from "react";
import Header from "../components/Header";
import type { DBEntry, FetchParams } from "../utils/interfaces";
import Entry from "../components/Entry";
import { entryDelete, entryGet, entryPost, entryPut } from "../utils/entryRequests";
import { sortDBEntries } from "../utils/sorting";
import EntryPageNavbar from "../components/EntryPageNavbar";

interface EntryPageProps {
  jwtToken: string;
  handleJwtFailure: (
    statusCode: number,
    navigate: (path: string) => void,
  ) => void;
  signOut: (navigate: (path: string) => void) => void;
  setSelectedListID: any;
  selectedListID: number;
}

function EntryPage(props: EntryPageProps) {
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

  const isMobile = /Mobi|Android/i.test(navigator.userAgent);
  let mobileBasedClass = ""
  if (!isMobile) mobileBasedClass = "scrollbar-thin"

  return (
    <div className="w-screen h-dvh flex flex-col justify-center items-center bg-gray-200">
      <Header signOut={() => props.signOut(navigate)} useSignOut={true}/>
      <main className="w-full h-40 grow max-w-2xl flex flex-col items-center bg-gray-100 shadow-xl">
        <EntryPageNavbar createEntry={createEntry} goBack={goBack} sortMethod={sortMethod} handleSortMethodChange={handleSortMethodChange}/>
        <section className={`overflow-scroll w-full px-2 ${mobileBasedClass}`}>
          {componentList}
        </section>
      </main>
    </div>
  );
}

export default EntryPage;
