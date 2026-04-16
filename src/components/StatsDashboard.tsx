import React from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Clock, 
  ArrowUpRight, 
  ArrowDownRight,
  Calendar
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  LineChart, 
  Line,
  Cell,
  PieChart,
  Pie
} from 'recharts';
import { cn } from '../lib/utils';

const data = [
  { name: '월', value: 45 },
  { name: '화', value: 52 },
  { name: '수', value: 38 },
  { name: '목', value: 65 },
  { name: '금', value: 48 },
  { name: '토', value: 24 },
  { name: '일', value: 12 },
];

const categoryData = [
  { name: '이미징CS', value: 400, color: '#F27D26' },
  { name: 'App 문의', value: 300, color: '#185fa5' },
  { name: '결제/정산', value: 200, color: '#3b6d11' },
  { name: '기타', value: 100, color: '#999' },
];

export default function StatsDashboard() {
  return (
    <div className="flex flex-col h-full overflow-y-auto p-6 gap-6 bg-[var(--bg-secondary)]">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-[var(--text-primary)]">상담 지표 대시보드</h2>
          <p className="text-sm text-[var(--text-tertiary)]">실시간 상담 현황 및 주요 지표 분석</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-3 py-1.5 bg-[var(--bg-primary)] border border-[var(--border-tertiary)] rounded-lg text-xs font-medium text-[var(--text-secondary)]">
            <Calendar size={14} /> 2024.03.01 - 2024.03.31
          </button>
          <button className="px-4 py-1.5 bg-[var(--bg-info)] text-[var(--text-info)] rounded-lg text-xs font-bold">
            보고서 다운로드
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: '전체 상담 건수', value: '1,284', change: '+12.5%', isUp: true, icon: MessageSquare },
          { label: '평균 응대 시간', value: '8분 24초', change: '-1.2%', isUp: false, icon: Clock },
          { label: '고객 만족도', value: '4.8 / 5.0', change: '+0.3', isUp: true, icon: TrendingUp },
          { label: '활성 상담원', value: '12명', change: '0', isUp: true, icon: Users },
        ].map((card, i) => (
          <div key={i} className="bg-[var(--bg-primary)] p-5 rounded-xl border border-[var(--border-tertiary)] shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 bg-[var(--bg-secondary)] rounded-lg text-[var(--text-secondary)]">
                <card.icon size={18} />
              </div>
              <div className={cn(
                "flex items-center text-[10px] font-bold px-1.5 py-0.5 rounded",
                card.isUp ? "bg-[var(--bg-success)] text-[var(--text-success)]" : "bg-[var(--bg-danger)] text-[var(--text-danger)]"
              )}>
                {card.isUp ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
                {card.change}
              </div>
            </div>
            <p className="text-xs text-[var(--text-tertiary)] font-medium mb-1">{card.label}</p>
            <p className="text-xl font-bold text-[var(--text-primary)]">{card.value}</p>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-12 gap-6">
        {/* Main Trend Chart */}
        <div className="col-span-8 bg-[var(--bg-primary)] p-6 rounded-xl border border-[var(--border-tertiary)] shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-[var(--text-primary)]">요일별 상담 추이</h3>
            <div className="flex gap-2">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-[#F27D26]" />
                <span className="text-[10px] text-[var(--text-tertiary)] font-bold">이번 주</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-gray-200" />
                <span className="text-[10px] text-[var(--text-tertiary)] font-bold">지난 주</span>
              </div>
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-tertiary)" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fontSize: 10, fill: 'var(--text-tertiary)'}} 
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fontSize: 10, fill: 'var(--text-tertiary)'}}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-tertiary)', borderRadius: '8px', fontSize: '12px' }}
                  cursor={{fill: 'var(--bg-secondary)'}}
                />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 3 ? '#F27D26' : '#e2e8f0'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Pie Chart */}
        <div className="col-span-4 bg-[var(--bg-primary)] p-6 rounded-xl border border-[var(--border-tertiary)] shadow-sm">
          <h3 className="font-bold text-[var(--text-primary)] mb-6">문의 분류 비중</h3>
          <div className="h-[240px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-tertiary)', borderRadius: '8px', fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2 mt-4">
            {categoryData.map((item, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-xs text-[var(--text-secondary)]">{item.name}</span>
                </div>
                <span className="text-xs font-bold text-[var(--text-primary)]">{((item.value / 1000) * 100).toFixed(0)}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

import { MessageSquare } from 'lucide-react';
