import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';

interface TrendData {
    _id: string;
    count: number;
}

interface SubmissionTrendChartProps {
    data: TrendData[];
}

export const SubmissionTrendChart: React.FC<SubmissionTrendChartProps> = ({ data }) => {
    const formattedData = data.map(d => ({
        date: new Date(d._id).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        submissions: d.count
    }));

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full h-64"
        >
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={formattedData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                    <XAxis
                        dataKey="date"
                        stroke="#888"
                        style={{ fontSize: '12px' }}
                    />
                    <YAxis
                        stroke="#888"
                        style={{ fontSize: '12px' }}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: '#1a1a1a',
                            border: '1px solid #333',
                            borderRadius: '8px',
                            color: '#fff'
                        }}
                    />
                    <Line
                        type="monotone"
                        dataKey="submissions"
                        stroke="#14b8a6"
                        strokeWidth={2}
                        dot={{ fill: '#14b8a6', r: 4 }}
                        activeDot={{ r: 6 }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </motion.div>
    );
};
