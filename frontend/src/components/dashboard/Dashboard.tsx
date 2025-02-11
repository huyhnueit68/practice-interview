import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../stores/commonStore';
import MostExpensiveWindowChart from './charts/MostExpensiveWindowChart';
import StatisticsChart from './charts/StatisticsChart'; // Import the new StatisticsChart component
import MarketPriceChart from './charts/MarketPriceChart'; // Import the new MarketPriceChart component

const Dashboard = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const dataArray = useSelector((state: RootState) => state.dataArray); // Get the current data array from the store

    const [chartData, setChartData] = useState<any>({
        labels: [],
        datasets: [
            {
                label: 'Market Price',
                data: [],
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderWidth: 1,
                fill: true, // Fill the area under the line
            },
        ],
    });

    /**
     * Calculates the minimum, maximum, and average market prices from the data array.
     * @returns An object containing minValue, maxValue, and averageValue.
     * CreatedBy: Harry (10.02.2025)
     */
    const calculateStatistics = () => {
        if (dataArray.length === 0) return { minValue: 0, maxValue: 0, averageValue: 0 };

        const prices = dataArray.map(item => item.marketPrice);
        const minValue: number = Math.min(...prices);
        const maxValue: number = Math.max(...prices);
        const averageValue: number = parseFloat((prices.reduce((acc, val) => acc + val, 0) / prices.length).toFixed(2));

        return { minValue, maxValue, averageValue };
    };

    const { minValue, maxValue, averageValue } = calculateStatistics();

    /**
     * Calculates the most expensive window based on the combined market prices of consecutive entries.
     * @returns An object representing the most expensive window with start and end details.
     * CreatedBy: Harry (10.02.2025)
     */
    const calculateMostExpensiveWindow = () => {
        let mostExpensiveWindow = {
            start: {
                dateTime: '',
                value: 0
            },
            end: {
                dateTime: '',
                value: 0
            },
            maxPrice: 0
        };

        for (let i = 0; i < dataArray.length - 1; i++) {
            const combinedPrice = dataArray[i].marketPrice + dataArray[i + 1].marketPrice;
            if (combinedPrice > mostExpensiveWindow.maxPrice) {
                mostExpensiveWindow = {
                    start: {
                        dateTime: dataArray[i].dateTime,
                        value: dataArray[i].marketPrice
                    },
                    end: {
                        dateTime: dataArray[i + 1].dateTime,
                        value: dataArray[i + 1].marketPrice
                    },
                    maxPrice: combinedPrice,
                };
            }
        }

        return mostExpensiveWindow;
    };

    const mostExpensiveWindow = calculateMostExpensiveWindow();

    useEffect(() => {
        if (dataArray.length > 0) {
            // Sort dataArray by dateTime in ascending order
            const sortedDataArray = dataArray.sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime());
    
            // Prepare labels and prices for the chart
            const labels = sortedDataArray.map(item => new Date(item.dateTime).toLocaleString()); // Convert to Date objects and format
            const prices = sortedDataArray.map(item => item.marketPrice);
    
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
            <div className='practice-dashboard__body'>
                {/* <div className='flex item-center justify-center mb-8'>
                    
                </div> */}
                <StatisticsChart minValue={minValue} maxValue={maxValue} averageValue={averageValue} />
                <MostExpensiveWindowChart mostExpensiveWindow={mostExpensiveWindow} />
                {/* <MarketPriceChart chartData={chartData} /> */}
            </div>
        </div>
    );
}

export default Dashboard;