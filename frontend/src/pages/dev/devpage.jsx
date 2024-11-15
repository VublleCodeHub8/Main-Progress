import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Power } from "lucide-react";
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const DevPage = () => {
  const [templates, setTemplates] = useState([]);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState(""); // Add search term state
  const token = useSelector((state) => state.misc.token);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [templateData] = await Promise.all([
          fetchTemplate(),
        ]);
        console.log(templateData);
        setTemplates(templateData);
      } catch (err) {
        setError(err.message);
      }
    };
    fetchData();
  }, [token]);

  const fetchTemplate = async () => {
    const response = await fetch("http://localhost:3000/dev/getAllTemplates", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token.token}`,
      },
    });
    return response.ok ? await response.json() : Promise.reject(response);
  }

  const filteredTemplates = templates.filter((template => {
    return template.name.toLowerCase().includes(searchTerm.toLowerCase());
  }))

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Developer Dashboard</h1>
        <Link to="/auth" className="flex items-center gap-2 rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600">
          <Power className="h-4 w-4" />
          Logout
        </Link>
      </div>

      {/* Search Bar */}
      <div className="mb-8">
        <input
          type="text"
          placeholder="Search by template name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full rounded border border-gray-300 px-4 py-2"
        />
      </div>

      {/* Template table */}
      <Card className='mb-8'>
        <CardHeader>
          <CardTitle>Templates</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='overflow-x-auto'>
            <TempTable templates={filteredTemplates} />
          </div>
        </CardContent>
      </Card>

      {/* Error Message */}
      {error && (
        <div className="mb-4 rounded bg-red-100 p-4 text-red-700">
          {error}
        </div>
      )}
    </div>
  );
};

const TempTable = ({ templates }) => (
  <table className='w-full border-collapse'>
    <thead>
      <tr className="border-b border-gray-200 text-left">
        <TableHeader title="Name" className="text-lg font-semibold" />
        <TableHeader title="Image" className="text-lg font-semibold" />
        <TableHeader title="Phase" className="text-lg font-semibold" />
        <TableHeader title="Description" className="text-lg font-semibold" />
      </tr>

    </thead>
    <tbody>
      {templates.map(template => (
        <React.Fragment key={template._id}>
          <tr className='border-b border-gray-200 cursor-pointer'>
            <td className='px-4 py-3 font-meduim' >{template.name}</td>
            <td className='px-4 py-3' >{template.image}</td>
            <td className='px-4 py-3' >
              <span
                className={
                  template.phase === 'Development' ? 'bg-blue-200 px-2 py-1 rounded' :
                    template.phase === 'Testing' ? 'bg-yellow-200 px-2 py-1 rounded' :
                      template.phase === 'Production' ? 'bg-green-200 px-2 py-1 rounded' : ''
                }
              >
                {template.phase}
              </span>
            </td>
            {/* description should be half hidden and show full on hover */}
            <td className='px-4 py-3' >{template.description}</td>
          </tr>
        </React.Fragment>
      ))}
    </tbody>
  </table>
)
const TableHeader = ({ title }) => (
  <th className="px-4 py-3 text-sm font-medium text-gray-500">{title}</th>
);
export default DevPage;
