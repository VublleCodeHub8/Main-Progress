import React, { useEffect, useState, useCallback, useRef } from "react";
import Files from "./Files";
import { useDispatch, useSelector } from "react-redux";
import { filesAction } from "@/store/main";
import {
    FaChevronLeft,
    FaChevronRight,
    FaFolder,
    FaSync,
    FaSearch,
    FaPlus,
    FaEllipsisV,
    FaFolderPlus,
    FaFileMedical,
    FaExclamationTriangle,
    FaTimes
} from "react-icons/fa";

// Add this utility function outside the component
const searchInFileTree = (tree, searchTerm, filters) => {
    if (!tree || !searchTerm) return tree;

    const search = filters?.caseSensitive ? searchTerm : searchTerm.toLowerCase();

    const matchesSearch = (name) => {
        const itemName = filters?.caseSensitive ? name : name.toLowerCase();

        if (filters?.regex) {
            try {
                const regex = new RegExp(search);
                return regex.test(itemName);
            } catch (e) {
                return false;
            }
        }

        if (filters?.wholeWord) {
            const words = itemName.split(/[\s-_./]+/);
            return words.some(word => word === search);
        }

        return itemName.includes(search);
    };

    const filterTree = (items) => {
        if (!Array.isArray(items)) return [];

        return items.reduce((filtered, item) => {
            // Create a copy of the current item
            const newItem = { ...item };

            // Check if the current item matches the search
            const nameMatches = matchesSearch(item.name);

            // If it has children, recursively filter them
            if (item.children) {
                newItem.children = filterTree(item.children);
            }

            // Include the item if it matches or has matching children
            if (nameMatches || (newItem.children && newItem.children.length > 0)) {
                filtered.push(newItem);
            }

            return filtered;
        }, []);
    };

    return filterTree(tree);
};

