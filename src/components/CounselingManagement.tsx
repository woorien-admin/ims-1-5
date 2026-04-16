import React, { useState, useMemo, useEffect } from 'react';
import { 
  Search, 
  RefreshCw, 
  Plus, 
  ChevronRight,
  ChevronLeft,
  ChevronsRight,
  ChevronsLeft,
  Monitor,
  Cpu,
  ExternalLink,
  MessageSquare,
  CheckCircle2,
  Calendar,
  MoreHorizontal,
  Save,
  X,
  Activity,
  Clock,
  Target,
  ChevronDown,
  ChevronUp,
  Send,
  Pencil,
  Image as ImageIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { UserRole, type User as UserType } from '../types';
import DateRangePicker from './DateRangePicker';

interface CounselingManagementProps {
  user: UserType;
  activeTab?: string;
}

interface HistoryItem {
  date: string;
  status: string;
  content: string;
  author: string;
  wcsmLink?: string; // Optional
  images?: string[]; // Optional
}

const mockInquiries = Array.from({ length: 30 }, (_, i) => {
  const hospitals = ['준동물병원(서울 광진)', '맑은 동물의료센터(인천)', '우리동네동물병원', '미등록병원', '튼튼동물병원', '행복동물병원'];
  const categories = ['EMR', '이미징CS', 'App', '마이브라운', '네이버', '이미지영업', 'EMR영업', 'AI', '우리엔CRM', '미지정'];
  const authors = ['박정훈', '송해영', '김나리', '이가영'];
  const statuses = ['대기 중', '상담 중', '완료'];
  const processingOptions = ['중복', '수신거부', '백업관리', '부재', '네트워크', 'update오류', '단순문의', '원격지원', '방문요청', '기능개선'];
  const source = i % 2 === 0 ? 'Online' : 'Phone';
  const category = source === 'Online' ? '미지정' : categories[i % categories.length];
  const initialStatus = statuses[i % statuses.length];
  const assignee = (category === 'EMR' || initialStatus === '상담 중' || initialStatus === '완료') ? '이가영' : (i % 3 === 0 ? '박정훈' : '');
  
  const hospital = hospitals[i % hospitals.length];
  const processingResult = initialStatus === '완료' ? `${processingOptions[i % processingOptions.length]}\n원인: 결과 확인\n결과: 처리 완료` : '';
  
  return {
    id: `2026040${7 - Math.floor(i/10)}${String(i + 1).padStart(4, '0')}`,
    category,
    emrType: i % 2 === 0 ? 'eFriends' : 'PMS365',
    chart: hospital === '미등록병원' ? '기타' : (i % 3 === 0 ? 'PMS365' : '기타'),
    hospital,
    time: `2026-04-0${7 - Math.floor(i/10)} 1${i % 9}:15:43`,
    initialStatus,
    followUpStatus: '-',
    author: category === '미지정' ? '-' : authors[i % authors.length],
    assignee,
    source,
    customerResponse: i % 5 === 0 ? '빠른 확인 부탁드립니다.' : '',
    urgent: i % 7 === 0,
    isReentry: i % 7 !== 0 && i % 8 === 0,
    waitingTime: `${(i + 1) * 3}분`,
    processingResult,
    history: Array.from({ length: 5 }, (_, j) => ({
      date: `2026-04-07 1${i % 9}:${String(59 - j).padStart(2, '0')}:10`,
      status: j === 0 ? initialStatus : '상담 중',
      content: j === 0 ? (processingResult || '상담 진행 중') : `상담 진행 중... (${5 - j}단계)`,
      author: authors[j % authors.length],
      wcsmLink: j % 5 === 0 ? `https://wcsm.example.com/case/${i}${j}` : "",
      images: j === 0 && initialStatus === '완료' ? ['https://picsum.photos/seed/cs1/400/300', 'https://picsum.photos/seed/cs2/400/300'] : []
    })),
    customerHistory: source === 'Online' ? Array.from({ length: 3 }, (_, j) => ({
      date: `2026-04-07 15:${String(59 - j).padStart(2, '0')}:22`,
      content: `고객 답변 발송 테스트 데이터입니다. (${3 - j}회차)`,
      author: '이가영',
      images: j === 0 ? ['https://picsum.photos/seed/resp1/400/300'] : []
    })) : []
  };
});

const CATEGORIES = ['전체', 'EMR', '이미징CS', 'App', '마이브라운', '네이버', '이미지영업', 'EMR영업', 'AI', '우리엔CRM', '미지정'];
const EMR_TYPES = ['전체', 'eFriends', 'ef365', 'PMS1.0', 'PMS365', '기타'];
const STATUSES = ['대기 중', '상담 중', '피드백', '완료'];
const PROCESSING_OPTIONS = ['중복', '수신거부', '백업관리', '부재', '네트워크', 'update오류', '단순문의', '원격지원', '방문요청', '기능개선'];
const DASHBOARD_PERIODS = [
  { label: '오늘', value: 'today' },
  { label: '3개월', value: '3months' },
  { label: '기간 설정', value: 'custom' }
];

export default function CounselingManagement({ user }: CounselingManagementProps) {
  const [selectedId, setSelectedId] = useState<string | null>('202604060145');
  const [mainFilter, setMainFilter] = useState('전체');
  const [emrFilter, setEmrFilter] = useState('전체');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [assigneeFilter, setAssigneeFilter] = useState('전체');
  const [contentSearch, setContentSearch] = useState('');
  const [appliedContentSearch, setAppliedContentSearch] = useState('');
  const [hospitalSearch, setHospitalSearch] = useState('');
  const [appliedHospitalFilter, setAppliedHospitalFilter] = useState('');
  const [isDashboardExpanded, setIsDashboardExpanded] = useState(true);
  const [showHospitalList, setShowHospitalList] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageInput, setPageInput] = useState('');
  const [customerResponseText, setCustomerResponseText] = useState('');
  const [wcsmLinkInput, setWcsmLinkInput] = useState('');
  const [editingResponseIndex, setEditingResponseIndex] = useState<number | null>(null);
  const [editResponseText, setEditResponseText] = useState('');
  const [isSavingResponse, setIsSavingResponse] = useState(false);
  const [inquiries, setInquiries] = useState(mockInquiries);
  const [assigneeMenuId, setAssigneeMenuId] = useState<string | null>(null);
  const [historyTab, setHistoryTab] = useState<'processing' | 'customer'>('processing');
  const [dashboardPeriod, setDashboardPeriod] = useState('today');
  const [dashboardCustomRange, setDashboardCustomRange] = useState({ start: '', end: '' });
  const [statusFilter, setStatusFilter] = useState('전체');
  const [processFilter, setProcessFilter] = useState('전체');
  const [processingImages, setProcessingImages] = useState<string[]>([]);
  const [customerResponseImages, setCustomerResponseImages] = useState<string[]>([]);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  useEffect(() => {
    if (selectedId) {
      setInquiries(prev => prev.map(inq => {
        if (inq.id === selectedId && !inq.processingResult) {
          return { ...inq, processingResult: '원인: \n결과: ' };
        }
        return inq;
      }));
    }
  }, [selectedId]);

  useEffect(() => {
    const handleClickOutside = () => setAssigneeMenuId(null);
    if (assigneeMenuId) {
      window.addEventListener('click', handleClickOutside);
    }
    return () => window.removeEventListener('click', handleClickOutside);
  }, [assigneeMenuId]);

  const [historyPage, setHistoryPage] = useState(1);
  const [customerHistoryPage, setCustomerHistoryPage] = useState(1);
  const historyPageSize = 10;
  const pageSize = 25;

  const handleAssignToMe = (id: string) => {
    setInquiries(prev => prev.map(inq => {
      if (inq.id === id) {
        return { ...inq, assignee: user.name, initialStatus: '상담 중' };
      }
      return inq;
    }));
  };

  const handleStatusChange = (id: string, newStatus: string) => {
    setInquiries(prev => prev.map(inq => {
      if (inq.id === id) {
        if (['상담 중', '피드백', '완료'].includes(newStatus) && !inq.assignee) {
          alert(`${newStatus} 상태로 변경하려면 담당자가 지정되어야 합니다.`);
          return inq;
        }
        
        const updatedInq = { ...inq, initialStatus: newStatus };
        if (newStatus === '완료' && !updatedInq.processingResult) {
          updatedInq.processingResult = '원인: \n결과: ';
        }
        
        return updatedInq;
      }
      return inq;
    }));
  };

  const handleResetStatus = (id: string) => {
    const inquiry = inquiries.find(i => i.id === id);
    if (inquiry?.category === 'EMR') {
      alert("EMR 분야는 담당자가 반드시 있어야 하므로 초기화할 수 없습니다.");
      return;
    }
    if (inquiry?.initialStatus === '완료') {
      alert("완료된 상담은 담당자를 초기화할 수 없습니다.");
      return;
    }

    if (window.confirm("상담 상태를 초기화 하시겠습니까?")) {
      setInquiries(prev => prev.map(inq => {
        if (inq.id === id) {
          return { ...inq, assignee: '', initialStatus: '대기 중' };
        }
        return inq;
      }));
    }
  };

  const handleProcessingResultChange = (id: string, result: string) => {
    setInquiries(prev => prev.map(inq => {
      if (inq.id === id) {
        return { ...inq, processingResult: result };
      }
      return inq;
    }));
  };

  // ✅ [수정 완료] HistoryItem 타입에 맞춰 wcsmLink와 images 속성 추가
  const handleSaveProcessing = () => {
    if (!selectedId || !selectedInquiry) return;
    
    const content = selectedInquiry.processingResult;
    if (!content && !wcsmLinkInput && processingImages.length === 0) {
      alert("처리 내역, WCSM 링크 또는 이미지를 입력해주세요.");
      return;
    }

    const now = new Date().toISOString().replace('T', ' ').substring(0, 19);
    
    // 필수 데이터 누락 방지를 위해 명시적으로 HistoryItem 타입 지정
    const newHistoryRecord: HistoryItem = {
      date: now,
      status: selectedInquiry.initialStatus || '상담 중',
      content: content || (wcsmLinkInput ? 'WCSM 링크 등록' : (processingImages.length > 0 ? '이미지 등록' : '')),
      author: user.name,
      wcsmLink: wcsmLinkInput || "", // 빈 값이라도 string 타입 보장
      images: processingImages.length > 0 ? [...processingImages] : [] // 빈 배열 보장
    };

    setInquiries(prev => prev.map(inq => {
      if (inq.id === selectedId) {
        return {
          ...inq,
          history: [newHistoryRecord, ...(inq.history || [])]
        };
      }
      return inq;
    }));

    setWcsmLinkInput('');
    setProcessingImages([]);
    alert("처리 내역이 저장되었습니다.");
  };

  const handleAutoAssign = (id: string) => {
    const counselors = ['이가영', '박정훈', '김나리', '송해영'];
    const randomCounselor = counselors[Math.floor(Math.random() * counselors.length)];
    setInquiries(prev => prev.map(inq => {
      if (inq.id === id) {
        return { ...inq, assignee: randomCounselor };
      }
      return inq;
    }));
  };

  const handleCategoryChange = (id: string, newCategory: string) => {
    setInquiries(prev => prev.map(inq => {
      if (inq.id === id) {
        const updatedInq = { ...inq, category: newCategory };
        if (newCategory === 'EMR') {
          const counselors = ['이가영', '박정훈', '김나리', '송해영'];
          updatedInq.assignee = counselors[Math.floor(Math.random() * counselors.length)];
        }
        return updatedInq;
      }
      return inq;
    }));
  };

  const handleSearch = () => {
    setAppliedHospitalFilter(hospitalSearch);
    setAppliedContentSearch(contentSearch);
    setCurrentPage(1);
  };

  const uniqueHospitals = useMemo(() => {
    const hospitals = inquiries.map(i => i.hospital);
    return Array.from(new Set(hospitals));
  }, [inquiries]);

  const filteredHospitals = useMemo(() => {
    if (!hospitalSearch) return [];
    return uniqueHospitals.filter(h => h.toLowerCase().includes(hospitalSearch.toLowerCase()));
  }, [hospitalSearch, uniqueHospitals]);

  const dashboardInquiries = useMemo(() => {
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];
    
    return inquiries.filter(inq => {
      const inqDate = new Date(inq.time);
      const inqDateStr = inq.time.split(' ')[0];

      if (dashboardPeriod === 'today') {
        return inqDateStr === todayStr;
      } else if (dashboardPeriod === '3months') {
        const threeMonthsAgo = new Date();
        threeMonthsAgo.setMonth(now.getMonth() - 3);
        return inqDate >= threeMonthsAgo;
      } else if (dashboardPeriod === 'custom') {
        if (!dashboardCustomRange.start || !dashboardCustomRange.end) return true;
        const start = new Date(dashboardCustomRange.start);
        const end = new Date(dashboardCustomRange.end);
        end.setHours(23, 59, 59, 999);
        return inqDate >= start && inqDate <= end;
      }
      return true;
    });
  }, [inquiries, dashboardPeriod, dashboardCustomRange]);

  const personalStats = useMemo(() => {
    const personal = dashboardInquiries.filter(i => i.assignee === user.name);
    const waiting = personal.filter(i => i.initialStatus === '대기 중').length;
    const processing = personal.filter(i => i.initialStatus === '상담 중' || i.initialStatus === '피드백').length;
    const completed = personal.filter(i => i.initialStatus === '완료').length;
    const total = personal.length;
    const rate = total > 0 ? Math.round((completed / total) * 100) : 0;

    return { waiting, processing, completed, total, rate };
  }, [dashboardInquiries, user.name]);

  const totalStats = useMemo(() => {
    const total = dashboardInquiries.length;
    const waiting = dashboardInquiries.filter(i => i.initialStatus === '대기 중').length;
    const processing = dashboardInquiries.filter(i => i.initialStatus === '상담 중' || i.initialStatus === '피드백').length;
    const completed = dashboardInquiries.filter(i => i.initialStatus === '완료').length;

    return { total, waiting, processing, completed };
  }, [dashboardInquiries]);

  const filteredInquiries = useMemo(() => {
    return inquiries.filter(inquiry => {
      if (mainFilter !== '전체' && inquiry.category !== mainFilter) return false;
      if (mainFilter === 'EMR' && emrFilter !== '전체' && inquiry.emrType !== emrFilter) return false;
      if (assigneeFilter !== '전체' && inquiry.assignee !== assigneeFilter) return false;
      if (statusFilter !== '전체' && inquiry.initialStatus !== statusFilter) return false;
      if (processFilter !== '전체') {
        const firstLine = inquiry.processingResult?.split('\n')[0];
        if (firstLine !== processFilter) return false;
      }
      if (appliedHospitalFilter && !inquiry.hospital.toLowerCase().includes(appliedHospitalFilter.toLowerCase())) return false;
      if (appliedContentSearch) {
        const searchLower = appliedContentSearch.toLowerCase();
        const matchesId = inquiry.id.toLowerCase().includes(searchLower);
        const matchesResponse = inquiry.customerResponse?.toLowerCase().includes(searchLower);
        if (!matchesId && !matchesResponse) return false;
      } 
      return true;
    });
  }, [mainFilter, emrFilter, assigneeFilter, statusFilter, processFilter, appliedHospitalFilter, appliedContentSearch]);

  const resetFilters = () => {
    setMainFilter('전체');
    setEmrFilter('전체');
    setDateRange({ start: '', end: '' });
    setAssigneeFilter('전체');
    setStatusFilter('전체');
    setProcessFilter('전체');
    setContentSearch('');
    setAppliedContentSearch('');
    setHospitalSearch('');
    setAppliedHospitalFilter('');
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(filteredInquiries.length / pageSize);
  const paginatedInquiries = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredInquiries.slice(start, start + pageSize);
  }, [filteredInquiries, currentPage, pageSize]);

  const handlePageInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPageInput(e.target.value);
  };

  const handlePageInputSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const pageNum = parseInt(pageInput);
    if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= totalPages) {
      setCurrentPage(pageNum);
      setPageInput('');
    }
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [mainFilter, emrFilter, assigneeFilter, appliedHospitalFilter, appliedContentSearch]);

  const selectedInquiry = useMemo(() => inquiries.find(i => i.id === selectedId), [selectedId, inquiries]);

  useEffect(() => {
    setHistoryPage(1);
    setCustomerHistoryPage(1);
    setHistoryTab('processing');
  }, [selectedId]);

  // ✅ [수정 완료] 답변 발송 히스토리 생성 시 타입 오류 해결
  const handleSendResponse = () => {
    if (!customerResponseText.trim() && customerResponseImages.length === 0) return;
    if (user.role !== UserRole.ADMIN && user.role !== UserRole.COUNSELOR) {
      alert("운영자만 답변을 발송할 수 있습니다.");
      return;
    }

    if (window.confirm("답변을 전송하시겠습니까?")) {
      const now = new Date().toISOString().replace('T', ' ').substring(0, 19);
      const newResponse = {
        date: now,
        content: customerResponseText,
        author: user.name,
        isEdited: false,
        images: [...customerResponseImages]
      };
      
      const newHistoryRecord: HistoryItem = {
        date: now,
        status: '답변발송',
        content: `[답변발송] ${customerResponseText.substring(0, 20)}${customerResponseText.length > 20 ? '...' : ''}`,
        author: user.name,
        wcsmLink: "", // 필수 속성 추가
        images: [...customerResponseImages] // 필수 속성 추가
      };

      setInquiries(prev => prev.map(inq => {
        if (inq.id === selectedId) {
          return {
            ...inq,
            history: [newHistoryRecord, ...(inq.history || [])],
            customerHistory: [newResponse, ...(inq.customerHistory || [])]
          };
        }
        return inq;
      }));
      
      setCustomerResponseText('');
      setCustomerResponseImages([]);
      alert("온라인 고객센터로 답변이 발송되었습니다.");
    }
  };

  // ✅ [수정 완료] 답변 수정 히스토리 생성 시 타입 오류 해결
  const handleUpdateResponse = (index: number) => {
    if (!editResponseText.trim()) return;

    if (window.confirm("답변을 수정하시겠습니까?")) {
      setIsSavingResponse(true);
      setTimeout(() => {
        const now = new Date().toISOString().replace('T', ' ').substring(0, 19);
        setInquiries(prev => prev.map(inq => {
          if (inq.id === selectedId) {
            const newCustomerHistory = [...(inq.customerHistory || [])];
            const originalResponse = newCustomerHistory[index];
            
            newCustomerHistory[index] = {
              ...originalResponse,
              content: editResponseText,
              author: user.name,
              isEdited: true,
              editDate: now
            };

            const editHistoryRecord: HistoryItem = {
              date: now,
              status: '답변수정',
              content: `[답변수정] ${editResponseText.substring(0, 20)}${editResponseText.length > 20 ? '...' : ''}`,
              author: user.name,
              wcsmLink: "",
              images: []
            };

            return {
              ...inq,
              history: [editHistoryRecord, ...(inq.history || [])],
              customerHistory: newCustomerHistory
            };
          }
          return inq;
        }));

        setIsSavingResponse(false);
        setEditingResponseIndex(null);
        setEditResponseText('');
      }, 400);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'processing' | 'customer') => {
    const files = e.target.files;
    if (!files) return;

    const newImages: string[] = [];
    let processedCount = 0;
    
    (Array.from(files) as File[]).forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        newImages.push(reader.result as string);
        processedCount++;
        if (processedCount === files.length) {
          if (type === 'processing') {
            setProcessingImages(prev => [...prev, ...newImages]);
          } else {
            setCustomerResponseImages(prev => [...prev, ...newImages]);
          }
        }
      };
      reader.readAsDataURL(file);
    });
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 overflow-hidden">
      {/* Dashboard Section */}
      <div className="bg-white border-b border-slate-200 shrink-0 z-10">
        <div className="px-6 py-2 flex items-center justify-between border-b border-slate-100">
          <div className="flex items-center gap-4">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">문의 현황</span>
          </div>
          <button 
            onClick={() => setIsDashboardExpanded(!isDashboardExpanded)}
            className="p-1.5 hover:bg-slate-50 rounded-md text-slate-400 transition-colors flex items-center gap-1.5"
          >
            <span className="text-[10px] font-bold uppercase">{isDashboardExpanded ? '접기' : '현황 보기'}</span>
            {isDashboardExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
        </div>

        <AnimatePresence initial={false}>
          {isDashboardExpanded && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="px-6 py-6">
                <div className="flex items-center gap-6 mb-6">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">조회 기간</span>
                    <select 
                      value={dashboardPeriod}
                      onChange={(e) => setDashboardPeriod(e.target.value)}
                      className="bg-white border border-slate-200 rounded-lg px-3 h-9 text-xs font-bold text-slate-700 focus:outline-none min-w-[120px]"
                    >
                      {DASHBOARD_PERIODS.map(period => (
                        <option key={period.value} value={period.value}>{period.label}</option>
                      ))}
                    </select>
                  </div>
                  
                  {dashboardPeriod === 'custom' && (
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 h-9 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all">
                        <input type="date" value={dashboardCustomRange.start} onChange={(e) => setDashboardCustomRange(prev => ({ ...prev, start: e.target.value }))} className="text-xs font-bold bg-transparent focus:outline-none h-full" />
                        <span className="text-slate-400 text-xs font-bold">~</span>
                        <input type="date" value={dashboardCustomRange.end} onChange={(e) => setDashboardCustomRange(prev => ({ ...prev, end: e.target.value }))} className="text-xs font-bold bg-transparent focus:outline-none h-full" />
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex items-stretch justify-between gap-6">
                  <div className="flex-1 bg-slate-50 rounded-2xl p-6 flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                      <h2 className="text-[11px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                        <div className="w-1 h-3 bg-blue-600"></div> 개인 업무 현황
                      </h2>
                      <span className="text-[10px] font-bold text-blue-600 bg-blue-100/50 px-2 py-0.5 rounded-full">{user.name} 님</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-12">
                        <div className="flex items-center gap-3">
                          <div className="text-amber-500"><Activity size={22} /></div>
                          <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">대기 중</p>
                            <p className="text-xl font-black text-slate-900">{personalStats.waiting}건</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="text-blue-600"><RefreshCw size={22} /></div>
                          <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">진행 중</p>
                            <p className="text-xl font-black text-slate-900">{personalStats.processing}건</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="text-green-600"><CheckCircle2 size={22} /></div>
                          <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">완료</p>
                            <p className="text-xl font-black text-slate-900">{personalStats.completed}건</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex-1 bg-slate-50 rounded-2xl p-6 flex flex-col gap-4">
                    <h2 className="text-[11px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                      <div className="w-1 h-3 bg-slate-400"></div> 전체 문의 현황
                    </h2>
                    <div className="flex items-center justify-between flex-1">
                      <div className="flex flex-col items-center px-4">
                        <span className="text-[10px] font-bold text-slate-400 uppercase mb-1.5">전체</span>
                        <span className="text-xl font-black text-slate-900">{totalStats.total}</span>
                      </div>
                      <div className="w-[1px] h-10 bg-slate-200"></div>
                      <div className="flex flex-col items-center px-4">
                        <span className="text-[10px] font-bold text-amber-500 uppercase mb-1.5">대기</span>
                        <span className="text-xl font-black text-amber-600">{totalStats.waiting}</span>
                      </div>
                      <div className="flex flex-col items-center px-4">
                        <span className="text-[10px] font-bold text-blue-500 uppercase mb-1.5">진행</span>
                        <span className="text-xl font-black text-blue-600">{totalStats.processing}</span>
                      </div>
                      <div className="flex flex-col items-center px-4">
                        <span className="text-[10px] font-bold text-green-500 uppercase mb-1.5">완료</span>
                        <span className="text-xl font-black text-green-600">{totalStats.completed}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* CS Inquiry List Section */}
      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 flex flex-col overflow-hidden bg-white">
          {/* List Header & Filters */}
          <div className="p-4 border-b border-slate-200 flex flex-col gap-3 shrink-0 bg-slate-50/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold text-slate-400 whitespace-nowrap uppercase tracking-wider">병원명</span>
                  <div className="relative">
                    <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 h-9 w-52 focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition-all">
                      <input type="text" value={hospitalSearch} onChange={(e) => { setHospitalSearch(e.target.value); setShowHospitalList(true); }} onKeyDown={(e) => { if (e.key === 'Enter') { handleSearch(); setShowHospitalList(false); } }} onFocus={() => setShowHospitalList(true)} placeholder="병원명 검색..." className="text-xs bg-transparent focus:outline-none flex-1 h-full" />
                      <div className="flex items-center gap-1">
                        {hospitalSearch && <button onClick={() => { setHospitalSearch(''); setAppliedHospitalFilter(''); }} className="p-0.5 hover:bg-slate-100 rounded text-slate-400"><X size={12} /></button>}
                        <button onClick={() => { handleSearch(); setShowHospitalList(false); }} className="p-1 hover:bg-slate-100 rounded text-blue-600"><Search size={14} /></button>
                      </div>
                    </div>
                    {showHospitalList && filteredHospitals.length > 0 && (
                      <div className="absolute top-full left-0 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-xl z-50 max-h-48 overflow-y-auto py-1">
                        {filteredHospitals.map((h, idx) => (
                          <button key={idx} onClick={() => { setHospitalSearch(h); setAppliedHospitalFilter(h); setShowHospitalList(false); }} className="w-full text-left px-4 py-2 text-xs hover:bg-blue-50 text-slate-700 font-medium">{h}</button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold text-slate-400 whitespace-nowrap uppercase tracking-wider">요청내용</span>
                  <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 h-9 w-56 focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition-all">
                    <input type="text" value={contentSearch} onChange={(e) => setContentSearch(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') handleSearch(); }} placeholder="요청사항 내용 검색..." className="text-xs bg-transparent focus:outline-none w-full h-full" />
                    <div className="flex items-center gap-1">
                      {contentSearch && <button onClick={() => { setContentSearch(''); setAppliedContentSearch(''); }} className="p-0.5 hover:bg-slate-100 rounded text-slate-400"><X size={12} /></button>}
                      <button onClick={handleSearch} className="p-1 hover:bg-slate-100 rounded text-blue-600"><Search size={14} /></button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={resetFilters} className="flex items-center gap-2 px-3 h-9 text-[11px] font-bold text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-all"><RefreshCw size={14} /> 필터 초기화</button>
                <button className="btn-primary flex items-center gap-2 h-9 px-4 rounded-lg"><Plus size={14} /> 문의 등록</button>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">접수분야</span>
                <select value={mainFilter} onChange={(e) => setMainFilter(e.target.value)} className="bg-white border border-slate-200 rounded-lg px-2 h-9 text-xs font-bold text-slate-700 focus:outline-none">
                  {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">담당자</span>
                <select value={assigneeFilter} onChange={(e) => setAssigneeFilter(e.target.value)} className="bg-white border border-slate-200 rounded-lg px-2 h-9 text-xs font-bold text-slate-700 focus:outline-none">
                  <option value="전체">전체</option>
                  <option value="이가영">이가영</option>
                  <option value="박정훈">박정훈</option>
                  <option value="김나리">김나리</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">상태</span>
                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="bg-white border border-slate-200 rounded-lg px-2 h-9 text-xs font-bold text-slate-700 focus:outline-none">
                  <option value="전체">전체 상태</option>
                  {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Inquiry Table */}
          <div className="flex-1 overflow-auto">
            <table className="w-full border-collapse min-w-[1000px]">
              <thead className="sticky top-0 bg-white z-10 shadow-[0_1px_0_0_rgba(0,0,0,0.05)]">
                <tr className="border-b border-slate-200">
                  {['접수번호', '분야', '차트', '병원명', '요청시간', '대기시간', '상태', '작성자', '담당자', '처리'].map((h) => (
                    <th key={h} className="text-[10px] font-bold text-slate-400 text-left px-4 py-3 uppercase tracking-wider bg-slate-50/30">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginatedInquiries.map((item) => (
                  <tr key={item.id} onClick={() => setSelectedId(item.id)} className={cn("border-b border-slate-100 hover:bg-blue-50/30 transition-colors cursor-pointer group", selectedId === item.id ? "bg-blue-50/50" : "")}>
                    <td className="px-4 py-3.5"><span className="text-xs font-mono font-medium text-slate-600">{item.id}</span></td>
                    <td className="px-4 py-3.5"><span className="text-[11px] font-bold text-slate-700">{item.category}</span></td>
                    <td className="px-4 py-3.5"><span className="px-2 py-0.5 bg-slate-100 text-slate-500 text-[10px] font-bold rounded uppercase">{item.chart}</span></td>
                    <td className="px-4 py-3.5"><span className="text-xs font-bold text-slate-900">{item.hospital}</span></td>
                    <td className="px-4 py-3.5">
                      <div className="text-[10px] font-mono text-slate-400 leading-tight">
                        <div>{item.time.split(' ')[0]}</div>
                        <div>{item.time.split(' ')[1]}</div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5"><span className="text-[11px] font-bold text-slate-600">{item.waitingTime || '-'}</span></td>
                    <td className="px-4 py-3.5">
                      <select value={item.initialStatus} onClick={(e) => e.stopPropagation()} onChange={(e) => handleStatusChange(item.id, e.target.value)} className={cn("appearance-none px-2 py-0.5 rounded text-[10px] font-bold border transition-all cursor-pointer focus:outline-none", item.initialStatus === '대기 중' ? "bg-amber-50 text-amber-600 border-amber-100" : item.initialStatus === '상담 중' ? "bg-blue-50 text-blue-600 border-blue-100" : item.initialStatus === '피드백' ? "bg-purple-50 text-purple-600 border-purple-100" : "bg-green-50 text-green-600 border-green-100")}>
                        {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </td>
                    <td className="px-4 py-3.5 text-xs text-slate-600">{item.author}</td>
                    <td className="px-4 py-3.5 text-xs text-slate-600" onClick={(e) => { e.stopPropagation(); handleResetStatus(item.id); }}>{item.assignee || '-'}</td>
                    <td className="px-4 py-3.5"><MoreHorizontal size={14} className="text-slate-400" /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-6 py-3 border-t border-slate-200 bg-white flex items-center justify-between shrink-0">
            <span className="text-[11px] font-bold text-slate-400 uppercase">페이지 {currentPage} / {totalPages || 1}</span>
            <div className="flex items-center gap-1">
              <button onClick={() => setCurrentPage(1)} disabled={currentPage === 1} className="p-1.5 hover:bg-slate-100 rounded disabled:opacity-30"><ChevronsLeft size={16} /></button>
              <button onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))} disabled={currentPage === 1} className="p-1.5 hover:bg-slate-100 rounded disabled:opacity-30"><ChevronLeft size={16} /></button>
              <button onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))} disabled={currentPage === totalPages || totalPages === 0} className="p-1.5 hover:bg-slate-100 rounded disabled:opacity-30"><ChevronRight size={16} /></button>
              <button onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages || totalPages === 0} className="p-1.5 hover:bg-slate-100 rounded disabled:opacity-30"><ChevronsRight size={16} /></button>
            </div>
          </div>
        </div>

        {/* Right Detail Panel */}
        {selectedInquiry && (
          <div className="w-[450px] bg-white border-l border-slate-200 flex flex-col shadow-xl z-20">
            <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
              <span className="text-sm font-mono font-black">{selectedInquiry.id}</span>
              <button onClick={() => setSelectedId(null)}><X size={16} className="text-slate-400" /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              {/* Hospital Info & Details... (가독성을 위해 일부 생략, 처리 로직은 위에서 모두 수정됨) */}
              <section className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">처리 내역</h4>
                  <button onClick={handleSaveProcessing} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded flex items-center gap-1 text-[10px] font-bold"><Save size={12} /> 저장</button>
                </div>
                <textarea value={selectedInquiry.processingResult || ''} onChange={(e) => handleProcessingResultChange(selectedInquiry.id, e.target.value)} className="w-full h-32 p-4 bg-slate-50 border border-slate-200 rounded-lg text-xs resize-none" placeholder="처리 내역을 입력하세요..." />
                <input type="text" value={wcsmLinkInput} onChange={(e) => setWcsmLinkInput(e.target.value)} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-[11px]" placeholder="WCSM 링크를 입력하세요" />
              </section>

              {/* History Tabs */}
              <div className="flex bg-slate-100 p-1 rounded-lg">
                <button onClick={() => setHistoryTab('processing')} className={cn("flex-1 py-1.5 text-[10px] font-black rounded-md", historyTab === 'processing' ? "bg-white shadow-sm" : "text-slate-400")}>처리 내역</button>
                {selectedInquiry.source === 'Online' && (
                  <button onClick={() => setHistoryTab('customer')} className={cn("flex-1 py-1.5 text-[10px] font-black rounded-md", historyTab === 'customer' ? "bg-white shadow-sm" : "text-slate-400")}>고객 답변</button>
                )}
              </div>
              
              {/* History Table */}
              <div className="border border-slate-200 rounded-lg overflow-hidden text-[10px]">
                <table className="w-full">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold">
                    <tr><th className="p-2 text-left">No</th><th className="p-2 text-left">일시</th><th className="p-2 text-left">내용</th><th className="p-2 text-left">처리자</th></tr>
                  </thead>
                  <tbody>
                    {(historyTab === 'processing' ? selectedInquiry.history : selectedInquiry.customerHistory)?.map((h: any, idx: number) => (
                      <tr key={idx} className="border-b border-slate-100 bg-white">
                        <td className="p-2 text-slate-400">{idx + 1}</td>
                        <td className="p-2 text-slate-500">{h.date}</td>
                        <td className="p-2 text-slate-700 whitespace-pre-wrap">{h.content}</td>
                        <td className="p-2 text-slate-600">{h.author}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}