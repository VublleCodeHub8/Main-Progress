import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { Link } from 'react-router-dom';
import { Bar, Pie } from 'react-chartjs-2';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Power, Edit, Search, Sliders, Trash, Shield, ClipboardList, Layout, AlertTriangle, Activity, MessageCircle, Eye, ScrollText } from "lucide-react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import Popup from '@/components/Popup';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const BugReports = () => {
    const token = useSelector((state) => state.misc.token);
    const [searchTerm, setSearchTerm] = useState("");
    const [bugReports, setBugReports] = useState([]);
    const [popupVisible, setPopupVisible] = useState(false);
    const [popupMessage, setPopupMessage] = useState("");
    const [popupType, setPopupType] = useState("success");
    const [refreshTrigger, setRefreshTrigger] = useState(false);


    useEffect(() => {
        const fetchBugReports = async () => {
            try {
                const response = await fetch("http://localhost:3000/admin/getAllBugReports", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token.token}`
                    }
                });
                const data = await response.json();
                setBugReports(data);
            } catch (error) {
                console.error("Error fetching bug reports:", error);
            }
        };
        fetchBugReports();
    }, [token, refreshTrigger]);

    const bugReportType = {
        labels: ['UI', 'Functionality', 'Performance', 'Security', 'Crash', 'Other'],
        datasets: [
            {
                label: 'Number of Reports',
                data: [
                    bugReports.filter((bugReport) => bugReport.type === 'ui').length,
                    bugReports.filter((bugReport) => bugReport.type === 'functional').length,
                    bugReports.filter((bugReport) => bugReport.type === 'performance').length,
                    bugReports.filter((bugReport) => bugReport.type === 'security').length,
                    bugReports.filter((bugReport) => bugReport.type === 'crash').length,
                    bugReports.filter((bugReport) => bugReport.type === 'other').length
                ],
                backgroundColor: [
                    'rgba(54, 162, 235, 0.8)',   // UI - Blue
                    'rgba(255, 206, 86, 0.8)',   // Functionality - Yellow
                    'rgba(75, 192, 192, 0.8)',   // Performance - Teal
                    'rgba(255, 99, 132, 0.8)',   // Security - Red
                    'rgba(153, 102, 255, 0.8)',  // Crash - Purple
                    'rgba(255, 159, 64, 0.8)'    // Other - Orange
                ],
                borderColor: [
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(255, 99, 132, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 1,
                borderRadius: 8,
                hoverOffset: 4,
                hoverBorderWidth: 2,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    font: {
                        size: 12,
                        family: "'Inter', sans-serif"
                    },
                    padding: 20,
                    usePointStyle: true,
                    pointStyle: 'circle'
                }
            },
            title: {
                display: true,
                text: 'Distribution of Bug Reports by Type',
                font: {
                    size: 16,
                    family: "'Inter', sans-serif",
                    weight: 'bold'
                },
                padding: {
                    top: 10,
                    bottom: 30
                }
            },
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                padding: 12,
                titleFont: {
                    size: 14,
                    family: "'Inter', sans-serif"
                },
                bodyFont: {
                    size: 13,
                    family: "'Inter', sans-serif"
                },
                displayColors: true,
                usePointStyle: true,
                callbacks: {
                    label: function(context) {
                        return `Number of Reports: ${context.parsed.y}`;
                    }
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    display: true,
                    color: 'rgba(0, 0, 0, 0.1)',
                    drawBorder: false
                },
                ticks: {
                    font: {
                        size: 12,
                        family: "'Inter', sans-serif"
                    },
                    stepSize: 1
                }
            },
            x: {
                grid: {
                    display: false
                },
                ticks: {
                    font: {
                        size: 12,
                        family: "'Inter', sans-serif"
                    }
                }
            }
        },
        animation: {
            duration: 2000,
            easing: 'easeInOutQuart'
        },
        layout: {
            padding: {
                left: 20,
                right: 20,
                top: 0,
                bottom: 0
            }
        }
    };

    const filteredBugReports = bugReports.filter((bugReport) => {
        return bugReport.name.toLowerCase().includes(searchTerm.toLowerCase()) || bugReport.type.toLowerCase().includes(searchTerm.toLowerCase());
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
                                         hover:scale-105 transition-all duration-300 group relative overflow-hidden">
                                <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity" />
                                <AlertTriangle className="h-8 w-8 text-white transform group-hover:-rotate-12 transition-transform" />
                            </div>
                            
                            {/* Title and Subtitle */}
                            <div>
                                <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                                    Bug Reports Dashboard
                                </h1>
                                <p className="text-gray-500 flex items-center gap-2 mt-1">
                                    <ClipboardList className="h-4 w-4" />
                                    Monitor and manage reported issues
                                </p>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-3">
                            <Link
                                to="/admin/contactus"
                                className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium
                                         bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 
                                         transition-all duration-200 shadow-sm hover:shadow group"
                            >
                                <MessageCircle className="h-4 w-4 group-hover:scale-110 transition-transform" />
                                Contact Messages
                            </Link>
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
                                placeholder="Search by name or bug type..."
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
                            title="Total Reports" 
                            value={bugReports.length}
                            icon={<ClipboardList className="h-4 w-4" />}
                        />
                        <QuickStat 
                            title="UI Issues" 
                            value={bugReports.filter(b => b.type === 'ui').length}
                            icon={<Layout className="h-4 w-4" />}
                        />
                        <QuickStat 
                            title="Critical Issues" 
                            value={bugReports.filter(b => b.type === 'crash').length}
                            icon={<AlertTriangle className="h-4 w-4" />}
                            valueColor="text-red-600"
                        />
                        <QuickStat 
                            title="Performance Issues" 
                            value={bugReports.filter(b => b.type === 'performance').length}
                            icon={<Activity className="h-4 w-4" />}
                        />
                    </div>
                </div>
            </div>

            {/* bar chart for bug report type wise */}
            <div className='mb-8'>
                <Card className="p-4">
                    <CardHeader className="pb-0">
                        <CardTitle className="text-xl font-semibold text-gray-800">Bug Report Analytics</CardTitle>
                        <p className="text-sm text-gray-500">Distribution of reported issues by category</p>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[400px] w-full p-4"> {/* Fixed height for better presentation */}
                            <Bar data={bugReportType} options={chartOptions} />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Bug Reports Table */}
            <Card className='mb-8'>
                <CardHeader>
                    <CardTitle>Bug Reports</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className='overflow-x-auto'>
                        <BugReportTable token={token} bugReports={filteredBugReports} setBugReports={setBugReports} refreshTrigger={refreshTrigger} setRefreshTrigger={setRefreshTrigger} setPopupVisible={setPopupVisible} setPopupMessage={setPopupMessage} setPopupType={setPopupType} popupMessage={popupMessage} popupType={popupType} popupVisible={popupVisible} />
                    </div>
                </CardContent>
            </Card>

        </div>
    );
};

const TableHeader = ({ title }) => (
    <th className="px-6 py-4 text-xs font-medium uppercase tracking-wider text-gray-500 bg-gray-50">
        {title}
    </th>
);

const DateCell = ({ date, isCreated }) => {
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
        <span className="inline-flex items-center gap-1">
            <span className={`flex h-2 w-2 rounded-full ${
                isCreated ? 'bg-green-400' : 'bg-red-400'
            }`} />
            <span className={`text-sm ${
                isCreated ? 'text-green-600' : 'text-red-600'
            }`}>
                {formattedDate}
            </span>
        </span>
    );
};

const BugReportTable = ({ token, bugReports, refreshTrigger, setBugReports, setRefreshTrigger, setPopupVisible, setPopupMessage, setPopupType, popupMessage, popupType, popupVisible }) => {
    const handleDeleteBugReport = async (id) => {
        try {
            const responce = await fetch("http://localhost:3000/admin/deleteBugReport", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token.token}`
                },
                body: JSON.stringify({ id })
            });

            if (responce.ok) {
                setBugReports(bugReports.filter((report) => report._id !== id));
                setPopupMessage("Bug report deleted successfully");
                setPopupType("success");
                setPopupVisible(true);
            } else {
                setPopupMessage("Failed to delete bug report");
                setPopupType("error");
                setPopupVisible(true);
            }
        } catch (error) {
            setPopupMessage("Error deleting bug report");
            setPopupType("error");
            setPopupVisible(true);
        }
        setRefreshTrigger(!refreshTrigger);
    };

    return (
        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
            <table className="w-full border-collapse bg-white text-left text-sm text-gray-500">
                <thead className="bg-gray-50/80">
                    <tr>
                        <TableHeader title="Reporter Details" />
                        <TableHeader title="Contact" />
                        <TableHeader title="Issue Type" />
                        <TableHeader title="Description" />
                        <TableHeader title="Reported On" />
                        <TableHeader title="Actions" />
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 border-t border-gray-100">
                    {bugReports.length === 0 ? (
                        <tr>
                            <td colSpan={6} className="px-6 py-8 text-center">
                                <div className="flex flex-col items-center gap-2">
                                    <ClipboardList className="h-8 w-8 text-gray-400" />
                                    <p className="text-gray-500 font-medium">No bug reports found</p>
                                    <p className="text-gray-400 text-sm">All clear for now!</p>
                                </div>
                            </td>
                        </tr>
                    ) : (
                        bugReports.map((bugReport) => (
                            <tr key={bugReport._id} className="hover:bg-gray-50/60 transition-all duration-200">
                                {/* Reporter Details Cell */}
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 
                                                    flex items-center justify-center shadow-sm">
                                            <span className="text-base font-semibold text-gray-600">
                                                {bugReport.name.charAt(0).toUpperCase()}
                                            </span>
                                        </div>
                                        <div>
                                            <div className="font-medium text-gray-900">{bugReport.name}</div>
                                            <div className="text-xs text-gray-500">ID: {bugReport._id.slice(0, 8)}...</div>
                                        </div>
                                    </div>
                                </td>

                                {/* Email Cell */}
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        <div className="h-2 w-2 rounded-full bg-indigo-400"></div>
                                        <span className="text-sm font-medium text-gray-600">
                                            {bugReport.email}
                                        </span>
                                    </div>
                                </td>

                                {/* Bug Type Cell */}
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-xs font-medium
                                        ${getBugTypeStyle(bugReport.type)} ring-1 ring-inset ${getBugTypeRingStyle(bugReport.type)}`}>
                                        {getBugTypeIcon(bugReport.type)}
                                        {bugReport.type.charAt(0).toUpperCase() + bugReport.type.slice(1)}
                                    </span>
                                </td>

                                {/* Description Cell */}
                                <td className="px-6 py-4">
                                    <div className="group relative max-w-md">
                                        <div className="relative">
                                            <div className={`text-sm text-gray-600 bg-gray-50/80 p-3 rounded-lg
                                                         transition-all duration-200 hover:bg-white hover:shadow-md`}>
                                                {bugReport.description.length > 100 ? (
                                                    <>
                                                        <div className="line-clamp-2 group-hover:hidden">
                                                            {bugReport.description}
                                                        </div>
                                                        <div className="hidden group-hover:block">
                                                            {bugReport.description}
                                                        </div>
                                                        <div className="absolute bottom-0 right-0 px-2 py-1 text-xs
                                                                    bg-white/90 text-gray-500 rounded-md shadow-sm
                                                                    group-hover:hidden">
                                                            <div className="flex items-center gap-1">
                                                                <Eye className="h-3 w-3" />
                                                                Hover to expand
                                                            </div>
                                                        </div>
                                                    </>
                                                ) : (
                                                    bugReport.description
                                                )}
                                            </div>
                                        </div>
                                        {bugReport.description.length > 100 && (
                                            <div className="absolute top-0 left-0 w-full h-full opacity-0 
                                                        group-hover:opacity-100 transition-opacity duration-200">
                                                <div className="absolute -right-2 -top-2">
                                                    <div className="bg-gray-900 text-white text-xs px-2 py-1 rounded-md shadow-lg">
                                                        <div className="flex items-center gap-1">
                                                            <ScrollText className="h-3 w-3" />
                                                            Full description
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </td>

                                {/* Date Cell */}
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 
                                                      text-xs font-medium bg-gray-100 text-gray-700">
                                            <span className="h-1.5 w-1.5 rounded-full bg-gray-500"></span>
                                            {new Date(bugReport.date).toLocaleString('en-US', {
                                                month: 'short',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </span>
                                    </div>
                                </td>

                                {/* Actions Cell */}
                                <td className="px-6 py-4">
                                    <button 
                                        onClick={() => handleDeleteBugReport(bugReport._id)}
                                        className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium
                                                 text-red-700 bg-red-50 rounded-md hover:bg-red-100 
                                                 transition-colors duration-200"
                                    >
                                        <Trash className="h-3.5 w-3.5" />
                                        Delete Report
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
            <Popup
                visible={popupVisible}
                message={popupMessage}
                onClose={() => setPopupVisible(false)}
                type={popupType}
            />
        </div>
    );
};

const getBugTypeStyle = (type) => {
    const styles = {
        ui: 'bg-blue-50 text-blue-600',
        functional: 'bg-yellow-50 text-yellow-600',
        performance: 'bg-green-50 text-green-600',
        security: 'bg-red-50 text-red-600',
        crash: 'bg-purple-50 text-purple-600',
        other: 'bg-gray-50 text-gray-600'
    };
    return styles[type] || styles.other;
};

const getBugTypeIcon = (type) => {
    const icons = {
        ui: <Layout className="h-3.5 w-3.5" />,
        functional: <AlertTriangle className="h-3.5 w-3.5" />,
        performance: <Activity className="h-3.5 w-3.5" />,
        security: <Shield className="h-3.5 w-3.5" />,
        crash: <Power className="h-3.5 w-3.5" />,
        other: <ClipboardList className="h-3.5 w-3.5" />
    };
    return icons[type] || icons.other;
};

const getBugTypeRingStyle = (type) => {
    const styles = {
        ui: 'ring-blue-600/20',
        functional: 'ring-yellow-600/20',
        performance: 'ring-green-600/20',
        security: 'ring-red-600/20',
        crash: 'ring-purple-600/20',
        other: 'ring-gray-600/20'
    };
    return styles[type] || styles.other;
};

const StatCard = ({ title, value, icon, color = "text-gray-500" }) => (
    <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">{title}</CardTitle>
            <div className={color}>{icon}</div>
        </CardHeader>
        <CardContent>
            <div className="text-3xl font-bold">{value}</div>
        </CardContent>
    </Card>
);

// New QuickStat component
const QuickStat = ({ title, value, icon, valueColor = "text-gray-900" }) => (
    <div className="bg-white rounded-lg p-4 border border-gray-100 shadow-sm hover:shadow transition-shadow duration-200">
        <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <div className="text-gray-400">{icon}</div>
        </div>
        <p className={`text-2xl font-semibold mt-2 ${valueColor}`}>{value}</p>
    </div>
);

export default BugReports;
