import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { useEffect, useState } from "react";

interface ListPageProps {
  jwtToken: string;
  handleJwtFailure: (
    statusCode: number,
    navigate: (path: string) => void,
  ) => void;
  signOut: (navigate: (path: string) => void) => void;
}

interface DBList {
  list_id: number;
  title: string;
  time_created: Date;
  time_modified: Date;
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
    return <div key={index}>{`name: ${list.title} timeModified: ${list.time_modified} timeCreated: ${list.time_created}`}</div>
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
        {componentList}
      </main>
    </div>
  );
}

export default ListPage;
