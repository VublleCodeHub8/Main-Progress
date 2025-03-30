import Terminal from "@/components/Terminal";
import FileSystem from "@/components/FileSystem";
import CodeEditor from "@/components/CodeEditor";
import { io } from "socket.io-client";
import { Link, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { projectAction } from "@/store/main";
import { ArrowLeft } from "lucide-react";
import { FaChevronRight } from "react-icons/fa";

export default function Project() {
  const [soc, setSoc] = useState(null);
  const [terminalHeight, setTerminalHeight] = useState('350px');
  const [isSidebarHidden, setIsSidebarHidden] = useState(false);
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
    <div className="w-screen h-screen overflow-hidden bg-gray-900">
      {soc === null ? (
        <div className="w-full h-full flex justify-center items-center bg-gradient-to-b from-gray-900 to-gray-800">
          <div className="flex flex-col items-center gap-6 p-8 rounded-2xl bg-gray-800/50 backdrop-blur-sm border border-gray-700/50">
            <div className="relative">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-600 border-t-blue-500"></div>
              <div className="absolute inset-0 animate-pulse rounded-full h-12 w-12 border-4 border-transparent border-t-blue-400/30"></div>
            </div>
            <div className="space-y-2 text-center">
              <p className="text-lg text-gray-200 font-medium tracking-wide">Loading Project</p>
              <p className="text-sm text-gray-400">Please wait while we set up your workspace...</p>
            </div>
          </div>
        </div>
      ) : soc === false ? (
        <div className="w-full h-full flex justify-center items-center bg-gradient-to-b from-gray-900 to-gray-800">
          <div className="flex flex-col items-center gap-4 p-8 rounded-2xl bg-gray-800/50 backdrop-blur-sm border border-red-500/20">
            <div className="h-12 w-12 rounded-full bg-red-500/10 flex items-center justify-center">
              <svg className="w-6 h-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <div className="space-y-2 text-center">
              <p className="text-xl text-gray-200 font-medium">Error Fetching Project</p>
              <p className="text-gray-400">"{params.projectId}" could not be loaded</p>
              <Link 
                to="/"
                className="inline-block mt-4 px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-gray-200 text-sm font-medium transition-colors"
              >
                Return to Dashboard
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="h-14 bg-gray-900 flex items-center justify-between px-6 shadow-md border-b border-gray-800">
            <Link to="/" className="flex items-center">
              <span className="text-xl font-bold text-white tracking-wide hover:text-gray-200 transition-colors">
                TERMINUS
              </span>
            </Link>
            <Link 
              to="/" 
              className="group flex items-center gap-2 px-4 py-2 rounded-lg
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
            className="h-[calc(100vh-3.5rem)] w-full flex relative"
          >
            {/* Show button when sidebar is hidden */}
            {isSidebarHidden && (
              <button
                onClick={() => setIsSidebarHidden(false)}
                className="absolute left-0 top-4 z-10 p-2 bg-zinc-800 hover:bg-zinc-700 
                         text-gray-400 hover:text-gray-200 rounded-r-lg transition-all duration-200
                         border border-l-0 border-zinc-700"
                title="Show Sidebar"
              >
                <FaChevronRight size={14} />
              </button>
            )}
            <div 
              id="our-fileSystem" 
              className={`h-full transition-all duration-300 ease-in-out ${
                isSidebarHidden ? 'w-0 opacity-0' : 'w-64 opacity-100'
              } bg-zinc-800 border-r border-zinc-700 overflow-hidden`}
            >
              <FileSystem 
                socket={soc} 
                onSidebarToggle={setIsSidebarHidden} 
                isHidden={isSidebarHidden}
              />
            </div>
            <div className={`flex flex-col h-full transition-all duration-300 ease-in-out ${
              isSidebarHidden ? 'w-full' : 'flex-grow'
            }`}>
              <div
                id="our-codeEditor"
                className="w-full flex-grow overflow-auto border-b border-gray-800"
                style={{ height: `calc(100vh - ${terminalHeight})` }}
              >
                <CodeEditor socket={soc} />
              </div>
              <div 
                id="our-terminal" 
                className="w-full overflow-hidden transition-all duration-300 ease-in-out bg-zinc-900 border-t border-zinc-700"
                style={{ height: terminalHeight }}
              >
                <Terminal 
                  socket={soc}
                  onHeightChange={setTerminalHeight}
                />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
