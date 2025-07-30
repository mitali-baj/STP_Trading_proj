import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const Chart = ({ data }) => (
  <div className="bg-gray-800 p-4 rounded-lg shadow-lg h-64 sm:h-96">
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data}>
        <XAxis dataKey="time" stroke="#6B7280" />
        <YAxis domain={['dataMin - 5', 'dataMax + 5']} stroke="#6B7280" />
        <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: 'none' }} />
        <Line type="monotone" dataKey="value" stroke="#3B82F6" strokeWidth={2} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  </div>
);

export default Chart;
