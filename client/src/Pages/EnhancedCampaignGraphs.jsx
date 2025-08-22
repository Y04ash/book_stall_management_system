import React from 'react';
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar, 
  PieChart as RechartsPieChart, Pie, Cell, ComposedChart,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { TrendingUp, PieChart, BarChart3, Activity } from 'lucide-react';

const EnhancedCampaignGraphs = ({ analytics }) => {
  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4', '#84CC16', '#F97316'];
  
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatNumber = (num) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const CustomTooltip = ({ active, payload, label, formatter }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900 mb-2">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {`${entry.name}: ${formatter ? formatter(entry.value) : entry.value}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-8">
      {/* Campaign Performance Overview */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Revenue & Sales Comparison */}
        {analytics.campaignData && analytics.campaignData.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center space-x-2 mb-6">
              <BarChart3 className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">Campaign Revenue & Sales</h3>
            </div>
            <ResponsiveContainer width="100%" height={350}>
              <ComposedChart data={analytics.campaignData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="campaignName" 
                  tick={{ fontSize: 12 }}
                  angle={-45}
                  textAnchor="end"
                  height={100}
                />
                <YAxis yAxisId="left" tick={{ fontSize: 12 }} />
                <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} />
                <Tooltip content={<CustomTooltip formatter={formatCurrency} />} />
                <Legend />
                <Bar 
                  yAxisId="left"
                  dataKey="revenue" 
                  fill="#3B82F6" 
                  name="Revenue (₹)"
                  radius={[4, 4, 0, 0]}
                  fillOpacity={0.8}
                />
                <Line 
                  yAxisId="right"
                  type="monotone" 
                  dataKey="booksSold" 
                  stroke="#10B981" 
                  strokeWidth={3}
                  name="Books Sold"
                  dot={{ fill: '#10B981', strokeWidth: 2, r: 6 }}
                  activeDot={{ r: 8, stroke: '#10B981', strokeWidth: 2 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Category Revenue Distribution */}
        {analytics.categoryAnalytics && analytics.categoryAnalytics.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center space-x-2 mb-6">
              <PieChart className="w-5 h-5 text-emerald-600" />
              <h3 className="text-lg font-semibold text-gray-900">Revenue by Category</h3>
            </div>
            <ResponsiveContainer width="100%" height={350}>
              <RechartsPieChart>
                <Pie
                  data={analytics.categoryAnalytics}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ category, percent }) => `${category}: ${(percent * 100).toFixed(1)}%`}
                  outerRadius={120}
                  fill="#8884d8"
                  dataKey="revenue"
                  nameKey="category"
                >
                  {analytics.categoryAnalytics.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={COLORS[index % COLORS.length]}
                      stroke={COLORS[index % COLORS.length]}
                      strokeWidth={2}
                    />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(value)} />
              </RechartsPieChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Monthly Trends and Top Books */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Monthly Sales Trend */}
        {analytics.monthlyTrends && analytics.monthlyTrends.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center space-x-2 mb-6">
              <TrendingUp className="w-5 h-5 text-purple-600" />
              <h3 className="text-lg font-semibold text-gray-900">Monthly Revenue Trend</h3>
            </div>
            <ResponsiveContainer width="100%" height={350}>
              <AreaChart data={analytics.monthlyTrends}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.05}/>
                  </linearGradient>
                  <linearGradient id="colorBooks" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0.05}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip 
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
                          <p className="font-medium text-gray-900 mb-2">{label}</p>
                          <p className="text-sm text-purple-600">
                            Revenue: {formatCurrency(payload[0]?.value || 0)}
                          </p>
                          <p className="text-sm text-emerald-600">
                            Books: {formatNumber(payload[1]?.value || 0)}
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stackId="1"
                  stroke="#8B5CF6" 
                  fill="url(#colorRevenue)"
                  strokeWidth={2}
                  name="Revenue"
                />
                <Area 
                  type="monotone" 
                  dataKey="booksSold" 
                  stackId="2"
                  stroke="#10B981" 
                  fill="url(#colorBooks)"
                  strokeWidth={2}
                  name="Books Sold"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Top Performing Books */}
        {analytics.topBooks && analytics.topBooks.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center space-x-2 mb-6">
              <Activity className="w-5 h-5 text-amber-600" />
              <h3 className="text-lg font-semibold text-gray-900">Top Performing Books</h3>
            </div>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={analytics.topBooks} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis type="number" tick={{ fontSize: 12 }} />
                <YAxis 
                  dataKey="title" 
                  type="category" 
                  tick={{ fontSize: 11 }}
                  width={120}
                />
                <Tooltip 
                  formatter={(value, name) => [
                    formatNumber(value),
                    name === 'totalSold' ? 'Books Sold' : 'Revenue'
                  ]}
                />
                <Bar 
                  dataKey="totalSold" 
                  fill="#F59E0B" 
                  radius={[0, 6, 6, 0]}
                  name="totalSold"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Sub-category Performance */}
      {analytics.subCategoryAnalytics && analytics.subCategoryAnalytics.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center space-x-2 mb-6">
            <BarChart3 className="w-5 h-5 text-cyan-600" />
            <h3 className="text-lg font-semibold text-gray-900">Top Sub-Categories Performance</h3>
          </div>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={analytics.subCategoryAnalytics}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="name" 
                tick={{ fontSize: 11 }}
                angle={-45}
                textAnchor="end"
                height={120}
              />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip 
                formatter={(value, name) => [
                  name === 'revenue' ? formatCurrency(value) : formatNumber(value),
                  name === 'revenue' ? 'Revenue' : 'Books Sold'
                ]}
              />
              <Legend />
              <Bar 
                dataKey="revenue" 
                fill="#06B6D4" 
                name="Revenue"
                radius={[4, 4, 0, 0]}
              />
              <Bar 
                dataKey="booksSold" 
                fill="#84CC16" 
                name="Books Sold"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default EnhancedCampaignGraphs;