// src/components/MarketPriceChart.tsx
import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, registerables } from 'chart.js';
import 'chartjs-adapter-date-fns'; // Import the date adapter for time handling

// Register plugins
ChartJS.register(...registerables);

interface MarketPriceChartProps {
    chartData: {
        labels: string[];
        datasets: {
            label: string;
            data: number[];
            borderColor: string;
            backgroundColor: string;
            borderWidth: number;
            fill: boolean; // Fill the area under the line
        }[];
    };
}

const MarketPriceChart: React.FC<MarketPriceChartProps> = ({ chartData }) => {
    return (
        <div className='dashboard__body--box box-custom'>
            <h3 className='font-semibold'>Market Price Chart</h3>
            <Line
                style={{
                    maxWidth: '100%',
                    maxHeight: '100%',
                }}
                data={chartData}
                options={{
                    animation: false,
                    responsive: true,
                    plugins: {
                        legend: {
                            display: false, // Hide the legend
                        },
                        title: {
                            display: false, // Hide the title
                        },
                    },
                    scales: {
                        y: {
                            beginAtZero: true, // Start the Y-axis at zero
                        },
                    },
                }}
            />
        </div>
    );
};

export default MarketPriceChart;