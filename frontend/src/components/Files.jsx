import down from "../assets/angle-down.png";
import { useDispatch, useSelector } from "react-redux";
import { filesAction } from "@/store/main";

export default function Files({ tree }) {
  const dispatch = useDispatch();
  const openedFiles = useSelector((state) => state.files.opened);

  function tileClick(file, opened) {
    if (opened) {
      dispatch(filesAction.removeOpened(file.path));
    } else {
      dispatch(filesAction.pushOpened(file.path));
    }
  }

  function fileClick(file) {
    dispatch(filesAction.setSelected(file));
    console.log(file);
  }

  console.log(openedFiles);

  return (
    <div className="flex flex-col space-y-[1px]">
      {tree.map((i) => {
        let opened = false;
        if (i.children != null && openedFiles.includes(i.path)) {
          opened = true;
        }
        return (
          <div key={i.name} className=" w-full infoBlock ">
            {i.children === null ? (
              <div
                style={{ paddingLeft: `${(i.level + 1) * 15 + 4}px` }}
                onClick={(event) => fileClick(i)}
                className="flex cursor-pointer hover:bg-zinc-700 text-nowrap flex-grow"
              >
                {i.name.length > 20 - i.level * 2
                  ? `${i.name.slice(0, 18 - i.level * 2)}`
                  : i.name}
                {i.name.length > 20 - i.level * 2 ? (
                  <span className="font-sans">....</span>
                ) : null}
              </div>
            ) : (
              <>
                <div
                  style={{ paddingLeft: `${i.level * 15 + 4}px` }}
                  onClick={() => tileClick(i, opened)}
                  className="flex cursor-pointer hover:bg-zinc-700 text-nowrap space-x-[6px] flex-grow"
                >
                  <div className="flex justify-center items-center">
                    <img
                      src={down}
                      style={{
                        transform: `rotate(${opened ? "0" : "-90"}deg)`,
                      }}
                      className="w-[10px] h-[10px]"
                      alt=""
                    />
                  </div>
                  <span>
                    {i.name.length > 20 - i.level * 2
                      ? `${i.name.slice(0, 18 - i.level * 2)}`
                      : i.name}
                    {i.name.length > 20 - i.level * 2 ? (
                      <span className="font-sans">....</span>
                    ) : null}
                  </span>
                </div>
                {opened ? <Files tree={i.children}></Files> : null}
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}
