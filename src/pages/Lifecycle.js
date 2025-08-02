import React from 'react';
import Header from '../components/Header';
import { useEffect, useState } from 'react';
const LifeCycle = () => {
// Example API response
const [apiData, setApiData] = useState([]);

useEffect(() => {
    fetch('http://localhost:8080/trades?clientId=client_Mitali')
        .then(res => res.json())
        .then(data => setApiData(data))
        .catch(err => console.error(err));
}, []);

// Group by tradeId
const grouped = apiData.reduce((acc, item) => {
    acc[item.tradeId] = acc[item.tradeId] || [];
    acc[item.tradeId].push(item);
    return acc;
}, {});
apiData.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
Object.keys(grouped).forEach(tradeId => {
    grouped[tradeId].sort((a, b) => a.createdAt.localeCompare(b.createdAt));
});
return (
    <div className="bg-gray-900 text-white min-h-screen font-sans flex flex-col">
        <main className="flex-grow p-6 overflow-hidden flex">
            <div className="flex-grow mr-4 overflow-x-auto">
                <h2 className="text-2xl font-semibold mb-6 text-blue-400">Market Summary</h2>
                {Object.entries(grouped).map(([tradeId, logs]) => {
                    // Get all unique keys from logs for dynamic columns
                    const allKeys = Array.from(
                        logs.reduce((set, log) => {
                            Object.keys(log).forEach(k => set.add(k));
                            return set;
                        }, new Set())
                    );
                    return (
                        <div key={tradeId} className="mb-8">
                            <h3 className="text-lg font-bold mb-2 text-green-400">Trade ID: {tradeId}</h3>
                            <div className="overflow-x-auto">
                                <table className="min-w-full bg-gray-800 rounded-lg overflow-hidden mb-4">
                                    <thead>
                                        <tr>
                                            {allKeys.map(key => (
                                                <th key={key} className="px-3 py-2 border-b border-gray-700">
                                                    {key}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {logs.map(log => (
                                            <tr key={log.logId || Math.random()} className="border-b border-gray-700">
                                                {allKeys.map(key => (
                                                    <td key={key} className="px-3 py-2">
                                                        {key === "createdAt"
                                                            ? new Date(log[key]).toLocaleString()
                                                            : log[key] !== undefined && log[key] !== null
                                                            ? log[key].toString()
                                                            : "-"}
                                                    </td>
                                                ))}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    );
                })}
            </div>
        </main>
    </div>
);
};

export default LifeCycle;
