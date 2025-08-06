import type { ChangeEvent } from "react";
import Icon from "./Icon";

interface ListPageNavbarProps {
  createList: () => Promise<void>;
  sortMethod: string;
  handleSortMethodChange: (event: ChangeEvent<HTMLSelectElement>) => void;
}

function ListPageNavbar(props: ListPageNavbarProps) {
  return (
    <div className="w-full flex justify-center items-center p-3">
      <nav className="flex w-full max-w-lg h-12 justify-around items-center gap-2 px-4 py-1 rounded-2xl bg-gray-200 shadow-sm">
        <button
          onClick={props.createList}
          className="bg-gray-200 text-gray-400 w-20 max-w-30 h-full rounded-2xl flex justify-center items-center grow hover:bg-blue-100 active:bg-blue-200 active:text-blue-400"
        >
          <Icon iconName="add" classes="w-7 h-7"/>
        </button>
        <div className="w-1 h-8 rounded-full bg-gray-300"></div>
        <div className="relative bg-gray-200 text-gray-400 w-20 max-w-30 h-full rounded-2xl flex justify-center items-center grow hover:bg-blue-100 active:bg-blue-200 active:text-blue-400">
          <Icon iconName="filter" classes="w-7 h-7" />
          <select
            className="absolute opacity-0 w-full h-full text-slate-900"
            defaultValue={props.sortMethod}
            onChange={props.handleSortMethodChange}
          >
            <option value="time_modified-DESC">Time Modified (new to old)</option>
            <option value="time_modified-ASC">Time Modified (old to new)</option>
            <option value="time_created-DESC">Time Created (new to old)</option>
            <option value="time_created-ASC">Time Created (old to new)</option>
            <option value="title-ASC">Title (A to Z)</option>
            <option value="title-DESC">Title (Z to A)</option>
          </select>
        </div>
      </nav>
    </div>
  );
}

export default ListPageNavbar;
