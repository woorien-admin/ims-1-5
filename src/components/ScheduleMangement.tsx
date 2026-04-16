import React, { useState } from 'react';
import { 
  Bell, 
  Search, 
  ChevronRight, 
  Clock, 
  Tag, 
  AlertCircle, 
  CheckCircle2,
  Info,
  Plus,
  X,
  Calendar,
  Link as LinkIcon,
  Image as ImageIcon,
  Filter,
  MoreVertical,
  Edit2,
  Trash2,
  Eye
} from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

const noticeTypes = [
  { label: '장애', color: 'bg-red-100 text-red-600 border-red-200' },
  { label: '업데이트', color: 'bg-blue-100 text-blue-600 border-blue-200' },
  { label: '홍보', color: 'bg-purple-100 text-purple-600 border-purple-200' },
  { label: '일반', color: 'bg-slate-100 text-slate-600 border-slate-200' },
];

const initialNotices = [
  { 
    id: 1, 
    type: '장애',
    title: '[긴급] IMS 2.0 서버 점검 안내 (2024.04.01)', 
    content: '안정적인 서비스 제공을 위해 서버 점검이 진행될 예정입니다. 점검 시간 동안 서비스 이용이 일시 중단되오니 양해 부탁드립니다.\n\n- 점검 일시: 2024년 4월 1일(월) 02:00 ~ 04:00 (2시간)\n- 대상 서비스: IMS 2.0 전체 서비스\n- 점검 내용: 데이터베이스 최적화 및 보안 업데이트',
    date: '2024.03.28', 
    period: { start: '2024-04-01', end: '2024-04-01' },
    link: 'https://notice.example.com/1',
    image: 'https://picsum.photos/seed/notice1/800/400',
    targetCharts: ['전체'],
    isImportant: true,
    author: '관리자'
  },
  { 
    id: 2, 
    type: '업데이트',
    title: '신규 기능 업데이트: 자동 배정 로직 고도화', 
    content: '상담원 자동 배정 로직이 새롭게 업데이트되었습니다. 이제 상담원의 숙련도와 제품군 전문성을 기반으로 더욱 정교한 배정이 가능해집니다.\n\n- 업데이트 일시: 2024년 3월 25일(월) 10:00\n- 주요 변경 사항: Skill-based 배정 로직 추가, Round Robin 방식 개선',
    date: '2024.03.24', 
    period: { start: '2024-03-25', end: '2024-04-25' },
    link: '',
    image: '',
    targetCharts: ['PMS365', 'eFriends'],
    isImportant: false,
    author: '이가영'
  },
  { 
    id: 3, 
    type: '홍보',
    title: '벳아너스 멤버십 등급 체계 변경 안내', 
    content: '벳아너스 멤버십 등급 체계가 다음과 같이 변경될 예정입니다. 상담 시 참고하시기 바랍니다.\n\n- 변경 일시: 2024년 4월 1일(월) 00:00\n- 변경 내용: Silver, Gold, Platinum 등급별 혜택 및 기준 조정',
    date: '2024.03.20', 
    period: { start: '2024-04-01', end: '2024-12-31' },
    link: 'https://vethonors.com/membership',
    image: 'https://picsum.photos/seed/notice3/800/400',
    targetCharts: ['전체'],
    isImportant: false,
    author: '박정훈'
  },
];

interface ReferenceNoticeProps {
  activeTab?: string;
}

