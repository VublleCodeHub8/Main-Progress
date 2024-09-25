import { useEffect, useState } from "react";
import Files from "./Files";
import closeAllImg from "../assets/close-all.png";
import { useDispatch, useSelector } from "react-redux";
import { filesAction } from "@/store/main";

export default function FileSystem({ socket }) {
  const [fileTree, setFileTree] = useState(null);
  const dispatch = useDispatch();
  const port = useSelector((state) => state.project.port);

  async function getFileTree() {
    const res = await fetch(`http://localhost:${port}/project/files`);
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
    <div className="flex h-full w-full font-mono border-r border-zinc-600 text-white">
      {fileTree === null ? (
        <p className="flex-grow text-center mt-8">Loading...</p>
      ) : (
        <div className="w-full h-full flex flex-col  ">
          <div className="flex font-semibold  border-b border-zinc-600 justify-between">
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
          <div className="w-full min-h-[30px] border-t border-zinc-600"></div>
        </div>
      )}
    </div>
  );
}
