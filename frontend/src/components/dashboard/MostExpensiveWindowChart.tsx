// src/components/MostExpensiveWindowChart.tsx
import React from 'react';
import { Bar } from 'react-chartjs-2';

// Define the type for the props
interface MostExpensiveWindow {
    start: string; // ISO date string or any format you prefer
    end: string;   // ISO date string or any format you prefer
    maxPrice: number; // Maximum combined price
}

interface MostExpensiveWindowChartProps {
    mostExpensiveWindow: MostExpensiveWindow;
}

const MostExpensiveWindowChart: React.FC<MostExpensiveWindowChartProps> = ({ mostExpensiveWindow }) => {
    const data = {
        labels: [mostExpensiveWindow.start, mostExpensiveWindow.end],
        datasets: [
            {
                label: 'Combined Market Price',
                data: [mostExpensiveWindow.maxPrice, mostExpensiveWindow.maxPrice], // Same value for both bars
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

    return (
        <div className='dashboard__body--box mb-8' style={{
            paddingBottom: '48px'
        }}>
            <h3 className='font-semibold'>Most Expensive Window</h3>
            <Bar data={data} options={{ animation: false }}/>
            <p>Most expensive window is from {mostExpensiveWindow.start} to {mostExpensiveWindow.end} with a total price of {mostExpensiveWindow.maxPrice}.</p>
        </div>
    );
};

export default MostExpensiveWindowChart;