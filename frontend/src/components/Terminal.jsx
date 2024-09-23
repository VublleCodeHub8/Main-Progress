import { Terminal as Xterminal } from "@xterm/xterm";
import { useEffect, useRef } from "react";
import "@xterm/xterm/css/xterm.css";
import socket from "../../socket";


export default function Terminal() {
  const terminalRef = useRef();

  useEffect(() => {
    const newTerminal = new Xterminal({
      convertEol: true, // Converts end-of-line characters
      cursorBlink: true, // Enables blinking cursor
      scrollback: 1000, // Sets scrollback buffer size
      rows: 15,
    });
    newTerminal.open(terminalRef.current);

    newTerminal.onData((data) => {
      console.log(data);
      socket.emit("terminal:write", data);
    });

    socket.on("terminal:data", (data) => {
      console.log(data);
      newTerminal.write(data);
    });

    return () => {
      socket.off("terminal:data");
    };
  }, []);

  return (
    <div
      className="w-full h-full border-t border-zinc-600"
      ref={terminalRef}
    ></div>
  );
}