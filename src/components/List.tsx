import { useEffect, useState } from "react";
import type { DBList } from "../utils/interfaces";
import type { ChangeEvent } from "react";
import { generateRelativeTimeString } from "../utils/timeFormatting";
import { normalizeTime } from "../utils/misc";
import Icon from "./Icon";

type ListProps = {
  dbList: DBList;
  stateIndex: number;
  deleteList: (listID: number, stateIndex: number) => Promise<void>;
  editList: (updatedList: DBList, stateIndex: number) => Promise<void>;
  setSelectedListID: any;
};

function List(props: ListProps) {
  const [listTitle, setListTitle] = useState<string>(props.dbList.title);

  const timeModifiedString = generateRelativeTimeString(normalizeTime(props.dbList.time_modified).toISOString())
  const timeCreatedString = generateRelativeTimeString(normalizeTime(props.dbList.time_created).toISOString())
  

  useEffect(() => {
    setListTitle(props.dbList.title)
  }, [props.dbList.title])

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
    if (listTitle === props.dbList.title) {
      return
    }
    const updatedList = props.dbList;
    updatedList.title = listTitle;
    props.editList(updatedList, props.stateIndex);
  }

  return (
    <div className="p-2 w-full border-gray-300 border-4 rounded-2xl bg-gray-200 flex justify-center items-start flex-col font-rubik shadow-sm">
      <div className="w-full flex gap-4 justify-between items-center">
        <input
          className="text-xl text-slate-900 font-medium grow overflow-ellipsis outline-0 px-2 py-1 focus:bg-gray-100 rounded-xl"
          type="text"
          value={listTitle}
          onChange={handleTitleChange}
          onBlur={handleTitleBlur}
        />
        <button
          className="flex items-start w-4 h-4 text-gray-400 hover:text-red-300 active:text-red-500"
          onClick={() => {
            props.deleteList(props.dbList.list_id, props.stateIndex);
          }}
        >
          <Icon iconName={"delete"} classes={"w-4 h-4"} />
        </button>
      </div>
      <button
        className="w-full flex flex-col justify-end items-start"
        onClick={() => {
          props.setSelectedListID(props.dbList.list_id);
        }}
      >
        <p className="text-gray-500 italic">{`Last modified ${timeModifiedString}`}</p>
        <p className="text-gray-500 italic">{`Created ${timeCreatedString}`}</p>
      </button>
    </div>
  );
}

export default List;