export default function ReferenceNotice({ activeTab }: ReferenceNoticeProps) {
  const [notices, setNotices] = useState(initialNotices);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'view' | 'create' | 'edit'>('view');
  
  // Form State
  const [formData, setFormData] = useState({
    type: '일반',
    title: '',
    content: '',
    periodStart: '',
    periodEnd: '',
    link: '',
    image: '',
    targetCharts: [] as string[],
    isImportant: false,
    attachedFiles: [] as File[]
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validTypes = ['image/png', 'image/jpeg', 'image/jpg'];
    const maxSize = 10 * 1024 * 1024; // 10MB

    const validFiles = files.filter((file: File) => {
      if (!validTypes.includes(file.type)) {
        alert(`${file.name}은(는) 허용되지 않는 파일 형식입니다. (png, jpg, jpeg만 가능)`);
        return false;
      }
      if (file.size > maxSize) {
        alert(`${file.name}의 용량이 10MB를 초과합니다.`);
        return false;
      }
      return true;
    });

    if (formData.attachedFiles.length + validFiles.length > 3) {
      alert('이미지는 최대 3개까지만 업로드 가능합니다.');
      return;
    }

    setFormData(prev => ({
      ...prev,
      attachedFiles: [...prev.attachedFiles, ...validFiles]
    }));
  };

  const removeFile = (index: number) => {
    setFormData(prev => ({
      ...prev,
      attachedFiles: prev.attachedFiles.filter((_, i) => i !== index)
    }));
  };

  const filteredNotices = notices.filter(n => 
    n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    n.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenModal = (mode: 'view' | 'create' | 'edit', notice?: any) => {
    setModalMode(mode);
    if (notice) {
      setSelectedId(notice.id);
      setFormData({
        type: notice.type,
        title: notice.title,
        content: notice.content,
        periodStart: notice.period.start,
        periodEnd: notice.period.end,
        link: notice.link,
        image: notice.image,
        targetCharts: notice.targetCharts,
        isImportant: notice.isImportant,
        attachedFiles: []
      });
    } else {
      setSelectedId(null);
      setFormData({
        type: '일반',
        title: '',
        content: '',
        periodStart: '',
        periodEnd: '',
        link: '',
        image: '',
        targetCharts: [],
        isImportant: false,
        attachedFiles: []
      });
    }
    setIsModalOpen(true);
  };

  const selectedNotice = notices.find(n => n.id === selectedId);

  const isManagementMode = activeTab === 'notice-management' || activeTab === 'notice-register';

  return (
    <div className="flex flex-col h-full overflow-hidden bg-slate-50">
      {/* Header */}
      <div className="px-8 py-6 bg-white border-b border-slate-200 flex items-center justify-between shrink-0">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            {isManagementMode ? '공지사항 관리' : '공지사항'}
          </h2>
          <p className="text-sm text-slate-500 font-medium mt-1">
            {isManagementMode 
              ? '시스템 공지사항을 등록하고 노출 대상을 관리합니다.' 
              : 'IMS 2.0의 주요 소식과 업무 공지사항을 확인하세요.'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative w-64">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="공지사항 검색..." 
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          {isManagementMode && (
            <button 
              onClick={() => handleOpenModal('create')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20"
            >
              <Plus size={18} /> 신규 공지 작성
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-8">
        <div className="max-w-6xl mx-auto">
          {isManagementMode ? (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-200">
                    <th className="px-6 py-4 text-left text-[11px] font-black text-slate-400 uppercase tracking-widest">유형</th>
                    <th className="px-6 py-4 text-left text-[11px] font-black text-slate-400 uppercase tracking-widest">제목</th>
                    <th className="px-6 py-4 text-left text-[11px] font-black text-slate-400 uppercase tracking-widest">노출 대상</th>
                    <th className="px-6 py-4 text-left text-[11px] font-black text-slate-400 uppercase tracking-widest">작성일</th>
                    <th className="px-6 py-4 text-left text-[11px] font-black text-slate-400 uppercase tracking-widest">작성자</th>
                    <th className="px-6 py-4 text-right text-[11px] font-black text-slate-400 uppercase tracking-widest">관리</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredNotices.map((notice) => (
                    <tr 
                      key={notice.id} 
                      className="hover:bg-slate-50/50 transition-colors group cursor-pointer"
                      onClick={() => handleOpenModal('view', notice)}
                    >
                      <td className="px-6 py-4">
                        <span className={cn(
                          "px-2.5 py-1 rounded-lg text-[10px] font-bold border",
                          noticeTypes.find(t => t.label === notice.type)?.color || "bg-slate-100 text-slate-600 border-slate-200"
                        )}>
                          {notice.type}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {notice.isImportant && (
                            <span className="shrink-0 w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                          )}
                          <span className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                            {notice.title}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {notice.targetCharts.map(chart => (
                            <span key={chart} className="px-1.5 py-0.5 bg-slate-100 text-slate-500 text-[9px] font-bold rounded uppercase">
                              {chart}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-xs text-slate-500 font-medium">{notice.date}</td>
                      <td className="px-6 py-4 text-xs text-slate-600 font-bold">{notice.author}</td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={(e) => { e.stopPropagation(); handleOpenModal('edit', notice); }}
                            className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button 
                            onClick={(e) => e.stopPropagation()}
                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredNotices.map((notice) => (
                <motion.div
                  key={notice.id}
                  layoutId={`notice-${notice.id}`}
                  onClick={() => handleOpenModal('view', notice)}
                  className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className={cn(
                      "px-2.5 py-1 rounded-lg text-[10px] font-bold border",
                      noticeTypes.find(t => t.label === notice.type)?.color || "bg-slate-100 text-slate-600 border-slate-200"
                    )}>
                      {notice.type}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400">{notice.date}</span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {notice.title}
                  </h3>
                  <p className="text-sm text-slate-500 line-clamp-3 mb-6 leading-relaxed">
                    {notice.content}
                  </p>
                  <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center">
                        <Info size={12} className="text-slate-400" />
                      </div>
                      <span className="text-xs font-bold text-slate-600">{notice.author}</span>
                    </div>
                    <ChevronRight size={16} className="text-slate-300 group-hover:text-blue-500 transition-all group-hover:translate-x-1" />
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              {/* Modal Header */}
              <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-10 h-10 rounded-lg flex items-center justify-center",
                    modalMode === 'view' ? "bg-blue-50 text-blue-600" : "bg-amber-50 text-amber-600"
                  )}>
                    {modalMode === 'view' ? <Eye size={20} /> : <Edit2 size={20} />}
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-slate-900">
                      {modalMode === 'view' ? '공지사항 상세' : modalMode === 'create' ? '신규 공지 작성' : '공지사항 수정'}
                    </h3>
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">
                      {modalMode === 'view' ? 'Notice Detail' : 'Notice Management'}
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Modal Body */}
              <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                {modalMode === 'view' ? (
                  <div className="space-y-8">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <span className={cn(
                          "px-3 py-1 rounded-lg text-xs font-bold border",
                          noticeTypes.find(t => t.label === selectedNotice?.type)?.color || "bg-slate-100 text-slate-600 border-slate-200"
                        )}>
                          {selectedNotice?.type}
                        </span>
                        {selectedNotice?.isImportant && (
                          <span className="px-3 py-1 bg-red-50 text-red-600 border border-red-100 rounded-lg text-xs font-bold flex items-center gap-1.5">
                            <AlertCircle size={14} /> 중요 공지
                          </span>
                        )}
                      </div>
                      <h1 className="text-2xl font-black text-slate-900 leading-tight">
                        {selectedNotice?.title}
                      </h1>
                      <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-slate-400 font-bold">
                        <div className="flex items-center gap-2">
                          <Clock size={14} /> 작성일: {selectedNotice?.date}
                        </div>
                        <div className="flex items-center gap-2">
                          <Info size={14} /> 작성자: {selectedNotice?.author}
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar size={14} /> 노출기간: {selectedNotice?.period.start} ~ {selectedNotice?.period.end}
                        </div>
                      </div>
                    </div>

                    {selectedNotice?.image && (
                      <div className="rounded-2xl overflow-hidden border border-slate-200">
                        <img src={selectedNotice.image} alt="Notice" className="w-full h-auto object-cover" referrerPolicy="no-referrer" />
                      </div>
                    )}

                    <div className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap bg-slate-50 p-6 rounded-2xl border border-slate-100">
                      {selectedNotice?.content}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 bg-white border border-slate-200 rounded-2xl space-y-2">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                          <LinkIcon size={12} /> 관련 링크
                        </p>
                        {selectedNotice?.link ? (
                          <a href={selectedNotice.link} target="_blank" rel="noreferrer" className="text-xs font-bold text-blue-600 hover:underline break-all">
                            {selectedNotice.link}
                          </a>
                        ) : (
                          <p className="text-xs text-slate-400 italic">등록된 링크가 없습니다.</p>
                        )}
                      </div>
                      <div className="p-4 bg-white border border-slate-200 rounded-2xl space-y-2">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                          <Filter size={12} /> 노출 대상 차트
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {selectedNotice?.targetCharts.map(chart => (
                            <span key={chart} className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-bold rounded-lg border border-slate-200">
                              {chart}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">공지 유형</label>
                        <div className="flex flex-wrap gap-2">
                          {noticeTypes.map(type => (
                            <button
                              key={type.label}
                              onClick={() => setFormData({ ...formData, type: type.label })}
                              className={cn(
                                "px-4 py-2 rounded-lg text-xs font-bold border transition-all",
                                formData.type === type.label 
                                  ? "bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-600/20" 
                                  : "bg-white text-slate-500 border-slate-200 hover:border-slate-300"
                              )}
                            >
                              {type.label}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">중요 공지 설정</label>
                        <button
                          onClick={() => setFormData({ ...formData, isImportant: !formData.isImportant })}
                          className={cn(
                            "w-full px-4 py-2 rounded-lg text-xs font-bold border transition-all flex items-center justify-center gap-2",
                            formData.isImportant 
                              ? "bg-red-50 text-red-600 border-red-200" 
                              : "bg-white text-slate-400 border-slate-200"
                          )}
                        >
                          <AlertCircle size={16} /> 중요 공지로 지정
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">제목</label>
                      <input 
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        placeholder="공지사항 제목을 입력하세요"
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all font-bold"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">내용</label>
                      <textarea 
                        value={formData.content}
                        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                        placeholder="공지사항 상세 내용을 입력하세요"
                        className="w-full h-40 px-4 py-4 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all resize-none leading-relaxed"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">노출 시작일</label>
                        <div className="relative">
                          <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                          <input 
                            type="date"
                            value={formData.periodStart}
                            onChange={(e) => setFormData({ ...formData, periodStart: e.target.value })}
                            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">노출 종료일</label>
                        <div className="relative">
                          <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                          <input 
                            type="date"
                            value={formData.periodEnd}
                            onChange={(e) => setFormData({ ...formData, periodEnd: e.target.value })}
                            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">링크 등록</label>
                        <div className="relative">
                          <LinkIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                          <input 
                            type="url"
                            value={formData.link}
                            onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                            placeholder="https://..."
                            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                          />
                        </div>
                      </div>
                    <div className="space-y-2">
                      <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">이미지 첨부 (최대 3개, 각 10MB)</label>
                      <div className="space-y-3">
                        <div className="flex items-center gap-4">
                          <label className="cursor-pointer flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all">
                            <ImageIcon size={16} className="text-slate-400" />
                            파일 선택
                            <input 
                              type="file" 
                              multiple 
                              accept=".png,.jpg,.jpeg"
                              onChange={handleFileChange}
                              className="hidden" 
                            />
                          </label>
                          <span className="text-[10px] text-slate-400 font-medium">
                            * png, jpg, jpeg 형식만 지원 (최대 3개)
                          </span>
                        </div>
                        
                        {formData.attachedFiles.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {formData.attachedFiles.map((file, idx) => (
                              <div key={idx} className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 border border-blue-100 rounded-lg">
                                <span className="text-[10px] font-bold text-blue-700 truncate max-w-[120px]">{file.name}</span>
                                <button 
                                  onClick={() => removeFile(idx)}
                                  className="p-0.5 hover:bg-blue-100 rounded text-blue-400"
                                >
                                  <X size={12} />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">특정 차트 노출 설정</label>
                      <div className="flex flex-wrap gap-2">
                        {['전체', 'PMS365', 'eFriends', 'VET CRM', '기타'].map(chart => (
                          <button
                            key={chart}
                            onClick={() => {
                              const current = formData.targetCharts;
                              if (current.includes(chart)) {
                                setFormData({ ...formData, targetCharts: current.filter(c => c !== chart) });
                              } else {
                                setFormData({ ...formData, targetCharts: [...current, chart] });
                              }
                            }}
                            className={cn(
                              "px-3 py-1.5 rounded-lg text-xs font-bold border transition-all",
                              formData.targetCharts.includes(chart)
                                ? "bg-slate-900 text-white border-slate-900"
                                : "bg-white text-slate-500 border-slate-200 hover:border-slate-300"
                            )}
                          >
                            {chart}
                          </button>
                        ))}
                      </div>
                      <p className="text-[10px] text-slate-400 font-medium italic">* 선택하지 않으면 전체 노출됩니다.</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="px-8 py-6 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3 shrink-0">
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-lg text-sm font-bold hover:bg-slate-50 transition-all"
                >
                  {modalMode === 'view' ? '닫기' : '취소'}
                </button>
                {modalMode !== 'view' && (
                  <button 
                    onClick={() => setIsModalOpen(false)}
                    className="px-8 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20"
                  >
                    {modalMode === 'create' ? '공지사항 등록' : '수정 완료'}
                  </button>
                )}
                {modalMode === 'view' && isManagementMode && (
                  <button 
                    onClick={() => setModalMode('edit')}
                    className="px-8 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20"
                  >
                    수정하기
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

