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
    FaPencilAlt,
    FaExclamationTriangle,
    FaEdit,
    FaCheck
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
    const [error, setError] = useState('');

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

    const handleDelete = (file) => {
        setItemToDelete(file);
        setShowDeleteConfirm(true);
    };

    const confirmDelete = async () => {
        try {
            setError('');
            if (!itemToDelete) return;
            
            if (itemToDelete.children === null) {
                await onDeleteFile(itemToDelete.path);
            } else {
                await onDeleteFolder(itemToDelete.path);
            }
            
            // Clear selection if deleted item was selected
            if (selectedFile?.path === itemToDelete.path) {
                dispatch(filesAction.setSelected(null));
            }
            
            setShowDeleteConfirm(false);
            setItemToDelete(null);
        } catch (error) {
            setError('Failed to delete item. Please try again.');
            console.error('Failed to delete item:', error);
        }
    };

    const handleRename = (file) => {
        setFileToRename(file);
        setNewFileName(file.name);
        setShowRenameDialog(true);
    };

    const confirmRename = async () => {
        try {
            setError('');
            if (!fileToRename || !newFileName.trim()) return;

            // Validate filename
            if (!/^[a-zA-Z0-9-_. ]+$/.test(newFileName)) {
                setError('Invalid filename. Use only letters, numbers, spaces, and -_.');
                return;
            }

            const newPath = fileToRename.path.replace(fileToRename.name, newFileName);
            await onRenameFile(fileToRename.path, newPath);
            
            // Update selection if renamed file was selected
            if (selectedFile?.path === fileToRename.path) {
                dispatch(filesAction.setSelected({ ...selectedFile, path: newPath, name: newFileName }));
            }
            
            setShowRenameDialog(false);
            setFileToRename(null);
            setNewFileName('');
            setError('');
        } catch (error) {
            setError('Failed to rename file. Please try again.');
            console.error('Failed to rename file:', error);
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
                                onClick={(e) => handleRename(file)}
                                className="text-gray-400 hover:text-blue-500 transition-all duration-200"
                                title="Rename file"
                            >
                                <FaPencilAlt size={12} />
                            </button>
                        )}
                        <button
                            onClick={(e) => handleDelete(file)}
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
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
                    <div className="bg-zinc-800 rounded-xl shadow-xl border border-zinc-700 w-[400px] transform transition-all duration-200">
                        <div className="flex items-center gap-3 p-4 border-b border-zinc-700">
                            <div className="p-2 bg-red-500/10 rounded-lg">
                                <FaExclamationTriangle size={20} className="text-red-500" />
                            </div>
                            <h3 className="text-lg font-medium text-red-500">Confirm Delete</h3>
                        </div>
                        <div className="p-4">
                            <p className="text-gray-300">
                                Are you sure you want to delete this {itemToDelete.children === null ? 'file' : 'folder'}?
                                {itemToDelete.children !== null && (
                                    <span className="block mt-1 text-red-400 text-sm">
                                        This will delete all contents inside the folder.
                                    </span>
                                )}
                            </p>
                            <div className="mt-2 p-3 bg-zinc-900/50 rounded-lg border border-zinc-700">
                                <div className="flex items-center gap-2">
                                    {itemToDelete.children === null ? (
                                        <FaFile size={14} className="text-zinc-400" />
                                    ) : (
                                        <FaFolder size={14} className="text-zinc-400" />
                                    )}
                                    <span className="text-sm font-medium text-zinc-300">{itemToDelete.name}</span>
                                </div>
                                <div className="mt-1 text-xs text-zinc-500 truncate">
                                    {itemToDelete.path}
                                </div>
                            </div>
                            {error && (
                                <div className="mt-3 text-sm text-red-400">
                                    {error}
                                </div>
                            )}
                            <div className="flex justify-end gap-3 mt-6">
                                <button
                                    onClick={() => {
                                        setShowDeleteConfirm(false);
                                        setItemToDelete(null);
                                        setError('');
                                    }}
                                    className="px-4 py-2 text-sm text-gray-400 hover:text-gray-300 
                                             bg-zinc-700 hover:bg-zinc-600 rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmDelete}
                                    className="px-4 py-2 text-sm text-white bg-red-600 hover:bg-red-500
                                             rounded-lg transition-colors flex items-center gap-2"
                                >
                                    <FaTimes size={12} />
                                    Delete {itemToDelete.children === null ? 'File' : 'Folder'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Rename Dialog */}
            {showRenameDialog && fileToRename && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
                    <div className="bg-zinc-800 rounded-xl shadow-xl border border-zinc-700 w-[400px] transform transition-all duration-200">
                        <div className="flex items-center gap-3 p-4 border-b border-zinc-700">
                            <div className="p-2 bg-blue-500/10 rounded-lg">
                                <FaEdit size={20} className="text-blue-500" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-200">
                                Rename {fileToRename.children === null ? 'File' : 'Folder'}
                            </h3>
                        </div>
                        <div className="p-4">
                            <div className="mb-4 p-3 bg-zinc-900/50 rounded-lg border border-zinc-700">
                                <div className="flex items-center gap-2">
                                    {fileToRename.children === null ? (
                                        <FaFile size={14} className="text-zinc-400" />
                                    ) : (
                                        <FaFolder size={14} className="text-zinc-400" />
                                    )}
                                    <span className="text-sm font-medium text-zinc-300">{fileToRename.name}</span>
                                </div>
                                <div className="mt-1 text-xs text-zinc-500 truncate">
                                    {fileToRename.path}
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-2">New name</label>
                                <input
                                    type="text"
                                    value={newFileName}
                                    onChange={(e) => setNewFileName(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && !e.shiftKey) {
                                            e.preventDefault();
                                            confirmRename();
                                        }
                                    }}
                                    className="w-full px-3 py-2 bg-zinc-900/50 border border-zinc-700 rounded-lg
                                             text-sm text-gray-200 placeholder-gray-500
                                             focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500
                                             transition-all duration-200"
                                    autoFocus
                                />
                                <p className="mt-2 text-xs text-gray-500">
                                    Press Enter to confirm or Esc to cancel
                                </p>
                            </div>
                            {error && (
                                <div className="mt-3 text-sm text-red-400">
                                    {error}
                                </div>
                            )}
                            <div className="flex justify-end gap-3 mt-6">
                                <button
                                    onClick={() => {
                                        setShowRenameDialog(false);
                                        setFileToRename(null);
                                        setNewFileName('');
                                        setError('');
                                    }}
                                    className="px-4 py-2 text-sm text-gray-400 hover:text-gray-300 
                                             bg-zinc-700 hover:bg-zinc-600 rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmRename}
                                    disabled={!newFileName.trim()}
                                    className="px-4 py-2 text-sm text-white bg-blue-600 hover:bg-blue-500
                                             rounded-lg transition-colors flex items-center gap-2
                                             disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <FaCheck size={12} />
                                    Rename
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
});

Files.displayName = 'Files';

export default Files;