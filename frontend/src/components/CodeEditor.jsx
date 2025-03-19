import React, { useState, useEffect } from "react";
import AceEditor from "react-ace";
import { useDispatch, useSelector } from "react-redux";
import { filesAction } from "@/store/main";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/mode-c_cpp";
import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/mode-xml";
import "ace-builds/src-noconflict/mode-sass";
import "ace-builds/src-noconflict/mode-markdown";
import "ace-builds/src-noconflict/mode-json";
import "ace-builds/src-noconflict/mode-html";
import "ace-builds/src-noconflict/mode-css";
import crossImg from "../assets/crossLine.png";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/theme-twilight";
import "ace-builds/src-noconflict/ext-language_tools";
import clearImg from "../assets/clear.png";
import themeImg from "../assets/background.png";
import zoomIn from "../assets/zoom-in.png";
import zoomOut from "../assets/zoom-out.png";

let timer;

const themes = ["twilight", "github"];

const extentionMapping = {
  ".cpp": "c_cpp",
  ".c": "c_cpp",
  ".js": "javascript",
  ".py": "python",
  ".java": "java",
  ".xml": "xml",
  ".sass": "sass",
  ".md": "markdown",
  ".json": "json",
  ".html": "html",
  ".css": "css",
};

export default function CodeEditor({ socket }) {
  const [val, setVal] = useState(null);
  const dispatch = useDispatch();
  const currFile = useSelector((state) => state.files.selected);
  const openedFiles = useSelector((state) => state.files.openedFiles);
  const port = useSelector((state) => state.project.port);
  const [save, setSave] = useState("saved");
  const [selectedTheme, setSelectedTheme] = useState(1);
  const [selectedFontSize, setSelectedFontSize] = useState(16);

  async function getFile() {
    const res = await fetch(`http://localhost:${port}/project/file`, {
      method: "POST",
      body: JSON.stringify(currFile),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (res.ok) {
      const data = await res.json();
      //   console.log(data);
      setVal(data);
    }
  }

  useEffect(() => {
    if (currFile != null) {
      getFile();
    }
  }, [currFile]);

  useEffect(() => {
    socket.on("file:saveStatus", (data) => {
      if (data === "success") {
        setSave("saved");
      } else {
        setSave("unsaved");
      }
      // console.log(data);
    });
  });

  function fileChange(data) {
    setVal(data);
    setSave("saving");
    clearTimeout(timer);
    timer = setTimeout(() => {
      socket.emit("file:save", data, currFile.path);
    }, 2000);
  }

  return (
    <div className="flex flex-col  w-full h-full">
      <div className="w-full h-[32px] flex bg-zinc-700">
        <div
          style={{ maxWidth: "calc( 100% - 128px )" }}
          className="flex-grow flex divide-x-[2px] noScroll divide-black overflow-auto "
        >
          {openedFiles.map((i) => {
            return (
              <>
                <div className="w-fit  bg-zinc-600 text-zinc-100 pl-2 pr-[6px] flex items-center text-base">
                  <button onClick={() => dispatch(filesAction.setSelected(i))}>
                    {i.name}
                  </button>
                  {currFile && currFile.fullPath === i.fullPath ? (
                    <button
                      className="flex ml-3"
                      onClick={() =>
                        dispatch(filesAction.removeSelectedFile(i))
                      }
                    >
                      <img
                        src={crossImg}
                        className="h-[12px] w-[12px]"
                        alt=""
                      />
                    </button>
                  ) : (
                    <div className="w-[4px]"></div>
                  )}
                </div>
              </>
            );
          })}
        </div>
        <div className="w-[128px] flex">
          <button
            className="pr-[6px] pl-[6px] hover:bg-zinc-500"
            onClick={() => dispatch(filesAction.clearAllSelectedFiles())}
          >
            <img src={clearImg} className="w-[20px] h-[20px]" alt="" />
          </button>
          <button
            className="pr-[6px] pl-[6px] hover:bg-zinc-500"
            onClick={() => setSelectedTheme((p) => (p + 1) % themes.length)}
          >
            <img src={themeImg} className="w-[20px] h-[20px]" alt="" />
          </button>
          <button
            className="pr-[6px] pl-[6px] hover:bg-zinc-500"
            onClick={() => setSelectedFontSize((p) => p + 2)}
          >
            <img src={zoomIn} className="w-[20px] h-[20px]" alt="" />
          </button>
          <button
            className="pr-[6px] pl-[6px] hover:bg-zinc-500"
            onClick={() => setSelectedFontSize((p) => p - 2)}
          >
            <img src={zoomOut} className="w-[20px] h-[20px]" alt="" />
          </button>
        </div>
      </div>
      {currFile === null ? (
        <div className="w-full h-full bg-black flex justify-center pt-8 text-zinc-200">
          <span>No File Selected</span>
        </div>
      ) : (
        <>
          <div className="flex font-mono justify-between h-[25px] items-center px-4 text-zinc-300 text-base border-b border-b-zinc-600 bg-black font-medium">
            <div className="flex space-x-16">
              <span>{currFile.path.replaceAll("\\", " > ")}</span>
              <span>
                {save === "saved"
                  ? "Saved"
                  : save === "saving"
                  ? "Saving..."
                  : "Unsaved"}
              </span>
            </div>

            <span className="flex">
              <span className=" text-base flex justify-center items-center  mr-2">
                {currFile.extension}
              </span>
              <span className="text-base flex justify-center items-center">
                file
              </span>
            </span>
          </div>
          <div className="flex flex-grow">
            <AceEditor
              mode={extentionMapping[currFile.extension]}
              theme={themes[selectedTheme]}
              onChange={(event) => fileChange(event)}
              fontSize={selectedFontSize}
              name="UNIQUE_ID_OF_DIV"
              editorProps={{ $blockScrolling: true }}
              width="100%"
              height="100%"
              value={val}
            />
          </div>
        </>
      )}
    </div>
  );
}
