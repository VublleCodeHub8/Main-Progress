import { Terminal as Xterminal } from "@xterm/xterm";
import { FitAddon } from "@xterm/addon-fit";
import { WebLinksAddon } from "@xterm/addon-web-links";
import { WebglAddon } from "@xterm/addon-webgl";
import { useEffect, useRef, useState, useCallback } from "react";
import "@xterm/xterm/css/xterm.css";
import { 
    FaChevronDown, 
    FaChevronUp, 
    FaTimes, 
    FaCopy, 
    FaExpandAlt,
    FaCompressAlt,
    FaEraser,
    FaCog
} from "react-icons/fa";

export default function Terminal({ socket, onHeightChange }) {
  const terminalRef = useRef();
    const xterminalRef = useRef(null);
    const fitAddonRef = useRef(null);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [terminalSettings, setTerminalSettings] = useState({
        fontSize: 14,
        fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace",
        fontWeight: 'normal',
        fontWeightBold: 'bold',
        lineHeight: 1.2,
        letterSpacing: 0,
        cursorStyle: "block",
        cursorBlink: true,
        theme: {
            background: '#1a1a1a',
            foreground: '#ffffff',
            cursor: '#ffffff',
            cursorAccent: '#000000',
            selection: '#404040',
            // ANSI Colors
            black: '#000000',
            red: '#e06c75',
            green: '#98c379',
            yellow: '#e5c07b',
            blue: '#61afef',
            magenta: '#c678dd',
            cyan: '#56b6c2',
            white: '#abb2bf',
            // Bright variants
            brightBlack: '#5c6370',
            brightRed: '#e06c75',
            brightGreen: '#98c379',
            brightYellow: '#e5c07b',
            brightBlue: '#61afef',
            brightMagenta: '#c678dd',
            brightCyan: '#56b6c2',
            brightWhite: '#ffffff',
        },
        allowTransparency: true,
        minimumContrastRatio: 4.5,
        renderBoldTextInBrightColors: true
    });

    const initializeTerminal = useCallback(() => {
        const terminal = new Xterminal({
            ...terminalSettings,
            convertEol: true,
            scrollback: 5000,
            rows: isFullscreen ? 30 : 15,
            allowTransparency: true,
            rightClickSelectsWord: true,
            windowsMode: true,
            wordSeparator: ' ()[]{}\'"',
            allowProposedApi: true,
            smoothScrollDuration: 300,
        });

        // Initialize addons
        fitAddonRef.current = new FitAddon();
        const webLinksAddon = new WebLinksAddon();
        
        // Add WebGL addon for better rendering
        try {
            const webglAddon = new WebglAddon();
            terminal.loadAddon(webglAddon);
        } catch (e) {
            console.warn('WebGL addon could not be loaded', e);
        }

        // Load other addons
        terminal.loadAddon(fitAddonRef.current);
        terminal.loadAddon(webLinksAddon);

        return terminal;
    }, [terminalSettings, isFullscreen]);

    useEffect(() => {
        const terminal = initializeTerminal();
        xterminalRef.current = terminal;
        terminal.open(terminalRef.current);
        fitAddonRef.current.fit();

        // Handle terminal data
        terminal.onData((data) => {
      socket.emit("terminal:write", data);
    });

        // Remove the original socket.on handler and replace with our colored version
    socket.on("terminal:data", (data) => {
            const promptRegex = /(root@[A-Za-z0-9]+:\/[^\s#]+#)/;
            if (promptRegex.test(data)) {
                const coloredData = data.replace(
                    promptRegex,
                    (match, prompt) => {
                        const [user, path] = prompt.split(':');
                        return `\x1b[1;32m${user}\x1b[0m:\x1b[1;34m${path}\x1b[0m`;
                    }
                );
                terminal.write(coloredData);
            } else {
                terminal.write(data);
            }
        });

        // Handle resize
        const handleResize = () => {
            fitAddonRef.current.fit();
        };
        window.addEventListener('resize', handleResize);

        // Cleanup
    return () => {
      socket.off("terminal:data");
            window.removeEventListener('resize', handleResize);
            terminal.dispose();
        };
    }, [socket, initializeTerminal]);

    // Add font loading
    useEffect(() => {
        // Load custom fonts
        const fontFace = new FontFace('JetBrains Mono', 'url(https://cdn.jsdelivr.net/gh/JetBrains/JetBrainsMono/web/woff2/JetBrainsMono-Regular.woff2)');
        fontFace.load().then(() => {
            document.fonts.add(fontFace);
            if (xterminalRef.current) {
                updateSettings({ fontFamily: terminalSettings.fontFamily });
            }
        });
    }, []);

    // Terminal actions
    const clearTerminal = () => {
        xterminalRef.current?.clear();
    };

    const copySelection = () => {
        const selection = xterminalRef.current?.getSelection();
        if (selection) {
            navigator.clipboard.writeText(selection);
        }
    };

    const updateSettings = (newSettings) => {
        setTerminalSettings(prev => ({
            ...prev,
            ...newSettings
        }));
        
        // Apply settings to active terminal
        Object.entries(newSettings).forEach(([key, value]) => {
            if (xterminalRef.current && key in xterminalRef.current) {
                xterminalRef.current.setOption(key, value);
            }
        });
        
        fitAddonRef.current?.fit();
    };

    // Add these styles for better scrolling
    const styles = `
        .settings-scroll {
            scrollbar-width: thin;
            scrollbar-color: #4B5563 #1F2937;
        }
        
        .settings-scroll::-webkit-scrollbar {
            width: 6px;
        }
        
        .settings-scroll::-webkit-scrollbar-track {
            background: transparent;
        }
        
        .settings-scroll::-webkit-scrollbar-thumb {
            background-color: #4B5563;
            border-radius: 3px;
        }
        
        .settings-scroll::-webkit-scrollbar-thumb:hover {
            background-color: #6B7280;
        }
    `;

  return (
        <>
            <style>{styles}</style>
            <div className={`relative ${isFullscreen ? 'fixed inset-0 z-50 bg-black' : ''}`}>
                {/* Terminal Header */}
                <div className="flex border-t border-zinc-600 justify-between bg-zinc-800/90 backdrop-blur-sm">
                    <div className="flex items-center gap-2 px-4 py-2">
                        <span className="text-white font-semibold font-mono uppercase tracking-wider">
          Terminal
        </span>
                    </div>

                    <div className="flex items-center gap-1 px-2">
                        <button
                            onClick={copySelection}
                            className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-700 rounded"
                            title="Copy Selection"
                        >
                            <FaCopy size={14} />
                        </button>
                        <button
                            onClick={clearTerminal}
                            className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-700 rounded"
                            title="Clear Terminal"
                        >
                            <FaEraser size={14} />
                        </button>
                        <button
                            onClick={() => setShowSettings(!showSettings)}
                            className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-700 rounded"
                            title="Settings"
                        >
                            <FaCog size={14} />
                        </button>
                        <button
                            onClick={() => {
                                setIsCollapsed(!isCollapsed);
                                onHeightChange(isCollapsed ? '320px' : '40px');
                                if (isCollapsed) {
                                    setTimeout(() => fitAddonRef.current?.fit(), 300);
                                }
                            }}
                            className={`
                                flex items-center gap-2 px-3 py-1.5 rounded-lg
                                transition-all duration-200 ease-in-out
                                ${isCollapsed 
                                    ? 'bg-green-500/10 text-green-400 hover:bg-green-500/20 hover:text-green-300' 
                                    : 'bg-zinc-700/50 text-zinc-400 hover:bg-zinc-700 hover:text-white'
                                }
                            `}
                            title={isCollapsed ? "Expand Terminal" : "Collapse Terminal"}
                        >
                            <span className="text-xs font-medium hidden sm:inline">
                                {isCollapsed ? "Expand" : "Collapse"}
                            </span>
                            {isCollapsed 
                                ? <FaChevronUp size={14} className="transform transition-transform duration-200 group-hover:translate-y-[-2px]" />
                                : <FaChevronDown size={14} className="transform transition-transform duration-200 group-hover:translate-y-[2px]" />
                            }
                        </button>
                    </div>
                </div>

                {showSettings && (
                    <div className="w-full h-[300px] bg-zinc-900 border-t border-zinc-700">
                        <div className="h-full flex">
                            {/* Settings Content */}
                            <div className="flex-1 p-4 overflow-y-auto settings-scroll">
                                <div className="max-w-2xl mx-auto space-y-6">
                                    {/* Appearance Section */}
                                    <div className="bg-zinc-800 rounded-lg p-4">
                                        <h4 className="text-zinc-300 text-sm font-medium mb-4">Appearance</h4>
                                        <div className="space-y-4">
                                            {/* Font Size */}
                                            <div>
                                                <div className="flex justify-between items-center mb-1">
                                                    <label className="text-sm text-zinc-400">Font Size</label>
                                                    <span className="text-sm text-zinc-500">{terminalSettings.fontSize}px</span>
                                                </div>
                                                <input
                                                    type="range"
                                                    min="8"
                                                    max="24"
                                                    value={terminalSettings.fontSize}
                                                    onChange={(e) => updateSettings({ fontSize: Number(e.target.value) })}
                                                    className="w-full accent-blue-500"
                                                />
                                            </div>

                                            {/* Line Height */}
                                            <div>
                                                <div className="flex justify-between items-center mb-1">
                                                    <label className="text-sm text-zinc-400">Line Height</label>
                                                    <span className="text-sm text-zinc-500">{terminalSettings.lineHeight}</span>
                                                </div>
                                                <input
                                                    type="range"
                                                    min="1"
                                                    max="2"
                                                    step="0.1"
                                                    value={terminalSettings.lineHeight}
                                                    onChange={(e) => updateSettings({ lineHeight: Number(e.target.value) })}
                                                    className="w-full accent-blue-500"
                                                />
                                            </div>

                                            {/* Letter Spacing */}
                                            <div>
                                                <div className="flex justify-between items-center mb-1">
                                                    <label className="text-sm text-zinc-400">Letter Spacing</label>
                                                    <span className="text-sm text-zinc-500">{terminalSettings.letterSpacing}px</span>
                                                </div>
                                                <input
                                                    type="range"
                                                    min="0"
                                                    max="5"
                                                    value={terminalSettings.letterSpacing}
                                                    onChange={(e) => updateSettings({ letterSpacing: Number(e.target.value) })}
                                                    className="w-full accent-blue-500"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Cursor Section */}
                                    <div className="bg-zinc-800 rounded-lg p-4">
                                        <h4 className="text-zinc-300 text-sm font-medium mb-4">Cursor</h4>
                                        <div className="space-y-4">
                                            <div>
                                                <label className="text-sm text-zinc-400 block mb-1">Cursor Style</label>
                                                <select
                                                    value={terminalSettings.cursorStyle}
                                                    onChange={(e) => updateSettings({ cursorStyle: e.target.value })}
                                                    className="w-full bg-zinc-700 px-3 py-1.5 rounded text-sm text-zinc-200 border border-zinc-600 focus:outline-none focus:border-blue-500"
                                                >
                                                    <option value="block">Block</option>
                                                    <option value="underline">Underline</option>
                                                    <option value="bar">Bar</option>
                                                </select>
                                            </div>

                                            <label className="flex items-center gap-2 p-2 hover:bg-zinc-700/50 rounded transition-colors">
                                                <input
                                                    type="checkbox"
                                                    checked={terminalSettings.cursorBlink}
                                                    onChange={(e) => updateSettings({ cursorBlink: e.target.checked })}
                                                    className="rounded border-zinc-600 text-blue-500 focus:ring-blue-500"
                                                />
                                                <span className="text-sm text-zinc-400">Cursor Blink</span>
                                            </label>
                                        </div>
                                    </div>

                                    {/* Text Options Section */}
                                    <div className="bg-zinc-800 rounded-lg p-4">
                                        <h4 className="text-zinc-300 text-sm font-medium mb-4">Text Options</h4>
                                        <div className="space-y-2">
                                            <label className="flex items-center gap-2 p-2 hover:bg-zinc-700/50 rounded transition-colors">
                                                <input
                                                    type="checkbox"
                                                    checked={terminalSettings.renderBoldTextInBrightColors}
                                                    onChange={(e) => updateSettings({ renderBoldTextInBrightColors: e.target.checked })}
                                                    className="rounded border-zinc-600 text-blue-500 focus:ring-blue-500"
                                                />
                                                <span className="text-sm text-zinc-400">Bright Bold Text</span>
                                            </label>
                                        </div>
                                    </div>

                                    {/* Reset Button */}
                                    <div className="flex justify-end">
                                        <button
                                            onClick={() => {
                                                setTerminalSettings({
                                                    fontSize: 14,
                                                    fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace",
                                                    fontWeight: 'normal',
                                                    lineHeight: 1.2,
                                                    letterSpacing: 0,
                                                    cursorStyle: "block",
                                                    cursorBlink: true,
                                                    renderBoldTextInBrightColors: true,
                                                    theme: terminalSettings.theme
                                                });
                                            }}
                                            className="bg-zinc-700 hover:bg-zinc-600 text-zinc-200 px-4 py-2 rounded text-sm transition-colors"
                                        >
                                            Reset to Defaults
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Terminal Container */}
                <div
                    className={`w-full overflow-hidden transition-all duration-300 ease-in-out
                        ${isCollapsed ? 'opacity-50' : 'opacity-100'}`}
                    style={{
                        visibility: 'visible',
                        transform: isCollapsed ? 'translateY(0)' : 'translateY(0)'
                    }}
                >
                    <div ref={terminalRef} className="terminal-container" />
                </div>

                {/* Collapsed State Indicator */}
                {isCollapsed && !isFullscreen && (
                    <div className="h-1 bg-zinc-700 w-full cursor-pointer" onClick={() => {
                        setIsCollapsed(false);
                        onHeightChange('320px');
                        setTimeout(() => fitAddonRef.current?.fit(), 300);
                    }}>
                        <div className="h-full w-16 mx-auto bg-zinc-600 rounded-full hover:bg-zinc-500 transition-colors" />
                    </div>
                )}
    </div>
        </>
  );
}