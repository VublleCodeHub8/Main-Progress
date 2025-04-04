import { useState, useEffect } from "react";
import { Chart } from "@/components/ui/chart";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useSelector } from "react-redux";
import Loader from "@/components/ui/Loader";
import { AlertTriangle } from "lucide-react";
// More realistic container usage and billing data
const getLastTwelveMonths = () => {
  const months = [];
  const currentDate = new Date();
  
  for (let i = 11; i >= 0; i--) {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
    months.push({
      label: `${date.toLocaleString('default', { month: 'long' })} ${date.getFullYear()}`,
      date: date
    });
  }
  return months;
};

const lastTwelveMonths = getLastTwelveMonths();

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

function Analytics() {
  const [selectedMonth, setSelectedMonth] = useState(lastTwelveMonths.length - 1);
  const [templates, setTemplates] = useState([]);
  const [projects, setProjects] = useState([]);
  const { user, status, isEditMode } = useSelector((state) => state.user);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [containerData, setContainerData] = useState(null);
   

  // Fetch templates
  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const tok = JSON.parse(localStorage.getItem("token"));
        // console.log(tok);
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
              id: template?.id === null ? index : template._id,
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
        // console.log(data);
        const userContainers = await Promise.all(data.map(async (container) => {
          return {
            // id: container.id,
            title: container.name,
            First_used: container.createdAt,
            Last_used: container.lastUsed,
            container_id: container.id,
            template: container.template,
          };
        }));
        // console.log(userContainers);
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
    if (templates.length > 0) {
      try {
        const colors = generateColors(templates.length);
        
        // Get container usage from user data
        const containerCounts = templates.map((template, index) => {
          // Get container IDs for each month from user.containerUsage.monthlyUsage
          const monthlyCounts = lastTwelveMonths.map(async (monthData) => {
            const month = monthData.label.split(' ')[0];
            const year = parseInt(monthData.label.split(' ')[1]);
            
            // Find matching monthly usage
            const monthlyUsage = user?.containerUsage?.monthlyUsage?.find(
              usage => usage.month === month && usage.year === year
            );
            
            if (!monthlyUsage) return 0;
            
            // Count containers for this template in this month
            let count = 0;
            for (const imageName of monthlyUsage.imageNames) {
              if (imageName === template.image) {
                count++;
              }
            }
            return count;
          });
          
          return {
            label: template.name,
            data: Promise.all(monthlyCounts),
            backgroundColor: colors[index],
            borderColor: colors[index].replace("0.7", "1"),
            borderWidth: 1,
          };
        });
        
        // Get monthly bills from user data
        const billData = lastTwelveMonths.map(monthData => {
          const matchingBill = user?.billingInfo?.monthlyBills?.find(
            bill => bill.month === monthData.label.split(' ')[0] && 
                   bill.year === parseInt(monthData.label.split(' ')[1])
          );
          return matchingBill ? matchingBill.amount : 0;
        });
        
        // Resolve all promises
        Promise.all(containerCounts.map(async (template) => {
          template.data = await template.data;
          return template;
        })).then(resolvedContainerCounts => {
          setContainerData({
            containerCounts: resolvedContainerCounts,
            billData,
          });
        });
      } catch (error) {
        console.error("Error generating container data:", error);
        setContainerData({
          containerCounts: [],
          billData: []
        });
      }
    } else {
      // If no templates, set empty container data
      setContainerData({
        containerCounts: [],
        billData: Array(lastTwelveMonths.length).fill(0)
      });
    }
  }, [templates, user?.billingInfo?.monthlyBills, user?.containerUsage?.monthlyUsage]);
  // console.log(containerData);
  if (loading) {
    return (
        <div className="w-full h-screen flex items-center justify-center bg-white/90">
            <Loader 
                title="Loading Analytics" 
                description="Fetching your container usage and billing data..."
            />
        </div>
    );
  }

  if (error) {
    return (
        <div className="w-full h-screen flex items-center justify-center bg-white/80">
            <div className="text-center p-8 rounded-lg">
                <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-red-700 mb-2">Analytics Error</h3>
                <p className="text-red-600">{error.message}</p>
            </div>
        </div>
    );
  }

  if (!containerData) {
    return (
        <div className="w-full h-screen flex items-center justify-center bg-white/80">
            <Loader 
                title="Preparing Analytics" 
                description="Setting up your dashboard..."
            />
        </div>
    );
  }

  const { containerCounts, billData } = containerData;
  
  // Data for bar chart showing monthly container usage by template
  const barData = {
    labels: lastTwelveMonths.map(m => m.label),
    datasets: containerCounts,
  };

  // Data for line chart showing monthly bills
  const lineData = {
    labels: lastTwelveMonths.map(m => m.label),
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
    if (!containerCounts || containerCounts.length === 0) {
      return {
        labels: ["No Data"],
        datasets: [
          {
            data: [1],
            backgroundColor: ["rgba(200, 200, 200, 0.7)"],
            borderColor: ["rgba(200, 200, 200, 1)"],
            borderWidth: 1,
          },
        ],
      };
    }
    
    // Ensure all data points are valid
    const validData = containerCounts.map(template => {
      if (!template || !template.data || template.data[selectedMonthIndex] === undefined) {
        return 0;
      }
      return template.data[selectedMonthIndex];
    });
    
    // If all data points are zero, show "No Data" instead
    if (validData.every(value => value === 0)) {
      return {
        labels: ["No Data"],
        datasets: [
          {
            data: [1],
            backgroundColor: ["rgba(200, 200, 200, 0.7)"],
            borderColor: ["rgba(200, 200, 200, 1)"],
            borderWidth: 1,
          },
        ],
      };
    }
    
    return {
      labels: templates.map(t => t.name),
      datasets: [
        {
          data: validData,
          backgroundColor: templates.map((_, index) => generateColors(templates.length)[index]),
          borderColor: templates.map((_, index) => generateColors(templates.length)[index].replace("0.7", "1")),
          borderWidth: 1,
        },
      ],
    };
  };

  // Calculate consumption metrics
  const calculateMetrics = (selectedMonthIndex) => {
    try {
      const selectedMonthData = lastTwelveMonths[selectedMonthIndex];
      const month = selectedMonthData.label.split(' ')[0];
      const year = parseInt(selectedMonthData.label.split(' ')[1]);
      
      // Get active containers count from projects
      const activeContainers = projects.length;
      
      // Get total containers from user data
      const totalContainers = user?.containerUsage?.totalContainers || 0;
      
      // Get monthly bill from user data
      const matchingBill = user?.billingInfo?.monthlyBills?.find(
        bill => bill.month === month && bill.year === year
      );
      const totalBill = matchingBill ? matchingBill.amount : 0;
      
      // Get monthly container usage from user data
      const monthlyUsage = user?.containerUsage?.monthlyUsage?.find(
        usage => usage.month === month && usage.year === year
      );
      
      // Count containers by template for the selected month
      const templateUsage = templates.map(template => {
        const templateData = containerCounts?.find(t => t.label === template.name);
        return {
          name: template.name,
          count: templateData?.data?.[selectedMonthIndex] || 0
        };
      });
      
      const mostUsedTemplate = templateUsage.reduce(
        (max, current) => current.count > max.count ? current : max,
        { name: "None", count: 0 }
      );
      
      // Calculate total bill across all months
      const totalBillTillNow = user?.billingInfo?.amount || 0;
      
      return {
        totalContainers,
        activeContainers,
        totalBill,
        totalBillTillNow,
        mostUsedTemplate,
      };
    } catch (error) {
      console.error("Error calculating metrics:", error);
      return {
        totalContainers: 0,
        activeContainers: 0,
        totalBill: 0,
        totalBillTillNow: 0,
        mostUsedTemplate: { name: "None", count: 0 }
      };
    }
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
              Total Containers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalContainers}</div>
            <p className="text-xs text-gray-500 mt-1">
              Total containers created till now
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Active Containers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.activeContainers}</div>
            <p className="text-xs text-gray-500 mt-1">
              Currently active containers
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
            <div className="text-2xl font-bold">
            {user?.billingInfo?.amount ? `$${user.billingInfo.amount.toFixed(2)}` : "$0.00"}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Total amount spent till now
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
        <CardHeader className="pb-2">
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
                  {lastTwelveMonths.map((monthData, index) => (
                    <option key={monthData.label} value={index}>
                      {monthData.label}
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
                        text: `Container Distribution - ${lastTwelveMonths[selectedMonth].label}`,
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
                {templates.map((template, index) => (
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
                        Current usage: {containerCounts && containerCounts[index] ? containerCounts[index].data[selectedMonth] : 0} containers
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

export default Analytics;