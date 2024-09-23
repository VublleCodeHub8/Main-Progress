import Terminal from "@/components/Terminal";
import FileSystem from "@/components/FileSystem";
import CodeEditor from "@/components/CodeEditor";

export default function Project() {
  return (
    <div className="w-screen h-screen">
      <div className="w-full h-full flex">
        <div id="our-fileSystem" className="h-full w-[200px] bg-zinc-800">
          <FileSystem></FileSystem>
        </div>
        <div className="flex flex-col flex-grow h-full">
          <div
            id="our-codeEditor"
            className="w-full flex-grow overflow-auto bg-green-200"
          >
            <CodeEditor></CodeEditor>
          </div>
          <div id="our-terminal" className="w-full h-fit bg-blue-200">
            <Terminal></Terminal>
          </div>
        </div>
      </div>
    </div>
  );
}
