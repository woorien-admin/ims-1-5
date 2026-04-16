import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Calendar, 
  Download, 
  ChevronLeft, 
  ChevronRight,
  MoreHorizontal,
  Eye
} from 'lucide-react';
import { cn } from '../lib/utils';

const historyData = [
  { id: '#20481', chart: 'EF365', hospital: '우리엔동물병원', date: '2024.03.28 14:22', category: '이미징CS', agent: '김상담', status: '완료' },
  { id: '#20480', chart: 'PMS365', hospital: '미래동물병원', date: '2024.03.28 14:05', category: 'App', agent: '이운영', status: '완료' },
  { id: '#20479', chart: 'EFV22', hospital: '행복한동물병원', date: '2024.03.28 13:50', category: '네이버', agent: '박지원', status: '완료' },
  { id: '#20478', chart: '기타', hospital: '미등록 고객', date: '2024.03.28 13:40', category: 'EMR영업', agent: '최배정', status: '완료' },
  { id: '#20477', chart: 'PMS1.0', hospital: '365동물메디컬', date: '2024.03.28 13:10', category: '이미징CS', agent: '김상담', status: '완료' },
  { id: '#20476', chart: 'EF365', hospital: '튼튼동물병원', date: '2024.03.27 16:45', category: '기술지원', agent: '이운영', status: '완료' },
  { id: '#20475', chart: 'PMS365', hospital: '사랑동물병원', date: '2024.03.27 15:20', category: 'App', agent: '박지원', status: '완료' },
  { id: '#20474', chart: 'EFV22', hospital: '우리동물병원', date: '2024.03.27 14:10', category: '결제/정산', agent: '최배정', status: '완료' },
];

export default function CounselingHistory() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="flex flex-col h-full overflow-hidden bg-[var(--bg-secondary)]">
      {/* Header */}
      <div className="px-6 py-4 bg-[var(--bg-primary)] border-b border-[var(--border-tertiary)] flex items-center justify-between shrink-0">
        <div>
          <h2 className="text-xl font-bold text-[var(--text-primary)]">상담 내역 조회</h2>
          <p className="text-sm text-[var(--text-tertiary)]">과거 상담 이력을 상세히 조회하고 분석할 수 있습니다.</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-[var(--bg-primary)] border border-[var(--border-tertiary)] rounded-lg text-xs font-bold text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] transition-all">
            <Download size={14} /> 엑셀 다운로드
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="px-6 py-4 bg-[var(--bg-primary)] border-b border-[var(--border-tertiary)] flex items-center gap-4 shrink-0">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]" />
          <input 
            type="text" 
            placeholder="병원명, 상담원, 접수번호 검색..." 
            className="w-full pl-10 pr-4 py-2 bg-[var(--bg-secondary)] border border-[var(--border-tertiary)] rounded-xl text-sm focus:outline-none focus:border-[var(--text-info)] transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-3 py-1.5 bg-[var(--bg-primary)] border border-[var(--border-tertiary)] rounded-lg text-xs font-medium text-[var(--text-secondary)]">
            <Calendar size={14} /> 기간 설정
          </button>
          <button className="flex items-center gap-2 px-3 py-1.5 bg-[var(--bg-primary)] border border-[var(--border-tertiary)] rounded-lg text-xs font-medium text-[var(--text-secondary)]">
            <Filter size={14} /> 상세 필터
          </button>
        </div>
      </div>

      {/* Table Area */}
      <div className="flex-1 overflow-auto p-6">
        <div className="bg-[var(--bg-primary)] rounded-xl border border-[var(--border-tertiary)] shadow-sm overflow-hidden">
          <table className="w-full border-collapse">
            <thead className="bg-[var(--bg-secondary)]">
              <tr className="border-b border-[var(--border-tertiary)]">
                {['접수번호', '차트', '병원명', '상담일시', '분류', '담당자', '상태', '관리'].map((h) => (
                  <th key={h} className="text-[10px] font-bold text-[var(--text-tertiary)] text-left px-4 py-3 uppercase tracking-wider">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {historyData.map((item) => (
                <tr key={item.id} className="border-b border-[var(--border-tertiary)] hover:bg-[var(--bg-secondary)] transition-colors cursor-pointer group">
                  <td className="text-[11px] px-4 py-3 text-[var(--text-primary)] font-medium">{item.id}</td>
                  <td className="text-[11px] px-4 py-3 text-[var(--text-secondary)]">{item.chart}</td>
                  <td className="text-[11px] px-4 py-3 text-[var(--text-primary)] font-bold">{item.hospital}</td>
                  <td className="text-[11px] px-4 py-3 text-[var(--text-secondary)]">{item.date}</td>
                  <td className="text-[11px] px-4 py-3">
                    <span className="px-2 py-0.5 bg-[var(--bg-info)] text-[var(--text-info)] text-[9px] font-bold rounded uppercase tracking-wider">{item.category}</span>
                  </td>
                  <td className="text-[11px] px-4 py-3 text-[var(--text-secondary)]">{item.agent}</td>
                  <td className="text-[11px] px-4 py-3">
                    <span className="px-2 py-0.5 bg-[var(--bg-success)] text-[var(--text-success)] text-[9px] font-bold rounded uppercase tracking-wider">{item.status}</span>
                  </td>
                  <td className="text-[11px] px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button className="p-1.5 hover:bg-[var(--bg-primary)] rounded-lg text-[var(--text-tertiary)] hover:text-[var(--text-info)] transition-colors" title="상세보기"><Eye size={14} /></button>
                      <button className="p-1.5 hover:bg-[var(--bg-primary)] rounded-lg text-[var(--text-tertiary)] hover:text-[var(--text-info)] transition-colors" title="더보기"><MoreHorizontal size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-6">
          <p className="text-xs text-[var(--text-tertiary)] font-medium">전체 1,284건 중 1-8건 표시</p>
          <div className="flex items-center gap-1">
            <button className="p-2 bg-[var(--bg-primary)] border border-[var(--border-tertiary)] rounded-lg text-[var(--text-tertiary)] hover:bg-[var(--bg-secondary)] transition-all cursor-not-allowed"><ChevronLeft size={16} /></button>
            {[1, 2, 3, 4, 5].map((p) => (
              <button 
                key={p} 
                className={cn(
                  "w-8 h-8 rounded-lg text-xs font-bold transition-all",
                  p === 1 ? "bg-[var(--bg-info)] text-[var(--text-info)]" : "bg-[var(--bg-primary)] border border-[var(--border-tertiary)] text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)]"
                )}
              >
                {p}
              </button>
            ))}
            <button className="p-2 bg-[var(--bg-primary)] border border-[var(--border-tertiary)] rounded-lg text-[var(--text-tertiary)] hover:bg-[var(--bg-secondary)] transition-all"><ChevronRight size={16} /></button>
          </div>
        </div>
      </div>
    </div>
  );
}
