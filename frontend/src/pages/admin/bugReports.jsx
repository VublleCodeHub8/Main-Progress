import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { Link } from 'react-router-dom';
import { Bar, Pie } from 'react-chartjs-2';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Power, Edit, Search, Sliders, Trash, Shield } from "lucide-react";
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
        labels: ['UI', 'Functionality', 'Performance', 'UI/UX', 'Security', 'Crash', 'Other'],
        datasets: [
            {
                label: 'Bug Report Type',
                data: [
                    bugReports.filter((bugReport) => bugReport.type === 'ui').length,
                    bugReports.filter((bugReport) => bugReport.type === 'functional').length,
                    bugReports.filter((bugReport) => bugReport.type === 'performance').length,
                    bugReports.filter((bugReport) => bugReport.type === 'security').length,
                    bugReports.filter((bugReport) => bugReport.type === 'crash').length,
                    bugReports.filter((bugReport) => bugReport.type === 'other').length
                ],
                backgroundColor: ['#bfdbfe', '#fef08a', '#bbf7d0', '#f97316', '#fb7185', '#f43f5e', '#f3e8ff']
            },
        ],

    };

    const filteredBugReports = bugReports.filter((bugReport) => {
        return bugReport.name.toLowerCase().includes(searchTerm.toLowerCase()) || bugReport.type.toLowerCase().includes(searchTerm.toLowerCase());
    })

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="mb-8 flex items-center justify-between">
                <h1 className="text-4xl font-bold">Bug Reports</h1>
                <div className="flex gap-4">
                    <Link
                        to="/auth"
                        className="flex items-center gap-2 rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600"
                    >
                        <Power className="h-4 w-4" />
                        Logout
                    </Link>
                    <Link
                        to="/admin"
                        className="flex items-center gap-2 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                    >
                        <Shield className="h-4 w-4" />
                        Admin Page
                    </Link>
                </div>
            </div>

            {/* Search Bar */}
            <div className="mb-8 flex items-center rounded border border-gray-300 bg-white px-4 py-2 shadow-sm">
                <Search className="h-5 w-5 text-gray-500" />
                <input
                    type="text"
                    placeholder="Search by template name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="ml-2 w-full border-none outline-none focus:ring-0"
                />
            </div>

            {/* bar chart for bug report type wise */}
            <div className='mb-8 grid gap-4 md:grid-cols-1'>
                <Card>
                    <CardHeader>
                        <CardTitle>Bug Report Type</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Bar data={bugReportType} options={{ responsive: true, maintainAspectRatio: false }} />
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
    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">{title}</th>
);

const DateCell = ({ date }) => {
    const dateObj = new Date(date);
    const formattedDate = dateObj.toLocaleString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    });
    return <td className="px-4 py-3">{formattedDate}</td>
}

const BugReportTable = ({ token, bugReports, refreshTrigger, setBugReports, setRefreshTrigger,  setPopupVisible, setPopupMessage, setPopupType, popupMessage, popupType, popupVisible }) => {

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
        <table className="w-full border-collapse">
            <thead>
                <tr className="border-b border-gray-200 text-left">
                    <TableHeader title="User's Name" className="text-lg font-semibold" />
                    <TableHeader title="Email" />
                    <TableHeader title="Type of Bug" />
                    <TableHeader title="Description" />
                    <TableHeader title="Date and Time" />
                    <TableHeader title="Action" />
                </tr>
            </thead>
            <tbody>
                {bugReports.map((bugReport) => (
                    <tr key={bugReport._id} className="border-b border-gray-200">
                        <td className="px-4 py-3">{bugReport.name}</td>
                        <td className="px-4 py-3">{bugReport.email}</td>
                        <td className="px-4 py-3">{bugReport.type}</td>
                        <td className="px-4 py-3">
                            <div className="relative max-w-xs">
                                <p
                                    className="overflow-hidden text-ellipsis whitespace-nowrap hover:whitespace-normal bg-gray-100 p-2 rounded transition-all duration-300"
                                    title={bugReport.description} // Optional: Tooltip for non-hover devices
                                >
                                    {bugReport.description}
                                </p>
                            </div>
                        </td>
                        <td className="px-4 py-3"><DateCell date={bugReport.date} /></td>
                        <td className="px-4 py-3">
                            <button className="text-red-500 hover:text-red-700"
                                onClick={() => handleDeleteBugReport(bugReport._id)}
                            >
                                <Trash className="h-5 w-5" />
                            </button>
                            <Popup
                                visible={popupVisible}
                                message={popupMessage}
                                onClose={() => setPopupVisible(false)}
                                type={popupType}
                            />
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    )
}

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

export default BugReports;
