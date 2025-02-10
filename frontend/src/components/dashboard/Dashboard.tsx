import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Bar } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js'; // Import Chart and registerables
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../stores/commonStore'; // Ensure you import RootState
import MostExpensiveWindowChart from './MostExpensiveWindowChart'; // Import the new chart component

Chart.register(...registerables);

const Dashboard = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // Sample data array
    const dataArray = [
        { dateTime: "2023-01-01T00:00:00", marketPrice: 65.24 },
        { dateTime: "2023-01-01T00:30:00", marketPrice: 70.50 },
        { dateTime: "2023-01-01T01:00:00", marketPrice: 68.00 },
        { dateTime: "2023-01-01T01:30:00", marketPrice: 72.00 },
        // Add more data as needed...
    ];

    const [chartData, setChartData] = useState<any>({
        labels: [],
        datasets: [
            {
                label: 'Market Price',
                data: [],
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderWidth: 1,
            },
        ],
    });

    // Calculate minimum, maximum, and average values
    const calculateStatistics = () => {
        if (dataArray.length === 0) return { minValue: 0, maxValue: 0, averageValue: 0 };

        const prices = dataArray.map(item => item.marketPrice);
        const minValue = Math.min(...prices);
        const maxValue = Math.max(...prices);
        const averageValue = (prices.reduce((acc, val) => acc + val, 0) / prices.length).toFixed(2);

        return { minValue, maxValue, averageValue };
    };

    const { minValue, maxValue, averageValue } = calculateStatistics();

    // Calculate the most expensive window
    const calculateMostExpensiveWindow = () => {
        let mostExpensiveWindow = { start: '', end: '', maxPrice: 0 };

        for (let i = 0; i < dataArray.length - 1; i++) {
            const combinedPrice = dataArray[i].marketPrice + dataArray[i + 1].marketPrice;
            if (combinedPrice > mostExpensiveWindow.maxPrice) {
                mostExpensiveWindow = {
                    start: dataArray[i].dateTime,
                    end: dataArray[i + 1].dateTime,
                    maxPrice: combinedPrice,
                };
            }
        }
        return mostExpensiveWindow;
    };

    const mostExpensiveWindow = calculateMostExpensiveWindow();

    useEffect(() => {
        if (dataArray.length > 0) {
            const labels = dataArray.map(item => new Date(item.dateTime).toLocaleString());
            const prices = dataArray.map(item => item.marketPrice);

            setChartData({
                labels: labels,
                datasets: [
                    {
                        label: 'Market Price',
                        data: prices,
                        borderColor: 'rgba(75, 192, 192, 1)',
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        borderWidth: 1,
                    },
                ],
            });
        }
    }, [dataArray]);

    return (
        <div className="practice-dashboard">
            <div className='practice-dashboard__topbar'>
            </div>
            <div className='practice-dashboard__body'>
                <>
                    <div className='dashboard__body--box mb-8'>
                        <h3 className='font-semibold' >Market Price Chart</h3>
                        <Line className='box-full' data={chartData} options={{ animation: false }}/>
                    </div>
                    <div className='dashboard__body--box mb-8'>
                        <h3 className='font-semibold'>Statistics</h3>
                        <Bar
                            options={{ animation: false }}
                            className='box-full'
                            data={{
                                labels: ['Minimum Value', 'Maximum Value', 'Average Value'],
                                datasets: [
                                    {
                                        label: 'Values',
                                        data: [minValue, maxValue, averageValue],
                                        backgroundColor: [
                                            'rgba(255, 99, 132, 0.2)',
                                            'rgba(54, 162, 235, 0.2)',
                                            'rgba(75, 192, 192, 0.2)',
                                        ],
                                        borderColor: [
                                            'rgba(255, 99, 132, 1)',
                                            'rgba(54, 162, 235, 1)',
                                            'rgba(75, 192, 192, 1)',
                                        ],
                                        borderWidth: 1,
                                    },
                                ],
                            }}
                        />
                    </div>
                    <MostExpensiveWindowChart mostExpensiveWindow={mostExpensiveWindow} />
                </>
            </div>
        </div>
    );
}

export default Dashboard;