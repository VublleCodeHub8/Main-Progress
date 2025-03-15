import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { Link } from 'react-router-dom';
import { Bar, Pie } from 'react-chartjs-2';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Power, Edit, Search, Sliders, Trash, Shield } from "lucide-react";
import Popup from '@/components/Popup';



const BugReports = () => {
    const token = useSelector((state) => state.misc.token);
    const [searchTerm, setSearchTerm] = useState("");
    const [bugReports, setBugReports] = useState([]);
    const [popupVisible, setPopupVisible] = useState(false);
    const [popupMessage, setPopupMessage] = useState("");
    const [popupType, setPopupType] = useState("success");


    const filteredBugReports = bugReports.filter((bugReport) => {
        return bugReport.name.toLowerCase().includes(searchTerm.toLowerCase());
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

            {/* Bug Reports Table */}
            <Card className='mb-8'>
                <CardHeader>
                    <CardTitle>Bug Reports</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className='overflow-x-auto'>
                        <BugReportTable token={token} setPopupVisible={setPopupVisible} setPopupMessage={setPopupMessage} setPopupType={setPopupType} popupMessage={popupMessage} popupType={popupType} popupVisible={popupVisible} />
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

const BugReportTable = ({ token, setPopupVisible, setPopupMessage, setPopupType, popupMessage, popupType, popupVisible }) => {
    const [bugReports, setBugReports] = useState([]);

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
    }, [token]);

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
                console.error("Failed to delete bug report");
                setPopupMessage("Failed to delete bug report");
                setPopupType("error");
                setPopupVisible(true);
            }
        } catch (error) {
            console.error("Error deleting bug report:", error);
            setPopupMessage("Error deleting bug report");
            setPopupType("error");
            setPopupVisible(true);
        }
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

export default BugReports;
