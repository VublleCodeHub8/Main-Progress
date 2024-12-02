import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { Bar, Pie } from 'react-chartjs-2';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Power, Edit, Search, Sliders } from "lucide-react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const DevPage = () => {
  const dispatch = useDispatch();
  const [templates, setTemplates] = useState([]);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState(""); // Add search term state
  const token = useSelector((state) => state.misc.token);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [templateData, containerData] = await Promise.all([
          fetchTemplate(),
          fetchContainers(),
        ]);
        const combinedData = templateData.map((template) => {
          const uses = containerData.filter((container) => container.template === template.image).length;
          return { ...template, uses };
        })
        console.log(combinedData);
        setTemplates(combinedData);
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
  const fetchContainers = async () => {
    const response = await fetch("http://localhost:3000/admin/getAllContainers", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token.token}`,
      },
    });
    return response.ok ? await response.json() : [];
  };


  const filteredTemplates = templates.filter((template => {
    return template.name.toLowerCase().includes(searchTerm.toLowerCase());
  }))

  const templatePhase = {
    labels: ['Development', 'Testing', 'Production'],
    datasets: [
      {
        label: 'Phase',
        data: [
          templates.filter(template => template.phase === 'Development').length,
          templates.filter(template => template.phase === 'Testing').length,
          templates.filter(template => template.phase === 'Production').length
        ],
        backgroundColor: ['#bfdbfe', '#fef08a', '#bbf7d0'],
      },
    ],
  };

  const generateRandomColor = () => {
    const randomColor = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
    return randomColor.padEnd(7, "0"); 
  };
  
  const templateStatus = {
    labels: templates.map(template => template.name),
    datasets: [
      {
        label: 'Status',
        data: templates.map(template => template.uses),
        backgroundColor: templates.map(template => generateRandomColor()),
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-4xl font-bold">Developer Dashboard</h1>
        <div className="flex gap-4">
          <Link
            to="/auth"
            className="flex items-center gap-2 rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600"
          >
            <Power className="h-4 w-4" />
            Logout
          </Link>
          <Link
            to="/dev/editor"
            className="flex items-center gap-2 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
          >
            <Edit className="h-4 w-4" />
            Editor
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

      {/* Stats Overview */}
      <div className="mb-8 grid gap-4 md:grid-cols-2">
        <StatCard title="Total Templates" value={templates.length} icon={<Sliders className="h-4 w-4 text-gray-500" />} />
        <StatCard
          title="Active Templates"
          value={templates.filter(templates => templates.phase === 'Production').length}
          icon={<Edit className="h-4 w-4 text-gray-500" />}
        />
      </div>

      <div className='mb-8 grid gap-4 md:grid-cols-2'>
          {/* Phase Bar Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Template Phase</CardTitle>
            </CardHeader>
            <CardContent>
              <Bar data = {templatePhase} options={{ responsive: true, maintainAspectRatio: false }} />
            </CardContent>
          </Card>

          {/* Template Status Pie Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Template Status</CardTitle>
            </CardHeader>
            <CardContent>
              <Pie data = {templateStatus} options={{ responsive: true, maintainAspectRatio: false }} />
            </CardContent>
          </Card>
          
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
        <TableHeader title = "Price" className="text-lg font-semibold" />
        <TableHeader title="Uses" className="text-lg font-semibold" />
      </tr>

    </thead>
    <tbody>
      {templates.map(template => (
        <React.Fragment key={template._id}>
          <tr className='border-b border-gray-200'>
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
            <td className="px-4 py-3">
              <div className="relative max-w-xs">
                <p
                  className="overflow-hidden text-ellipsis whitespace-nowrap hover:whitespace-normal bg-gray-100 p-2 rounded transition-all duration-300"
                  title={template.description} // Optional: Tooltip for non-hover devices
                >
                  {template.description}
                </p>
              </div>
            </td>
            <td className='px-4 py-3 text-green-500 font-bold' >${template.price}</td>
            <td className='px-4 py-3' >{template.uses}</td>
          </tr>
        </React.Fragment>
      ))}
    </tbody>
  </table>
);

const TableHeader = ({ title }) => (
  <th className="px-4 py-3 text-lg font-medium text-gray-500">{title}</th>
);

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


export default DevPage;
