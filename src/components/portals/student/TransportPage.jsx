import React, { useState, useEffect } from 'react';
import { Bus, MapPin, Clock, Phone, Users, Navigation, AlertCircle } from 'lucide-react';

const TransportPage = ({ darkMode }) => {
    const [busLocation, setBusLocation] = useState({
        currentStop: 'Park Street',
        nextStop: 'Central Plaza',
        eta: 5,
        status: 'Bus is on the way - Approaching Park Street'
    });

    const [routeInfo, setRouteInfo] = useState({
        routeNumber: 'RT-001',
        routeName: 'North Zone Route',
        pickupTime: '07:15 AM',
        pickupLocation: 'Park Street',
        dropTime: '03:15 PM',
        dropLocation: 'Park Street',
        status: 'Active',
        transportEnrolled: true
    });

    const [busDetails, setBusDetails] = useState({
        busNumber: 'BUS-101',
        routeName: 'North Zone Route',
        driverName: 'John Doe',
        driverPhone: '+1234567890',
        capacity: 40,
        currentOccupancy: 35,
        status: 'Active'
    });

    const [routeStops, setRouteStops] = useState([
        {
            id: 1,
            name: 'Main Gate',
            time: '07:00 AM',
            status: 'completed',
            isYourStop: false
        },
        {
            id: 2,
            name: 'Park Street',
            time: '07:15 AM',
            status: 'current',
            isYourStop: true
        },
        {
            id: 3,
            name: 'Central Plaza',
            time: '07:30 AM',
            status: 'upcoming',
            isYourStop: false
        },
        {
            id: 4,
            name: 'School',
            time: '08:00 AM',
            status: 'upcoming',
            isYourStop: false
        }
    ]);

    // Simulate real-time bus tracking
    useEffect(() => {
        const interval = setInterval(() => {
            setBusLocation(prev => ({
                ...prev,
                eta: Math.max(0, prev.eta - 1)
            }));
        }, 60000); // Update every minute

        return () => clearInterval(interval);
    }, []);

    // Simulate bus movement through stops
    useEffect(() => {
        const interval = setInterval(() => {
            setRouteStops(prevStops => {
                const currentIndex = prevStops.findIndex(stop => stop.status === 'current');
                if (currentIndex < prevStops.length - 1) {
                    return prevStops.map((stop, index) => {
                        if (index < currentIndex) return { ...stop, status: 'completed' };
                        if (index === currentIndex) return { ...stop, status: 'completed' };
                        if (index === currentIndex + 1) return { ...stop, status: 'current' };
                        return stop;
                    });
                }
                return prevStops;
            });
        }, 300000); // Update every 5 minutes

        return () => clearInterval(interval);
    }, []);

    const renderRouteInfoCards = () => (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {/* My Route */}
            <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl p-6 shadow-sm border`}>
                <div className="flex items-center justify-between mb-2">
                    <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>My Route</h3>
                    <Bus className="w-5 h-5 text-blue-500" />
                </div>
                <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-1`}>{routeInfo.routeNumber}</p>
                <p className="text-sm text-gray-500">{routeInfo.routeName}</p>
            </div>

            {/* Pickup Time */}
            <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl p-6 shadow-sm border`}>
                <div className="flex items-center justify-between mb-2">
                    <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Pickup Time</h3>
                    <Clock className="w-5 h-5 text-orange-500" />
                </div>
                <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-1`}>{routeInfo.pickupTime}</p>
                <p className="text-sm text-gray-500">{routeInfo.pickupLocation}</p>
            </div>

            {/* Drop Time */}
            <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl p-6 shadow-sm border`}>
                <div className="flex items-center justify-between mb-2">
                    <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Drop Time</h3>
                    <Clock className="w-5 h-5 text-purple-500" />
                </div>
                <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-1`}>{routeInfo.dropTime}</p>
                <p className="text-sm text-gray-500">{routeInfo.dropLocation}</p>
            </div>

            {/* Status */}
            <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl p-6 shadow-sm border`}>
                <div className="flex items-center justify-between mb-2">
                    <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Status</h3>
                    <AlertCircle className="w-5 h-5 text-green-500" />
                </div>
                <p className={`text-2xl font-bold text-green-600 mb-1`}>{routeInfo.status}</p>
                <p className="text-sm text-gray-500">Transport enrolled</p>
            </div>
        </div>
    );

    const renderBusDetails = () => (
        <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl p-6 shadow-sm border mb-6`}>
            <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>My Bus Details</h3>
            <p className="text-sm text-gray-500 mb-6">Information about your assigned bus</p>

            <div className="flex items-center space-x-4 mb-6">
                <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Bus className="w-8 h-8 text-blue-600" />
                </div>
                <div className="flex-1">
                    <h4 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{busDetails.busNumber}</h4>
                    <p className="text-sm text-gray-500">{busDetails.routeName}</p>
                    <span className="inline-block mt-2 px-3 py-1 bg-green-100 text-green-600 text-xs font-semibold rounded-full">
                        {busDetails.status}
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                    <p className="text-sm text-gray-500 mb-1">Driver Information</p>
                    <div className="flex items-center space-x-2 mb-2">
                        <Users className="w-4 h-4 text-gray-400" />
                        <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{busDetails.driverName}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <p className="text-sm text-gray-500">{busDetails.driverPhone}</p>
                    </div>
                </div>

                <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                    <p className="text-sm text-gray-500 mb-1">Capacity</p>
                    <p className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
                        Current Occupancy
                    </p>
                    <p className="text-2xl font-bold text-orange-600">
                        {busDetails.currentOccupancy} / {busDetails.capacity}
                    </p>
                </div>
            </div>
        </div>
    );

    const renderRouteStops = () => (
        <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl p-6 shadow-sm border mb-6`}>
            <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>Route Stops</h3>
            <p className="text-sm text-gray-500 mb-6">All stops on your route</p>

            <div className="space-y-4">
                {routeStops.map((stop, index) => (
                    <div
                        key={stop.id}
                        className={`flex items-center space-x-4 p-4 rounded-lg ${stop.isYourStop
                            ? 'bg-blue-50 border-2 border-blue-500'
                            : darkMode ? 'bg-gray-700' : 'bg-gray-50'
                            }`}
                    >
                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-white border-2 border-gray-300">
                            <span className="font-bold text-gray-700">{index + 1}</span>
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center space-x-2">
                                <h4 className={`font-semibold ${darkMode && !stop.isYourStop ? 'text-white' : 'text-gray-900'}`}>
                                    {stop.name}
                                </h4>
                                {stop.isYourStop && (
                                    <span className="px-2 py-1 bg-blue-600 text-white text-xs font-semibold rounded">
                                        Your Stop
                                    </span>
                                )}
                            </div>
                            <div className="flex items-center space-x-2 mt-1">
                                <Clock className="w-4 h-4 text-gray-400" />
                                <p className="text-sm text-gray-500">{stop.time}</p>
                            </div>
                        </div>
                        <div>
                            <MapPin
                                className={`w-6 h-6 ${stop.status === 'completed'
                                    ? 'text-green-500'
                                    : stop.status === 'current'
                                        ? 'text-blue-500'
                                        : 'text-gray-400'
                                    }`}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    const renderBusTracking = () => (
        <div className={`${darkMode ? 'bg-gradient-to-br from-green-900 to-green-800' : 'bg-gradient-to-br from-green-50 to-green-100'} rounded-xl p-6 shadow-sm border ${darkMode ? 'border-green-700' : 'border-green-200'}`}>
            <div className="flex items-center space-x-3 mb-4">
                <Navigation className="w-6 h-6 text-green-600" />
                <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Bus Tracking</h3>
            </div>
            <p className={`text-sm ${darkMode ? 'text-green-200' : 'text-green-700'} mb-6`}>Real-time location of your bus</p>

            <div className="mb-6">
                <p className={`text-sm ${darkMode ? 'text-green-300' : 'text-green-600'} mb-2`}>Current Status</p>
                <p className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>
                    {busLocation.status}
                </p>
                <p className={`text-sm ${darkMode ? 'text-green-300' : 'text-green-600'}`}>
                    ETA: {busLocation.eta} minutes
                </p>
            </div>

            <button className="w-full py-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors flex items-center justify-center space-x-2">
                <Navigation className="w-5 h-5" />
                <span>Track Bus Live</span>
            </button>
        </div>
    );

    return (
        <div className="flex-1 overflow-y-auto p-8">
            {/* Page Header */}
            <div className="mb-8">
                <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
                    Transport Management
                </h1>
                <p className="text-sm text-gray-500">View your bus route and track your bus in real-time</p>
            </div>

            {/* Route Info Cards */}
            {renderRouteInfoCards()}

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Bus Details and Route Stops */}
                <div className="lg:col-span-2">
                    {renderBusDetails()}
                    {renderRouteStops()}
                </div>

                {/* Right Column - Bus Tracking */}
                <div className="lg:col-span-1">
                    {renderBusTracking()}
                </div>
            </div>
        </div>
    );
};

export default TransportPage;
