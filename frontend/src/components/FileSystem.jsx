import { useEffect, useState } from "react";
import Files from "./Files";
import closeAllImg from "../assets/close-all.png";
import { useDispatch } from "react-redux";
import { filesAction } from "@/store/main";
import socket from "../../socket";

export default function FileSystem() {
  const [fileTree, setFileTree] = useState(null);
  const dispatch = useDispatch();

  async function getFileTree() {
    const res = await fetch("http://localhost:3000/project/files");
    const data = await res.json();
    console.log(data);
    setFileTree(data);
  }

  useEffect(() => {
    getFileTree();
  }, []);

  useEffect(() => {
    socket.on("file:refresh", getFileTree);
  }, []);

  function closeAll() {
    dispatch(filesAction.setOpened([]));
  }

  return (
    <div className="flex h-full w-full font-mono text-white">
      {fileTree === null ? (
        <p className="flex-grow text-center mt-8">Loading...</p>
      ) : (
        <div className="w-full h-full flex flex-col  ">
          <div className="flex font-semibold  border-b border-white justify-between">
            <span className="pl-2 text-lg">FILES</span>
            <div className="flex ">
              <button
                onClick={closeAll}
                className="p-1  hover:bg-zinc-700 px-2 flex justify-center items-center"
              >
                <img src={closeAllImg} className="w-[18px] h-[18px]" alt="" />
              </button>
            </div>
          </div>
          <div className=" pt-2 flex-grow overflow-y-auto fileBarScroll overflow-x-hidden">
            <Files tree={fileTree}></Files>
          </div>
          <div className="w-full min-h-[30px] border-t border-white"></div>
        </div>
      )}
    </div>
  );
}
