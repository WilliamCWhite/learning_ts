import { useNavigate } from "react-router-dom";
import React from "react";

interface TestDashboardProps {
  jwtToken: string;
  setJwtToken: React.Dispatch<React.SetStateAction<string>>;
  handleJwtFailure: (
    statusCode: number,
    navigate: (path: string) => void,
  ) => void;
  SignOut: (
    navigate: (path: string) => void,
  ) => void;
}

function TestDashboard(props: TestDashboardProps) {
  const navigate = useNavigate();

  function testRequest2(): void {
    console.log("Initializing testRequest2");
    fetch("http://localhost:7070/api/lists", {
      method: "GET",
      headers: { Authorization: `Bearer ${props.jwtToken}` },
    })
      .then((res) => {
        props.handleJwtFailure(res.status, navigate);
        return res.json();
      })
      .then((data) => {
        console.log("Printing data from testRequest");
        console.log(data);
      });
  }

  return (
    <div>
      <p>this is the test dashboard</p>
      <button onClick={testRequest2} className="w-10 h-10 border-2"></button>
      <button onClick={() => {navigate("/login")}} className="w-10 h-10 border-2"></button>
      <button onClick={() => {props.SignOut(navigate)}} className="w-10 h-10 border-2"></button>
    </div>
  );
}

export default TestDashboard;
