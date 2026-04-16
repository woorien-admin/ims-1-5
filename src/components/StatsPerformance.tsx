import React from 'react';
import { 
  Users, 
  Clock, 
  CheckCircle2, 
  MessageSquare,
  TrendingUp,
  Award,
  Search,
  Filter
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';
import { cn } from '../lib/utils';

const performanceData = [
  { name: '김상담', count: 145, time: '6:20', satisfaction: 4.9 },
  { name: '이운영', count: 132, time: '7:45', satisfaction: 4.7 },
  { name: '박지원', count: 128, time: '8:10', satisfaction: 4.8 },
  { name: '최배정', count: 115, time: '7:15', satisfaction: 4.6 },
  { name: '정관리', count: 98, time: '9:30', satisfaction: 4.5 },
];

export default function StatsPerformance() {
  return (
    <div className="flex flex-col h-full overflow-y-auto p-6 gap-6 bg-[var(--bg-secondary)]">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-[var(--text-primary)]">상담원 성과 분석</h2>
          <p className="text-sm text-[var(--text-tertiary)]">상담원별 주요 성과 지표 및 효율성 분석</p>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]" />
            <input 
              type="text" 
              placeholder="상담원 검색..." 
              className="pl-9 pr-4 py-1.5 bg-[var(--bg-primary)] border border-[var(--border-tertiary)] rounded-lg text-xs focus:outline-none focus:border-[var(--text-info)]"
            />
          </div>
          <button className="flex items-center gap-2 px-3 py-1.5 bg-[var(--bg-primary)] border border-[var(--border-tertiary)] rounded-lg text-xs font-medium text-[var(--text-secondary)]">
            <Filter size={14} /> 필터
          </button>
        </div>
      </div>

      {/* Top Performers */}
      <div className="grid grid-cols-3 gap-6">
        {[
          { title: '최다 상담', name: '김상담', value: '145건', icon: MessageSquare, color: 'text-blue-500', bg: 'bg-blue-50' },
          { title: '최단 응대', name: '김상담', value: '6분 20초', icon: Clock, color: 'text-green-500', bg: 'bg-green-50' },
          { title: '최고 만족도', name: '김상담', value: '4.9 / 5.0', icon: Award, color: 'text-amber-500', bg: 'bg-amber-50' },
        ].map((item, i) => (
          <div key={i} className="bg-[var(--bg-primary)] p-5 rounded-xl border border-[var(--border-tertiary)] shadow-sm flex items-center gap-4">
            <div className={cn("p-3 rounded-2xl", item.bg, item.color)}>
              <item.icon size={24} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-[var(--text-tertiary)] uppercase tracking-wider mb-0.5">{item.title}</p>
              <p className="text-sm font-bold text-[var(--text-primary)]">{item.name}</p>
              <p className="text-lg font-black text-[var(--text-primary)] mt-0.5">{item.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Performance Table & Chart */}
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-7 bg-[var(--bg-primary)] rounded-xl border border-[var(--border-tertiary)] shadow-sm overflow-hidden">
          <div className="p-4 border-b border-[var(--border-tertiary)] flex items-center justify-between">
            <h3 className="font-bold text-[var(--text-primary)]">상담원별 지표 현황</h3>
            <span className="text-[10px] text-[var(--text-tertiary)] font-bold">최근 30일 기준</span>
          </div>
          <table className="w-full border-collapse">
            <thead className="bg-[var(--bg-secondary)]">
              <tr className="border-b border-[var(--border-tertiary)]">
                {['상담원', '상담 건수', '평균 응대', '만족도', '상태'].map((h) => (
                  <th key={h} className="text-[10px] font-bold text-[var(--text-tertiary)] text-left px-4 py-3 uppercase tracking-wider">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {performanceData.map((agent, i) => (
                <tr key={i} className="border-b border-[var(--border-tertiary)] hover:bg-[var(--bg-secondary)] transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-[var(--bg-info)] flex items-center justify-center text-[10px] font-bold text-[var(--text-info)]">
                        {agent.name.substring(0, 2)}
                      </div>
                      <span className="text-xs font-bold text-[var(--text-primary)]">{agent.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs font-medium text-[var(--text-primary)]">{agent.count}건</td>
                  <td className="px-4 py-3 text-xs text-[var(--text-secondary)]">{agent.time}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <Award size={12} className="text-amber-400" />
                      <span className="text-xs font-bold text-[var(--text-primary)]">{agent.satisfaction}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 bg-[var(--bg-success)] text-[var(--text-success)] text-[9px] font-bold rounded uppercase tracking-wider">우수</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="col-span-5 bg-[var(--bg-primary)] p-6 rounded-xl border border-[var(--border-tertiary)] shadow-sm">
          <h3 className="font-bold text-[var(--text-primary)] mb-6">상담 건수 비교</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={performanceData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="var(--border-tertiary)" />
                <XAxis type="number" hide />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fontSize: 11, fill: 'var(--text-primary)', fontWeight: 'bold'}}
                  width={60}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-tertiary)', borderRadius: '8px', fontSize: '12px' }}
                  cursor={{fill: 'var(--bg-secondary)'}}
                />
                <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                  {performanceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 0 ? '#F27D26' : '#e2e8f0'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