export default function FileSystem({ socket }) {
    // State management
    const [fileTree, setFileTree] = useState(null);
    const [hide, setHide] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [showOptions, setShowOptions] = useState(false);
    const [error, setError] = useState(null);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [searchFilters, setSearchFilters] = useState({});
    const [showNewFileDialog, setShowNewFileDialog] = useState(false);
    const [showNewFolderDialog, setShowNewFolderDialog] = useState(false);
    const [newFileName, setNewFileName] = useState('');
    const [newFolderName, setNewFolderName] = useState('');

    // Refs
    const optionsRef = useRef(null);
    const searchDebounceRef = useRef(null);
    const mountedRef = useRef(true);

    // Redux
    const dispatch = useDispatch();
    const port = useSelector((state) => state.project.port) || 4000;

    // Close options menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (optionsRef.current && !optionsRef.current.contains(event.target)) {
                setShowOptions(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            mountedRef.current = false;
            if (searchDebounceRef.current) {
                clearTimeout(searchDebounceRef.current);
            }
        };
    }, []);

    // Fetch file tree with error handling and retry mechanism
    const getFileTree = useCallback(async (retryCount = 0) => {
        try {
            if (!port) {
                throw new Error("Port is not available");
            }

            setIsLoading(true);
            setError(null);
            setIsRefreshing(true);

            const res = await fetch(`http://localhost:${port}/project/files`);

            if (!res.ok) {
                throw new Error(`Failed to fetch files: ${res.statusText}`);
            }

            const data = await res.json();

            if (!data || typeof data !== 'object') {
                throw new Error("Invalid file tree data received");
            }

            if (mountedRef.current) {
                setFileTree(data);
                setError(null);
            }
        } catch (error) {
            console.error("File tree fetch error:", error);

            if (retryCount < 3 && mountedRef.current) {
                setTimeout(() => getFileTree(retryCount + 1), 1000 * (retryCount + 1));
                setError(`Retrying... (${retryCount + 1}/3)`);
            } else if (mountedRef.current) {
                setError("Failed to load file tree. Please try refreshing.");
            }
        } finally {
            if (mountedRef.current) {
                setIsLoading(false);
                setIsRefreshing(false);
            }
        }
    }, [port]);

    // Initial load
    useEffect(() => {
        getFileTree();
    }, [getFileTree]);

    // Socket handling
    useEffect(() => {
        if (!socket) return;

        const handleRefresh = () => {
            if (!isRefreshing) {
                getFileTree();
            }
        };

        socket.on("file:refresh", handleRefresh);
        socket.on("connect_error", () => setError("Socket connection lost"));

        return () => {
            socket.off("file:refresh", handleRefresh);
            socket.off("connect_error");
        };
    }, [socket, getFileTree, isRefreshing]);

    // Debounced search
    const handleSearch = (value) => {
        if (searchDebounceRef.current) {
            clearTimeout(searchDebounceRef.current);
        }

        searchDebounceRef.current = setTimeout(() => {
            setSearchTerm(value);
        }, 300);
    };

    // Action handlers
    const closeAll = useCallback(() => {
        dispatch(filesAction.setOpened([]));
    }, [dispatch]);

    const toggleHide = useCallback(() => {
        setHide(prev => !prev);
    }, []);

    const handleRefresh = useCallback(() => {
        if (!isRefreshing) {
            getFileTree();
        }
    }, [getFileTree, isRefreshing]);

    // Update the Files component rendering to use the filtered tree
    const getFilteredTree = useCallback(() => {
        if (!fileTree || !searchTerm) return fileTree;

        const filteredTree = searchInFileTree(fileTree, searchTerm, searchFilters);
        return filteredTree;
    }, [fileTree, searchTerm, searchFilters]);

    // Add this state for search results count
    const [searchResults, setSearchResults] = useState({
        total: 0,
        files: 0,
        folders: 0
    });

    // Update search results count when tree is filtered
    useEffect(() => {
        if (!searchTerm) {
            setSearchResults({ total: 0, files: 0, folders: 0 });
            return;
        }

        const countResults = (tree) => {
            let files = 0;
            let folders = 0;

            const traverse = (items) => {
                if (!Array.isArray(items)) return;

                items.forEach(item => {
                    if (item.children === null) {
                        files++;
                    } else {
                        folders++;
                        traverse(item.children);
                    }
                });
            };

            traverse(tree);
            return { total: files + folders, files, folders };
        };

        const filteredTree = getFilteredTree();
        setSearchResults(countResults(filteredTree));
    }, [searchTerm, getFilteredTree]);

    // Update the search results display in the footer
    const SearchResultsFooter = () => (
        <div className="h-8 border-t border-zinc-700 bg-zinc-800/50 px-3 flex items-center justify-between">
            {searchTerm ? (
                <div className="flex items-center gap-2 text-xs text-zinc-400">
                    <span>Found: {searchResults.total}</span>
                    {searchResults.total > 0 && (
                        <>
                            <span>•</span>
                            <span>{searchResults.files} files</span>
                            <span>•</span>
                            <span>{searchResults.folders} folders</span>
                        </>
                    )}
                </div>
            ) : (
                <span className="text-xs text-zinc-500">
                    {fileTree ? `${Object.keys(fileTree).length} items` : 'No items'}
                </span>
            )}
        </div>
    );

    // Error display component
    const ErrorMessage = ({ message, onRetry }) => (
        <div className="flex flex-col items-center justify-center h-full p-4 text-center">
            <FaExclamationTriangle className="text-yellow-500 text-4xl mb-3" />
            <p className="text-zinc-400 mb-2">{message}</p>
            <button
                onClick={onRetry}
                className="px-3 py-1.5 bg-zinc-700 hover:bg-zinc-600 rounded text-sm transition-colors"
            >
                Retry
            </button>
        </div>
    );

    async function handleNewFile(filePath) {
        try {
            // Validate input
            if (!filePath) {
                throw new Error('File path is required');
            }

            // Clean up path if needed (remove leading slashes, etc.)
            const cleanPath = filePath.replace(/^\/+/, '');

            // Send request to create the file
            const response = await fetch(`http://localhost:${port}/project/file/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ filePath: cleanPath }),
            });

            // Parse response
            const data = await response.json();

            // Handle errors
            if (!response.ok) {
                console.error('Failed to create file:', data.error);
                throw new Error(data.error || 'Failed to create file');
            }

            console.log('File created successfully:', data);
            return data;
        } catch (error) {
            console.error('Error in handleNewFile:', error);
            throw error;
        }
    }

    const handleNewFolder = async (folderPath) => {
        try {
            if (!folderPath) {
                throw new Error('Folder path is required');
            }

            // Clean up path if needed (remove leading slashes, etc.)
            const cleanPath = folderPath.replace(/^\/+/, '');

            // Send request to create the folder
            const response = await fetch(`http://localhost:${port}/project/folder/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ folderPath: cleanPath }),
            });

            // Parse response
            const data = await response.json();

            // Handle errors
            if (!response.ok) {
                console.error('Failed to create folder:', data.error);
                throw new Error(data.error || 'Failed to create folder');
            }

            console.log('Folder created successfully:', data);
            return data;
        } catch (error) {
            console.error('Error in handleNewFolder:', error);
            throw error;
        }
    }

    const handleDeleteFile = async (filePath) => {
        console.log('Received file delete request:', { filePath });
            
        try {
            if (!filePath) {
                throw new Error('File path is required');
            }

            // Clean up path - remove leading slashes and ../user/ prefix
            const cleanPath = filePath.replace(/^\/+/, '').replace(/^\.\.\/user\//, '');

            console.log('Sending file delete request:', { filePath, cleanPath });

            // Send request to delete the file
            const response = await fetch(`http://localhost:${port}/project/file/delete`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ filePath: cleanPath }),
            });

            // Parse response
            const data = await response.json();

            // Handle errors
            if (!response.ok) {
                console.error('Failed to delete file:', data.error);
                throw new Error(data.error || 'Failed to delete file');
            }

            console.log('File deleted successfully:', data);
            // Refresh the file tree after successful deletion
            handleRefresh();
            return data;
        } catch (error) {
            console.error('Error in handleDeleteFile:', error);
            throw error;
        }
    }

    const handleDeleteFolder = async (folderPath) => {
        try {
            if (!folderPath) {
                throw new Error('Folder path is required');
            }

            // Clean up path - remove leading slashes and ../user/ prefix
            const cleanPath = folderPath.replace(/^\/+/, '').replace(/^\.\.\/user\//, '');

            console.log('Sending folder delete request:', { folderPath, cleanPath });

            // Send request to delete the folder
            const response = await fetch(`http://localhost:${port}/project/folder/delete`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ folderPath: cleanPath }),
            });

            // Parse response
            const data = await response.json();
            console.log(data);
            // Handle errors
            if (!response.ok) {
                console.error('Failed to delete folder:', data.error);
                throw new Error(data.error || 'Failed to delete folder');
            }

            console.log('Folder deleted successfully:', data);
            // Refresh the file tree after successful deletion
            handleRefresh();
            return data;
        } catch (error) {
            console.error('Error in handleDeleteFolder:', error);
            throw error;
        }
    }

    const handleRenameFile = async (oldPath, newPath) => {
        try {
            if (!oldPath || !newPath) {
                throw new Error('Both old and new file paths are required');
            }

            // Clean up paths if needed (remove leading slashes, etc.)
            const cleanOldPath = oldPath.replace(/^\/+/, '');
            const cleanNewPath = newPath.replace(/^\/+/, '');

            // Send request to rename the file
            const response = await fetch(`http://localhost:${port}/project/file/rename`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    oldPath: cleanOldPath,
                    newPath: cleanNewPath 
                }),
            });

            // Parse response
            const data = await response.json();

            // Handle errors
            if (!response.ok) {
                console.error('Failed to rename file:', data.error);
                throw new Error(data.error || 'Failed to rename file');
            }

            console.log('File renamed successfully:', data);
            // Refresh the file tree after successful rename
            handleRefresh();
            return data;
        } catch (error) {
            console.error('Error in handleRenameFile:', error);
            throw error;
        }
    }

    return (
        <div className="h-full flex">
            {/* Collapsed Sidebar */}
            {hide && (
                <div className="w-12 h-full bg-zinc-900 border-r border-zinc-700 flex flex-col items-center py-2">
                    <button
                        onClick={toggleHide}
                        className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded transition-colors"
                        title="Show File Explorer"
                    >
                        <FaChevronRight size={16} />
                    </button>
                </div>
            )}

            {/* Expanded Sidebar */}
            <div className={`${hide ? 'hidden' : 'flex flex-col'} w-64 h-full bg-zinc-900 text-zinc-100`}>
                {/* Header */}
                <div className="flex items-center justify-between px-3 h-12 border-b border-zinc-700 bg-zinc-800">
                    <div className="flex items-center gap-2">
                        <FaFolder className="text-zinc-400" />
                        <span className="font-semibold">EXPLORER</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <button
                            onClick={handleRefresh}
                            disabled={isRefreshing}
                            className={`p-1.5 rounded transition-colors ${isRefreshing
                                ? 'text-zinc-600'
                                : 'text-zinc-400 hover:text-white hover:bg-zinc-700'
                                }`}
                            title={isRefreshing ? "Refreshing..." : "Refresh"}
                        >
                            <FaSync size={14} className={isRefreshing ? 'animate-spin' : ''} />
                        </button>
                        <button
                            onClick={toggleHide}
                            className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-700 rounded transition-colors"
                            title="Hide Sidebar"
                        >
                            <FaChevronLeft size={14} />
                        </button>
                    </div>
                </div>

                {/* Search Bar */}
                <div className="px-3 py-2 border-b border-zinc-700">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search files..."
                            onChange={(e) => handleSearch(e.target.value)}
                            className="w-full bg-zinc-800 text-zinc-100 text-sm rounded px-8 py-1.5 
                                     focus:outline-none focus:ring-1 focus:ring-zinc-600"
                        />
                        <FaSearch className="absolute left-2.5 top-2.5 text-zinc-500" size={12} />
                        {searchTerm && (
                            <button
                                onClick={() => setSearchTerm("")}
                                className="absolute right-2 top-2 text-zinc-500 hover:text-zinc-300"
                            >
                                <FaTimes size={12} />
                            </button>
                        )}
                    </div>
                </div>

                {/* Actions Bar */}
                <div className="flex items-center justify-between px-3 py-2 border-b border-zinc-700 bg-zinc-800/50">
                    <div className="flex items-center gap-1" ref={optionsRef}>
                        <button
                            onClick={() => setShowOptions(!showOptions)}
                            className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-700 rounded transition-colors"
                            title="New File/Folder"
                        >
                            <FaPlus size={14} />
                        </button>
                        {showOptions && (
                            <div className="absolute mt-8 bg-zinc-800 rounded shadow-lg border border-zinc-700 z-10">
                                <button
                                    onClick={() => setShowNewFileDialog(true)}
                                    className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-zinc-700">
                                    <FaFileMedical size={12} />
                                    New File
                                </button>
                                <button 
                                    onClick={() => setShowNewFolderDialog(true)}
                                    className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-zinc-700">
                                    <FaFolderPlus size={12} />
                                    New Folder
                                </button>
                            </div>
                        )}
                        <button
                            onClick={closeAll}
                            className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-700 rounded transition-colors"
                            title="Close All"
                        >
                            <FaEllipsisV size={14} />
                        </button>
                    </div>
                </div>

                {/* New File Dialog */}
                {showNewFileDialog && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                        <div className="bg-zinc-800 rounded-md shadow-lg border border-zinc-700 w-80">
                            <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-700">
                                <h3 className="text-sm font-medium">Create New File</h3>
                                <button
                                    onClick={() => setShowNewFileDialog(false)}
                                    className="text-zinc-400 hover:text-white"
                                >
                                    <FaTimes size={14} />
                                </button>
                            </div>
                            <div className="p-4">
                                <form onSubmit={(e) => {
                                    e.preventDefault();
                                    const filePath = newFileName.trim();
                                    if (filePath) {
                                        handleNewFile(filePath);
                                        setNewFileName('');
                                        setShowNewFileDialog(false);
                                        setShowOptions(false);
                                    }
                                }}>
                                    <div className="mb-4">
                                        <label className="block text-xs text-zinc-400 mb-1">File Name</label>
                                        <input
                                            type="text"
                                            value={newFileName}
                                            onChange={(e) => setNewFileName(e.target.value)}
                                            placeholder="example.js"
                                            className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                                            autoFocus
                                        />
                                    </div>
                                    <div className="flex justify-end gap-2">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setNewFileName('');
                                                setShowNewFileDialog(false);
                                            }}
                                            className="px-3 py-1.5 text-xs bg-zinc-700 hover:bg-zinc-600 rounded"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="px-3 py-1.5 text-xs bg-blue-600 hover:bg-blue-500 rounded"
                                        >
                                            Create
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                )}

                {/* New Folder Dialog */}
                {showNewFolderDialog && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                        <div className="bg-zinc-800 rounded-md shadow-lg border border-zinc-700 w-80">
                            <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-700">
                                <h3 className="text-sm font-medium">Create New Folder</h3>
                                <button
                                    onClick={() => setShowNewFolderDialog(false)}
                                    className="text-zinc-400 hover:text-white"
                                >
                                    <FaTimes size={14} />
                                </button>
                            </div>
                            <div className="p-4">
                                <form onSubmit={async (e) => {
                                    e.preventDefault();
                                    const folderPath = newFolderName.trim();
                                    if (folderPath) {
                                        try {
                                            await handleNewFolder(folderPath);
                                            setNewFolderName('');
                                            setShowNewFolderDialog(false);
                                            setShowOptions(false);
                                            // Refresh the file tree
                                            handleRefresh();
                                        } catch (error) {
                                            // You might want to show this error to the user in a more user-friendly way
                                            console.error('Failed to create folder:', error);
                                        }
                                    }
                                }}>
                                    <div className="mb-4">
                                        <label className="block text-xs text-zinc-400 mb-1">Folder Name</label>
                                        <input
                                            type="text"
                                            value={newFolderName}
                                            onChange={(e) => setNewFolderName(e.target.value)}
                                            placeholder="my-folder"
                                            className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                                            autoFocus
                                        />
                                    </div>
                                    <div className="flex justify-end gap-2">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setNewFolderName('');
                                                setShowNewFolderDialog(false);
                                            }}
                                            className="px-3 py-1.5 text-xs bg-zinc-700 hover:bg-zinc-600 rounded"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="px-3 py-1.5 text-xs bg-blue-600 hover:bg-blue-500 rounded"
                                        >
                                            Create
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                )}

                {/* File Tree */}
                <div className="flex-1 overflow-y-auto">
                    {isLoading ? (
                        <div className="flex items-center justify-center h-full">
                            <span className="text-zinc-500">Loading...</span>
                        </div>
                    ) : error ? (
                        <div className="flex items-center justify-center h-full text-red-500">
                            <FaExclamationTriangle className="mr-2" />
                            {error}
                        </div>
                    ) : (
                        <Files 
                            tree={getFilteredTree()} 
                            searchTerm={searchTerm}
                            onDeleteFile={handleDeleteFile}
                            onDeleteFolder={handleDeleteFolder}
                            onRenameFile={handleRenameFile}
                        />
                    )}
                </div>

                <SearchResultsFooter />
            </div>
        </div>
    );
}
