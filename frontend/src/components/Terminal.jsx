import { Terminal as Xterminal } from "@xterm/xterm";
import { useEffect, useRef, useState } from "react";
import "@xterm/xterm/css/xterm.css";
import down from "@/assets/angle-down.png";

export default function Terminal({ socket }) {
  const terminalRef = useRef();
  const [show, setShow] = useState(false);

  useEffect(() => {
    const newTerminal = new Xterminal({
      convertEol: true, // Converts end-of-line characters
      cursorBlink: true, // Enables blinking cursor
      scrollback: 1000, // Sets scrollback buffer size
      rows: 10,
    });
    newTerminal.open(terminalRef.current);

    newTerminal.onData((data) => {
      // console.log(data);
      socket.emit("terminal:write", data);
    });

    socket.on("terminal:data", (data) => {
      // console.log(data);
      newTerminal.write(data);
    });

    return () => {
      socket.off("terminal:data");
    };
  }, []);

  return (
    <div>
      <div className="flex border-t border-zinc-600 justify-between bg-zinc-800">
        <span className="text-white font-semibold ml-4 font-mono uppercase tracking-wider text-lg">
          Terminal
        </span>
        <div className="flex items-center mr-4 ">
          <button className="p-2 px-3" onClick={() => setShow((p) => !p)}>
            <img
              src={down}
              style={{ rotate: !show ? "0deg" : "180deg" }}
              className="flex justify-center duration-500 items-center w-[15px] h-[15px]"
              alt=""
            />
          </button>
        </div>
      </div>
      <div
        style={{ display: show ? "none" : "" }}
        className="w-full h-full p-2 bg-black border-t border-zinc-600"
        ref={terminalRef}
      ></div>
    </div>
  );
}