import type { DBList } from "../utils/interfaces"

type ListProps = {
  dbList: DBList,
  stateIndex: number,
  deleteList: (listID: number, stateIndex: number) => Promise<void>
  editList: (listID: number, stateIndex: number) => Promise<void>
}

function List(props: ListProps) {
  // HACK: Very annoying to sync client side and server side date formats otherwise
  let newTimeModified: Date
  if (typeof props.dbList.time_modified === "string") {
    newTimeModified = new Date(props.dbList.time_modified)
  }
  else {
    newTimeModified = props.dbList.time_modified
  }

  
  return (
    <div>
      <p>{props.dbList.title} {newTimeModified.toISOString()}</p>
      <button onClick={() => {props.deleteList(props.dbList.list_id, props.stateIndex)}}>DELETE</button>
      <button onClick={() => {props.editList(props.dbList.list_id, props.stateIndex)}}>EDIT</button>
    </div>
  )
}

export default List

