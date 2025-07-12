"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import {
    BarChart,
    Bar,
    LineChart,
    Line,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";
import { useRouter } from "next/navigation";
import { FiArrowLeft } from "react-icons/fi";

const COLORS = ["#8884d8", "#82ca9d"];

export default function EvaluationDashboard() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        axios
            .get("http://localhost:8000/evaluation-results")
            .then((res) => setData(res.data))
            .catch((err) => console.error("Failed to fetch:", err))
            .finally(() =>
                setTimeout(() => setLoading(false), 2000) // Simulate loading delay
            );
    }, []);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-screen space-y-4">
                <svg
                    className="animate-spin h-12 w-12 text-indigo-600"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                >
                    <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                    ></circle>
                    <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    ></path>
                </svg>
                <p className="text-indigo-600 text-lg font-medium">Loading data...</p>
            </div>
        );
    }


    if (!data) {
        return <p className="text-red-500 p-6">Failed to load data</p>;
    }

    const summaryData = [
        { mode: "Conceptual", ...data.summary.conceptual },
        { mode: "Keyword", ...data.summary.keyword },
    ];

    const chartData = data.details.map((item) => ({
        query: item.query,
        conceptual_f1: item.modes.conceptual.f1_score,
        keyword_f1: item.modes.keyword.f1_score,
        conceptual_precision: item.modes.conceptual.precision,
        keyword_precision: item.modes.keyword.precision,
        conceptual_recall: item.modes.conceptual.recall,
        keyword_recall: item.modes.keyword.recall,
    }));

    // Set a minWidth for scrollable charts (adjust width per query count for clarity)
    // Here, 120px per query approx, minimum 1200px so at least 10 queries visible without scroll
    const minChartWidth = Math.max(chartData.length * 120, 1200);

    return (
        <div className="p-6 space-y-6">

         <div className="flex items-center gap-2 cursor-pointer w-fit" onClick={() => router.push("/")}>
        <FiArrowLeft size={20} className="text-blue-600 dark:text-white" />
        <span className="text-blue-600 dark:text-white font-medium hover:underline">Back to Search</span>
      </div>

            <h1 className="text-3xl font-bold mb-4">📊 Model Evaluation Dashboard</h1>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-6">
                {summaryData.map((mode) => (
                    <div
                        key={mode.mode}
                        className="rounded-lg shadow-lg p-6 bg-gradient-to-tr from-blue-400 via-indigo-500 to-purple-600 text-white"
                    >
                        <h2 className="text-2xl font-semibold mb-4">{mode.mode}</h2>
                        <p className="text-base mb-1">
                            🎯 Precision: <span className="font-bold">{mode.avg_precision}</span>
                        </p>
                        <p className="text-base mb-1">
                            📈 Recall: <span className="font-bold">{mode.avg_recall}</span>
                        </p>
                        <p className="text-base">
                            📊 F1 Score: <span className="font-bold">{mode.avg_f1_score}</span>
                        </p>
                    </div>
                ))}
            </div>


            {/* F1 Score Bar Chart */}
            <section className="bg-white rounded-lg shadow-md p-4 h-[650px] overflow-x-auto">
                <h2 className="text-lg font-semibold mb-4 text-[#000]">F1 Score per Query</h2>
                <div style={{ minWidth: minChartWidth, height: "550px" }}>
                    <BarChart
                        data={chartData}
                        width={minChartWidth}
                        height={500} // increase chart drawing height
                        margin={{ top: 50, right: 30, left: 20, bottom: 100 }} // more top and bottom margin
                    >
                        <XAxis
                            dataKey="query"
                            tick={{ fontSize: 10 }}
                            interval={0}
                            angle={-45}
                            textAnchor="end"
                            height={80}
                            dy={15}
                        />
                        <YAxis />
                        <Tooltip />
                        {/* Legend positioned on top to avoid axis overlap */}
                        <Legend verticalAlign="top" height={36} />
                        <Bar dataKey="conceptual_f1" fill="#8884d8" name="Conceptual F1" />
                        <Bar dataKey="keyword_f1" fill="#82ca9d" name="Keyword F1" />
                    </BarChart>
                </div>
            </section>


            {/* Precision Line Chart */}
<section className="bg-white rounded-lg shadow-md p-4 h-[520px] overflow-x-auto">
  <h2 className="text-lg font-semibold mb-4 text-[#000]">Precision Trends</h2>
  <div style={{ minWidth: minChartWidth, height: "420px" }}>
    <LineChart
      data={chartData}
      width={minChartWidth}
      height={420}  // increased height for bigger graph
      margin={{ top: 50, right: 30, left: 20, bottom: 100 }}
    >
      <XAxis
        dataKey="query"
        tick={{ fontSize: 10 }}
        interval={0}
        angle={-45}
        textAnchor="end"
        height={70}
        dy={15}
      />
      <YAxis />
      <Tooltip />
      <Legend verticalAlign="top" height={36} />
      <Line
        type="monotone"
        dataKey="conceptual_precision"
        stroke="#8884d8"
        name="Conceptual Precision"
      />
      <Line
        type="monotone"
        dataKey="keyword_precision"
        stroke="#82ca9d"
        name="Keyword Precision"
      />
    </LineChart>
  </div>
</section>




            {/* Recall Pie Chart */}
            <section className="bg-white rounded-lg shadow-md p-4 h-[400px]">
                <h2 className="text-lg font-semibold mb-2 text-[#000]">Average Recall Distribution</h2>
                <ResponsiveContainer width="100%" height="90%">
                    <PieChart>
                        <Pie
                            data={summaryData.map((m) => ({ name: m.mode, value: m.avg_recall }))}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            outerRadius={100}
                            label
                        >
                            {summaryData.map((_, index) => (
                                <Cell key={index} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            </section>
        </div>
    );
}
