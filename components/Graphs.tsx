import React from 'react';
import { ResponsiveContainer, BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from 'recharts';

export interface MonthlyCategoryDataItem {
  name: string;
  value: number;
}

interface GraphsProps {
  monthlyCategoryData: MonthlyCategoryDataItem[];
  selectedDate: Date;
}

const Graphs: React.FC<GraphsProps> = ({ monthlyCategoryData, selectedDate }) => {
  return (
    <div className="py-4">
      <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">
        Monthly Expenses by Category ({selectedDate.toLocaleString('default', { month: 'short' }).toUpperCase()} {selectedDate.getFullYear()})
      </h2>
      {monthlyCategoryData.length > 0 ? (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={monthlyCategoryData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" angle={-15} textAnchor="end" height={50} interval={0} />
            <YAxis />
            <Tooltip formatter={(value: number) => `₹${value.toLocaleString('en-IN')}`} />
            <Legend />
            <Bar dataKey="value" fill="#8884d8" name="Amount" />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <p className="text-gray-500 text-center py-10">No expense data for this month.</p>
      )}
    </div>
  );
};

export default Graphs;
