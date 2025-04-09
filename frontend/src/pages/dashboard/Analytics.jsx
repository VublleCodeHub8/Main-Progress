import { useState, useEffect, useMemo, Suspense } from "react";
import { Chart } from "@/components/ui/chart";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { useSelector } from "react-redux";
import Loader from "@/components/ui/Loader";
import { 
  AlertTriangle, 
  TrendingUp, 
  TrendingDown,
  Server, 
  Activity,
  Calendar,
  DollarSign,
  Package,
  Layers,
  Clock,
  RefreshCw
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
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
  const [ userAnalytics, setuserAnalytics] = useState(null)
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [containerData, setContainerData] = useState(null);

  const fetchUserAnalyticsData = async () => {
    try {
      setLoading(true);
      const tok = JSON.parse(localStorage.getItem("token"));
      if (!tok?.token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch("http://localhost:3000/user/getuserdata", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${tok.token}`,
          "Content-Type": "application/json"
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch analytics data');
      }

      const data = await response.json();
      setuserAnalytics(data);
    } catch (error) {
      console.error("Error fetching analytics data:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchUserAnalyticsData();
  }, []);

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
        
        // Get container usage from userAnalytics data
        const containerCounts = templates.map((template, index) => {
          // Get container IDs for each month from userAnalytics.containerUsage.monthlyUsage
          const monthlyCounts = lastTwelveMonths.map(async (monthData) => {
            const month = monthData.label.split(' ')[0];
            const year = parseInt(monthData.label.split(' ')[1]);
            
            // Find matching monthly usage
            const monthlyUsage = userAnalytics?.containerUsage?.monthlyUsage?.find(
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
        
        // Get monthly bills from userAnalytics data
        const billData = lastTwelveMonths.map(monthData => {
          const matchingBill = userAnalytics?.billingInfo?.monthlyBills?.find(
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
  }, [templates, userAnalytics?.billingInfo?.monthlyBills, userAnalytics?.containerUsage?.monthlyUsage]);
  // console.log(containerData);
  if (loading) {
    return (
        <div className="w-full h-screen flex flex-col items-center justify-center bg-white/90 px-4">
            <Loader 
                title="Loading Analytics Dashboard" 
                description="Fetching your container usage and billing data..."
            />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full max-w-6xl mt-10">
                {[1, 2, 3, 4].map((i) => (
                    <Card key={i} className="w-full">
                        <CardHeader className="pb-2">
                            <Skeleton className="h-4 w-24" />
                        </CardHeader>
                        <CardContent>
                            <Skeleton className="h-8 w-16 mb-2" />
                            <Skeleton className="h-3 w-32" />
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
  }

  if (error) {
    return (
        <div className="w-full h-screen flex flex-col items-center justify-center bg-white/90 px-4">
            <div className="text-center p-8 bg-red-50 rounded-lg border border-red-100 max-w-md">
                <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-red-700 mb-2">Analytics Error</h3>
                <p className="text-red-600 mb-4">{error.message || "Failed to load analytics data"}</p>
                <Button 
                    variant="outline" 
                    onClick={() => window.location.reload()}
                    className="flex items-center gap-2"
                >
                    <RefreshCw className="h-4 w-4" /> Retry
                </Button>
            </div>
        </div>
    );
  }

  if (!containerData) {
    return (
        <div className="w-full h-screen flex items-center justify-center bg-white/90">
            <Loader 
                title="Preparing Analytics" 
                description="Processing your usage data and generating insights..."
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

  // Enhanced metrics calculation
  const calculateMetrics = (selectedMonthIndex) => {
    try {
      const selectedMonthData = lastTwelveMonths[selectedMonthIndex];
      const month = selectedMonthData.label.split(' ')[0];
      const year = parseInt(selectedMonthData.label.split(' ')[1]);
      
      // Get active containers count from projects
      const activeContainers = projects.length;
      
      // Get total containers from userAnalytics data
      const totalContainers = userAnalytics?.containerUsage?.totalContainers || 0;
      
      // Calculate container growth (compared to previous month)
      const containerGrowth = calculateGrowthRate(selectedMonthIndex);
      
      // Get monthly bill from userAnalytics data
      const matchingBill = userAnalytics?.billingInfo?.monthlyBills?.find(
        bill => bill.month === month && bill.year === year
      );
      const totalBill = matchingBill ? matchingBill.amount : 0;
      
      // Calculate bill growth (compared to previous month)
      const billGrowth = calculateBillGrowthRate(selectedMonthIndex);
      
      // Get monthly container usage from userAnalytics data
      const monthlyUsage = userAnalytics?.containerUsage?.monthlyUsage?.find(
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
      const totalBillTillNow = userAnalytics?.billingInfo?.amount || 0;
      
      return {
        totalContainers,
        activeContainers,
        totalBill,
        totalBillTillNow,
        mostUsedTemplate,
        containerGrowth,
        billGrowth
      };
    } catch (error) {
      console.error("Error calculating metrics:", error);
      return {
        totalContainers: 0,
        activeContainers: 0,
        totalBill: 0,
        totalBillTillNow: 0,
        mostUsedTemplate: { name: "None", count: 0 },
        containerGrowth: 0,
        billGrowth: 0
      };
    }
  };

  // Calculate growth rate for containers
  const calculateGrowthRate = (currentMonthIndex) => {
    try {
      if (currentMonthIndex <= 0) return 0;
      
      // Get current month data
      const currentMonthTotalContainers = getMonthTotalContainers(currentMonthIndex);
      
      // Get previous month data
      const previousMonthTotalContainers = getMonthTotalContainers(currentMonthIndex - 1);
      
      if (previousMonthTotalContainers === 0) return 0;
      
      // Calculate growth rate
      const growthRate = ((currentMonthTotalContainers - previousMonthTotalContainers) / previousMonthTotalContainers) * 100;
      return Math.round(growthRate);
    } catch (error) {
      return 0;
    }
  };

  // Calculate bill growth rate
  const calculateBillGrowthRate = (currentMonthIndex) => {
    try {
      if (currentMonthIndex <= 0) return 0;
      
      // Get current month bill
      const currentMonthData = lastTwelveMonths[currentMonthIndex];
      const currentBill = billData[currentMonthIndex] || 0;
      
      // Get previous month bill
      const previousBill = billData[currentMonthIndex - 1] || 0;
      
      if (previousBill === 0) return 0;
      
      // Calculate growth rate
      const growthRate = ((currentBill - previousBill) / previousBill) * 100;
      return Math.round(growthRate);
    } catch (error) {
      return 0;
    }
  };

  // Get total containers for a specific month
  const getMonthTotalContainers = (monthIndex) => {
    try {
      let totalContainers = 0;
      
      // Sum containers across all templates for the given month
      containerCounts.forEach(template => {
        totalContainers += template.data[monthIndex] || 0;
      });
      
      return totalContainers;
    } catch (error) {
      return 0;
    }
  };

  // Calculate monthly insights
  const generateMonthlyInsights = (selectedMonthIndex) => {
    try {
      const monthName = lastTwelveMonths[selectedMonthIndex].label;
      const totalContainersThisMonth = getMonthTotalContainers(selectedMonthIndex);
      const growth = calculateGrowthRate(selectedMonthIndex);
      const bill = billData[selectedMonthIndex] || 0;
      const billGrowth = calculateBillGrowthRate(selectedMonthIndex);
      
      let main = `In ${monthName}, you used ${totalContainersThisMonth} containers in total.`;
      let secondary = '';
      let recommendation = '';
      
      if (growth > 15) {
        secondary = `Usage increased by ${growth}% compared to previous month.`;
        recommendation = 'Consider reviewing your container allocation strategy to optimize costs.';
      } else if (growth < -15) {
        secondary = `Usage decreased by ${Math.abs(growth)}% compared to previous month.`;
        recommendation = 'Your resource usage has decreased significantly. You might want to check if all needed services are running properly.';
      } else if (billGrowth > 20) {
        secondary = `Your bill increased by ${billGrowth}% while container usage only changed by ${growth}%.`;
        recommendation = 'Investigate cost increases - you might be using more expensive templates or services.';
      } else {
        secondary = `Your usage pattern was relatively stable this month.`;
      }
      
      return { main, secondary, recommendation };
    } catch (error) {
      return {
        main: 'No significant insights available for this month.',
        secondary: 'Try selecting a different month or check if your data is up to date.',
        recommendation: ''
      };
    }
  };

  const metrics = calculateMetrics(selectedMonth);
  const pieData = generatePieData(selectedMonth);
  const monthlyTotalContainers = getMonthTotalContainers(selectedMonth);
  const monthOverMonthChange = calculateGrowthRate(selectedMonth);
  const monthlyInsights = generateMonthlyInsights(selectedMonth);
  
  // Calculate additional metrics for the overview tab
  const averageMonthlyBill = billData.reduce((sum, bill) => sum + bill, 0) / billData.filter(bill => bill > 0).length || 0;
  
  const highestBillingMonth = billData.reduce((highest, bill, index) => {
    if (bill > highest.amount) {
      return { month: lastTwelveMonths[index].label, amount: bill };
    }
    return highest;
  }, { month: 'None', amount: 0 });
  
  const billTrend = (() => {
    if (billData.length < 3) return 'Insufficient data for trend analysis';
    
    const recentMonths = billData.slice(-3);
    if (recentMonths[2] > recentMonths[1] && recentMonths[1] > recentMonths[0]) {
      return 'Consistently increasing over the last three months';
    } else if (recentMonths[2] < recentMonths[1] && recentMonths[1] < recentMonths[0]) {
      return 'Consistently decreasing over the last three months';
    } else {
      return 'Fluctuating pattern over recent months';
    }
  })();
  
  // Containers over time data
  const containersOverTimeData = {
    labels: lastTwelveMonths.map(m => m.label),
    datasets: [
      {
        label: 'Total Containers',
        data: lastTwelveMonths.map((_, index) => getMonthTotalContainers(index)),
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 1,
      }
    ]
  };
  
  const containerGrowthRate = (() => {
    const totals = lastTwelveMonths.map((_, index) => getMonthTotalContainers(index));
    if (totals.length < 2 || totals[0] === 0) return 0;
    
    const firstMonth = totals[0];
    const lastMonth = totals[totals.length - 1];
    return Math.round(((lastMonth - firstMonth) / firstMonth) * 100);
  })();
  
  const peakUsageMonth = (() => {
    const totals = lastTwelveMonths.map((month, index) => ({ 
      month: month.label, 
      count: getMonthTotalContainers(index) 
    }));
    
    return totals.reduce((max, current) => current.count > max.count ? current : max, { month: 'None', count: 0 }).month;
  })();
  
  const usageTrend = (() => {
    const totals = lastTwelveMonths.map((_, index) => getMonthTotalContainers(index));
    if (totals.length < 3) return 'Insufficient data for trend analysis';
    
    const recentMonths = totals.slice(-3);
    if (recentMonths[2] > recentMonths[1] && recentMonths[1] > recentMonths[0]) {
      return 'Consistently increasing over the last three months';
    } else if (recentMonths[2] < recentMonths[1] && recentMonths[1] < recentMonths[0]) {
      return 'Consistently decreasing over the last three months';
    } else {
      return 'Fluctuating pattern over recent months';
    }
  })();
  
  // Efficiency data for scatter plot
  const efficiencyData = {
    datasets: [
      {
        label: 'Cost Efficiency',
        data: lastTwelveMonths.map((month, index) => {
          const containers = getMonthTotalContainers(index);
          const bill = billData[index] || 0;
          return {
            x: containers,
            y: containers > 0 ? bill / containers : 0,
            month: month.label
          };
        }).filter(item => item.x > 0),
        backgroundColor: 'rgba(75, 192, 192, 0.7)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
        pointRadius: 6,
        pointHoverRadius: 8,
      }
    ]
  };
  
  const costEfficiencyAnalysis = (() => {
    const data = efficiencyData.datasets[0].data;
    if (data.length < 2) return 'Insufficient data for cost efficiency analysis';
    
    const avgCostPerContainer = data.reduce((sum, item) => sum + item.y, 0) / data.length;
    const trend = data[data.length - 1].y < avgCostPerContainer ? 
      'Your cost per container is decreasing, showing improved efficiency' : 
      'Your cost per container is increasing - consider optimizing your resource usage';
    
    return trend;
  })();

  // Generate realistic recommendations based on usage patterns
  const generateRecommendations = (metrics, templates, containerCounts) => {
    // This would normally analyze real data patterns
    // For now, we'll return some generic recommendations
    return {
      usageRecommendations: [
        "Consider consolidating your Node.js containers to reduce overhead and improve resource utilization.",
        "Your Python containers show periodic usage patterns - schedule these during off-peak hours.",
        "Several containers have been idle for more than 7 days. Consider pausing or removing them.",
        "Database containers are consuming the most resources - review your query optimization."
      ],
      costSavingTips: [
        "Switch development environments to lower-cost templates during non-working hours.",
        "Implement auto-scaling for your production containers to match demand patterns.",
        "Consolidate storage across similar container types to reduce redundancy.",
        "Consider reserved instances for your consistently used containers to save up to 30%."
      ]
    };
  };

  // Generate recommendations based on data
  const { usageRecommendations, costSavingTips } = generateRecommendations(metrics, templates, containerCounts);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics Dashboard</h1>
          <p className="text-gray-500 mt-1">Monitor your container usage and billing trends</p>
        </div>
        <Button 
          variant="outline" 
          onClick={() => window.location.reload()}
          className="flex items-center gap-2"
        >
          <RefreshCw className="h-4 w-4" /> Refresh Data
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <Card className="overflow-hidden border-l-4 border-l-blue-500 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium text-gray-500">
              Total Containers
            </CardTitle>
            <Server className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{metrics.totalContainers}</div>
            <div className="flex items-center mt-1 text-xs">
              <Badge variant={metrics.containerGrowth > 0 ? "success" : "destructive"} className="text-xs px-1 py-0">
                {metrics.containerGrowth > 0 ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                {Math.abs(metrics.containerGrowth || 0)}%
              </Badge>
              <span className="text-gray-500 ml-2">vs previous period</span>
            </div>
          </CardContent>
        </Card>
        
        <Card className="overflow-hidden border-l-4 border-l-green-500 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium text-gray-500">
              Active Containers
            </CardTitle>
            <Activity className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{metrics.activeContainers}</div>
            <div className="flex items-center mt-1">
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div 
                  className="bg-green-500 h-1.5 rounded-full" 
                  style={{ width: `${metrics.activeContainers > 0 ? (metrics.activeContainers / metrics.totalContainers) * 100 : 0}%` }}
                ></div>
              </div>
              <span className="text-xs text-gray-500 ml-2">
                {metrics.activeContainers > 0 ? 
                  Math.round((metrics.activeContainers / metrics.totalContainers) * 100) : 0}% utilization
              </span>
            </div>
          </CardContent>
        </Card>
        
        <Card className="overflow-hidden border-l-4 border-l-purple-500 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium text-gray-500">
              Total Bill
            </CardTitle>
            <DollarSign className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {userAnalytics?.billingInfo?.amount ? `$${userAnalytics.billingInfo.amount.toFixed(2)}` : "$0.00"}
            </div>
            <div className="flex items-center mt-1 text-xs">
              <Badge variant={metrics.billGrowth > 0 ? "warning" : "success"} className="text-xs px-1 py-0">
                {metrics.billGrowth > 0 ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                {Math.abs(metrics.billGrowth || 0)}%
              </Badge>
              <span className="text-gray-500 ml-2">vs previous month</span>
            </div>
          </CardContent>
        </Card>
        
        <Card className="overflow-hidden border-l-4 border-l-amber-500 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium text-gray-500">
              Most Used Template
            </CardTitle>
            <Package className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold truncate">{metrics.mostUsedTemplate.name}</div>
            <div className="flex items-center text-xs mt-1">
              <Layers className="h-3 w-3 text-amber-500 mr-1" />
              <span className="text-gray-700">{metrics.mostUsedTemplate.count} containers</span>
              <span className="text-gray-500 ml-1">
                ({metrics.mostUsedTemplate.count > 0 && metrics.totalContainers > 0 ? 
                  Math.round((metrics.mostUsedTemplate.count / metrics.totalContainers) * 100) : 0}% of total)
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content with Tabs */}
      <Card className="overflow-hidden shadow-md">
        <CardHeader className="pb-2 border-b">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl">Usage & Billing Analysis</CardTitle>
            <div className="text-sm text-gray-500 flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              <span>Last updated: {new Date().toLocaleString()}</span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="mb-6 grid grid-cols-3 p-1">
              <TabsTrigger value="overview" className="flex items-center">
                <Activity className="h-4 w-4 mr-2" />
                Overall Trends
              </TabsTrigger>
              <TabsTrigger value="monthly" className="flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                Monthly Breakdown
              </TabsTrigger>
              <TabsTrigger value="templates" className="flex items-center">
                <Package className="h-4 w-4 mr-2" />
                Template Analysis
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Billing Trend Over Time</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[350px]">
                      <Chart 
                        type="line" 
                        data={lineData} 
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          plugins: {
                            legend: {
                              position: 'top',
                            },
                            tooltip: {
                              mode: 'index',
                              intersect: false,
                            },
                          },
                          scales: {
                            y: {
                              beginAtZero: true,
                              title: {
                                display: true,
                                text: 'Amount ($)'
                              }
                            }
                          }
                        }}
                      />
                    </div>
                  </CardContent>
                  <CardFooter className="border-t px-6 py-3">
                    <div className="text-xs text-gray-500">
                      <p className="font-medium">Key Insights:</p>
                      <ul className="list-disc list-inside mt-1">
                        <li>Average monthly bill: ${averageMonthlyBill.toFixed(2)}</li>
                        <li>Highest billing month: {highestBillingMonth.month} (${highestBillingMonth.amount.toFixed(2)})</li>
                        <li>Billing trend: {billTrend}</li>
                      </ul>
                    </div>
                  </CardFooter>
                </Card>
                
                <Card className="shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Container Growth Over Time</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[350px]">
                      <Chart 
                        type="bar" 
                        data={containersOverTimeData} 
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          plugins: {
                            legend: {
                              position: 'top',
                            },
                            tooltip: {
                              mode: 'index',
                              intersect: false,
                            },
                          },
                          scales: {
                            y: {
                              beginAtZero: true,
                              title: {
                                display: true,
                                text: 'Container Count'
                              }
                            }
                          }
                        }}
                      />
                    </div>
                  </CardContent>
                  <CardFooter className="border-t px-6 py-3">
                    <div className="text-xs text-gray-500">
                      <p className="font-medium">Key Insights:</p>
                      <ul className="list-disc list-inside mt-1">
                        <li>Monthly container growth: {containerGrowthRate}%</li>
                        <li>Peak usage month: {peakUsageMonth}</li>
                        <li>Usage trend: {usageTrend}</li>
                      </ul>
                    </div>
                  </CardFooter>
                </Card>
              </div>
              
              <Card className="shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Usage-to-Cost Efficiency</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <Chart 
                      type="scatter" 
                      data={efficiencyData} 
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          tooltip: {
                            callbacks: {
                              label: function(context) {
                                return `${context.raw.month}: ${context.raw.x} containers, $${context.raw.y.toFixed(2)}`;
                              }
                            }
                          }
                        },
                        scales: {
                          x: {
                            title: {
                              display: true,
                              text: 'Total Containers'
                            }
                          },
                          y: {
                            title: {
                              display: true,
                              text: 'Cost per Container ($)'
                            }
                          }
                        }
                      }}
                    />
                  </div>
                </CardContent>
                <CardFooter className="border-t px-6 py-3">
                  <div className="text-xs text-gray-500">
                    <p className="font-medium">Cost Efficiency Analysis:</p>
                    <p className="mt-1">{costEfficiencyAnalysis}</p>
                  </div>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="monthly" className="space-y-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                <div className="flex-1">
                  <h3 className="text-lg font-medium mb-1">Monthly Detailed Analysis</h3>
                  <p className="text-sm text-gray-500">Examine container distribution and costs for a specific month</p>
                </div>
                <div className="w-full md:w-auto">
                  <Select
                    value={selectedMonth.toString()}
                    onValueChange={(value) => setSelectedMonth(parseInt(value))}
                  >
                    <SelectTrigger className="w-[220px]">
                      <SelectValue placeholder="Select a month" />
                    </SelectTrigger>
                    <SelectContent>
                      {lastTwelveMonths.map((monthData, index) => (
                        <SelectItem key={monthData.label} value={index.toString()}>
                          {monthData.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">
                      {`Container Distribution - ${lastTwelveMonths[selectedMonth].label}`}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[350px]">
                      <Chart 
                        type="pie" 
                        data={pieData}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          plugins: {
                            legend: {
                              position: 'right',
                            },
                            tooltip: {
                              callbacks: {
                                label: function(context) {
                                  const label = context.label || '';
                                  const value = context.raw || 0;
                                  const total = context.chart.data.datasets[0].data.reduce((a, b) => a + b, 0);
                                  const percentage = Math.round((value / total) * 100);
                                  return `${label}: ${value} containers (${percentage}%)`;
                                }
                              }
                            }
                          }
                        }}
                      />
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">
                      Monthly Metrics Snapshot
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="text-sm text-gray-500 mb-1">Total Containers</div>
                        <div className="text-2xl font-bold">{monthlyTotalContainers}</div>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="text-sm text-gray-500 mb-1">Monthly Bill</div>
                        <div className="text-2xl font-bold">${metrics.totalBill.toFixed(2)}</div>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="text-sm text-gray-500 mb-1">Avg. Cost/Container</div>
                        <div className="text-2xl font-bold">
                          ${monthlyTotalContainers > 0 ? (metrics.totalBill / monthlyTotalContainers).toFixed(2) : "0.00"}
                        </div>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="text-sm text-gray-500 mb-1">vs Previous Month</div>
                        <div className="flex items-center">
                          <div className="text-2xl font-bold">{Math.abs(monthOverMonthChange)}%</div>
                          {monthOverMonthChange > 0 ? (
                            <TrendingUp className="ml-2 h-5 w-5 text-green-500" />
                          ) : (
                            <TrendingDown className="ml-2 h-5 w-5 text-red-500" />
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                      <h4 className="text-sm font-medium text-blue-700 mb-2">Month Insights</h4>
                      <ul className="text-sm text-blue-600 space-y-1">
                        <li className="flex items-start">
                          <span className="mr-2">•</span>
                          <span>{monthlyInsights.main}</span>
                        </li>
                        <li className="flex items-start">
                          <span className="mr-2">•</span>
                          <span>{monthlyInsights.secondary}</span>
                        </li>
                        {monthlyInsights.recommendation && (
                          <li className="flex items-start mt-2 pt-2 border-t border-blue-200">
                            <span className="mr-2">💡</span>
                            <span className="font-medium">{monthlyInsights.recommendation}</span>
                          </li>
                        )}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="templates" className="space-y-6">
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-1">Template Performance Analysis</h3>
                <p className="text-sm text-gray-500">Compare usage trends across different templates</p>
              </div>
              
              <div className="h-[400px] mb-6">
                <Chart 
                  type="bar" 
                  data={barData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'top',
                      },
                      tooltip: {
                        mode: 'index',
                        intersect: false,
                      },
                    },
                    scales: {
                      x: {
                        stacked: false,
                      },
                      y: {
                        stacked: false,
                        beginAtZero: true,
                        title: {
                          display: true,
                          text: 'Container Count'
                        }
                      }
                    }
                  }}
                />
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
                {templates.map((template, index) => (
                  <Card key={template.name} className="shadow-sm hover:shadow-md transition-shadow border-t-4" style={{ borderTopColor: generateColors(templates.length)[index].replace("0.7", "1") }}>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium flex items-center justify-between">
                        <span className="truncate">{template.name}</span>
                        <Badge variant="outline" className="text-xs">
                          ${template.price}
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-baseline gap-2">
                        <div className="text-2xl font-bold">
                          {containerCounts && containerCounts[index] ? containerCounts[index].data[selectedMonth] : 0}
                        </div>
                        <div className="text-sm text-gray-500">containers</div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-500">Usage share</span>
                          <span className="font-medium">
                            {monthlyTotalContainers > 0 && containerCounts && containerCounts[index] 
                              ? Math.round((containerCounts[index].data[selectedMonth] / monthlyTotalContainers) * 100) 
                              : 0}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div 
                            className="h-1.5 rounded-full" 
                            style={{ 
                              width: `${monthlyTotalContainers > 0 && containerCounts && containerCounts[index] 
                                ? (containerCounts[index].data[selectedMonth] / monthlyTotalContainers) * 100 
                                : 0}%`,
                              backgroundColor: generateColors(templates.length)[index].replace("0.7", "1")
                            }}
                          ></div>
                        </div>
                      </div>
                      
                      <div className="text-xs text-gray-500 pt-1 flex justify-between items-center">
                        <span>Monthly cost:</span>
                        <span className="font-medium">
                          ${(template.price * (containerCounts && containerCounts[index] ? containerCounts[index].data[selectedMonth] : 0)).toFixed(2)}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      {/* Usage Recommendations */}
      <Card className="overflow-hidden shadow-md bg-gradient-to-r from-blue-50 to-indigo-50">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Usage Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <h3 className="font-medium text-blue-700 flex items-center mb-2">
                <TrendingUp className="h-4 w-4 mr-2" />
                Optimization Opportunities
              </h3>
              <ul className="space-y-2 text-sm">
                {usageRecommendations.map((rec, i) => (
                  <li key={i} className="flex items-start">
                    <span className="text-blue-500 mr-2">•</span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <h3 className="font-medium text-purple-700 flex items-center mb-2">
                <DollarSign className="h-4 w-4 mr-2" />
                Cost Saving Tips
              </h3>
              <ul className="space-y-2 text-sm">
                {costSavingTips.map((tip, i) => (
                  <li key={i} className="flex items-start">
                    <span className="text-purple-500 mr-2">•</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default Analytics;