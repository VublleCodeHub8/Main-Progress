import { Terminal as XTerminal } from '@xterm/xterm'
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import '@xterm/xterm/css/xterm.css'
import socket from '../../socket'
import './Terminal.css'
import FileTree from './tree'
import brace from 'brace';
import AceEditor from 'react-ace';

import 'brace/mode/java';
import 'brace/theme/github';


const Terminal1 = () => {

    const terminalRef = useRef();
    const isRendered = useRef(false);

    useEffect(() => {
        if (isRendered.current) return;
        isRendered.current = true;
        const term = new XTerminal({
            rows: 20,
        });
        term.open(terminalRef.current);

        term.onData((data) => {
            // console.log(data);
            socket.emit('terminal:write', data);
        });

        socket.on('terminal:data', (data) => {
            term.write(data);
        });
    }, []);

    const [fileTree, setFileTree] = useState({});
    const [selectedFile, setSelectedFile] = useState('');
    const [selectedFileContent, setSelectedFileContent] = useState('');
    const [code, setCode] = useState('');

    const isSaved = selectedFileContent === code;

    const getFileTree = async () => {
        const res = await fetch('http://localhost:3000/files');
        const result = await res.json();
        setFileTree(result.tree);
    };

    const getFileContent = useCallback(async () => {
        if (!selectedFile) return;
        const res = await fetch(`http://localhost:3000/files/content?path=${selectedFile}`);
        const result = await res.json();
        setSelectedFileContent(result.content); 

    }, [selectedFile]); 

     useEffect(() => {
        if(selectedFileContent && selectedFile) {
            setCode(selectedFileContent);
        }
     }, [selectedFileContent, selectedFile]);

    useEffect(() => {
        if(selectedFile){
            getFileContent();
        }
    }, [getFileContent, selectedFile]);

    useEffect(() => {
        setCode("");
    }, [selectedFile]);

    useEffect(() => {
        getFileTree();
    }, []);

    useEffect(() => {
        socket.on('file:refresh', getFileTree);
        return () => {
            socket.off('file:refresh', getFileTree);
        }
    })




    useEffect(() => {
        if (code && !isSaved) {
            const time = setTimeout(() => {
                // console.log('save code', code)
                socket.emit('file:change', {
                    path: selectedFile,
                    content: code,
                })
            }, 2 * 1000);
            return () => {
                clearTimeout(time);
            }
        }
    }, [code, selectedFile, isSaved]);
    // console.log(fileTree);
    return (
        <>
            <div className='playground-container'>
                <div className='editor-container'>
                    <div className='files'>
                        <FileTree onselect={(path) => setSelectedFile(path)} tree={fileTree} />
                    </div>
                    <div className='editor'>
                        {selectedFile && 
                        <p>
                            {selectedFile.replaceAll('/', '>')}{" "}
                            {isSaved ? "Saved" : "Saving..."}
                        </p>}
                        <AceEditor
                            mode="java"
                            theme="github"
                            // onChange={onChange}
                            name="UNIQUE_ID_OF_DIV"
                            editorProps={{ $blockScrolling: true }}
                            ext="language_tools"
                            value={code}
                            onChange={(e) => setCode(e)}
                        />
                    </div>
                </div>
                <div ref={terminalRef} id="terminal" className='terminal-container'></div>
            </div>
        </>

    )
}

export default Terminal1