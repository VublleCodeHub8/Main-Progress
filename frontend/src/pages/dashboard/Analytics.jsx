import { useState } from "react";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const barData = {
  labels: ["January", "February", "March", "April", "May", "June", "July"],
  datasets: [
    {
      label: "Number of Containers Running",
      data: [12, 19, 3, 5, 2, 3, 9],
      backgroundColor: "rgba(75, 192, 192, 0.2)",
      borderColor: "rgba(75, 192, 192, 1)",
      borderWidth: 1,
    },
    {
      label: "Bill Generated ($)",
      data: [200, 300, 400, 500, 600, 700, 800],
      backgroundColor: "rgba(153, 102, 255, 0.2)",
      borderColor: "rgba(153, 102, 255, 1)",
      borderWidth: 1,
    },
  ],
};

const pieData = {
  labels: ["Number of Containers Running", "Bill Generated ($)"],
  datasets: [
    {
      data: [19, 300], // Data for February
      backgroundColor: ["rgba(75, 192, 192, 0.2)", "rgba(153, 102, 255, 0.2)"],
      borderColor: ["rgba(75, 192, 192, 1)", "rgba(153, 102, 255, 1)"],
      borderWidth: 1,
    },
  ],
};

const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top",
    },
    title: {
      display: true,
      text: "Analytics Overview",
    },
  },
};

function Analytics() {
  const [activeTab, setActiveTab] = useState("total");

  return (
    <div className="w-full">
      <h1 className="text-2xl font-bold mb-4">Analytics</h1>
      <div className="tabs">
        <button
          className={`tab ${activeTab === "total" ? "active" : ""}`}
          onClick={() => setActiveTab("total")}
        >
          Total Analysis
        </button>
        <button
          className={`tab ${activeTab === "february" ? "active" : ""}`}
          onClick={() => setActiveTab("february")}
        >
          February Analysis
        </button>
      </div>
      <div className="h-[700px]">
      {activeTab === "total" && <Bar data={barData} options={{ ...options, maintainAspectRatio: false }}/>}
      {activeTab === "february" && (
        
          <Pie data={pieData} options={{ ...options, maintainAspectRatio: false }} />
        
      )}
      </div>
    </div>
  );
}

export default Analytics;

