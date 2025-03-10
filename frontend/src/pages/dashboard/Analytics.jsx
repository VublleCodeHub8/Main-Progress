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
  labels: [ "June", "July","August", "September", "October", "November", "December"],
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
      data: [140, 160, 35, 63, 20, 30, 108],
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
      data: [19, 300], // Data for June
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
const months = [ "June", "July","August", "September", "October", "November", "December"];
const [selectedMonth, setSelectedMonth] = useState("June");

const handleMonthChange = (event) => {
  setSelectedMonth(event.target.value);
};

const pieDataForSelectedMonth = {
  labels: ["Number of Containers Running", "Bill Generated ($)"],
  datasets: [
    {
      data: [
        barData.datasets[0].data[months.indexOf(selectedMonth)],
        barData.datasets[1].data[months.indexOf(selectedMonth)],
      ],
      backgroundColor: ["rgba(75, 192, 192, 0.2)", "rgba(153, 102, 255, 0.2)"],
      borderColor: ["rgba(75, 192, 192, 1)", "rgba(153, 102, 255, 1)"],
      borderWidth: 1,
    },
  ],
};

return (
  <div className="w-full">
    <h1 className="text-2xl font-bold mb-4">Analytics</h1>
    <div className="tabs flex justify-between">
      <button
        className={`tab ${activeTab === "total" ? "active bg-white " : ""} border-2 rounded-sm p-1 border-slate-800 mr-2`}
        onClick={() => setActiveTab("total")}
      >
        Total Analysis
      </button>
      <button
        className={`tab ${activeTab === "June" ? "active bg-white" : ""} border-2 rounded-sm p-1 border-slate-800 mr-2`}
        onClick={() => setActiveTab("June")}
      >
        Monthly Analysis
      </button>
    </div>
    {activeTab === "June" && (
      <div className="mb-4">
        <label htmlFor="month-select" className="mr-2">Select Month:</label>
        <select
          id="month-select"
          value={selectedMonth}
          onChange={handleMonthChange}
        >
          {months.map((month) => (
            <option key={month} value={month}>
              {month}
            </option>
          ))}
        </select>
      </div>
    )}
    <div className="h-[500px]">
      {activeTab === "total" && (
        <Bar data={barData} options={{ ...options, maintainAspectRatio: false }} />
      )}
      {activeTab === "June" && (
        <Pie data={pieDataForSelectedMonth} options={{ ...options, maintainAspectRatio: false }} />
      )}
    </div>
  </div>
);
}

export default Analytics;

