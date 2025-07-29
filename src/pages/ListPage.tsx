import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { useEffect, useState, type ChangeEvent } from "react";
import List from "../components/List";
import type { DBList, FetchParams } from "../utils/interfaces";
import { listGet, listPost, listPut, listDelete } from "../utils/listRequests";
import { sortDBLists } from "../utils/sorting";

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

  return (
    <div className="w-screen h-screen flex justify-center items-center bg-white">
      <main className="w-5xl h-full my-16 bg-gray-100">
        <Header />
        <section className="flex w-full"></section>
        <button
          onClick={() => {
            props.signOut(navigate);
          }}
          className="w-10 h-10 border-2"
        ></button>
        <button onClick={createList} className="w-10 h-10 border-2"></button>
        <select defaultValue={sortMethod} onChange={handleSortMethodChange}>
          <option value="time_modified-DESC">Time Modified (new to old)</option>
          <option value="time_modified-ASC">Time Modified (old to new)</option>
          <option value="time_created-DESC">Time Created (new to old)</option>
          <option value="time_created-ASC">Time Created (old to new)</option>
          <option value="title-ASC">Title (A to Z)</option>
          <option value="title-DESC">Title (Z to A)</option>
        </select>

        {componentList}
      </main>
    </div>
  );
}

export default ListPage;
