import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Power, Search, Shield, User, Calendar, Box, Clock, Activity } from "lucide-react";

const ContainerHistory = () => {
    const token = useSelector((state) => state.misc.token);
    const [containerHistory, setContainerHistory] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const fetchContainerHistory = async () => {
            try {
                const response = await fetch("http://localhost:3000/admin/getAllContainerHistory", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token.token}`
                    }
                })
                const data = await response.json();
                setContainerHistory(data);
            } catch (error) {
                console.error("Error fetching container history:", error);
            }
        };
        fetchContainerHistory();
    }, [token]);

    const filteredContainerHistory = containerHistory.filter((container) => {
        return container.userName.toLowerCase().includes(searchTerm.toLowerCase()) || container.template.toLowerCase().includes(searchTerm.toLowerCase());
    })

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-8">
            {/* Enhanced Header Section */}
            <div className="mb-8">
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                    <div className="flex items-center justify-between flex-wrap gap-4">
                        <div className="flex items-center gap-5">
                            {/* Single Prominent Icon */}
                            <div className="h-16 w-16 rounded-xl bg-gradient-to-br from-gray-900 to-gray-700 
                                         flex items-center justify-center shadow-lg transform 
                                         hover:scale-105 transition-transform duration-300 group">
                                <Activity className="h-8 w-8 text-white transform group-hover:-rotate-12 transition-transform" />
                            </div>
                            
                            {/* Title and Subtitle */}
                            <div>
                                <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                                    Container History
                                </h1>
                                <p className="text-gray-500 flex items-center gap-2 mt-1">
                                    <Clock className="h-4 w-4" />
                                    Track and monitor container lifecycle events
                                </p>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-3">
                            <Link
                                to="/admin"
                                className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium
                                         bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 
                                         transition-all duration-200 shadow-sm hover:shadow group"
                            >
                                <Shield className="h-4 w-4 group-hover:scale-110 transition-transform" />
                                Dashboard
                            </Link>
                            <Link
                                to="/auth"
                                className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium
                                         bg-black text-white rounded-lg hover:bg-gray-800 
                                         transition-all duration-200 shadow-sm hover:shadow group"
                            >
                                <Power className="h-4 w-4 group-hover:scale-110 transition-transform" />
                                Logout
                            </Link>
                        </div>
                    </div>

                    {/* Enhanced Search Bar */}
                    <div className="mt-6 max-w-2xl">
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                placeholder="Search by user or template..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="block w-full pl-10 pr-3 py-2.5 text-sm
                                         border border-gray-300 rounded-lg
                                         focus:ring-2 focus:ring-black focus:border-transparent
                                         placeholder-gray-400 transition-all duration-200
                                         bg-gray-50 hover:bg-white focus:bg-white"
                            />
                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                                <span className="text-sm text-gray-400">
                                    Press '/' to focus
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
                        <QuickStat 
                            title="Total Containers" 
                            value={containerHistory.length}
                            icon={<Box className="h-4 w-4" />}
                        />
                        <QuickStat 
                            title="Active Templates" 
                            value={new Set(containerHistory.map(c => c.template)).size}
                            icon={<Activity className="h-4 w-4" />}
                        />
                        <QuickStat 
                            title="Created Today" 
                            value={containerHistory.filter(c => isToday(new Date(c.createdAt))).length}
                            icon={<Calendar className="h-4 w-4" />}
                            valueColor="text-green-600"
                        />
                        <QuickStat 
                            title="Deleted Today" 
                            value={containerHistory.filter(c => isToday(new Date(c.deletedAt))).length}
                            icon={<Clock className="h-4 w-4" />}
                            valueColor="text-red-600"
                        />
                    </div>
                </div>
            </div>

            {/* Enhanced Container History Table */}
            <Card className="shadow-lg">
                <CardHeader className="bg-gray-50 border-b border-gray-100">
                    <CardTitle className="text-xl font-semibold text-gray-800">Container Activity Log</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <ContainerHistoryTable containerHistory={filteredContainerHistory} />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

// Helper function to check if date is today
const isToday = (date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear();
};

// Quick Stat Component
const QuickStat = ({ title, value, icon, valueColor = "text-gray-900" }) => (
    <div className="bg-white rounded-lg p-4 border border-gray-100 shadow-sm hover:shadow transition-shadow duration-200">
        <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <div className="text-gray-400">{icon}</div>
        </div>
        <p className={`text-2xl font-semibold mt-2 ${valueColor}`}>{value}</p>
    </div>
);

// Enhanced Container History Table
const ContainerHistoryTable = ({ containerHistory }) => {
    return (
        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
            <table className="w-full border-collapse bg-white text-left text-sm text-gray-500">
                <thead className="bg-gray-50/80">
                    <tr>
                        <TableHeader title="User Details" />
                        <TableHeader title="Email" />
                        <TableHeader title="Template" />
                        <TableHeader title="Container" />
                        <TableHeader title="Created" />
                        <TableHeader title="Deleted" />
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 border-t border-gray-100">
                    {containerHistory.length === 0 ? (
                        <tr>
                            <td colSpan={6} className="px-6 py-8 text-center">
                                <div className="flex flex-col items-center gap-2">
                                    <Box className="h-8 w-8 text-gray-400" />
                                    <p className="text-gray-500 font-medium">No container history found</p>
                                    <p className="text-gray-400 text-sm">Try adjusting your search criteria</p>
                                </div>
                            </td>
                        </tr>
                    ) : (
                        containerHistory.map((container) => (
                            <tr 
                                key={container._id} 
                                className="hover:bg-gray-50/60 transition-all duration-200"
                            >
                                {/* User Name Cell */}
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 
                                                    flex items-center justify-center shadow-sm">
                                            <User className="h-5 w-5 text-gray-600" />
                                        </div>
                                        <div>
                                            <div className="font-medium text-gray-900">
                                                {container.userName}
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                ID: {container._id.slice(0, 8)}...
                                            </div>
                                        </div>
                                    </div>
                                </td>

                                {/* Email Cell */}
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        <div className="h-2 w-2 rounded-full bg-purple-400"></div>
                                        <span className="text-sm text-gray-600">
                                            {container.email}
                                        </span>
                                    </div>
                                </td>

                                {/* Template Cell */}
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 
                                                     text-xs font-medium bg-blue-50 text-blue-700 
                                                     ring-1 ring-inset ring-blue-600/20">
                                            <Box className="h-3.5 w-3.5" />
                                            {container.template}
                                        </span>
                                    </div>
                                </td>

                                {/* Container Name Cell */}
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                                            {container.containerName}
                                        </span>
                                    </div>
                                </td>

                                {/* Created At Cell */}
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        <DateCell 
                                            date={container.createdAt} 
                                            isCreated={true}
                                            className="group"
                                        >
                                            <div className="invisible group-hover:visible absolute -top-8 left-1/2 
                                                        transform -translate-x-1/2 px-2 py-1 bg-black text-white 
                                                        text-xs rounded whitespace-nowrap">
                                                Created
                                            </div>
                                        </DateCell>
                                    </div>
                                </td>

                                {/* Deleted At Cell */}
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        <DateCell 
                                            date={container.deletedAt} 
                                            isCreated={false}
                                            className="group"
                                        >
                                            <div className="invisible group-hover:visible absolute -top-8 left-1/2 
                                                        transform -translate-x-1/2 px-2 py-1 bg-black text-white 
                                                        text-xs rounded whitespace-nowrap">
                                                Deleted
                                            </div>
                                        </DateCell>
                                    </div>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};

// Enhanced Table Header
const TableHeader = ({ title }) => (
    <th className="px-6 py-4 text-xs font-medium uppercase tracking-wider text-gray-500 bg-gray-50/80 
                   border-b border-gray-200">
        {title}
    </th>
);

// Enhanced Date Cell
const DateCell = ({ date, isCreated, children }) => {
    const dateObj = new Date(date);
    const formattedDate = dateObj.toLocaleString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    });
    
    return (
        <div className="relative group">
            <span className={`inline-flex items-center gap-2 px-2.5 py-1.5 rounded-full 
                          ${isCreated 
                            ? 'bg-green-50 text-green-700 ring-1 ring-green-600/20' 
                            : 'bg-red-50 text-red-700 ring-1 ring-red-600/20'}`}>
                <span className={`h-1.5 w-1.5 rounded-full ${
                    isCreated ? 'bg-green-600 animate-pulse' : 'bg-red-600'
                }`} />
                <span className="text-xs font-medium">
                    {formattedDate}
                </span>
            </span>
            {children}
        </div>
    );
};

export default ContainerHistory;