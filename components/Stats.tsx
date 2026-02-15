
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import { Task, TaskStatus, PartConfigs, PartConfig } from '../types';

interface StatsProps {
  tasks: Task[];
  configs: PartConfigs;
}

const Stats: React.FC<StatsProps> = ({ tasks, configs }) => {
  const completed = tasks.filter(t => t.status === TaskStatus.COMPLETED).length;
  const pending = tasks.length - completed;
  
  const statusData = [
    { name: 'הושלם', value: completed },
    { name: 'ממתין', value: pending },
  ];

  // Fix: Explicitly cast Object.values to PartConfig[] to prevent 'unknown' type errors
  const partData = (Object.values(configs) as PartConfig[]).map(config => ({
    name: config.label,
    כמות: tasks.filter(t => t.partId === config.id).length,
    color: config.color
  }));

  const STATUS_COLORS = ['#10b981', '#f59e0b'];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-center items-center">
        <h4 className="text-gray-400 text-sm font-bold mb-1 uppercase tracking-wider">סה"כ משימות</h4>
        <div className="text-4xl font-black text-gray-800">{tasks.length}</div>
        <div className="text-xs text-indigo-500 font-bold mt-2">פעילות במערכת</div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-48">
        <h4 className="text-gray-400 text-sm font-bold mb-4 uppercase tracking-wider text-center">סטטוס ביצוע</h4>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={statusData}
              cx="50%"
              cy="50%"
              innerRadius={40}
              outerRadius={60}
              paddingAngle={5}
              dataKey="value"
            >
              {statusData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={STATUS_COLORS[index]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 lg:col-span-2 h-48">
        <h4 className="text-gray-400 text-sm font-bold mb-2 uppercase tracking-wider">משימות לפי חלקים</h4>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={partData} layout="vertical">
            <XAxis type="number" hide />
            <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 11 }} />
            <Tooltip />
            <Bar dataKey="כמות" radius={[0, 4, 4, 0]}>
              {partData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Stats;
