import React, { useState } from 'react';
import { 
  History, 
  User, 
  Phone, 
  MapPin, 
  AlertCircle, 
  CheckCircle2, 
  Send, 
  MessageSquare,
  ChevronRight,
  Clock,
  Building2,
  CreditCard,
  Award,
  Lock
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { UserRole, type User as UserType } from '../types';

interface CounselingDetailProps {
  user: UserType;
}

export default function CounselingDetail({ user }: CounselingDetailProps) {
  const [activeInputTab, setActiveInputTab] = useState<'internal' | 'external'>('internal');
  const [internalComment, setInternalComment] = useState('');
  const [externalResponse, setExternalResponse] = useState('');

  const isCompleteDisabled = internalComment.trim().length === 0;
  
  // 외주 상담사는 플랜 수정(VetCRM 상세 보기) 접근 불가
  const canModifyPlan = user.role === UserRole.ADMIN || user.role === UserRole.COUNSELOR;

  const history = [
    { id: 1, date: '2024-03-28 14:20', type: '전화상담', content: '제품 A 결제 오류 문의 - 벳CRM 연동 확인 필요', agent: '이운영' },
    { id: 2, date: '2024-03-25 10:05', type: '카카오톡', content: '관리비 미납 관련 안내 완료 - 다음주 결제 예정', agent: '김상담' },
    { id: 3, date: '2024-03-20 16:45', type: '시스템', content: '벳아너스 등급 상향 (Silver -> Gold)', agent: 'System' },
  ];

  return (
    <div className="grid grid-cols-12 gap-6 h-full">
      {/* Left: Customer Info & History */}
      <div className="col-span-8 flex flex-col gap-6">
        {/* Customer Basic Info */}
        <section className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-start justify-between mb-6">
            <div className="flex gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center text-gray-400">
                <User size={32} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold">박원장 (해피동물병원)</h2>
                  <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-[10px] font-bold rounded uppercase tracking-wider">VIP 고객</span>
                </div>
                <p className="text-gray-500 text-sm mt-1 flex items-center gap-4">
                  <span className="flex items-center gap-1"><Phone size={14} /> 010-1234-5678</span>
                  <span className="flex items-center gap-1"><MapPin size={14} /> 서울시 강남구 테헤란로 123</span>
                </p>
              </div>
            </div>
            {canModifyPlan ? (
              <button className="text-sm font-medium text-[#F27D26] hover:underline flex items-center gap-1">
                VetCRM 상세 보기 / 플랜 수정 <ChevronRight size={14} />
              </button>
            ) : (
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 text-gray-400 rounded-lg text-xs font-medium border border-gray-100 cursor-not-allowed">
                <Lock size={12} /> 플랜 수정 권한 없음
              </div>
            )}
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 bg-[#F9FAFB] rounded-lg border border-gray-100">
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">최근 상담일</p>
              <p className="text-sm font-semibold">2024년 3월 28일</p>
            </div>
            <div className="p-4 bg-[#F9FAFB] rounded-lg border border-gray-100">
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">누적 상담 건수</p>
              <p className="text-sm font-semibold">12건</p>
            </div>
            <div className="p-4 bg-[#F9FAFB] rounded-lg border border-gray-100">
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">주요 문의 제품</p>
              <p className="text-sm font-semibold">VetCRM Pro, 벳아너스 멤버십</p>
            </div>
          </div>
        </section>


        {/* Counseling Input Area */}
        <section className="bg-white rounded-xl border border-gray-200 flex flex-col shadow-sm overflow-hidden flex-1">
          <div className="flex border-b border-gray-100">
            <button 
              onClick={() => setActiveInputTab('internal')}
              className={cn(
                "flex-1 py-4 text-sm font-bold flex items-center justify-center gap-2 transition-colors",
                activeInputTab === 'internal' ? "bg-white text-[#1A1A1A] border-b-2 border-[#F27D26]" : "bg-gray-50 text-gray-400"
              )}
            >
              <MessageSquare size={16} /> 내부 코멘트 (필수)
            </button>
            <button 
              onClick={() => setActiveInputTab('external')}
              className={cn(
                "flex-1 py-4 text-sm font-bold flex items-center justify-center gap-2 transition-colors",
                activeInputTab === 'external' ? "bg-white text-[#1A1A1A] border-b-2 border-[#F27D26]" : "bg-gray-50 text-gray-400"
              )}
            >
              <Send size={16} /> 외부 답변 전송
            </button>
          </div>

          <div className="flex-1 p-6 flex flex-col gap-4">
            <div className="flex-1 relative">
              <textarea 
                value={activeInputTab === 'internal' ? internalComment : externalResponse}
                onChange={(e) => activeInputTab === 'internal' ? setInternalComment(e.target.value) : setExternalResponse(e.target.value)}
                placeholder={activeInputTab === 'internal' ? "상담 내용을 상세히 기록해주세요. (운영팀 공유용)" : "고객에게 전송될 답변을 입력해주세요."}
                className="w-full h-full min-h-[200px] p-4 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-[#F27D26]/20 resize-none text-sm leading-relaxed"
              />
              {activeInputTab === 'internal' && internalComment.length === 0 && (
                <div className="absolute top-4 right-4 flex items-center gap-1.5 text-amber-500 text-[10px] font-bold">
                  <AlertCircle size={12} /> 입력 필수
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-[#F27D26] focus:ring-[#F27D26]" />
                  <span className="text-xs text-gray-500 group-hover:text-gray-800">긴급 처리 필요</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-[#F27D26] focus:ring-[#F27D26]" />
                  <span className="text-xs text-gray-500 group-hover:text-gray-800">SMS 알림 발송</span>
                </label>
              </div>
              
              <div className="flex gap-2">
                <button className="px-6 py-2.5 rounded-lg border border-gray-200 text-sm font-bold text-gray-600 hover:bg-gray-50 transition-colors">
                  임시 저장
                </button>
                <button 
                  disabled={isCompleteDisabled}
                  className={cn(
                    "px-8 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2 transition-all shadow-md",
                    isCompleteDisabled 
                      ? "bg-gray-200 text-gray-400 cursor-not-allowed shadow-none" 
                      : "bg-[#1A1A1A] text-white hover:bg-black active:scale-95"
                  )}
                >
                  <CheckCircle2 size={18} /> 처리 완료
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* History Timeline */}
        <section className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-6">
            <History size={18} className="text-gray-400" />
            <h3 className="font-bold">상담 히스토리</h3>
          </div>
          
          <div className="space-y-6 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[1px] before:bg-gray-100">
            {history.map((item) => (
              <div key={item.id} className="relative pl-8">
                <div className="absolute left-0 top-1.5 w-[23px] h-[23px] rounded-full bg-white border-2 border-gray-200 flex items-center justify-center z-10">
                  <div className="w-2 h-2 rounded-full bg-gray-300" />
                </div>
                <div className="flex flex-col gap-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{item.date}</span>
                    <span className="text-[10px] bg-gray-100 px-2 py-0.5 rounded text-gray-500 font-bold">{item.type}</span>
                  </div>
                  <p className="text-sm font-medium text-gray-800">{item.content}</p>
                  <p className="text-[11px] text-gray-400 flex items-center gap-1">
                    <Clock size={10} /> 담당자: {item.agent}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Right Sidebar: Hospital Quick Card */}
      <div className="col-span-4 flex flex-col gap-6">
        <section className="bg-[#151619] rounded-xl p-6 text-white shadow-xl sticky top-0">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
              <Building2 size={20} className="text-[#F27D26]" />
            </div>
            <div>
              <h3 className="font-bold text-lg">해피동물병원</h3>
              <p className="text-xs text-white/40">ID: VET-2024-0012</p>
            </div>
          </div>

          <div className="space-y-4">
            {/* Badges */}
            <div className="flex flex-wrap gap-2">
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#F27D26]/20 text-[#F27D26] rounded-full text-[10px] font-bold border border-[#F27D26]/30">
                <Award size={12} /> 벳아너스 가입
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-500/20 text-blue-400 rounded-full text-[10px] font-bold border border-blue-500/30">
                A등급 병원
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500/20 text-red-400 rounded-full text-[10px] font-bold border border-red-500/30">
                <CreditCard size={12} /> 미납 정보 (2건)
              </div>
            </div>

            <div className="h-[1px] bg-white/10 my-4" />

            {/* Detailed Info Grid */}
            <div className="grid grid-cols-2 gap-y-4 gap-x-2">
              <div>
                <p className="text-[10px] text-white/30 font-bold uppercase tracking-wider mb-1">가입일</p>
                <p className="text-xs font-medium">2021. 05. 12</p>
              </div>
              <div>
                <p className="text-[10px] text-white/30 font-bold uppercase tracking-wider mb-1">사용 제품</p>
                <p className="text-xs font-medium">VetCRM Pro v2.0</p>
              </div>
              <div>
                <p className="text-[10px] text-white/30 font-bold uppercase tracking-wider mb-1">미납 금액</p>
                <p className="text-xs font-bold text-red-400">₩ 1,240,000</p>
              </div>
              <div>
                <p className="text-[10px] text-white/30 font-bold uppercase tracking-wider mb-1">최근 연동일</p>
                <p className="text-xs font-medium">1시간 전</p>
              </div>
            </div>

            <div className="mt-6 space-y-2">
              <button className="w-full py-2.5 bg-white text-[#151619] rounded-lg text-xs font-bold hover:bg-gray-100 transition-colors">
                병원 상세 정보 (CRM)
              </button>
              <button className="w-full py-2.5 bg-white/5 text-white border border-white/10 rounded-lg text-xs font-bold hover:bg-white/10 transition-colors">
                관리비 납부 내역 확인
              </button>
            </div>
          </div>
        </section>

        {/* Quick Notes */}
        <section className="bg-amber-50 border border-amber-200 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-3 text-amber-800">
            <AlertCircle size={16} />
            <h4 className="text-xs font-bold uppercase tracking-wider">특이사항 (Sticky Note)</h4>
          </div>
          <p className="text-xs text-amber-900 leading-relaxed">
            원장님이 오후 2시~4시 사이에는 수술 중이라 통화가 어렵습니다. 급한 건은 실장님(010-XXXX-XXXX)께 연락 부탁드립니다.
          </p>
        </section>
      </div>
    </div>
  );
}
