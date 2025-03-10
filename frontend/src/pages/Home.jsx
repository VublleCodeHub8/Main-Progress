import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const token = useSelector((state) => state.misc.token);
  const navigate = useNavigate();

  async function newProject() {
    const res = await fetch("http://localhost:3000/container/createcontainer", {
      method: "POST",
      body: JSON.stringify({ template: "node" }),
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token?.token,
      },
    });
    if (res.ok) {
      const data = await res.json();
      console.log(data);
      navigate(`/project/${data.containerId}`);
    } else if (res.status === 401) {
      alert("Not Authenticated!!");
    }
  }
  return (
    <>
      <h1>Home</h1>
      <button onClick={newProject}>create new project</button>
    </>
  );
}
