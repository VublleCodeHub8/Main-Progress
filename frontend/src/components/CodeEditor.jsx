import React, { useState, useEffect } from "react";
import AceEditor from "react-ace";
import { useDispatch, useSelector } from "react-redux";
import { filesAction } from "@/store/main";
import { 
    FaCode, 
    FaTimes, 
    FaPalette,
    FaSearch, 
    FaSave,
    FaExpandAlt,
    FaMoon,
    FaSun,
    FaDownload,
    FaSearchPlus,
    FaSearchMinus
} from "react-icons/fa";

// Import all Ace modes and themes
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
import "ace-builds/src-noconflict/mode-text";

// Import additional themes
import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/src-noconflict/theme-github_dark";
import "ace-builds/src-noconflict/theme-tomorrow_night";
import "ace-builds/src-noconflict/theme-solarized_dark";
import "ace-builds/src-noconflict/theme-dracula";
import "ace-builds/src-noconflict/ext-language_tools";
import "ace-builds/src-noconflict/ext-searchbox";

// Add these theme imports
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/theme-eclipse";
import "ace-builds/src-noconflict/theme-solarized_light";
import "ace-builds/src-noconflict/theme-tomorrow";

let timer;

const themes = {
    dark: [
        "monokai",
        "dracula",
        "tomorrow_night",
        "solarized_dark",
    ],
    light: [
        "github",
        "eclipse",
        "solarized_light",
        "tomorrow",
    ]
};

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
    ".txt": "text",
    ".hpp": "c_cpp",
};

const getFileIcon = (extension) => {
    const iconMap = {
        ".js": "💛",
        ".py": "🐍",
        ".java": "☕",
        ".cpp": "⚡",
        ".c": "⚙️",
        ".html": "🌐",
        ".css": "🎨",
        ".json": "📦",
        ".md": "📝",
        ".txt": "📄",
        ".hpp": "⚡",
    };
    return iconMap[extension] || "📄";
};

