import Terminal from "@/components/Terminal";
import FileSystem from "@/components/FileSystem";
import CodeEditor from "@/components/CodeEditor";
import { io } from "socket.io-client";
import { Link, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { projectAction } from "@/store/main";
import { ArrowLeft } from "lucide-react";

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
          <div className="h-[50px] bg-gray-900 flex items-center justify-between px-6 shadow-sm">
            <Link to="/" className="flex items-center">
              <span className="text-xl font-bold text-white tracking-wide">
                TERMINUS
              </span>
            </Link>
            <Link 
              to="/" 
              className="group flex items-center gap-2 px-4 py-1.5 rounded-lg
                        border border-gray-700 hover:border-gray-600
                        text-gray-300 hover:text-white 
                        transition-all duration-200 bg-gray-800/50
                        hover:bg-gray-800"
            >
              <ArrowLeft className="w-4 h-4 transition-transform duration-200 
                           group-hover:-translate-x-1" />
              <span className="text-sm font-medium">Back to Dashboard</span>
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
