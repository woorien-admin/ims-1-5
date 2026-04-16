import React, { useState } from 'react';
import { 
  Search, 
  HelpCircle, 
  ChevronRight, 
  ChevronDown, 
  Tag, 
  Copy, 
  CheckCircle2,
  Filter
} from 'lucide-react';
import { cn } from '../lib/utils';

const faqData = [
  { 
    id: 1, 
    question: 'VetCRM Pro 연동 시 데이터 동기화가 안 되는 경우 어떻게 하나요?', 
    answer: '1. 네트워크 상태를 먼저 확인하세요. 2. 설정 메뉴에서 연동 키가 올바른지 재검토합니다. 3. 서버 로그에서 "Connection Timeout" 에러가 있는지 확인 후 기술지원팀에 문의하세요.',
    category: '기술지원',
    tags: ['연동오류', '동기화', 'VetCRM']
  },
  { 
    id: 2, 
    question: '관리비 미납 병원의 서비스 제한 기준이 궁금합니다.', 
    answer: '미납 2개월 차부터 서비스 일부 기능(이미지 전송 등)이 제한되며, 3개월 차에는 전체 서비스가 정지됩니다. 정지 7일 전 SMS로 사전 예고가 발송됩니다.',
    category: '운영정책',
    tags: ['미납', '서비스제한', '운영']
  },
  { 
    id: 3, 
    question: '신규 병원 등록 시 필수 서류는 무엇인가요?', 
    answer: '사업자등록증 사본, 원장님 면허증 사본, 통장 사본이 필요합니다. 모든 서류는 IMS 2.0 병원 등록 메뉴에서 직접 업로드 가능합니다.',
    category: '영업/등록',
    tags: ['신규등록', '서류', '영업']
  },
  { 
    id: 4, 
    question: '상담원 자동 배정 로직의 우선순위는 어떻게 되나요?', 
    answer: '1. 근무 중인 상담원 2. 제품군별 전문 상담원 3. 현재 상담 건수가 가장 적은 상담원 순으로 배정됩니다.',
    category: '시스템',
    tags: ['자동배정', '로직', '상담원']
  },
];

export default function ReferenceFAQ() {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState<number | null>(1);
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const handleCopy = (id: number, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="flex flex-col h-full overflow-hidden bg-[var(--bg-secondary)]">
      {/* Header */}
      <div className="px-6 py-4 bg-[var(--bg-primary)] border-b border-[var(--border-tertiary)] flex items-center justify-between shrink-0">
        <div>
          <h2 className="text-xl font-bold text-[var(--text-primary)]">FAQ / 상담 스크립트</h2>
          <p className="text-sm text-[var(--text-tertiary)]">자주 묻는 질문과 표준 상담 스크립트를 확인하세요.</p>
        </div>
        <button className="px-4 py-1.5 bg-[var(--bg-info)] text-[var(--text-info)] rounded-lg text-xs font-bold">
          스크립트 추가
        </button>
      </div>

      {/* Search Bar */}
      <div className="px-6 py-4 bg-[var(--bg-primary)] border-b border-[var(--border-tertiary)] shrink-0">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]" />
          <input 
            type="text" 
            placeholder="질문, 답변, 태그 검색..." 
            className="w-full pl-10 pr-4 py-2 bg-[var(--bg-secondary)] border border-[var(--border-tertiary)] rounded-xl text-sm focus:outline-none focus:border-[var(--text-info)] transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {faqData.map((faq) => (
          <div key={faq.id} className="bg-[var(--bg-primary)] rounded-xl border border-[var(--border-tertiary)] shadow-sm overflow-hidden transition-all">
            <button 
              onClick={() => setExpandedId(expandedId === faq.id ? null : faq.id)}
              className="w-full px-5 py-4 flex items-start gap-4 text-left hover:bg-[var(--bg-secondary)] transition-colors"
            >
              <div className="p-2 bg-[var(--bg-info)] text-[var(--text-info)] rounded-lg shrink-0">
                <HelpCircle size={20} />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-bold text-[var(--text-info)] bg-[var(--bg-info)] px-2 py-0.5 rounded uppercase tracking-wider">{faq.category}</span>
                  <div className="flex gap-1">
                    {faq.tags.map(tag => (
                      <span key={tag} className="text-[9px] text-[var(--text-tertiary)] font-medium">#{tag}</span>
                    ))}
                  </div>
                </div>
                <h3 className="font-bold text-[var(--text-primary)] text-sm leading-snug">{faq.question}</h3>
              </div>
              <div className="shrink-0 text-[var(--text-tertiary)] mt-1">
                {expandedId === faq.id ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
              </div>
            </button>

            {expandedId === faq.id && (
              <div className="px-5 pb-5 pt-2 border-t border-[var(--border-tertiary)] bg-[var(--bg-secondary)]/30">
                <div className="bg-[var(--bg-primary)] p-4 rounded-xl border border-[var(--border-tertiary)] relative group">
                  <p className="text-sm text-[var(--text-secondary)] leading-relaxed whitespace-pre-wrap">{faq.answer}</p>
                  <button 
                    onClick={() => handleCopy(faq.id, faq.answer)}
                    className="absolute top-3 right-3 p-2 bg-[var(--bg-secondary)] text-[var(--text-tertiary)] rounded-lg hover:text-[var(--text-info)] transition-all opacity-0 group-hover:opacity-100"
                    title="스크립트 복사"
                  >
                    {copiedId === faq.id ? <CheckCircle2 size={16} className="text-[var(--text-success)]" /> : <Copy size={16} />}
                  </button>
                </div>
                <div className="mt-3 flex justify-end">
                  <button className="text-[11px] font-bold text-[var(--text-info)] flex items-center gap-1 hover:underline">
                    관련 매뉴얼 보기 <ChevronRight size={12} />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
