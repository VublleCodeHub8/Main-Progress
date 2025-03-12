import { useEffect, useState, useRef } from "react";
import Files from "./Files";
import closeAllImg from "../assets/close-all.png";
import { useDispatch, useSelector } from "react-redux";
import { filesAction } from "@/store/main";
import up from "@/assets/chevron-double-up.png";
import file from "@/assets/file.png";
import folder from "@/assets/folder.png";
import load from "@/assets/load.gif";

export default function FileSystem({ socket }) {
  const [fileTree, setFileTree] = useState(null);
  const [hide, setHide] = useState(false);
  const dispatch = useDispatch();
  const port = useSelector((state) => state.project.port);

  async function getFileTree() {
    const res = await fetch(`http://localhost:${port}/project/files`);
    const data = await res.json();
    // console.log(data);
    setFileTree(data);
  }

  useEffect(() => {
    getFileTree();
  }, []);

  useEffect(() => {
    socket.on("file:refresh", getFileTree);
  }, []);

  // useEffect(() => {
  //   if (addDoc != null) {
  //     modalRef.current.showModal();
  //   } else {
  //     modalRef.current.close();
  //   }
  // }, [addDoc]);

  function closeAll() {
    dispatch(filesAction.setOpened([]));
  }

  function hideFiles() {
    setHide((p) => !p);
  }

  return (
    <>
      {hide ? (
        <div className="flex  h-full font-mono border-r border-zinc-600 text-white">
          <button
            onClick={hideFiles}
            className="p-1  hover:bg-zinc-700 px-2 flex justify-center items-center"
          >
            <img src={up} className="w-[15px] rotate-90 h-[15px]" alt="" />
          </button>
        </div>
      ) : null}
      <div
        style={{ display: hide ? "none" : "" }}
        className="flex h-full w-[200px] font-mono border-r border-zinc-600 text-white"
      >
        {fileTree === null ? (
          <div className="mx-auto mt-32">
            <img
              src={load}
              className="w-[80px] h-[80px] flex justify-center items-center"
              alt=""
            />
          </div>
        ) : (
          <div className="w-full h-full flex flex-col  ">
            <div className="flex font-semibold  border-b border-zinc-600 justify-between">
              <span className="pl-2 text-lg">FILES</span>
              <div className="flex">
                <button
                  onClick={closeAll}
                  className="p-1  hover:bg-zinc-700 px-2 flex justify-center items-center"
                >
                  <img src={up} className="w-[15px] h-[15px]" alt="" />
                </button>
                <button
                  onClick={hideFiles}
                  className="p-1  hover:bg-zinc-700 px-2 flex justify-center items-center"
                >
                  <img
                    src={up}
                    className="w-[15px] -rotate-90 h-[15px]"
                    alt=""
                  />
                </button>
              </div>
            </div>
            <div className="flex font-semibold justify-end  border-b border-zinc-600 ">
              <div className="flex justify-end"></div>
            </div>
            <div className=" pt-2 flex-grow overflow-y-auto fileBarScroll overflow-x-hidden">
              <Files tree={fileTree}></Files>
            </div>
            <div className="w-full min-h-[30px] border-t border-zinc-600"></div>
          </div>
        )}
      </div>
    </>
  );
}