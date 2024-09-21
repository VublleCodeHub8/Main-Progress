import './tree.css'

const FileTreeNode = ({ fileName, nodes, onselect, path}) => {
    // console.log( {nodes} );
    const isDir = !! nodes;
    return (


        <div className="filetree" onClick={(e) => {
            e.stopPropagation();
            if(isDir) return;
            onselect(path)
        }}>
            <p className={isDir ? '' : 'file-node'}>
                {fileName}
            </p>
            {nodes && fileName !== "node_modules" && (
                <ul>
                {Object.keys(nodes).map(child => (
                    <li key={child}>
                        <FileTreeNode onselect={onselect} path= {path + '/' + child} fileName={child} nodes={nodes[child]} />
                    </li>
                ))}
                </ul>
            )}
        </div>
    )
}

const FileTree  = ({ tree, onselect }) => {
    // console.log({tree});
    return (
        <FileTreeNode
            onselect={onselect}
            fileName='/'
            path=''
            nodes={tree}
        />
    )
}

export default FileTree