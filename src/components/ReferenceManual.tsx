import React, { useState } from 'react';
import { 
  Search, 
  BookOpen, 
  FileText, 
  ChevronRight, 
  ExternalLink, 
  Star, 
  Clock, 
  Tag,
  Download,
  Share2,
  Printer
} from 'lucide-react';
import { cn } from '../lib/utils';

const manuals = [
  { id: 1, title: 'VetCRM Pro v2.0 설치 가이드', category: '설치/환경', date: '2024.03.15', author: '기술지원팀', views: 1240, isFavorite: true },
  { id: 2, title: '벳아너스 멤버십 혜택 및 가입 절차', category: '영업/마케팅', date: '2024.03.10', author: '영업팀', views: 850, isFavorite: false },
  { id: 3, title: '이미지 전송 오류 해결 체크리스트', category: '기술지원', date: '2024.03.05', author: '개발팀', views: 2100, isFavorite: true },
  { id: 4, title: '결제/정산 시스템 사용 매뉴얼', category: '운영', date: '2024.02.28', author: '운영팀', views: 640, isFavorite: false },
  { id: 5, title: '신규 고객 상담 스크립트 (2024)', category: '상담', date: '2024.02.20', author: '상담팀', views: 1500, isFavorite: true },
];

export default function ReferenceManual() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('전체');

  const categories = ['전체', '설치/환경', '기술지원', '영업/마케팅', '운영', '상담'];

  return (
    <div className="flex flex-col h-full overflow-hidden bg-[var(--bg-secondary)]">
      {/* Header */}
      <div className="px-6 py-4 bg-[var(--bg-primary)] border-b border-[var(--border-tertiary)] flex items-center justify-between shrink-0">
        <div>
          <h2 className="text-xl font-bold text-[var(--text-primary)]">업무 참조 매뉴얼</h2>
          <p className="text-sm text-[var(--text-tertiary)]">상담에 필요한 각종 가이드 및 매뉴얼을 확인하세요.</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-[var(--bg-info)] text-[var(--text-info)] rounded-lg text-xs font-bold">
            <BookOpen size={14} /> 내 즐겨찾기
          </button>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="px-6 py-4 bg-[var(--bg-primary)] border-b border-[var(--border-tertiary)] flex items-center gap-4 shrink-0">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]" />
          <input 
            type="text" 
            placeholder="매뉴얼 제목, 키워드 검색..." 
            className="w-full pl-10 pr-4 py-2 bg-[var(--bg-secondary)] border border-[var(--border-tertiary)] rounded-xl text-sm focus:outline-none focus:border-[var(--text-info)] transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-bold transition-all",
                selectedCategory === cat 
                  ? "bg-[var(--bg-info)] text-[var(--text-info)]" 
                  : "bg-[var(--bg-primary)] text-[var(--text-secondary)] border border-[var(--border-tertiary)] hover:bg-[var(--bg-secondary)]"
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Manual List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {manuals.map((manual) => (
            <div key={manual.id} className="bg-[var(--bg-primary)] p-5 rounded-xl border border-[var(--border-tertiary)] shadow-sm hover:border-[var(--text-info)] transition-all cursor-pointer group">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-[var(--bg-secondary)] rounded-xl text-[var(--text-info)]">
                    <FileText size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-[var(--text-primary)] group-hover:text-[var(--text-info)] transition-colors">{manual.title}</h3>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-[10px] font-bold text-[var(--text-info)] bg-[var(--bg-info)] px-2 py-0.5 rounded uppercase tracking-wider">{manual.category}</span>
                      <span className="text-[10px] text-[var(--text-tertiary)] flex items-center gap-1"><Clock size={10} /> {manual.date}</span>
                      <span className="text-[10px] text-[var(--text-tertiary)] flex items-center gap-1"><Tag size={10} /> {manual.author}</span>
                    </div>
                  </div>
                </div>
                <button className={cn(
                  "p-2 rounded-lg transition-colors",
                  manual.isFavorite ? "text-amber-400" : "text-[var(--text-tertiary)] hover:bg-[var(--bg-secondary)]"
                )}>
                  <Star size={18} fill={manual.isFavorite ? "currentColor" : "none"} />
                </button>
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-[var(--border-tertiary)]">
                <div className="flex items-center gap-4 text-[10px] text-[var(--text-tertiary)] font-medium">
                  <span>조회수 {manual.views.toLocaleString()}회</span>
                  <span>다운로드 124회</span>
                </div>
                <div className="flex gap-2">
                  <button className="p-1.5 hover:bg-[var(--bg-secondary)] rounded-lg text-[var(--text-tertiary)] transition-colors" title="다운로드"><Download size={14} /></button>
                  <button className="p-1.5 hover:bg-[var(--bg-secondary)] rounded-lg text-[var(--text-tertiary)] transition-colors" title="공유"><Share2 size={14} /></button>
                  <button className="p-1.5 hover:bg-[var(--bg-secondary)] rounded-lg text-[var(--text-tertiary)] transition-colors" title="인쇄"><Printer size={14} /></button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Reference Panel */}
        <div className="w-80 bg-[var(--bg-primary)] border-l border-[var(--border-tertiary)] p-6 shrink-0 overflow-y-auto">
          <h3 className="font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2">
            <Star size={16} className="text-amber-400" /> 자주 찾는 매뉴얼
          </h3>
          <div className="space-y-3">
            {manuals.filter(m => m.isFavorite).map((m) => (
              <div key={m.id} className="p-3 bg-[var(--bg-secondary)] rounded-lg hover:bg-[var(--bg-info)] transition-all cursor-pointer group">
                <p className="text-xs font-bold text-[var(--text-primary)] group-hover:text-[var(--text-info)] line-clamp-1">{m.title}</p>
                <p className="text-[10px] text-[var(--text-tertiary)] mt-1">{m.category}</p>
              </div>
            ))}
          </div>

          <div className="mt-8">
            <h3 className="font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2">
              <ExternalLink size={16} className="text-[var(--text-info)]" /> 외부 링크
            </h3>
            <div className="space-y-2">
              <a href="#" className="flex items-center justify-between p-3 border border-[var(--border-tertiary)] rounded-lg text-xs font-medium text-[var(--text-secondary)] hover:border-[var(--text-info)] hover:text-[var(--text-info)] transition-all">
                벳아너스 공식 홈페이지 <ChevronRight size={14} />
              </a>
              <a href="#" className="flex items-center justify-between p-3 border border-[var(--border-tertiary)] rounded-lg text-xs font-medium text-[var(--text-secondary)] hover:border-[var(--text-info)] hover:text-[var(--text-info)] transition-all">
                VetCRM Pro 관리자 페이지 <ChevronRight size={14} />
              </a>
              <a href="#" className="flex items-center justify-between p-3 border border-[var(--border-tertiary)] rounded-lg text-xs font-medium text-[var(--text-secondary)] hover:border-[var(--text-info)] hover:text-[var(--text-info)] transition-all">
                기술지원 원격 제어 <ChevronRight size={14} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
