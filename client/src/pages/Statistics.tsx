import { trpc } from "@/lib/trpc";
import { BarChart, Bar, PieChart, Pie, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from "recharts";
import { TrendingUp, MapPin, Calendar, BarChart3 } from "lucide-react";
import { CATEGORIES } from "@shared/categories";

export default function Statistics() {
  const { data: stats, isLoading } = trpc.statistics.getStats.useQuery();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-cyan-400 text-xl animate-pulse">Loading statistics...</div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-red-400">Failed to load statistics</div>
      </div>
    );
  }

  // Get colors from CATEGORIES
  const categoryColors = stats.byCategory.map(cat => {
    const category = CATEGORIES.find(c => c.label.toLowerCase() === cat.name.toLowerCase());
    return category?.color || "#3b82f6";
  });

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-cyan-400 mb-2 tracking-wider uppercase">
          Event Statistics Dashboard
        </h1>
        <p className="text-slate-400">Comprehensive analytics and insights</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-slate-900/50 border border-cyan-500/30 rounded-lg p-6 backdrop-blur-md">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-cyan-500/20 rounded-lg">
              <BarChart3 className="h-8 w-8 text-cyan-400" />
            </div>
            <div>
              <p className="text-slate-400 text-sm uppercase tracking-wider">Total Events</p>
              <p className="text-3xl font-bold text-white">{stats.total}</p>
            </div>
          </div>
        </div>

        <div className="bg-slate-900/50 border border-blue-500/30 rounded-lg p-6 backdrop-blur-md">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-500/20 rounded-lg">
              <TrendingUp className="h-8 w-8 text-blue-400" />
            </div>
            <div>
              <p className="text-slate-400 text-sm uppercase tracking-wider">Categories</p>
              <p className="text-3xl font-bold text-white">{stats.byCategory.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-slate-900/50 border border-purple-500/30 rounded-lg p-6 backdrop-blur-md">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-500/20 rounded-lg">
              <MapPin className="h-8 w-8 text-purple-400" />
            </div>
            <div>
              <p className="text-slate-400 text-sm uppercase tracking-wider">Boroughs</p>
              <p className="text-3xl font-bold text-white">{stats.byBorough.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-slate-900/50 border border-green-500/30 rounded-lg p-6 backdrop-blur-md">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-500/20 rounded-lg">
              <Calendar className="h-8 w-8 text-green-400" />
            </div>
            <div>
              <p className="text-slate-400 text-sm uppercase tracking-wider">Time Span</p>
              <p className="text-3xl font-bold text-white">{stats.byMonth.length}mo</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Events by Category - Pie Chart */}
        <div className="bg-slate-900/50 border border-cyan-500/30 rounded-lg p-6 backdrop-blur-md">
          <h2 className="text-xl font-bold text-cyan-400 mb-4 uppercase tracking-wider">
            Events by Category
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={stats.byCategory}
                dataKey="count"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label={(entry) => `${entry.name}: ${entry.count}`}
              >
                {stats.byCategory.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={categoryColors[index]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#0f172a', 
                  border: '1px solid #06b6d4',
                  borderRadius: '8px'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Top Boroughs - Bar Chart */}
        <div className="bg-slate-900/50 border border-cyan-500/30 rounded-lg p-6 backdrop-blur-md">
          <h2 className="text-xl font-bold text-cyan-400 mb-4 uppercase tracking-wider">
            Top 10 Boroughs
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stats.byBorough}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis 
                dataKey="name" 
                stroke="#94a3b8"
                angle={-45}
                textAnchor="end"
                height={100}
                fontSize={12}
              />
              <YAxis stroke="#94a3b8" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#0f172a', 
                  border: '1px solid #06b6d4',
                  borderRadius: '8px'
                }}
              />
              <Bar dataKey="count" fill="#06b6d4" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Events Over Time - Line Chart */}
        <div className="bg-slate-900/50 border border-cyan-500/30 rounded-lg p-6 backdrop-blur-md lg:col-span-2">
          <h2 className="text-xl font-bold text-cyan-400 mb-4 uppercase tracking-wider">
            Events Over Time
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={stats.byMonth}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis 
                dataKey="month" 
                stroke="#94a3b8"
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis stroke="#94a3b8" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#0f172a', 
                  border: '1px solid #06b6d4',
                  borderRadius: '8px'
                }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="count" 
                stroke="#06b6d4" 
                strokeWidth={2}
                dot={{ fill: '#06b6d4', r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
