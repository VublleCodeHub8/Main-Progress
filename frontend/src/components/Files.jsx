import React, { memo } from 'react';
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
    FaDatabase
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
        'c': <FaCode {...iconProps} className="text-blue-300" />
    };

    return iconMap[extension] || <FaFile {...iconProps} className="text-gray-400" />;
};

const Files = memo(({ tree, searchTerm = "" }) => {
    const dispatch = useDispatch();
    const openedFiles = useSelector((state) => state.files.opened);
    const selectedFile = useSelector((state) => state.files.selected);

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
                    className={`flex items-center py-1 px-2 cursor-pointer text-sm
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
                </div>
                
                {/* Render children if folder is open */}
                {!isFile && isOpen && (
                    <div className="relative">
                        <div className="absolute left-[19px] top-0 bottom-0 w-px bg-zinc-700 opacity-50" />
                        <Files tree={file.children} searchTerm={searchTerm} />
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="flex flex-col">
            {tree.map((file) => (
                <FileItem
                    key={file.path}
                    file={file}
                    isOpen={file.children !== null && openedFiles.includes(file.path)}
                    level={file.level}
                />
            ))}
        </div>
    );
});

Files.displayName = 'Files';

export default Files;