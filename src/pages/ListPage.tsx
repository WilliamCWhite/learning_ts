import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { useEffect, useState } from "react";
import List from '../components/List'
import type { DBList } from "../utils/interfaces";

interface ListPageProps {
  jwtToken: string;
  handleJwtFailure: (
    statusCode: number,
    navigate: (path: string) => void,
  ) => void;
  signOut: (navigate: (path: string) => void) => void;
}


function ListPage(props: ListPageProps) {
  const navigate = useNavigate();

  const [lists, setLists] = useState<DBList[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const apiResponse = await getLists()
      setLists(apiResponse)
    }
    fetchData()
  }, [])

  const componentList = lists.map((list: DBList, index: number) => {
    return <List key={index} dbList={list} stateIndex={index} deleteList={deleteList} editList={editList}/>
  })

  async function getLists(): Promise<DBList[]> {
    try {
      const response = await fetch("http://localhost:7070/api/lists", {
        method: "GET",
        headers: { Authorization: `Bearer ${props.jwtToken}`},
      })
      props.handleJwtFailure(response.status, navigate)
      const data = await response.json() as DBList[] // may need to make "is dblist" function
      return data;
    }
    catch (error) {
      console.error(error)
      return []
    }
  }

  async function createList() {
    console.log("button log")
    try {
      const response = await fetch("http://localhost:7070/api/lists", {
        method: "POST",
        headers: { Authorization: `Bearer ${props.jwtToken}`},
        body: JSON.stringify({
          title: "test list"
        })
      })
      props.handleJwtFailure(response.status, navigate)
      const data = await response.json() as DBList
      console.log(data)
      
      const newLists = [data, ...lists]
      setLists(newLists)
    }
    catch (error) {
      console.error(error)
    }
  }

  async function editList(listID: number, stateIndex: number) {
    try {
      const response = await fetch("http://localhost:7070/api/lists", {
        method: "PUT",
        headers: { Authorization: `Bearer ${props.jwtToken}`},
        body: JSON.stringify({
          title: "edited list",
          list_id: listID
        })
      })
      props.handleJwtFailure(response.status, navigate)
      const updatedList: DBList = {
        title: "edited list",
        time_modified: new Date(),
        list_id: lists[stateIndex].list_id,
        time_created: lists[stateIndex].time_created
      }

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
      const response = await fetch("http://localhost:7070/api/lists", {
        method: "DELETE",
        headers: { Authorization: `Bearer ${props.jwtToken}`},
        body: JSON.stringify({
          list_id: listID
        })
      })
      props.handleJwtFailure(response.status, navigate)
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
    <div className="w-screen h-screen flex justify-center itesm-center bg-white">
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
