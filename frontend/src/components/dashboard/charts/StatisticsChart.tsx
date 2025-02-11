// src/components/StatisticsChart.tsx
import React from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import annotationPlugin from "chartjs-plugin-annotation"; // Import annotation plugin
import ChartDataLabels from "chartjs-plugin-datalabels"; // Import data labels plugin

// Register plugins
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, annotationPlugin, ChartDataLabels);

interface StatisticsChartProps {
    minValue: number;
    maxValue: number;
    averageValue: number;
}

const StatisticsChart: React.FC<StatisticsChartProps> = ({ minValue, maxValue, averageValue }) => {
    const data = {
        labels: ["Minimum Value", "Maximum Value"],
        datasets: [
            {
                label: "Values",
                data: [minValue, maxValue],
                backgroundColor: ['rgba(255, 99, 132, 0.2)', 'rgba(54, 162, 235, 0.2)'],
                borderColor: ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)'],
                borderWidth: 1,
            },
        ],
    };

    const options: any = {
        responsive: true,
        maintainAspectRatio: false, // Prevent maintaining aspect ratio
        plugins: {
            legend: {
                display: false
            },
            annotation: {
                annotations: {
                    line1: {
                        type: "line",
                        yMin: averageValue,
                        yMax: averageValue,
                        borderColor: "rgb(99, 115, 255)",
                        borderWidth: 1.5,
                        label: {
                            content: `Avg: ${averageValue}`,
                            display: true,
                            position: "center",
                            backgroundColor: "#ffffff",
                            color: "rgb(99, 115, 255)",
                            font: {
                                size: 12,
                                weight: "bold",
                            },
                            padding: 5,
                        },
                    },
                },
            },
            datalabels: {
                anchor: "end",
                align: "end",
                formatter: (value: any, context: any) => {
                    const labels = ["Min Price", "Max Price", "Avg Price"];
                    return `${labels[context.dataIndex]}: ${value}`;
                },
                color: "black",
            },
        },
        scales: {
            y: {
                beginAtZero: true,
            },
        },
    };

    return (
        <div className="dashboard__body--box box-custom mb-4">
            <h3 className="font-semibold pb-4">Statistics</h3>
            <Bar
                className="box-full"
                data={data}
                options={options}
            />
        </div>
    );
};

export default StatisticsChart;