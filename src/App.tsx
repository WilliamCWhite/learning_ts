import Header from './components/Header.tsx'
import Entry from './components/Entry.tsx'
import { GoogleLogin } from '@react-oauth/google';
import type { CredentialResponse } from '@react-oauth/google';
import { useState } from 'react';

import "./styles/App.css";

import data from './assets/test.json'

function App() {
  interface Entry {
    name: string;
    score: number;
  }

  const [jwtToken, setJwtToken] = useState("")

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

  function testRequest() :void {
    console.log("Initializing testRequest")
    fetch('http://localhost:7070/api/tokentest', {
      method: 'GET',
      headers: {'Authorization': `Bearer ${jwtToken}`}
    }).then(res => res.json())
    .then(data => {
      console.log("Printing data from testRequest")
      console.log(data)
    })
  }

  return (
    <div className="w-screen h-screen flex justify-center items-center bg-white">
      <main className="w-5xl h-full my-16 bg-gray-100">
        <Header/>
        <section className="flex flex-col w-full">
          {componentList}
        </section>
        <GoogleLogin
          onSuccess={(credentialResponse : CredentialResponse) => {
            console.log(credentialResponse)
            const idToken = credentialResponse.credential;
            fetch('http://localhost:7070/auth/google', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ "id_token": idToken })
            }).then(res => res.json())
            .then(data => {
                console.log("Writing post request response below")
                console.log(data)
                setJwtToken(data.token)
            });
          }}
          onError={() => {
            console.log("Login Failed")
          }}
        />
        <button onClick={testRequest} className="w-10 h-10 border-2"></button>
      </main>
    </div>
  );
}

export default App;
