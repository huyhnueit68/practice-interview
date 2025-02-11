// src/components/MostExpensiveWindowChart.tsx
import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS } from 'chart.js';
import annotationPlugin from 'chartjs-plugin-annotation'; // Import annotation plugin

// Register the annotation plugin
ChartJS.register(annotationPlugin);

// Define the type for the props
interface MostExpensiveWindow {
    start: {
        dateTime: string,
        value: number
    }; // ISO date string or any format you prefer
    end: {
        dateTime: string,
        value: number
    };   // ISO date string or any format you prefer
    maxPrice: number; // Maximum combined price
}

interface MostExpensiveWindowChartProps {
    mostExpensiveWindow: MostExpensiveWindow;
}

const MostExpensiveWindowChart: React.FC<MostExpensiveWindowChartProps> = ({ mostExpensiveWindow }) => {
    const data = {
        labels: [mostExpensiveWindow?.start?.dateTime, mostExpensiveWindow?.end?.dateTime],
        datasets: [
            {
                label: 'Combined Market Price',
                data: [mostExpensiveWindow?.start?.value, mostExpensiveWindow?.end?.value],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                ],
                borderWidth: 1,
            },
        ],
    };

    const options: any = {
        animation: false,
        responsive: true, // Make the chart responsive
        maintainAspectRatio: false, // Prevent maintaining aspect ratio
        plugins: {
            legend: {
                display: false
            },
            annotation: {
                annotations: {
                    line1: {
                        type: 'line',
                        yMin: Math.abs(mostExpensiveWindow.end?.value - mostExpensiveWindow.start?.value),
                        yMax: Math.abs(mostExpensiveWindow.end?.value - mostExpensiveWindow.start?.value),
                        borderColor: 'rgb(99, 115, 255)',
                        borderWidth: 2,
                        label: {
                            content: `HPD: ${Math.abs(mostExpensiveWindow.end?.value - mostExpensiveWindow.start?.value)}`,
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
        },
        scales: {
            y: {
                beginAtZero: true,
            },
        },
    };

    return (
        <div className='dashboard__body--box'>
            <h3 className='font-semibold pb-4'>Most Expensive Window</h3>
            <Bar
                data={data}
                options={options}
                style={{
                    width: '100%',
                    maxHeight: 'calc(100% - 35px)'
                }}
            />
            <div className='box--title'>
                <div className='title-line'></div>
                <div className='title-text'>HPD: Highest Price Difference</div>
            </div>
        </div>
    );
};

export default MostExpensiveWindowChart;