export default function CodeEditor({ socket }) {
    const [val, setVal] = useState(null);
    const [save, setSave] = useState("saved");
    const [selectedTheme, setSelectedTheme] = useState(0);
    const [selectedFontSize, setSelectedFontSize] = useState(14);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [showMinimap, setShowMinimap] = useState(true);
    const [isDarkMode, setIsDarkMode] = useState(true);
    const [themeIndex, setThemeIndex] = useState(0);
    const [fontSize, setFontSize] = useState(14);

    const dispatch = useDispatch();
    const currFile = useSelector((state) => state.files.selected);
    const openedFiles = useSelector((state) => state.files.openedFiles);
    const port = useSelector((state) => state.project.port);

    async function getFile() {
        try {
            const res = await fetch(`http://localhost:${port}/project/file`, {
                method: "POST",
                body: JSON.stringify(currFile),
                headers: {
                    "Content-Type": "application/json",
                },
            });
            if (res.ok) {
                const data = await res.json();
                setVal(data);
            }
        } catch (error) {
            console.error("Failed to fetch file:", error);
        }
    }

    useEffect(() => {
        if (currFile != null) {
            getFile();
        }
    }, [currFile]);

    useEffect(() => {
        socket.on("file:saveStatus", (data) => {
            setSave(data === "success" ? "saved" : "unsaved");
        });

        return () => socket.off("file:saveStatus");
    }, [socket]);

    function fileChange(data) {
        setVal(data);
        setSave("saving");
        clearTimeout(timer);
        timer = setTimeout(() => {
            socket.emit("file:save", data, currFile.path);
        }, 1000);
    }

    const TabButton = ({ file, isActive }) => (
        <div className={`flex items-center px-3 py-1.5 text-sm border-r border-zinc-700
                      ${isActive 
                          ? 'bg-zinc-800 text-white' 
                          : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800'}`}>
            <span className="mr-2">{getFileIcon(file.extension)}</span>
            <button 
                onClick={() => dispatch(filesAction.setSelected(file))}
                className="mr-2"
            >
                {file.name}
            </button>
            {isActive && (
                <button
                    onClick={() => dispatch(filesAction.removeSelectedFile(file))}
                    className="opacity-60 hover:opacity-100"
                >
                    <FaTimes size={12} />
                </button>
            )}
        </div>
    );

    // Function to handle theme cycling
    const cycleTheme = () => {
        const themeList = isDarkMode ? themes.dark : themes.light;
        setThemeIndex((prev) => (prev + 1) % themeList.length);
    };

    // Function to toggle between dark and light mode
    const toggleTheme = () => {
        setIsDarkMode(prev => !prev);
        setThemeIndex(0); // Reset theme index when switching modes
    };

    // Add zoom functions
    const zoomIn = () => {
        setFontSize(prev => Math.min(prev + 2, 32)); // Max size 32
    };

    const zoomOut = () => {
        setFontSize(prev => Math.max(prev - 2, 8)); // Min size 8
    };

    return (
        <div className={`flex flex-col h-full ${isDarkMode ? 'bg-zinc-900' : 'bg-gray-50'} ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
            {/* Editor Header */}
            <div className={`flex items-center justify-between h-10 
                         ${isDarkMode ? 'bg-zinc-800 border-zinc-700' : 'bg-white border-gray-200'} 
                         border-b`}>
                {/* Tabs */}
                <div className="flex flex-1 overflow-x-auto">
                    {openedFiles.map((file) => (
                        <TabButton 
                            key={file.fullPath}
                            file={file}
                            isActive={currFile && currFile.fullPath === file.fullPath}
                        />
                    ))}
                </div>

                {/* Actions */}
                <div className="flex items-center px-2 space-x-2">
                    {/* Zoom Controls */}
                    <div className="flex items-center mr-2 border-r border-zinc-600 pr-2">
                        <button
                            onClick={zoomOut}
                            className={`p-1.5 rounded transition-colors
                                    ${isDarkMode 
                                        ? 'text-zinc-400 hover:text-white hover:bg-zinc-700' 
                                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}`}
                            title="Zoom Out"
                        >
                            <FaSearchMinus size={14} />
                        </button>
                        <span className={`mx-2 text-xs ${isDarkMode ? 'text-zinc-400' : 'text-gray-600'}`}>
                            {fontSize}px
                        </span>
                        <button
                            onClick={zoomIn}
                            className={`p-1.5 rounded transition-colors
                                    ${isDarkMode 
                                        ? 'text-zinc-400 hover:text-white hover:bg-zinc-700' 
                                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}`}
                            title="Zoom In"
                        >
                            <FaSearchPlus size={14} />
                        </button>
                    </div>

                    <button
                        onClick={() => dispatch(filesAction.clearAllSelectedFiles())}
                        className={`p-1.5 rounded transition-colors
                                ${isDarkMode 
                                    ? 'text-zinc-400 hover:text-white hover:bg-zinc-700' 
                                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}`}
                        title="Close All"
                    >
                        <FaTimes size={14} />
                    </button>
                    <button
                        onClick={cycleTheme}
                        className={`p-1.5 rounded transition-colors
                                ${isDarkMode 
                                    ? 'text-zinc-400 hover:text-white hover:bg-zinc-700' 
                                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}`}
                        title="Change Theme Variant"
                    >
                        <FaPalette size={14} />
                    </button>
                    <button
                        onClick={toggleTheme}
                        className={`p-1.5 rounded transition-colors
                                ${isDarkMode 
                                    ? 'text-zinc-400 hover:text-white hover:bg-zinc-700' 
                                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}`}
                        title="Toggle Light/Dark Mode"
                    >
                        {isDarkMode ? <FaSun size={14} /> : <FaMoon size={14} />}
                    </button>
                    <button
                        onClick={() => setIsFullscreen(!isFullscreen)}
                        className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-700 rounded"
                        title="Toggle Fullscreen"
                    >
                        <FaExpandAlt size={14} />
                    </button>
                </div>
            </div>

            {/* File Path and Status Bar */}
            {currFile && (
                <div className="flex items-center justify-between px-4 py-1.5 bg-zinc-800 border-b border-zinc-700 text-xs">
                    <div className="flex items-center space-x-4 text-zinc-400">
                        <span>{currFile.path.replaceAll("\\", " › ")}</span>
                        <div className="flex items-center space-x-1">
                            <FaSave size={12} className={save === "saved" ? "text-green-500" : "text-yellow-500"} />
                            <span>{save === "saved" ? "Saved" : save === "saving" ? "Saving..." : "Unsaved"}</span>
                        </div>
                    </div>
                    <div className="flex items-center space-x-4 text-zinc-400">
                        <span>{extentionMapping[currFile.extension]}</span>
                        <span>UTF-8</span>
                        <span>LF</span>
                    </div>
                </div>
            )}

            {/* Editor Content */}
            {currFile === null ? (
                <div className="flex-1 flex items-center justify-center bg-zinc-900 text-zinc-500">
                    <div className="text-center">
                        <FaCode size={48} className="mx-auto mb-4 opacity-50" />
                        <p>No File Selected</p>
                        <p className="text-sm mt-2">Select a file to start editing</p>
                    </div>
                </div>
            ) : (
                <div className="flex-1 relative">
                    <AceEditor
                        mode={extentionMapping[currFile.extension]}
                        theme={isDarkMode ? themes.dark[themeIndex] : themes.light[themeIndex]}
                        onChange={fileChange}
                        fontSize={fontSize}
                        name="UNIQUE_ID_OF_DIV"
                        editorProps={{ $blockScrolling: true }}
                        width="100%"
                        height="100%"
                        value={val}
                        setOptions={{
                            enableBasicAutocompletion: true,
                            enableLiveAutocompletion: true,
                            enableSnippets: true,
                            showLineNumbers: true,
                            tabSize: 4,
                            showPrintMargin: false,
                            showGutter: true,
                            highlightActiveLine: true,
                            showInvisibles: false,
                            useSoftTabs: true,
                            navigateWithinSoftTabs: true,
                            displayIndentGuides: true,
                            enableMultiselect: true,
                            fadeFoldWidgets: true,
                            showFoldWidgets: true,
                            showLineNumbers: true,
                            highlightSelectedWord: true,
                            animatedScroll: true,
                            scrollPastEnd: 0.5,
                            fixedWidthGutter: true,
                            theme: isDarkMode ? themes.dark[themeIndex] : themes.light[themeIndex],
                        }}
                        className={isDarkMode ? 'bg-zinc-900' : 'bg-white'}
                    />
                </div>
            )}
        </div>
    );
}
