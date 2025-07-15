import Header from './components/Header.tsx'
import Entry from './components/Entry.tsx'

import "./styles/App.css";

import data from './assets/test.json'

function App() {
  interface Entry {
    name: string;
    score: number;
  }

  const testList : Entry[] = data.lists[0].entries;

  const componentList = testList.map((entry : Entry, index : number) => {
    return (
      <Entry
        key={index}
        name={entry.name}
        score={entry.score}
      />
    )
  })

  return (
    <div className="w-screen h-screen flex justify-center items-center bg-white">
      <main className="w-5xl h-full my-16 bg-gray-100">
        <Header/>
        <section className="flex flex-col w-full">
          {componentList}
        </section>
      </main>
    </div>
  );
}

export default App;
