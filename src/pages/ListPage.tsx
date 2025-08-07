import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { useEffect, useState, type ChangeEvent } from "react";
import List from "../components/List";
import type { DBList, FetchParams } from "../utils/interfaces";
import { listGet, listPost, listPut, listDelete } from "../utils/listRequests";
import { sortDBLists } from "../utils/sorting";
import ListPageNavbar from "../components/ListPageNavbar";

interface ListPageProps {
  jwtToken: string;
  handleJwtFailure: (
    statusCode: number,
    navigate: (path: string) => void,
  ) => void;
  signOut: (navigate: (path: string) => void) => void;
  setSelectedListID: any;
}

function ListPage(props: ListPageProps) {
  const navigate = useNavigate();

  const fetchParams: FetchParams = {
    jwtToken: props.jwtToken,
    handleJwtFailure: props.handleJwtFailure,
    navigate: navigate,
  };

  const [lists, setLists] = useState<DBList[]>([]);
  const [sortMethod, setSortMethod] = useState<string>("time_modified-DESC");

  useEffect(() => {
    const fetchData = async () => {
      const fetchedLists = await listGet(fetchParams);
      sortAndSetLists(fetchedLists);
    };
    fetchData();
  }, []);

  useEffect(() => {
    sortAndSetLists([...lists]);
  }, [sortMethod]);

  const componentList = lists.map((list: DBList, index: number) => {
    return (
      <List
        key={index}
        dbList={list}
        stateIndex={index}
        deleteList={deleteList}
        editList={editList}
        setSelectedListID={props.setSelectedListID}
      />
    );
  });

  function sortAndSetLists(listsDupe: DBList[]) {
    sortDBLists(listsDupe, sortMethod);
    setLists(listsDupe);
  }

  async function createList() {
    const list: Partial<DBList> = {
      title: "Untitled List",
    };
    try {
      const newList = await listPost(fetchParams, list);
      const newLists = [newList, ...lists];
      sortAndSetLists(newLists);
    } catch (error) {
      console.error(error);
    }
  }

  async function editList(updatedList: DBList, stateIndex: number) {
    updatedList.time_modified = new Date();
    try {
      await listPut(fetchParams, updatedList);

      const newLists = [
        ...lists.slice(0, stateIndex),
        updatedList,
        ...lists.slice(stateIndex + 1),
      ];
      sortAndSetLists(newLists);
    } catch (error) {
      console.error(error);
    }
  }

  async function deleteList(listID: number, stateIndex: number) {
    try {
      await listDelete(fetchParams, listID);
      const newLists = [
        ...lists.slice(0, stateIndex),
        ...lists.slice(stateIndex + 1),
      ];
      sortAndSetLists(newLists);
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
        <ListPageNavbar createList={createList} sortMethod={sortMethod} handleSortMethodChange={handleSortMethodChange}/>
        <section className={`overflow-scroll w-full px-2 flex flex-col justify-between items-center gap-4 ${mobileBasedClass}`}>
          {componentList}
        </section>
      </main>
    </div>
  );
}

export default ListPage;
