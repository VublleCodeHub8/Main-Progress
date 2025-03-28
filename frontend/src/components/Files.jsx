import React, { memo, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { filesAction } from "@/store/main";
import { 
    FaChevronRight,
    FaFolder,
    FaFolderOpen,
    FaJs,
    FaHtml5,
    FaCss3,
    FaJava,
    FaPython,
    FaCode,
    FaFile,
    FaMarkdown,
    FaDatabase,
    FaTrash,
    FaTimes,
    FaPencilAlt
} from "react-icons/fa";

const getFileIcon = (fileName) => {
    const extension = fileName.split('.').pop().toLowerCase();
    const iconProps = { size: 16, className: "flex-shrink-0" };
    
    const iconMap = {
        'js': <FaJs {...iconProps} className="text-yellow-400" />,
        'jsx': <FaJs {...iconProps} className="text-blue-400" />,
        'html': <FaHtml5 {...iconProps} className="text-orange-500" />,
        'css': <FaCss3 {...iconProps} className="text-blue-500" />,
        'java': <FaJava {...iconProps} className="text-red-500" />,
        'py': <FaPython {...iconProps} className="text-blue-500" />,
        'json': <FaDatabase {...iconProps} className="text-yellow-500" />,
        'md': <FaMarkdown {...iconProps} className="text-white" />,
        'cpp': <FaCode {...iconProps} className="text-blue-400" />,
        'c': <FaCode {...iconProps} className="text-blue-300" />,
        'hpp': <FaCode {...iconProps} className="text-blue-400" />,
    };

    return iconMap[extension] || <FaFile {...iconProps} className="text-gray-400" />;
};

const Files = memo(({ tree, searchTerm = "", onDeleteFile, onDeleteFolder, onRenameFile }) => {
    const dispatch = useDispatch();
    const openedFiles = useSelector((state) => state.files.opened);
    const selectedFile = useSelector((state) => state.files.selected);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);
    const [showRenameDialog, setShowRenameDialog] = useState(false);
    const [fileToRename, setFileToRename] = useState(null);
    const [newFileName, setNewFileName] = useState('');

    const handleFolderClick = (file, isOpen) => {
        if (isOpen) {
            dispatch(filesAction.removeOpened(file.path));
        } else {
            dispatch(filesAction.pushOpened(file.path));
        }
    };

    const handleFileClick = (file) => {
        dispatch(filesAction.setSelected(file));
    };

    const handleDeleteClick = (e, item) => {
        e.stopPropagation(); // Prevent file/folder selection
        setItemToDelete(item);
        setShowDeleteConfirm(true);
    };

    const handleRenameClick = (e, file) => {
        e.stopPropagation(); // Prevent file selection
        setFileToRename(file);
        setNewFileName(file.name);
        setShowRenameDialog(true);
    };

    const confirmDelete = async () => {
        try {
            if (itemToDelete.children === null) {
                // It's a file
                await onDeleteFile(itemToDelete.path);
                // If the deleted file was selected, clear selection
                if (selectedFile?.path === itemToDelete.path) {
                    dispatch(filesAction.setSelected(null));
                }
            } else {
                // It's a folder
                console.log('Attempting to delete folder:', {
                    path: itemToDelete.path,
                    name: itemToDelete.name,
                    item: itemToDelete
                });
                await onDeleteFolder(itemToDelete.path);
                // Remove from opened folders if it was open
                if (openedFiles.includes(itemToDelete.path)) {
                    dispatch(filesAction.removeOpened(itemToDelete.path));
                }
            }
            setShowDeleteConfirm(false);
            setItemToDelete(null);
        } catch (error) {
            console.error('Failed to delete item:', error);
            // You might want to show an error message to the user
        }
    };

    const confirmRename = async () => {
        try {
            const newPath = fileToRename.path.replace(fileToRename.name, newFileName);
            await onRenameFile(fileToRename.path, newPath);
            setShowRenameDialog(false);
            setFileToRename(null);
            setNewFileName('');
            // If the renamed file was selected, update selection
            if (selectedFile?.path === fileToRename.path) {
                dispatch(filesAction.setSelected({ ...selectedFile, path: newPath, name: newFileName }));
            }
        } catch (error) {
            console.error('Failed to rename file:', error);
            // You might want to show an error message to the user
        }
    };

    const FileItem = ({ file, isOpen, level }) => {
        const isSelected = selectedFile?.path === file.path;
        const paddingLeft = `${level * 12 + 8}px`;
        const isFile = file.children === null;
        
        // Filter by search term if provided
        if (searchTerm && !file.name.toLowerCase().includes(searchTerm.toLowerCase())) {
            return null;
        }

        return (
            <div className="group">
                <div
                    onClick={() => isFile ? handleFileClick(file) : handleFolderClick(file, isOpen)}
                    style={{ paddingLeft }}
                    className={`flex items-center py-1 px-2 cursor-pointer text-sm justify-between
                             ${isSelected ? 'bg-blue-600' : 'hover:bg-zinc-700'}
                             transition-colors duration-100 group-hover:bg-opacity-50`}
                >
                    <div className="flex items-center gap-2 min-w-0">
                        {!isFile && (
                            <FaChevronRight 
                                size={12}
                                className={`transform transition-transform duration-200
                                        ${isOpen ? 'rotate-90' : ''} text-gray-400`}
                            />
                        )}
                        <span className="w-4 flex items-center">
                            {isFile ? (
                                getFileIcon(file.name)
                            ) : (
                                isOpen ? (
                                    <FaFolderOpen size={16} className="text-yellow-400" />
                                ) : (
                                    <FaFolder size={16} className="text-yellow-400" />
                                )
                            )}
                        </span>
                        <span className={`truncate ${isSelected ? 'text-white' : 'text-gray-300'}`}>
                            {file.name}
                        </span>
                    </div>
                    <div className="opacity-0 group-hover:opacity-100 flex items-center gap-2">
                        {isFile && (
                            <button
                                onClick={(e) => handleRenameClick(e, file)}
                                className="text-gray-400 hover:text-blue-500 transition-all duration-200"
                                title="Rename file"
                            >
                                <FaPencilAlt size={12} />
                            </button>
                        )}
                        <button
                            onClick={(e) => handleDeleteClick(e, file)}
                            className="text-gray-400 hover:text-red-500 transition-all duration-200"
                            title={`Delete ${isFile ? 'file' : 'folder'}`}
                        >
                            <FaTrash size={12} />
                        </button>
                    </div>
                </div>
                
                {/* Render children if folder is open */}
                {!isFile && isOpen && file.children && (
                    <div>
                        {file.children.map((child) => (
                            <FileItem
                                key={child.path}
                                file={child}
                                isOpen={openedFiles.includes(child.path)}
                                level={level + 1}
                            />
                        ))}
                    </div>
                )}
            </div>
        );
    };

    return (
        <>
            <div className="flex flex-col">
                {tree.map((file) => (
                    <FileItem
                        key={file.path}
                        file={file}
                        isOpen={openedFiles.includes(file.path)}
                        level={0}
                    />
                ))}
            </div>

            {/* Delete Confirmation Dialog */}
            {showDeleteConfirm && itemToDelete && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-zinc-800 rounded-md shadow-lg border border-zinc-700 w-80">
                        <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-700">
                            <h3 className="text-sm font-medium">Delete {itemToDelete.children === null ? 'File' : 'Folder'}</h3>
                            <button
                                onClick={() => setShowDeleteConfirm(false)}
                                className="text-zinc-400 hover:text-white"
                            >
                                <FaTimes size={14} />
                            </button>
                        </div>
                        <div className="p-4">
                            <p className="text-sm text-zinc-300 mb-4">
                                Are you sure you want to delete <span className="text-white font-medium">{itemToDelete.name}</span>?
                                {itemToDelete.children !== null && (
                                    <span className="block mt-2 text-red-400">
                                        This will also delete all contents inside the folder. This action cannot be undone.
                                    </span>
                                )}
                                {itemToDelete.children === null && (
                                    <span className="block mt-2 text-red-400">
                                        This action cannot be undone.
                                    </span>
                                )}
                            </p>
                            <div className="flex justify-end gap-2">
                                <button
                                    onClick={() => setShowDeleteConfirm(false)}
                                    className="px-3 py-1.5 text-xs bg-zinc-700 hover:bg-zinc-600 rounded"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmDelete}
                                    className="px-3 py-1.5 text-xs bg-red-600 hover:bg-red-500 rounded"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Rename Dialog */}
            {showRenameDialog && fileToRename && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-zinc-800 rounded-md shadow-lg border border-zinc-700 w-80">
                        <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-700">
                            <h3 className="text-sm font-medium">Rename File</h3>
                            <button
                                onClick={() => setShowRenameDialog(false)}
                                className="text-zinc-400 hover:text-white"
                            >
                                <FaTimes size={14} />
                            </button>
                        </div>
                        <div className="p-4">
                            <form onSubmit={(e) => {
                                e.preventDefault();
                                if (newFileName.trim() && newFileName !== fileToRename.name) {
                                    confirmRename();
                                }
                            }}>
                                <div className="mb-4">
                                    <label className="block text-xs text-zinc-400 mb-1">File Name</label>
                                    <input
                                        type="text"
                                        value={newFileName}
                                        onChange={(e) => setNewFileName(e.target.value)}
                                        className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                                        autoFocus
                                    />
                                </div>
                                <div className="flex justify-end gap-2">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setNewFileName('');
                                            setShowRenameDialog(false);
                                        }}
                                        className="px-3 py-1.5 text-xs bg-zinc-700 hover:bg-zinc-600 rounded"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-3 py-1.5 text-xs bg-blue-600 hover:bg-blue-500 rounded"
                                        disabled={!newFileName.trim() || newFileName === fileToRename.name}
                                    >
                                        Rename
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
});

Files.displayName = 'Files';

export default Files;