

import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Plus,
  Calendar,
  MapPin,
  TrendingUp,
  TrendingDown,
  Users,
  BookOpen,
  DollarSign,
  BarChart3,
  PieChart,
  Activity,
  Target,
  Award,
  ShoppingCart,
  Package,
  Zap,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  ComposedChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import Navbar from "../Components/Navbar";
import RecentCampaign from "../Components/RecentCampaign";
import Footer from "@/Components/Footer";
const Home = () => {
  const [recentCamps, setRecentCamps] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userName,setUserName]=useState("");
  const navigate = useNavigate();

  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const FRONTEND_URL = import.meta.env.VITE_FRONTEND_URL;

  // Modern gradient color schemes
  const CHART_COLORS = [
    "#8B5CF6",
    "#06B6D4",
    "#10B981",
    "#F59E0B",
    "#EF4444",
    "#EC4899",
    "#84CC16",
    "#F97316",
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${BASE_URL}/home`, {
          method: "GET",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        });

        if (response.ok) {
          const result = await response.json();
          if (result.status === "ok") {
            setRecentCamps(result.recentCampaigns);
            setAnalytics(result.data);
            // console.log("Top Products Data:", result.data.topProducts);
// console.log(typeof analytics.topProducts[0].totalSold);

            setUserName(result.name); // Assuming userName is returned in the response


          }
        }
      } catch (error) {
        // console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate, BASE_URL]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-GB");
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatNumber = (num) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/95 backdrop-blur-sm p-4 border border-gray-200 rounded-xl shadow-xl">
          <p className="font-semibold text-gray-900 mb-2">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm flex items-center gap-2">
              <span
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: entry.color }}
              ></span>
              <span className="font-medium">{entry.name}:</span>
              <span className="text-gray-700">
                {entry.name.toLowerCase().includes("revenue")
                  ? formatCurrency(entry.value)
                  : formatNumber(entry.value)}
              </span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-violet-500 border-t-transparent"></div>
          <p className="text-gray-600 font-medium">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        {/* Modern Header */}
        <div className="">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
                  Welcome Back! <span className="text-[#EF4444]">{userName} </span>
                </h1>
                
              </div>
              <button
                onClick={() => navigate("/Add-campaign")}
                className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white px-6 py-3 rounded-xl hover:from-violet-700 hover:to-indigo-700 transition-all duration-300 font-medium flex items-center space-x-2 shadow-lg hover:shadow-xl"
              >
                <Plus className="w-5 h-5" />
                <span>New Campaign</span>
              </button>
            </div>
          </div>
        </div>

        {/* analytics section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {analytics ? (
            <div className="space-y-8">
              {/* Top Metrics Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Total Revenue Card */}
                <div className="bg-gradient-to-br from-violet-500 via-violet-600 to-purple-700 text-white rounded-2xl p-6 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
                  <div className="relative">
                    <div className="flex items-center justify-between mb-4">
                      <DollarSign className="w-8 h-8 text-white/90" />
                      <div className="text-right text-sm text-white/80">
                        <div className="flex items-center gap-1">
                          <ArrowUpRight className="w-4 h-4" />
                          <span>Total</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-white/80 text-sm font-medium">Revenue</p>
                    <p className="text-3xl font-bold truncate">
                      {formatCurrency(analytics.totalRevenue)}
                    </p>
                  </div>
                </div>

                {/* Books Sold Card */}
                <div className="bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-700 text-white rounded-2xl p-6 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
                  <div className="relative">
                    <div className="flex items-center justify-between mb-4">
                      <BookOpen className="w-8 h-8 text-white/90" />
                      <div className="text-right text-sm text-white/80">
                        <div className="flex items-center gap-1">
                          <Package className="w-4 h-4" />
                          <span>Units</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-white/80 text-sm font-medium">
                      Product Sold
                    </p>
                    <p className="text-3xl font-bold">
                      {formatNumber(analytics.totalProductsSold)}
                    </p>
                  </div>
                </div>

                {/* Customers Card */}
                <div className="bg-gradient-to-br from-orange-500 via-amber-600 to-yellow-600 text-white rounded-2xl p-6 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
                  <div className="relative">
                    <div className="flex items-center justify-between mb-4">
                      <Users className="w-8 h-8 text-white/90" />
                      <div className="text-right text-sm text-white/80">
                        <div className="flex items-center gap-1">
                          <Target className="w-4 h-4" />
                          <span>Unique</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-white/80 text-sm font-medium">
                      Customers
                    </p>
                    <p className="text-3xl font-bold">
                      {formatNumber(analytics.totalCustomers)}
                    </p>
                  </div>
                </div>

                {/* Active Campaigns Card */}
                <div className="bg-gradient-to-br from-pink-500 via-rose-600 to-red-600 text-white rounded-2xl p-6 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
                  <div className="relative">
                    <div className="flex items-center justify-between mb-4">
                      <Activity className="w-8 h-8 text-white/90" />
                      <div className="text-right text-sm text-white/80">
                        <div className="flex items-center gap-1">
                          <Zap className="w-4 h-4" />
                          <span>Live</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-white/80 text-sm font-medium">
                      Active Campaigns
                    </p>
                    <p className="text-3xl font-bold">
                      {analytics.ongoingCampaigns}
                    </p>
                  </div>
                </div>
              </div>

              {/* Sales Growth Card */}
              {analytics.salesGrowth && (
                <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-xl">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-4">
                        Campaign Performance Growth
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4">
                          <p className="text-sm text-gray-600 mb-1">
                            Latest Campaign
                          </p>
                          <p className="text-2xl font-bold text-gray-900">
                            {formatCurrency(analytics.salesGrowth.latest)}
                          </p>
                        </div>
                        <div className="bg-gradient-to-br from-slate-50 to-gray-100 rounded-xl p-4">
                          <p className="text-sm text-gray-600 mb-1">
                            Previous Campaign
                          </p>
                          <p className="text-2xl font-bold text-gray-900">
                            {formatCurrency(analytics.salesGrowth.previous)}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-center lg:justify-end">
                      <div
                        className={`flex items-center space-x-3 px-6 py-4 rounded-2xl ${
                          analytics.salesGrowth.isPositive
                            ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white"
                            : "bg-gradient-to-r from-red-500 to-pink-600 text-white"
                        }`}
                      >
                        {analytics.salesGrowth.isPositive ? (
                          <TrendingUp className="w-8 h-8" />
                        ) : (
                          <TrendingDown className="w-8 h-8" />
                        )}
                        <div className="text-center">
                          <div className="text-3xl font-bold">
                            {Math.abs(analytics.salesGrowth.percentage).toFixed(
                              1
                            )}
                            %
                          </div>
                          <div className="text-sm opacity-90">
                            {analytics.salesGrowth.isPositive
                              ? "Growth"
                              : "Decline"}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Main Charts Grid */}
              <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
                {/* Campaign Performance - Large Chart */}
                {analytics.campaignData && analytics.campaignData.length > 0 ? (
                  <div className="xl:col-span-8 bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-xl">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-2 bg-gradient-to-br from-violet-500 to-purple-600 rounded-lg">
                        <BarChart3 className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900">
                        Campaign Performance Overview
                      </h3>
                    </div>
                    <ResponsiveContainer width="100%" height={400}>
                      <ComposedChart data={analytics.campaignData}>
                        <defs>
                          <linearGradient
                            id="revenueGradient"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop
                              offset="0%"
                              stopColor="#8B5CF6"
                              stopOpacity={0.8}
                            />
                            <stop
                              offset="100%"
                              stopColor="#8B5CF6"
                              stopOpacity={0.1}
                            />
                          </linearGradient>
                        </defs>
                        <CartesianGrid
                          strokeDasharray="3 3"
                          stroke="#e2e8f0"
                          strokeOpacity={0.6}
                        />
                        <XAxis
                          dataKey="campaignName"
                          tick={{ fontSize: 12, fill: "#64748b" }}
                          axisLine={false}
                          tickLine={false}
                        />
                        <YAxis
                          yAxisId="left"
                          tick={{ fontSize: 12, fill: "#64748b" }}
                          axisLine={false}
                          tickLine={false}
                        />
                        <YAxis
                          yAxisId="right"
                          orientation="right"
                          tick={{ fontSize: 12, fill: "#64748b" }}
                          axisLine={false}
                          tickLine={false}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        <Bar
                          yAxisId="left"
                          dataKey="revenue"
                          fill="url(#revenueGradient)"
                          name="Revenue (₹)"
                          radius={[8, 8, 0, 0]}
                        />
                        <Line
                          yAxisId="right"
                          type="monotone"
                          dataKey="productsSold"
                          stroke="#10B981"
                          strokeWidth={3}
                          name="Product Sold"
                          dot={{ fill: "#10B981", strokeWidth: 3, r: 6 }}
                          activeDot={{
                            r: 8,
                            stroke: "#10B981",
                            strokeWidth: 2,
                            fill: "#ffffff",
                          }}
                        />
                      </ComposedChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="xl:col-span-8 bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-xl">
                    <div className="flex flex-col items-center justify-center h-96 text-center">
                      <div className="p-4 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full mb-4">
                        <BarChart3 className="w-12 h-12 text-gray-400" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        No Campaign Data
                      </h3>
                      <p className="text-gray-600 mb-6">
                        Create your first campaign to see performance analytics
                      </p>
                      <button
                        onClick={() => navigate("/Add-campaign")}
                        className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white px-6 py-3 rounded-xl hover:from-violet-700 hover:to-indigo-700 transition-all duration-300"
                      >
                        Create Campaign
                      </button>
                    </div>
                  </div>
                )}

                {/* Category Donut Chart */}
                {analytics.categoryAnalytics &&
                analytics.categoryAnalytics.length > 0 ? (
                  <div className="xl:col-span-4 bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-xl">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg">
                        <PieChart className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-lg font-bold text-gray-900">
                        Category Revenue
                      </h3>
                    </div>
                    <ResponsiveContainer width="100%" height={300}>
                      <RechartsPieChart>
                        <Pie
                          data={analytics.categoryAnalytics}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={120}
                          paddingAngle={2}
                          dataKey="revenue"
                          nameKey="category"
                        >
                          {analytics.categoryAnalytics.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={CHART_COLORS[index % CHART_COLORS.length]}
                            />
                          ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                        <Legend
                          verticalAlign="bottom"
                          height={36}
                          iconType="circle"
                          wrapperStyle={{ fontSize: "14px" }}
                        />
                      </RechartsPieChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="xl:col-span-4 bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-xl">
                    <div className="flex flex-col items-center justify-center h-80 text-center">
                      <div className="p-4 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full mb-4">
                        <PieChart className="w-10 h-10 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        No Category Data
                      </h3>
                      <p className="text-gray-600 text-sm">
                        Sales data will appear here
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Secondary Charts Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Top Products */}
                {analytics.topProducts && analytics.topProducts.length > 0 ? (
  <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-xl">
    <div className="flex items-center gap-3 mb-6">
      <div className="p-2 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg">
        <Award className="w-6 h-6 text-white" />
      </div>
      <h3 className="text-lg font-bold text-gray-900">Top Products</h3>
    </div>

    <ResponsiveContainer width="100%" height={400}>
      <BarChart
        data={analytics.topProducts}
        margin={{ top: 16, right: 24, left: 8, bottom: 8 }}
      >
        <defs>
          {/* Gradient for Products Sold */}
          <linearGradient id="colorSold" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.9} />
            <stop offset="95%" stopColor="#82ca9d" stopOpacity={0.2} />
          </linearGradient>

          {/* Gradient for Revenue */}
          <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#8884d8" stopOpacity={0.9} />
            <stop offset="95%" stopColor="#8884d8" stopOpacity={0.2} />
          </linearGradient>
        </defs>

        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="title" />

        {/* Y-Axis for Sales */}
        <YAxis yAxisId="left" orientation="left" label={{ value: "Products Sold", angle: -90, position: "insideLeft" }} />

        {/* Y-Axis for Revenue */}
        <YAxis yAxisId="right" orientation="right" label={{ value: "Revenue", angle: -90, position: "insideRight" }} />

        <Tooltip />
        <Legend />

        {/* Bars with gradients */}
        <Bar dataKey="totalSold" name="Products Sold" yAxisId="left" fill="url(#colorSold)" radius={[8, 8, 0, 0]} />
        <Bar dataKey="revenue" name="Revenue" yAxisId="right" fill="url(#colorRevenue)" radius={[8, 8, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  </div>
)

: (
                  <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-xl">
                    <div className="flex flex-col items-center justify-center h-80 text-center">
                      <div className="p-4 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full mb-4">
                        <Award className="w-10 h-10 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        No Product Sales
                      </h3>
                      <p className="text-gray-600 text-sm">
                        Top performing products will appear here
                      </p>
                    </div>
                  </div>
                )}

                {/* Monthly Trends */}
                {analytics.monthlyTrends &&
                analytics.monthlyTrends.length > 0 ? (
                  <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-xl">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg">
                        <TrendingUp className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-lg font-bold text-gray-900">
                        Monthly Trends
                      </h3>
                    </div>
                    <ResponsiveContainer width="100%" height={400}>
                      <AreaChart data={analytics.monthlyTrends}>
                        <defs>
                          <linearGradient
                            id="monthlyGradient"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop
                              offset="0%"
                              stopColor="#3B82F6"
                              stopOpacity={0.6}
                            />
                            <stop
                              offset="100%"
                              stopColor="#3B82F6"
                              stopOpacity={0.1}
                            />
                          </linearGradient>
                        </defs>
                        <CartesianGrid
                          strokeDasharray="3 3"
                          stroke="#e2e8f0"
                          strokeOpacity={0.6}
                        />
                        <XAxis
                          dataKey="month"
                          tick={{ fontSize: 12, fill: "#64748b" }}
                          axisLine={false}
                          tickLine={false}
                        />
                        <YAxis
                          tick={{ fontSize: 12, fill: "#64748b" }}
                          axisLine={false}
                          tickLine={false}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Area
                          type="monotone"
                          dataKey="revenue"
                          stroke="#3B82F6"
                          fill="url(#monthlyGradient)"
                          strokeWidth={3}
                          name="Monthly Revenue"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-xl">
                    <div className="flex flex-col items-center justify-center h-80 text-center">
                      <div className="p-4 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full mb-4">
                        <TrendingUp className="w-10 h-10 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        No Monthly Data
                      </h3>
                      <p className="text-gray-600 text-sm">
                        Monthly trends will appear here
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Additional Insights */}

              {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-cyan-500 via-blue-600 to-indigo-700 text-white rounded-2xl p-6 relative overflow-hidden">
                  <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full"></div>
                  <div className="relative">
                    <div className="flex items-center justify-between mb-4">
                      <Target className="w-8 h-8 text-white/90" />
                      <span className="text-sm text-white/80 bg-white/20 px-2 py-1 rounded-full">
                        Avg
                      </span>
                    </div>
                    <p className="text-white/80 text-sm font-medium">
                      Revenue per Campaign
                    </p>
                    <p className="text-2xl font-bold">
                      {formatCurrency(analytics.averageRevenuePerCampaign)}
                    </p>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-green-500 via-emerald-600 to-teal-700 text-white rounded-2xl p-6 relative overflow-hidden">
                  <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full"></div>
                  <div className="relative">
                    <div className="flex items-center justify-between mb-4">
                      <BookOpen className="w-8 h-8 text-white/90" />
                      <span className="text-sm text-white/80 bg-white/20 px-2 py-1 rounded-full">
                        Avg
                      </span>
                    </div>
                    <p className="text-white/80 text-sm font-medium">
                      Books per Campaign
                    </p>
                    <p className="text-2xl font-bold">
                      {formatNumber(analytics.averageBooksPerCampaign)}
                    </p>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-purple-500 via-violet-600 to-indigo-700 text-white rounded-2xl p-6 relative overflow-hidden">
                  <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full"></div>
                  <div className="relative">
                    <div className="flex items-center justify-between mb-4">
                      <BarChart3 className="w-8 h-8 text-white/90" />
                      <span className="text-sm text-white/80 bg-white/20 px-2 py-1 rounded-full">
                        Total
                      </span>
                    </div>
                    <p className="text-white/80 text-sm font-medium">
                      Total Campaigns
                    </p>
                    <p className="text-2xl font-bold">
                      {analytics.totalCampaigns}
                    </p>
                  </div>
                </div>
              </div> */}

              {/* stack + recent camp */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full">
                {/* Left side stacked boxes (1/3 width on lg+, full width on mobile) */}
                <div className="flex flex-col gap-6">
                  {/* Revenue per Campaign */}
                  <div className="bg-gradient-to-br from-cyan-500 via-blue-600 to-indigo-700 text-white rounded-2xl p-6 relative overflow-hidden flex-1">
                    <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full"></div>
                    <div className="relative h-full flex flex-col justify-between">
                      <div className="flex items-center justify-between mb-4">
                        <Target className="w-8 h-8 text-white/90" />
                        <span className="text-sm text-white/80 bg-white/20 px-2 py-1 rounded-full">Avg</span>
                      </div>
                      <p className="text-white/80 text-sm font-medium">Revenue per Campaign</p>
                      <p className="text-2xl font-bold">{formatCurrency(analytics.averageRevenuePerCampaign)}</p>
                    </div>
                  </div>

                  {/* Books per Campaign */}
                  <div className="bg-gradient-to-br from-green-500 via-emerald-600 to-teal-700 text-white rounded-2xl p-6 relative overflow-hidden flex-1">
                    <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full"></div>
                    <div className="relative h-full flex flex-col justify-between">
                      <div className="flex items-center justify-between mb-4">
                        <BookOpen className="w-8 h-8 text-white/90" />
                        <span className="text-sm text-white/80 bg-white/20 px-2 py-1 rounded-full">Avg</span>
                      </div>
                      <p className="text-white/80 text-sm font-medium">Products per Campaign</p>
                      <p className="text-2xl font-bold">{formatNumber(analytics.averageProductsPerCampaign)}</p>
                    </div>
                  </div>

                  {/* Total Campaigns */}
                  <div className="bg-gradient-to-br from-purple-500 via-violet-600 to-indigo-700 text-white rounded-2xl p-6 relative overflow-hidden flex-1">
                    <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full"></div>
                    <div className="relative h-full flex flex-col justify-between">
                      <div className="flex items-center justify-between mb-4">
                        <BarChart3 className="w-8 h-8 text-white/90" />
                        <span className="text-sm text-white/80 bg-white/20 px-2 py-1 rounded-full">Total</span>
                      </div>
                      <p className="text-white/80 text-sm font-medium">Total Campaigns</p>
                      <p className="text-2xl font-bold">{analytics.totalCampaigns}</p>
                    </div>
                  </div>
                </div>

                {/* Right side (recent campaign) → span 2 columns only on lg+ */}
                <div className="lg:col-span-2 rounded-2xl bg-white shadow-md p-5 flex flex-col justify-between">
                  {recentCamps.length > 0 ? (
                    <>
                      <h1 className="text-3xl font-semibold text-gray-800 mb-4">Recent Campaign</h1>
                      <Link
                        key={recentCamps[0].campaignId}
                        to={`${FRONTEND_URL}/campaign/${recentCamps[0].campaignId}`}
                        className="block rounded-2xl transition-all duration-200"
                      >
                        <RecentCampaign campaign={recentCamps[0]} />
                      </Link>
                    </> 
                  ):(
                    
                  <div className="xl:col-span-8 bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-xl">
                    <div className="flex flex-col items-center justify-center h-96 text-center">
                      <div className="p-4 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full mb-4">
                        <BarChart3 className="w-12 h-12 text-gray-400" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        No Campaign Data
                      </h3>
                      <p className="text-gray-600 mb-6">
                        Create your first campaign to see performance analytics
                      </p>
                      <button
                        onClick={() => navigate("/Add-campaign")}
                        className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white px-6 py-3 rounded-xl hover:from-violet-700 hover:to-indigo-700 transition-all duration-300"
                      >
                        Create Campaign
                      </button>
                    </div>
                  </div>
                
                  )
                  }
                </div>
              </div>


            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm p-12 text-center">
             <BarChart3 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
             <h2 className="text-2xl font-semibold text-gray-900 mb-4">
               Welcome to BookStockPro
             </h2>
             <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
               Start your journey by creating your first campaign. Track sales, manage inventory,
               and analyze performance with our comprehensive analytics dashboard.
             </p>
             <button
              onClick={() => navigate("/Add-campaign")}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium flex items-center space-x-2 mx-auto"
            >
              <Plus className="w-5 h-5" />
              <span>Create First Campaign</span>
            </button>
          </div>
          )}

        </div>


      
      </div>
      <Footer/>
    </>
  );
};
export default Home;
