import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import {
  PieChart as RePieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import {
  Book,
  Layers,
  Tags,
  IndianRupee,
  Users,
  Download,
  TrendingUp,
  BarChart3,
  LineChart as LineIcon,
  Activity,
} from "lucide-react";

/** ---------- Helpers ---------- */
const BASE_URL = import.meta.env.VITE_BASE_URL;

const CHART_COLORS = [
  "#8B5CF6", "#06B6D4", "#10B981", "#F59E0B", "#EF4444",
  "#EC4899", "#84CC16", "#F97316", "#3B82F6", "#A855F7",
];

const formatCurrency = (v = 0) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", minimumFractionDigits: 0 }).format(Number(v) || 0);

const formatNumber = (n = 0) => {
  const num = Number(n) || 0;
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`;
  return `${num}`;
};

const truncate = (s = "", n = 20) => (s.length > n ? s.slice(0, n - 1) + "…" : s);

/** ---------- Small UI Bits ---------- */
function StatCard({ title, value, icon, gradient = "from-violet-500 via-violet-600 to-indigo-700", sub }) {
  const Icon = icon || Activity;
  return (
    <div className={`rounded-2xl p-5 text-white bg-gradient-to-br ${gradient} relative overflow-hidden`}>
      <div className="absolute -top-6 -right-6 w-28 h-28 bg-white/10 rounded-full" />
      <div className="relative">
        <div className="flex items-center justify-between mb-2">
          <span className="text-white/80 text-sm font-medium">{title}</span>
          <Icon className="w-6 h-6 text-white/90" />
        </div>
        <div className="text-3xl font-extrabold leading-tight">{value}</div>
        {sub ? <div className="mt-1 text-white/80 text-xs">{sub}</div> : null}
      </div>
    </div>
  );
}

function EmptyCard({ icon: Icon = Activity, title = "No Data", subtitle = "Data will appear here soon." }) {
  return (
    <div className="h-72 rounded-2xl border border-gray-200 bg-white/70 backdrop-blur-sm flex flex-col items-center justify-center text-center p-6">
      <div className="p-4 rounded-full bg-gray-100 mb-3">
        <Icon className="w-10 h-10 text-gray-400" />
      </div>
      <div className="text-lg font-semibold text-gray-900">{title}</div>
      <div className="text-sm text-gray-600">{subtitle}</div>
    </div>
  );
}

/** ---------- CSV Download ---------- */
function downloadCSV(filename, rows) {
  if (!rows?.length) return;
  const escape = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  const headers = Object.keys(rows[0]);
  const csv = [headers.map(escape).join(","), ...rows.map((r) => headers.map((h) => escape(r[h])).join(","))].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/** ---------- Page Component ---------- */
export default function Analytics({campaignId}) {
//   const { id } = useParams(); // expects a route like /campaign/:id/analytics
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [data, setData] = useState(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        setErr("");
        // Adjust this path if your backend differs
        const res = await fetch(`${BASE_URL}/campaign/${campaignId}/analytics`, { credentials: "include" });
        // console.log("res ",res);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        if (json.status !== "ok") throw new Error(json.message || "Failed to load analytics");
        if (mounted) setData(json);
        // console.log(json);
      } catch (e) {
        console.error(e);
        if (mounted) setErr(e.message || "Failed to load");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => (mounted = false);
  }, [campaignId]);

  // Derive safe arrays

  const topProducts = data?.topProducts || []; // [{title, totalSold, revenue}]
  const categories = data?.categoryWise || []; // [{category, productsSold, revenue}]
  const totals = data?.totals || {}; // {totalProducts, uniqueTitles, categories, subcategories, totalRevenue, totalCustomers}

  const donutDataRevenue = useMemo(() => {
  if (!categories.length) return [];
  return categories.map(c => ({
    name: c.category || "Unknown",
    value: c.revenue || 0
  }));
}, [categories]);

// Donut: Category-wise books sold
const donutData = useMemo(() => {
  if (!categories.length) return [];
  return categories.map(c => ({
    name: c.category || "Unknown",
    value: c.productsSold || 0
  }));
}, [categories]);


  const onDownload = () => {
    // Merge a flat CSV with the key datasets (you can refine fields as needed)
    const rows = [];
    // Overview one-line
    rows.push({
      section: "Overview",
      totalProducts: totals.totalProducts ?? 0,
      uniqueTitles: totals.uniqueTitles ?? 0,
      categories: totals.categories ?? 0,
      subcategories: totals.subcategories ?? 0,
      totalRevenue: totals.totalRevenue ?? 0,
      totalCustomers: totals.totalCustomers ?? 0,
    });
    // Sales trend

    // Top books
    topBooks.forEach((b) =>
      rows.push({
        section: "TopProducts",
        name: b.name,
        totalSold: b.totalSold,
        revenue: b.revenue,
        category: b.category,
        subCategory: b.subCategory,
      })
    );
    // Categories
    categories.forEach((c) =>
      rows.push({
        section: "Categories",
        category: c.category,
        productsSold: c.productsSold,
        revenue: c.revenue,
      })
    );

    downloadCSV(`campaign_${campaignId}_analytics.csv`, rows);
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] grid place-items-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-12 w-12 rounded-full border-4 border-violet-500 border-t-transparent animate-spin" />
          <div className="text-gray-600">Loading analytics…</div>
        </div>
      </div>
    );
  }

  if (err) {
    return (
      <div className="min-h-[60vh] grid place-items-center">
        <div className="rounded-xl bg-red-50 text-red-700 px-4 py-3 border border-red-200">
          Failed to load: {err}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-white/20 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
                Campaign Analytics
              </h1>
              <p className="text-gray-600 mt-1">Campaign ID: {campaignId}</p>
            </div>
            <button
              onClick={onDownload}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white px-5 py-3 rounded-xl hover:from-violet-700 hover:to-indigo-700 transition-all duration-300 shadow-lg"
            >
              <Download className="w-5 h-5" />
              Download Report
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatCard
            title="Total Products Sold"
            value={formatNumber(totals.totalProducts)}
            icon={Book}
            gradient="from-emerald-500 via-emerald-600 to-teal-700"
            sub="Units sold during this campaign"
          />
          <StatCard
            title="Unique Titles"
            value={formatNumber(totals.uniqueTitles)}
            icon={Layers}
            gradient="from-cyan-500 via-blue-600 to-indigo-700"
          />
          <StatCard
            title="Categories"
            value={formatNumber(totals.categories)}
            icon={Tags}
            gradient="from-orange-500 via-amber-600 to-yellow-600"
          />
          <StatCard
            title="Subcategories"
            value={formatNumber(totals.subcategories)}
            icon={Tags}
            gradient="from-pink-500 via-rose-600 to-red-600"
          />
          <StatCard
            title="Revenue"
            value={formatCurrency(totals.totalRevenue)}
            icon={IndianRupee}
            gradient="from-violet-500 via-violet-600 to-indigo-700"
          />
          <StatCard
            title="Total Customers Visited"
            value={formatNumber(totals.totalCustomers)}
            icon={Users}
            gradient="from-green-500 via-lime-600 to-emerald-700"
          />
        </div>

        {/* Charts grid */}
<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
  {/* Donut: Books Sold by Category */}
  <div className="rounded-2xl p-6 bg-white/60 backdrop-blur-sm border border-white/20 shadow-xl">
    <div className="flex items-center gap-3 mb-4">
      <div className="p-2 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600">
        <BarChart3 className="w-6 h-6 text-white" />
      </div>
      <h3 className="text-lg font-bold text-gray-900">Books Sold by Category</h3>
    </div>
    {donutData.length ? (
      <ResponsiveContainer width="100%" height={320}>
        <RePieChart>
          <Pie
            data={donutData}
            dataKey="value"
            nameKey="name"
            innerRadius={70}
            outerRadius={120}
            paddingAngle={2}
          >
            {donutData.map((entry, i) => (
              <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{ borderRadius: 12 }}
            formatter={(v, n) => [formatNumber(v), n]}
          />
          <Legend verticalAlign="bottom" height={36} iconType="circle" />
        </RePieChart>
      </ResponsiveContainer>
    ) : (
      <EmptyCard title="No Category Data Yet" subtitle="Sell books to view category share." />
    )}
  </div>

  {/* Donut: Revenue by Category */}
  <div className="rounded-2xl p-6 bg-white/60 backdrop-blur-sm border border-white/20 shadow-xl">
    <div className="flex items-center gap-3 mb-4">
      <div className="p-2 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600">
        <IndianRupee className="w-6 h-6 text-white" />
      </div>
      <h3 className="text-lg font-bold text-gray-900">Revenue by Category</h3>
    </div>
    {donutDataRevenue.length ? (
      <ResponsiveContainer width="100%" height={320}>
        <RePieChart>
          <Pie
            data={donutDataRevenue}
            dataKey="value"
            nameKey="name"
            innerRadius={70}
            outerRadius={120}
            paddingAngle={2}
          >
            {donutDataRevenue.map((entry, i) => (
              <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{ borderRadius: 12 }}
            formatter={(v, n) => [formatCurrency(v), n]}
          />
          <Legend verticalAlign="bottom" height={36} iconType="circle" />
        </RePieChart>
      </ResponsiveContainer>
    ) : (
      <EmptyCard title="No Revenue Data Yet" subtitle="Revenue per category will show here." />
    )}
  </div>
</div>

        {/* Top Books Table / Cards */}
        <div className="rounded-2xl p-6 bg-white/60 backdrop-blur-sm border border-white/20 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600">
                <Book className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Top Products in this Campaign</h3>
            </div>
          </div>

          {topProducts.length ? (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-600 border-b">
                    <th className="py-3 pr-4">Title</th>
                    <th className="py-3 pr-4">Category</th>
                    <th className="py-3 pr-4">Subcategory</th>
                    <th className="py-3 pr-4">Units Sold</th>
                    <th className="py-3 pr-4">Revenue</th>
                  </tr>
                </thead>
                <tbody>
                  {topProducts.map((b, idx) => (
                    <tr key={idx} className="border-b last:border-0">
                      <td className="py-3 pr-4 font-medium text-gray-900">
  {truncate((b.name || b._doc?.name || "Untitled"), 40)}
</td>
<td className="py-3 pr-4">{b.category || b._doc?.category || "-"}</td>
<td className="py-3 pr-4">{b.subCategory || b._doc?.subCategory || "-"}</td>

                      <td className="py-3 pr-4">{formatNumber(b.totalSold || 0)}</td>
                      <td className="py-3 pr-4">{formatCurrency(b.revenue || 0)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <EmptyCard title="No Top Books Yet" subtitle="Once you sell books, the top performers show up here." />
          )}

          <div className="mt-6">
            <button
              onClick={onDownload}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:from-violet-700 hover:to-indigo-700 transition-all shadow"
            >
              <Download className="w-5 h-5" />
              Download Complete Sales Report (CSV)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
