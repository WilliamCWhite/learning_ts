import type { ReactElement } from "react";
interface HeaderProps {
  signOut: () => void;
  useSignOut: boolean;
}

function Header(props: HeaderProps) {
  let signOutContent: ReactElement;
  if (props.useSignOut) {
    signOutContent = (
      <button
        className="text-sm font-rubik w-18 h-10 md:text-lg md:w-24 md:h-11 bg-gray-100 text-gray-700 rounded-xl shadow-sm hover:bg-gray-200 active:bg-gray-300 active:text-gray-800"
        onClick={props.signOut}
      >
        Sign Out
      </button>
    );
  } else signOutContent = <></>;

  return (
    <nav className="w-full h-16 xs:h-18 py-2 bg-white flex justify-center items-center shadow-md">
      <div className="w-full max-w-2xl flex justify-between items-center px-4">
        <h1 className="text-2xl xs:text-3xl font-rubik font-bold text-slate-800">
          <span className="text-red-400 font-black">[</span>TALLYKEEPER
          <span className="text-green-500 font-black">]</span>
        </h1>
        {signOutContent}
      </div>
    </nav>
  );
}

export default Header;
