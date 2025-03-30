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
    FaTimes,
    FaStream,
    FaList,
    FaFilter
} from "react-icons/fa";

// Add this utility function outside the component
const filterTree = (tree, filterFn = null) => {
    if (!tree) return null;
    
    const filtered = tree.reduce((acc, item) => {
        const passesFilter = !filterFn || filterFn(item);
        if (item.children) {
            const filteredChildren = filterTree(item.children, filterFn);
            if (filteredChildren.length > 0 || passesFilter) {
                acc.push({ ...item, children: filteredChildren });
            }
        } else if (passesFilter) {
            acc.push(item);
        }
        return acc;
    }, []);
    
    return filtered;
};

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

    return filterTree(tree, (item) => matchesSearch(item.name));
};

export default function FileSystem({ socket, onSidebarToggle, isHidden }) {
    // State management
    const [fileTree, setFileTree] = useState(null);
    const [hide, setHide] = useState(isHidden);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [showOptions, setShowOptions] = useState(false);
    const [error, setError] = useState(null);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [searchFilters, setSearchFilters] = useState({
        showHidden: false,
        fileTypes: [],
        modifiedWithin: null,
        caseSensitive: false,
        regex: false,
        wholeWord: false
    });
    const [showNewFileDialog, setShowNewFileDialog] = useState(false);
    const [showNewFolderDialog, setShowNewFolderDialog] = useState(false);
    const [newFileName, setNewFileName] = useState('');
    const [newFolderName, setNewFolderName] = useState('');
    const [showFilterMenu, setShowFilterMenu] = useState(false);
    const [recentFiles, setRecentFiles] = useState([]);
    const [viewMode, setViewMode] = useState('tree'); // 'tree' or 'list'

    // Refs
    const optionsRef = useRef(null);
    const filterMenuRef = useRef(null);
    const searchDebounceRef = useRef(null);
    const mountedRef = useRef(true);

    // Redux
    const dispatch = useDispatch();
    const port = useSelector((state) => state.project.port) || 4000;

    // Enhanced file tree filtering with search and filters
    const getFilteredTree = useCallback(() => {
        if (!fileTree) return null;
        
        return searchInFileTree(fileTree, searchTerm, searchFilters);
    }, [fileTree, searchTerm, searchFilters]);

    // Handle search with debounce
    const handleSearch = useCallback((term) => {
        setSearchTerm(term);
        if (searchDebounceRef.current) {
            clearTimeout(searchDebounceRef.current);
        }
        searchDebounceRef.current = setTimeout(() => {
            // The UI will update automatically due to state change
        }, 300);
    }, []);

    // Track recent files
    const trackRecentFile = useCallback((file) => {
        setRecentFiles(prev => {
            const newRecent = [file, ...prev.filter(f => f.path !== file.path)].slice(0, 5);
            localStorage.setItem('recentFiles', JSON.stringify(newRecent));
            return newRecent;
        });
    }, []);

    // Load recent files on mount
    useEffect(() => {
        const saved = localStorage.getItem('recentFiles');
        if (saved) {
            try {
                setRecentFiles(JSON.parse(saved));
            } catch (e) {
                console.error('Failed to load recent files:', e);
            }
        }
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

    // Update search results count when tree is filtered
    const [searchResults, setSearchResults] = useState({
        total: 0,
        files: 0,
        folders: 0
    });

    useEffect(() => {
        if (!searchTerm) {
            setSearchResults({ total: 0, files: 0, folders: 0 });
            return;
        }

        const filtered = getFilteredTree();
        if (!filtered) return;

        const countResults = (items) => {
            return items.reduce((counts, item) => {
                if (item.children) {
                    counts.folders++;
                    const childCounts = countResults(item.children);
                    counts.files += childCounts.files;
                    counts.folders += childCounts.folders;
                } else {
                    counts.files++;
                }
                return counts;
            }, { files: 0, folders: 0 });
        };

        const counts = countResults(filtered);
        setSearchResults({
            total: counts.files + counts.folders,
            files: counts.files,
            folders: counts.folders
        });
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
        <div className="h-full flex flex-col bg-zinc-800">
            {/* Header with view toggle */}
            <div className="flex items-center justify-between p-3 border-b border-zinc-700">
                <div className="flex items-center gap-2">
                    <h2 className="text-sm font-medium text-gray-200">Explorer</h2>
                    <div className="flex items-center gap-1 ml-2">
                        <button
                            onClick={() => setViewMode('tree')}
                            className={`p-1.5 rounded-lg transition-colors ${
                                viewMode === 'tree' 
                                    ? 'bg-zinc-700 text-white' 
                                    : 'text-gray-400 hover:text-gray-200 hover:bg-zinc-700/50'
                            }`}
                            title="Tree View"
                        >
                            <FaStream size={12} />
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`p-1.5 rounded-lg transition-colors ${
                                viewMode === 'list' 
                                    ? 'bg-zinc-700 text-white' 
                                    : 'text-gray-400 hover:text-gray-200 hover:bg-zinc-700/50'
                            }`}
                            title="List View"
                        >
                            <FaList size={12} />
                        </button>
                    </div>
                </div>
                <div className="flex items-center gap-1">
                    <button
                        onClick={() => handleRefresh()}
                        disabled={isRefreshing}
                        className={`p-1.5 rounded-lg transition-colors ${
                            isRefreshing
                                ? 'text-zinc-600'
                                : 'text-gray-400 hover:text-gray-200 hover:bg-zinc-700/50'
                        }`}
                        title={isRefreshing ? "Refreshing..." : "Refresh"}
                    >
                        <FaSync size={12} className={isRefreshing ? 'animate-spin' : ''} />
                    </button>
                    <button
                        onClick={() => onSidebarToggle(prev => !prev)}
                        className="p-1.5 rounded-lg hover:bg-zinc-700/50 text-gray-400 hover:text-gray-200 transition-colors"
                        title={isHidden ? "Show Sidebar" : "Hide Sidebar"}
                    >
                        <FaChevronLeft
                            size={14}
                            className={`transform transition-transform duration-300 ${
                                isHidden ? 'rotate-180' : ''
                            }`}
                        />
                    </button>
                </div>
            </div>

            {/* Enhanced Search Bar */}
            <div className="p-3 border-b border-zinc-700">
                <div className="relative group">
                    <input
                        type="text"
                        placeholder="Search files..."
                        value={searchTerm}
                        onChange={(e) => handleSearch(e.target.value)}
                        className="w-full bg-zinc-900/50 text-gray-200 text-sm rounded-lg pl-8 pr-8 py-1.5
                                 border border-transparent focus:border-zinc-600
                                 focus:outline-none focus:ring-1 focus:ring-zinc-600
                                 placeholder-gray-500"
                    />
                    <FaSearch className="absolute left-2.5 top-2.5 text-gray-500 group-focus-within:text-gray-400" size={12} />
                    {searchTerm && (
                        <button
                            onClick={() => handleSearch("")}
                            className="absolute right-2.5 top-2 text-gray-500 hover:text-gray-400 p-0.5"
                        >
                            <FaTimes size={12} />
                        </button>
                    )}
                </div>
                
                {/* Search Filters */}
                <div className="flex items-center gap-2 mt-2 text-xs text-gray-400">
                    <button
                        onClick={() => setShowFilterMenu(true)}
                        className="flex items-center gap-1 px-2 py-1 rounded hover:bg-zinc-700/50 transition-colors"
                    >
                        <FaFilter size={10} />
                        Filters
                        {Object.values(searchFilters).some(v => v) && (
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                        )}
                    </button>
                    {searchFilters.fileTypes.map(type => (
                        <span key={type} className="px-2 py-0.5 rounded bg-zinc-700/50">
                            {type}
                        </span>
                    ))}
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto">
                {isLoading ? (
                    <div className="flex items-center justify-center h-full">
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-zinc-600 border-t-blue-500"></div>
                    </div>
                ) : error ? (
                    <div className="flex flex-col items-center justify-center h-full text-red-500 p-4 text-center">
                        <FaExclamationTriangle size={20} className="mb-2" />
                        <p className="text-sm">{error}</p>
                        <button
                            onClick={handleRefresh}
                            className="mt-4 px-3 py-1 text-xs bg-zinc-700 hover:bg-zinc-600 text-gray-200 rounded-lg transition-colors"
                        >
                            Try Again
                        </button>
                    </div>
                ) : (
                    <>
                        {/* Recent Files Section */}
                        {recentFiles.length > 0 && !searchTerm && (
                            <div className="mb-4">
                                <div className="px-3 py-2 text-xs font-medium text-gray-400 bg-zinc-800/50">
                                    Recent Files
                                </div>
                                {recentFiles.map(file => (
                                    <button
                                        key={file.path}
                                        onClick={() => handleFileClick(file)}
                                        className="w-full px-3 py-1.5 text-sm text-gray-300 hover:bg-zinc-700/50 flex items-center gap-2"
                                    >
                                        {getFileIcon(file.name)}
                                        <span className="truncate">{file.name}</span>
                                    </button>
                                ))}
                            </div>
                        )}
                        
                        {/* File Tree/List */}
                        <Files 
                            tree={getFilteredTree()} 
                            viewMode={viewMode}
                            searchTerm={searchTerm}
                            onDeleteFile={handleDeleteFile}
                            onDeleteFolder={handleDeleteFolder}
                            onRenameFile={handleRenameFile}
                            onFileClick={(file) => {
                                handleFileClick(file);
                                trackRecentFile(file);
                            }}
                        />
                    </>
                )}
            </div>

            {/* Action Buttons */}
            <div className="p-3 border-t border-zinc-700 bg-zinc-800/50">
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setShowNewFileDialog(true)}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 
                                 bg-blue-600 hover:bg-blue-500 rounded-lg transition-all duration-200
                                 text-sm text-white shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30
                                 transform hover:-translate-y-0.5"
                    >
                        <FaFileMedical size={12} className="text-blue-200" />
                        New File
                    </button>
                    <button
                        onClick={() => setShowNewFolderDialog(true)}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 
                                 bg-amber-600 hover:bg-amber-500 rounded-lg transition-all duration-200
                                 text-sm text-white shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30
                                 transform hover:-translate-y-0.5"
                    >
                        <FaFolderPlus size={12} className="text-amber-200" />
                        New Folder
                    </button>
                </div>
            </div>

            {/* New File Dialog */}
            {showNewFileDialog && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
                    <div className="bg-zinc-800 rounded-xl shadow-xl border border-zinc-700 w-96 transform transition-all duration-200">
                        <div className="flex items-center justify-between p-4 border-b border-zinc-700">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-500/10 rounded-lg">
                                    <FaFileMedical size={16} className="text-blue-500" />
                                </div>
                                <h3 className="text-lg font-medium text-gray-200">Create New File</h3>
                            </div>
                            <button
                                onClick={() => setShowNewFileDialog(false)}
                                className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-zinc-700/50 transition-colors"
                            >
                                <FaTimes size={16} />
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
                                }
                            }}>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-1">File Name</label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                value={newFileName}
                                                onChange={(e) => setNewFileName(e.target.value)}
                                                placeholder="example.js"
                                                className="w-full px-4 py-2 bg-zinc-900/50 border border-zinc-700 rounded-lg
                                                         text-gray-200 placeholder-gray-500
                                                         focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500
                                                         transition-all duration-200"
                                                autoFocus
                                            />
                                            {newFileName && (
                                                <button
                                                    type="button"
                                                    onClick={() => setNewFileName('')}
                                                    className="absolute right-2 top-2 p-1 text-gray-500 hover:text-gray-400
                                                             rounded-full hover:bg-zinc-700/50 transition-colors"
                                                >
                                                    <FaTimes size={12} />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex justify-end gap-3 mt-6">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setNewFileName('');
                                            setShowNewFileDialog(false);
                                        }}
                                        className="px-4 py-2 text-sm text-gray-400 hover:text-gray-300 
                                                 bg-zinc-700 hover:bg-zinc-600 rounded-lg transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 text-sm text-white bg-blue-600 hover:bg-blue-500 
                                                 rounded-lg transition-colors shadow-lg shadow-blue-500/20
                                                 hover:shadow-blue-500/30 transform hover:-translate-y-0.5"
                                    >
                                        Create File
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* New Folder Dialog */}
            {showNewFolderDialog && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
                    <div className="bg-zinc-800 rounded-xl shadow-xl border border-zinc-700 w-96 transform transition-all duration-200">
                        <div className="flex items-center justify-between p-4 border-b border-zinc-700">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-amber-500/10 rounded-lg">
                                    <FaFolderPlus size={16} className="text-amber-500" />
                                </div>
                                <h3 className="text-lg font-medium text-gray-200">Create New Folder</h3>
                            </div>
                            <button
                                onClick={() => setShowNewFolderDialog(false)}
                                className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-zinc-700/50 transition-colors"
                            >
                                <FaTimes size={16} />
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
                                        handleRefresh();
                                    } catch (error) {
                                        console.error('Failed to create folder:', error);
                                    }
                                }
                            }}>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-1">Folder Name</label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                value={newFolderName}
                                                onChange={(e) => setNewFolderName(e.target.value)}
                                                placeholder="my-folder"
                                                className="w-full px-4 py-2 bg-zinc-900/50 border border-zinc-700 rounded-lg
                                                         text-gray-200 placeholder-gray-500
                                                         focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500
                                                         transition-all duration-200"
                                                autoFocus
                                            />
                                            {newFolderName && (
                                                <button
                                                    type="button"
                                                    onClick={() => setNewFolderName('')}
                                                    className="absolute right-2 top-2 p-1 text-gray-500 hover:text-gray-400
                                                             rounded-full hover:bg-zinc-700/50 transition-colors"
                                                >
                                                    <FaTimes size={12} />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex justify-end gap-3 mt-6">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setNewFolderName('');
                                            setShowNewFolderDialog(false);
                                        }}
                                        className="px-4 py-2 text-sm text-gray-400 hover:text-gray-300 
                                                 bg-zinc-700 hover:bg-zinc-600 rounded-lg transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 text-sm text-white bg-amber-600 hover:bg-amber-500 
                                                 rounded-lg transition-colors shadow-lg shadow-amber-500/20
                                                 hover:shadow-amber-500/30 transform hover:-translate-y-0.5"
                                    >
                                        Create Folder
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Search Results Footer */}
            <SearchResultsFooter />
        </div>
    );
}
