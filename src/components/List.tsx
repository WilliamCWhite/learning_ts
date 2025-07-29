import { useState } from "react";
import type { DBList } from "../utils/interfaces";
import type { ChangeEvent } from "react";

type ListProps = {
  dbList: DBList;
  stateIndex: number;
  deleteList: (listID: number, stateIndex: number) => Promise<void>;
  editList: (updatedList: DBList, stateIndex: number) => Promise<void>;
  setSelectedListID: any;
};

function List(props: ListProps) {
  const [listTitle, setListTitle] = useState<string>(props.dbList.title);

  // HACK: Very annoying to sync client side and server side date formats otherwise
  let newTimeModified: Date;
  if (typeof props.dbList.time_modified === "string") {
    newTimeModified = new Date(props.dbList.time_modified);
  } else {
    newTimeModified = props.dbList.time_modified;
  }

  function handleTitleChange(event: ChangeEvent<HTMLInputElement>) {
    setListTitle(event.target.value);
  }

  function handleTitleBlur() {
    const updatedList = props.dbList;
    updatedList.title = listTitle;
    props.editList(updatedList, props.stateIndex);
  }

  return (
    <div>
      <input
        type="text"
        value={listTitle}
        onChange={handleTitleChange}
        onBlur={handleTitleBlur}
      />
      <p>{newTimeModified.toISOString()}</p>
      <button
        onClick={() => {
          props.deleteList(props.dbList.list_id, props.stateIndex);
        }}
      >
        DELETE
      </button>
      <button
        onClick={() => {
          props.setSelectedListID(props.dbList.list_id);
        }}
      >
        SELECT
      </button>
    </div>
  );
}

export default List;
