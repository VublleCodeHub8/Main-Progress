import { useState, useEffect } from "react";
import { Chart } from "@/components/ui/chart";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useDispatch, useSelector } from "react-redux";
// More realistic container usage and billing data
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const currentMonth = new Date().getMonth();
const lastSixMonths = months.slice(Math.max(0, currentMonth - 5), currentMonth + 1);

// Generate colors for templates
const generateColors = (count) => {
  const colors = [
    "rgba(75, 192, 192, 0.7)",
    "rgba(54, 162, 235, 0.7)",
    "rgba(153, 102, 255, 0.7)",
    "rgba(255, 159, 64, 0.7)",
    "rgba(255, 99, 132, 0.7)",
    "rgba(75, 192, 192, 0.7)",
    "rgba(54, 162, 235, 0.7)",
    "rgba(153, 102, 255, 0.7)",
  ];
  return colors.slice(0, count);
};

const getContainerStatus = async (containerId) => { 
  const tok = JSON.parse(localStorage.getItem("token"));
  const response = await fetch(`http://localhost:3000/container/details/${containerId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${tok.token}`,
    },
  });
  const details = await response.json();
  return {status : details.status} ;
};

function Analytics() {
  const [selectedMonth, setSelectedMonth] = useState(lastSixMonths.length - 1);
  const [templates, setTemplates] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [containerData, setContainerData] = useState(null);
  const { user } = useSelector((state) => state.user);

  // Fetch templates
  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const tok = JSON.parse(localStorage.getItem("token"));
        const res = await fetch("http://localhost:3000/getAllTemplates", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + tok?.token,
          },
        });
        if (res.ok) {
          const data = await res.json();
          let templates = data
            .filter((template) => template.phase === "Production")
            .map((template, index) => ({
              name: template.name,
              id: template?.id === null ? index : template.id,
              image: template.image,
              price: template.price,
              phase: template.phase,
            }));
          setTemplates(templates);
        }
      } catch (error) {
        setError(error);
      }
    };

    fetchTemplates();
  }, []);

  // Fetch containers
  useEffect(() => {
    const fetchContainers = async () => {
      try {
        const tok = JSON.parse(localStorage.getItem("token"));
        const response = await fetch("http://localhost:3000/container/listcontainers", {
          method: "GET",
          headers: {
            Authorization: "Bearer " + tok.token,
          },
        });
        let data = await response.json();
        const userContainers = await Promise.all(data.map(async (container) => {
          return {
            id: container.id,
            title: container.name,
            First_used: container.createdAt,
            Last_used: container.lastUsed,
            container_id: container.id,
            template: container.template,
          };
        }));
        setProjects(userContainers);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    fetchContainers();
  }, []);

  // Generate container data when templates and projects are loaded
  useEffect(() => {
    if (templates.length > 0 && projects.length > 0) {
      const colors = generateColors(templates.length);
      
      // Group containers by template and month
      const containerCounts = templates.map((template, index) => {
        const templateContainers = projects.filter(p => p.template === template.image);
        const monthlyCounts = lastSixMonths.map(month => {
          const monthIndex = months.indexOf(month);
          return templateContainers.filter(container => {
            const containerDate = new Date(container.First_used);
            return containerDate.getMonth() === monthIndex;
          }).length;
        });

        return {
          label: template.name,
          data: monthlyCounts,
          backgroundColor: colors[index],
          borderColor: colors[index].replace("0.7", "1"),
          borderWidth: 1,
        };
      });

      // Calculate bills based on container counts and template prices
      const billData = lastSixMonths.map((_, monthIndex) => {
        return containerCounts.reduce((total, template, templateIndex) => {
          return total + (template.data[monthIndex] * templates[templateIndex].price);
        }, 0);
      });

      setContainerData({
        containerCounts,
        billData,
      });
    }
  }, [templates, projects]);

  if (loading) {
    return <div className="w-full h-full flex items-center justify-center">Loading...</div>;
  }

  if (error) {
    return <div className="w-full h-full flex items-center justify-center text-red-500">Error: {error.message}</div>;
  }

  if (!containerData) {
    return (
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"></rect>
                <line x1="7" y1="2" x2="7" y2="22"></line>
                <line x1="17" y1="2" x2="17" y2="22"></line>
                <line x1="2" y1="12" x2="22" y2="12"></line>
                <line x1="2" y1="7" x2="7" y2="7"></line>
                <line x1="2" y1="17" x2="7" y2="17"></line>
                <line x1="17" y1="17" x2="22" y2="17"></line>
                <line x1="17" y1="7" x2="22" y2="7"></line>
              </svg>
              No Container Usage Data
            </CardTitle>
            <p className="text-sm text-gray-500">You haven't deployed any containers yet. Here are the available templates:</p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {templates.map((template) => (
                <Card key={template.name} className="">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                        <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                        <line x1="12" y1="22.08" x2="12" y2="12"></line>
                      </svg>
                      {template.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-baseline space-x-2">
                      <div className="text-2xl font-bold">${template.price}</div>
                      <div className="text-sm text-gray-500">per container/month</div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>)
  };

  const { containerCounts, billData } = containerData;
  
  // Data for bar chart showing monthly container usage by template
const barData = {
    labels: lastSixMonths,
    datasets: containerCounts,
  };

  // Data for line chart showing monthly bills
  const lineData = {
    labels: lastSixMonths,
  datasets: [
    {
        label: "Total Monthly Bill ($)",
        data: billData,
        fill: true,
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        borderColor: "rgba(59, 130, 246, 0.8)",
        tension: 0.3,
    },
  ],
};

  // Data for pie chart showing container distribution for selected month
  const generatePieData = (selectedMonthIndex) => {
    return {
      labels: templates.map(t => t.name),
  datasets: [
    {
          data: containerCounts.map(template => template.data[selectedMonthIndex]),
          backgroundColor: templates.map((_, index) => generateColors(templates.length)[index]),
          borderColor: templates.map((_, index) => generateColors(templates.length)[index].replace("0.7", "1")),
      borderWidth: 1,
    },
  ],
};
  };

  // Calculate consumption metrics
  const calculateMetrics = (selectedMonthIndex) => {
    const totalContainers = containerCounts.reduce(
      (sum, template) => sum + template.data[selectedMonthIndex], 0
    );
    
    const totalBill = billData[selectedMonthIndex];
    
    const avgCostPerContainer = totalContainers > 0 
      ? (totalBill / totalContainers).toFixed(2) 
      : 0;
      
    const mostUsedTemplate = containerCounts.reduce(
      (max, current, index) => 
        current.data[selectedMonthIndex] > max.count 
          ? { name: templates[index].name, count: current.data[selectedMonthIndex] }
          : max,
      { name: "", count: 0 }
    );

    const activeContainers = containerCounts.reduce((count, template) => {
      const status = getContainerStatus(template.id);
      if (status.Status === "running") {
        return count + template.data[selectedMonthIndex];
      }
      return count;
    }, 0);

    return {
      totalContainers,
      totalBill,
      avgCostPerContainer,
      mostUsedTemplate,
      activeContainers,
    };
  };

  const metrics = calculateMetrics(selectedMonth);
  const pieData = generatePieData(selectedMonth);

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Active Containers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.activeContainers}</div>
            <p className="text-xs text-gray-500 mt-1">
              Total containers for {lastSixMonths[selectedMonth]}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Total Bill
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${user?.billingInfo?.amount ? `${user.billingInfo.amount.toFixed(2)}` : "0.00"}</div>
            <p className="text-xs text-gray-500 mt-1">
              For {lastSixMonths[selectedMonth]}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Avg. Cost per Container
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${metrics.avgCostPerContainer}</div>
            <p className="text-xs text-gray-500 mt-1">
              Based on template pricing
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Most Used Template
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.mostUsedTemplate.name}</div>
            <p className="text-xs text-gray-500 mt-1">
              {metrics.mostUsedTemplate.count} containers
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content with Tabs */}
      <Card className="overflow-hidden">
        <CardHeader className="pb-4">
          <CardTitle>Usage & Billing Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="overview">Overall Trends</TabsTrigger>
              <TabsTrigger value="monthly">Monthly Breakdown</TabsTrigger>
              <TabsTrigger value="templates">Template Analysis</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-4">
              <div className="h-[400px]">
                <Chart 
                  type="line" 
                  data={lineData} 
                  options={{
  plugins: {
    title: {
      display: true,
                        text: 'Billing Trend Over Time',
                      },
                    },
                  }}
                />
              </div>
            </TabsContent>
            
            <TabsContent value="monthly" className="space-y-4">
      <div className="mb-4">
                <label htmlFor="month-select" className="text-sm font-medium mr-2">Select Month:</label>
        <select
          id="month-select"
          value={selectedMonth}
                  onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                  className="rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        >
                  {lastSixMonths.map((month, index) => (
                    <option key={month} value={index}>
              {month}
            </option>
          ))}
        </select>
      </div>
              
              <div className="h-[400px]">
                <Chart 
                  type="pie" 
                  data={pieData}
                  options={{
                    plugins: {
                      title: {
                        display: true,
                        text: `Container Distribution - ${lastSixMonths[selectedMonth]}`,
                      },
                    },
                  }}
                />
              </div>
            </TabsContent>
            
            <TabsContent value="templates" className="space-y-4">
              <div className="h-[400px]">
                <Chart 
                  type="bar" 
                  data={barData}
                  options={{
                    plugins: {
                      title: {
                        display: true,
                        text: 'Container Usage by Template',
                      },
                    },
                  }}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
                {templates.map((template, index) => {
                  // Only show template if it has at least one container in selected month
                  if (containerCounts[index].data[selectedMonth] > 0) {
                    return (
                      <Card key={template.name}>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium">
                            {template.name}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-baseline space-x-2">
                            <div className="text-2xl font-bold">${template.price}</div>
                            <div className="text-sm text-gray-500">per container/month</div>
                          </div>
                          <div className="mt-2 text-sm">
                            Current usage: {containerCounts[index].data[selectedMonth]} containers
                          </div>
                          <div className="mt-2 text-sm text-gray-600">
                            Monthly cost: ${(template.price * containerCounts[index].data[selectedMonth]).toFixed(2)}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  }
                  return null;
                })}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
  </div>
);
}

export default Analytics;

