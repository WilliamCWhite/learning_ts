import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { useEffect, useState } from "react";
import List from '../components/List'
import type { DBList, FetchParams } from "../utils/interfaces";
import { listGet, listPost, listPut, listDelete } from "../utils/listRequests";

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
    navigate: navigate
  }

  const [lists, setLists] = useState<DBList[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const fetchedLists = await listGet(fetchParams)
      setLists(fetchedLists)
    }
    fetchData()
  }, [])

  const componentList = lists.map((list: DBList, index: number) => {
    return <List key={index} dbList={list} stateIndex={index} deleteList={deleteList} editList={editList} setSelectedListID={props.setSelectedListID}/>
  })

  async function createList() {
    const list: Partial<DBList> = {
      title: "hello"
    }
    try {
      const newList = await listPost(fetchParams, list)
      const newLists = [newList, ...lists]
      setLists(newLists)
    }
    catch (error) {
      console.error(error)
    }
  }

  async function editList(listID: number, stateIndex: number) {
    console.log(listID)
    const updatedList: DBList = lists[stateIndex]
    updatedList.title = "newly updated"
    updatedList.time_modified = new Date()
    try {
      await listPut(fetchParams, updatedList)

      const newLists = [
        ...lists.slice(0, stateIndex),
        updatedList,
        ...lists.slice(stateIndex+1)
      ]
      setLists(newLists)
    }
    catch (error) {
      console.error(error)
    }
  }

  async function deleteList(listID: number, stateIndex: number) {
    try {
      await listDelete(fetchParams, listID)
      const newLists = [
        ...lists.slice(0, stateIndex),
        ...lists.slice(stateIndex+1)
      ]
      setLists(newLists)
    }
    catch (error) {
      console.error(error)
    }
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

        {componentList}
      </main>
    </div>
  );
}

export default ListPage;
