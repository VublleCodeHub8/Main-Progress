import { useState } from "react";
import { Chart } from "@/components/ui/chart";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

// More realistic container usage and billing data
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const currentMonth = new Date().getMonth();
const lastSixMonths = months.slice(Math.max(0, currentMonth - 5), currentMonth + 1);

// Different container templates with varying pricing
const templates = [
  { name: "Basic Web Server", price: 5, color: "rgba(75, 192, 192, 0.7)" },
  { name: "Database Server", price: 10, color: "rgba(54, 162, 235, 0.7)" },
  { name: "ML Computing", price: 20, color: "rgba(153, 102, 255, 0.7)" },
  { name: "Video Processing", price: 75, color: "rgba(255, 159, 64, 0.7)" },
];

// Generate realistic usage data for containers based on templates
const generateContainerData = () => {
  // Container counts per template over the last 6 months
  const containerCounts = templates.map(template => ({
    label: template.name,
    data: lastSixMonths.map(() => Math.floor(Math.random() * 10) + 1),
    backgroundColor: template.color,
    borderColor: template.color.replace("0.7", "1"),
    borderWidth: 1,
  }));

  // Calculate bills based on container counts and template prices
  const billData = lastSixMonths.map((_, monthIndex) => {
    return containerCounts.reduce((total, template, templateIndex) => {
      return total + (template.data[monthIndex] * templates[templateIndex].price);
    }, 0);
  });

  return {
    containerCounts,
    billData,
  };
};

const { containerCounts, billData } = generateContainerData();

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
        backgroundColor: templates.map(t => t.color),
        borderColor: templates.map(t => t.color.replace("0.7", "1")),
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

  return {
    totalContainers,
    totalBill,
    avgCostPerContainer,
    mostUsedTemplate,
  };
};

function Analytics() {
  const [selectedMonth, setSelectedMonth] = useState(lastSixMonths.length - 1);
  
  const metrics = calculateMetrics(selectedMonth);
  const pieData = generatePieData(selectedMonth);

  return (
    <div className="w-full space-y-4 ">
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
            <div className="text-2xl font-bold">{metrics.totalContainers}</div>
            <p className="text-xs text-gray-500 mt-1">
              Total containers for {lastSixMonths[selectedMonth]}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Monthly Bill
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${metrics.totalBill}</div>
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
        <CardHeader className="pb-0">
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
                        Current usage: {containerCounts[index].data[selectedMonth]} containers
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

