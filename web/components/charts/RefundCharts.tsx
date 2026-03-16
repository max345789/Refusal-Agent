'use client';

import { motion } from 'framer-motion';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import type { Analytics } from '@/lib/api';

const PIE_COLORS = ['#2f6bff', '#20e37b', '#ffb800', '#121212'];

type Props = {
  analytics: Analytics;
};

export function RefundCharts({ analytics }: Props) {
  const pieData = [
    { name: 'Approved', value: analytics.approved, color: PIE_COLORS[1] },
    { name: 'Denied', value: analytics.denied, color: PIE_COLORS[2] },
    { name: 'Pending', value: analytics.pending, color: PIE_COLORS[3] },
  ].filter((d) => d.value > 0);

  const barData = [
    { label: 'Total', count: analytics.totalTickets },
    { label: 'Last 24h', count: analytics.last24Hours },
    { label: 'Approved', count: analytics.approved },
    { label: 'Denied', count: analytics.denied },
  ];

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="nb-surface bg-white p-6"
      >
        <h3 className="font-heading text-sm font-black uppercase tracking-wider text-text-primary mb-4">
          Requests overview
        </h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <XAxis dataKey="label" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  borderRadius: '0px',
                  border: '3px solid rgba(18,18,18,1)',
                  boxShadow: '10px 10px 0 0 rgba(18,18,18,1)',
                }}
              />
              <Bar dataKey="count" fill="#2f6bff" radius={[0, 0, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="nb-surface bg-white p-6"
      >
        <h3 className="font-heading text-sm font-black uppercase tracking-wider text-text-primary mb-4">
          Decision breakdown
        </h3>
        <div className="h-64">
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                  nameKey="name"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {pieData.map((entry, i) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    borderRadius: '0px',
                    border: '3px solid rgba(18,18,18,1)',
                    boxShadow: '10px 10px 0 0 rgba(18,18,18,1)',
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full text-text-secondary text-sm">
              No data yet
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
