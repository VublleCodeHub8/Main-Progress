import Terminal from "@/components/Terminal";
import FileSystem from "@/components/FileSystem";
import CodeEditor from "@/components/CodeEditor";
import { io } from "socket.io-client";
import { Link, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { projectAction } from "@/store/main";

export default function Project() {
  const [soc, setSoc] = useState(null);
  const params = useParams();
  const token = useSelector((state) => state.misc.token);
  const dispatch = useDispatch();

  useEffect(() => {
    async function runContainer() {
      const containerId = params.projectId;
      const res = await fetch(
        `http://localhost:3000/container/runcontainer/${containerId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token.token,
          },
        }
      );
      if (res.ok) {
        const data = await res.json();
        // console.log(data);
        const socket = io(`http://localhost:${data.port}`);

        socket.on("connect", () => {
          // console.log(socket);
          setSoc(socket);
          dispatch(projectAction.setPort(data.port));
        });
      } else {
        setSoc(false);
      }
    }
    runContainer();
  }, []);

  return (
    <div className="w-screen h-screen">
      {soc === null ? (
        <div className="w-full h-full flex justify-center items-start">
          Loading ...
        </div>
      ) : soc === false ? (
        <div className="w-full h-full flex justify-center items-start">
          Error Fetching Project "{params.projectId}"
        </div>
      ) : (
        <>
          <div className="h-[50px] items-center bg-home_background p-2 justify-between pr-8 pl-6 pb-4 font-semibold text-lg flex">
            <Link to={"/"}>
              <svg height="35" width="220" xmlns="http://www.w3.org/2000/svg">
                <text y="34" fill="darkblue" stroke="darkblue" font-size="40">
                  Terminus
                </text>
              </svg>
            </Link>
            <Link to={"/"} className="hover:text-blue-500">
              Back To Home
            </Link>
          </div>
          <div
            style={{ height: "calc( 100% - 50px )" }}
            className="w-full flex"
          >
            <div id="our-fileSystem" className="h-full  bg-zinc-800">
              <FileSystem socket={soc}></FileSystem>
            </div>
            <div className="flex flex-col flex-grow h-full">
              <div
                id="our-codeEditor"
                className="w-full flex-grow overflow-auto "
              >
                <CodeEditor socket={soc}></CodeEditor>
              </div>
              <div id="our-terminal" className="w-full h-fit ">
                <Terminal socket={soc}></Terminal>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
