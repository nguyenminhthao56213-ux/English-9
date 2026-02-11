
import React from 'react';
import { 
  TrendingUp, 
  Award, 
  Target, 
  Clock, 
  ArrowRight,
  ChevronRight,
  BookOpen,
  CheckCircle,
  Zap,
  // Added missing icons used in Quick Actions section
  MessageSquare,
  Library
} from 'lucide-react';
import { AppTab } from '../types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

const data = [
  { name: 'T2', score: 65 },
  { name: 'T3', score: 72 },
  { name: 'T4', score: 68 },
  { name: 'T5', score: 85 },
  { name: 'T6', score: 82 },
  { name: 'T7', score: 90 },
  { name: 'CN', score: 94 },
];

interface DashboardProps {
  setActiveTab: (tab: AppTab) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ setActiveTab }) => {
  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-primary p-8 text-white shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-4 text-center md:text-left">
            <h1 className="text-3xl md:text-4xl font-black">Sẵn sàng chinh phục Unit 4? 🚀</h1>
            <p className="text-blue-50 text-lg max-w-lg">
              Bạn đang học rất tốt! Mục tiêu "Wish clauses" đang chờ bạn hoàn thành. 
              Chỉ còn 3 bài tập nữa để đạt huy hiệu Tuần này.
            </p>
            <button 
              onClick={() => setActiveTab(AppTab.EXERCISES)}
              className="inline-flex items-center gap-2 bg-white text-blue-600 px-6 py-3 rounded-xl font-bold hover:bg-opacity-90 transition-all shadow-lg"
            >
              Học tiếp thôi! <ArrowRight size={20} />
            </button>
          </div>
          <div className="hidden lg:block">
            <div className="w-48 h-48 bg-white bg-opacity-20 rounded-full flex items-center justify-center animate-pulse">
              <Award size={96} className="text-white" />
            </div>
          </div>
        </div>
        {/* Abstract Shapes */}
        <div className="absolute -top-12 -right-12 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-orange-300 opacity-20 rounded-full blur-3xl"></div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Điểm TB', value: '8.5', icon: Target, color: 'text-blue-600', bg: 'bg-blue-100' },
          { label: 'Bài tập xong', value: '24', icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-100' },
          { label: 'Ngày liên tiếp', value: '7', icon: Zap, color: 'text-orange-600', bg: 'bg-orange-100' },
          { label: 'Thời gian học', value: '12h', icon: Clock, color: 'text-purple-600', bg: 'bg-purple-100' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all group">
            <div className="flex items-center justify-between mb-4">
              <div className={`${stat.bg} ${stat.color} p-3 rounded-xl group-hover:scale-110 transition-transform`}>
                <stat.icon size={24} />
              </div>
              <span className="text-xs font-bold text-green-500 bg-green-50 px-2 py-1 rounded-full">+12%</span>
            </div>
            <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
            <p className="text-2xl font-bold mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Progress Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <TrendingUp size={24} className="text-blue-500" />
              Tiến độ học tập
            </h3>
            <select className="bg-gray-50 border-none text-sm font-semibold rounded-lg px-3 py-1 text-gray-600">
              <option>Tuần này</option>
              <option>Tháng này</option>
            </select>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4A90E2" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#4A90E2" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dx={-10} />
                <Tooltip 
                  contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}}
                  cursor={{stroke: '#4A90E2', strokeWidth: 2, strokeDasharray: '5 5'}}
                />
                <Area type="monotone" dataKey="score" stroke="#4A90E2" strokeWidth={4} fillOpacity={1} fill="url(#colorScore)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-6">
          <h3 className="text-xl font-bold">Truy cập nhanh</h3>
          <div className="grid grid-cols-1 gap-4">
            <button 
              onClick={() => setActiveTab(AppTab.GRAMMAR_CHECK)}
              className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm hover:border-blue-200 hover:bg-blue-50 transition-all text-left group"
            >
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
                <CheckCircle size={24} />
              </div>
              <div className="flex-1">
                <p className="font-bold">Quét bài tập</p>
                <p className="text-xs text-gray-500">Phát hiện lỗi ngữ pháp qua ảnh</p>
              </div>
              <ChevronRight size={20} className="text-gray-300 group-hover:text-blue-500" />
            </button>
            <button 
              onClick={() => setActiveTab(AppTab.TUTOR)}
              className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm hover:border-orange-200 hover:bg-orange-50 transition-all text-left group"
            >
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center text-orange-600 group-hover:scale-110 transition-transform">
                <MessageSquare size={24} />
              </div>
              <div className="flex-1">
                <p className="font-bold">Hỏi đáp AI</p>
                <p className="text-xs text-gray-500">Giải đáp cấu trúc câu 24/7</p>
              </div>
              <ChevronRight size={20} className="text-gray-300 group-hover:text-orange-500" />
            </button>
            <button 
              onClick={() => setActiveTab(AppTab.LIBRARY)}
              className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm hover:border-purple-200 hover:bg-purple-50 transition-all text-left group"
            >
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600 group-hover:scale-110 transition-transform">
                <Library size={24} />
              </div>
              <div className="flex-1">
                <p className="font-bold">Tóm tắt kiến thức</p>
                <p className="text-xs text-gray-500">Hệ thống Unit 1-12 Global Success</p>
              </div>
              <ChevronRight size={20} className="text-gray-300 group-hover:text-purple-500" />
            </button>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <h4 className="font-bold mb-4">Mục tiêu hôm nay</h4>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <input type="checkbox" className="w-5 h-5 rounded border-gray-300 text-blue-600" />
                <span className="text-sm text-gray-600">Ôn tập Conditional Type 2</span>
              </div>
              <div className="flex items-center gap-3">
                <input type="checkbox" checked readOnly className="w-5 h-5 rounded border-gray-300 text-blue-600" />
                <span className="text-sm text-gray-400 line-through">Làm bài kiểm tra Unit 3</span>
              </div>
              <div className="flex items-center gap-3">
                <input type="checkbox" className="w-5 h-5 rounded border-gray-300 text-blue-600" />
                <span className="text-sm text-gray-600">Tự luận Reported Speech</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
