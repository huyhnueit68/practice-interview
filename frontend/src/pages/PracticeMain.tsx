// src/pages/PracticeMain.tsx
import React, { useEffect, useMemo } from 'react';
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { HomeOutlined, FileExcelOutlined, UserOutlined } from '@ant-design/icons';

/**
 * Interface for sidebar items
 */
interface SidebarItem {
    name: string;
    url: string;
    icon: JSX.Element;
}

/**
 * Page default init page (sidebar, topbar)
 * CreatedBy: Harry (10.02.2025)
 */
const PracticeMain: React.FC = () => {
    const location = useLocation(); // Get the current location
    const navigate = useNavigate(); // Initialize navigate

    const sideBar: SidebarItem[] = useMemo(() => {
        return [
            {
                name: 'Dashboard',
                url: 'dashboard',
                icon: <HomeOutlined />
            },
            {
                name: 'Sheet',
                url: 'sheet',
                icon: <FileExcelOutlined />
            },
        ];
    }, []);

    // Effect to navigate to the default route if no route is selected
    useEffect(() => {
        if (location.pathname === '/') { // Check if the current path is the root
            navigate(sideBar[0].url); // Navigate to the first sidebar item's URL
        }
    }, [location.pathname, sideBar]);

    return (
        <div className="practice w-full h-full">
            <div className='practice-sidebar flex flex-col items-center w-40 h-full overflow-hidden text-gray-400 bg-gray-900'>
                <div className="flex items-center w-full px-3 mt-3" onClick={() => navigate('#')}>
                    <div></div>
                    <span className="ml-2 text-sm font-bold">Practice Interview</span>
                </div>
                <div className="w-full px-2">
                    <div className="flex flex-col items-center w-full mt-3 border-t border-gray-700">
                        {
                            sideBar.map((item: SidebarItem, index: number) => {
                                return (
                                    <div 
                                        key={index} 
                                        className={`flex cursor-pointer items-center w-full h-12 px-3 mt-2 rounded hover:bg-gray-700 hover:text-gray-300 ${location.pathname.includes(item.url) ? 'active-sidebar' : ''}`} 
                                        onClick={() => navigate(item.url)} // Use navigate to change route
                                    >
                                        {item.icon}
                                        <span className="ml-2 text-sm font-medium">{item.name}</span>
                                    </div>
                                );
                            })
                        }
                    </div>
                    <div className="flex flex-col items-center w-full mt-2 border-t border-gray-700"></div>
                </div>
                <div className="cursor-pointer flex items-center justify-center w-full h-16 mt-auto bg-gray-800 hover:bg-gray-700 hover:text-gray-300" onClick={() => navigate('#')}>
                    <UserOutlined />
                    <span className="ml-2 text-sm font-medium">Account</span>
                </div>
            </div>
            <div className='practice-body'>
                <Outlet />
            </div>
        </div>
    );
}

export default PracticeMain;