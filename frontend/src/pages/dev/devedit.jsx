import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import React, { useState, useEffect } from 'react';
import { Power, Edit } from "lucide-react";


const DevEdit = () => {
    const [templates, setTemplates] = useState([]);
    const token = useSelector((state) => state.misc.token);

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            {/* Header */}
            <div className="mb-8 flex items-center justify-between">
                <Link to="/">
                    <h1 className="text-4xl font-bold">Developer Dashboard</h1>
                </Link>
                <div className="flex gap-4">
                    <Link
                        to="/auth"
                        className="flex items-center gap-2 rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600"
                    >
                        <Power className="h-4 w-4" />
                        Logout
                    </Link>
                    <Link
                        to="/dev"
                        className="flex items-center gap-2 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                    >
                        <Edit className="h-4 w-4" />
                        Dev
                    </Link>
                </div>
            </div>
        </div>

    );
}

export default DevEdit;                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         