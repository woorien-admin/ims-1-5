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
import { CustomerHistoryItem, HistoryItem, UserRole, User as UserType } from '../types';
import DateRangePicker from './DateRangePicker';

interface CounselingManagementProps {
  user: UserType;
  activeTab?: string;
}

const mockInquiries = [
  {
    id: '202604160001',
    category: '미지정',
    emrType: 'PMS365',
    chart: '기타',
    hospital: '준동물병원(서울 광진)',
    time: '2026-04-16 10:15:43',
    initialStatus: '대기 중',
    followUpStatus: '-',
    author: '-',
    assignee: '',
    source: 'Online',
    customerResponse: '',
    urgent: false,
    isReentry: false,
    waitingTime: '5분',
    processingResult: '',
    history: [],
    customerHistory: []
  },
  {
    id: '202604160002',
    category: 'EMR',
    emrType: 'eFriends',
    chart: 'PMS365',
    hospital: '맑은 동물의료센터(인천)',
    time: '2026-04-16 11:20:10',
    initialStatus: '상담 중',
    followUpStatus: '-',
    author: '박정훈',
    assignee: '이가영',
    source: 'Phone',
    customerResponse: '',
    urgent: true,
    isReentry: false,
    waitingTime: '2분',
    processingResult: '',
    history: [
      {
        date: '2026-04-16 11:25:00',
        status: '상담 중',
        content: '상담 시작함',
        author: '이가영',
        images: []
      }
    ],
    customerHistory: []
  },
  {
    id: '202604160003',
    category: '이미징CS',
    emrType: 'PMS365',
    chart: '기타',
    hospital: '우리동네동물병원',
    time: '2026-04-16 12:05:22',
    initialStatus: '완료',
    followUpStatus: '-',
    author: '김나리',
    assignee: '박정훈',
    source: 'Online',
    customerResponse: '',
    urgent: false,
    isReentry: true,
    waitingTime: '10분',
    processingResult: '단순문의\n원인: 사용법 미숙\n결과: 설명 완료',
    history: [
      {
        date: '2026-04-16 12:30:00',
        status: '완료',
        content: '단순문의\n원인: 사용법 미숙\n결과: 설명 완료',
        author: '박정훈',
        images: ['https://picsum.photos/seed/test1/400/300']
      }
    ],
    customerHistory: [
      {
        date: '2026-04-16 12:25:00',
        content: '문의하신 내용에 대해 답변 드립니다.',
        author: '박정훈',
        images: []
      }
    ]
  },
  {
    id: '202604160004',
    category: 'App',
    emrType: 'PMS365',
    chart: '기타',
    hospital: '튼튼동물병원',
    time: '2026-04-16 13:45:15',
    initialStatus: '대기 중',
    followUpStatus: '-',
    author: '이가영',
    assignee: '',
    source: 'Phone',
    customerResponse: '',
    urgent: false,
    isReentry: false,
    waitingTime: '1분',
    processingResult: '',
    history: [],
    customerHistory: []
  },
  {
    id: '202604160005',
    category: '네이버',
    emrType: 'PMS365',
    chart: '기타',
    hospital: '행복동물병원',
    time: '2026-04-16 14:10:30',
    initialStatus: '상담 중',
    followUpStatus: '-',
    author: '송해영',
    assignee: '김나리',
    source: 'Online',
    customerResponse: '예약 확인 부탁드려요.',
    urgent: false,
    isReentry: false,
    waitingTime: '15분',
    processingResult: '',
    history: [
      {
        date: '2026-04-16 14:15:00',
        status: '상담 중',
        content: '예약 내역 확인 중',
        author: '김나리',
        images: []
      }
    ],
    customerHistory: []
  }
];

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
  const [completionModal, setCompletionModal] = useState<{ isOpen: boolean; id: string | null }>({ isOpen: false, id: null });
  const [selectedProcessingType, setSelectedProcessingType] = useState('');

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

  // Close assignee menu when clicking outside
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
        return { ...inq, assignee: user.name };
      }
      return inq;
    }));
  };

  // handleStatusChange 함수 수정
  const handleStatusChange = (id: string, newStatus: string) => {
  const inquiry = inquiries.find(i => i.id === id);
  
  if (!inquiry) return;
  
  // 담당자가 있고 현재 사용자가 아닌 경우에만 확인 알럿 표시
  if (inquiry.assignee && inquiry.assignee !== user.name) {
    const message = `상태를 '${newStatus}'로 변경하고 본인을 담당자로 배정하시겠습니까?`;
    
    if (!window.confirm(message)) {
      return;
    }
  }
  
  console.log('상태 변경:', id, newStatus);
  
  setInquiries(prev => prev.map(inq => {
    if (inq.id === id) {
      // 항상 현재 사용자를 담당자로 배정
      const updatedAssignee = user.name;

      if (newStatus === '완료') {
        setCompletionModal({ isOpen: true, id });
        return { ...inq, initialStatus: newStatus, assignee: updatedAssignee };
      }
      
      const updatedInq = { ...inq, initialStatus: newStatus, assignee: updatedAssignee };
      
      if (newStatus === '완료' && !updatedInq.processingResult) {
        updatedInq.processingResult = '원인: \n결과: ';
      }
      
      console.log('업데이트된 항목:', updatedInq);
      return updatedInq;
    }
    return inq;
  }));
  
};

  const handleConfirmCompletion = () => {
    if (!completionModal.id || !selectedProcessingType) {
      alert("처리 유형을 선택해주세요.");
      return;
    }

    setInquiries(prev => prev.map(inq => {
      if (inq.id === completionModal.id) {
        return { 
          ...inq, 
          initialStatus: '완료', 
          processingResult: `${selectedProcessingType}\n원인: \n결과: ` 
        };
      }
      return inq;
    }));

    setCompletionModal({ isOpen: false, id: null });
    setSelectedProcessingType('');
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

  const handleSaveProcessing = () => {
    if (!selectedId || !selectedInquiry) return;
    
    const content = selectedInquiry.processingResult;
    if (!content && !wcsmLinkInput && processingImages.length === 0) {
      alert("처리 내역, WCSM 링크 또는 이미지를 입력해주세요.");
      return;
    }

    const now = new Date().toISOString().replace('T', ' ').substring(0, 19);
    const newHistoryRecord = {
      date: now,
      status: selectedInquiry.initialStatus || '상담 중',
      content: content || (wcsmLinkInput ? 'WCSM 링크 등록' : (processingImages.length > 0 ? '이미지 등록' : '')),
      author: user.name,
      wcsmLink: wcsmLinkInput || undefined,
      images: [...processingImages]
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
    // Mock auto-assignment logic
    const counselors = ['이가영', '박정훈', '김나리', '송해영'];
    const randomCounselor = counselors[Math.floor(Math.random() * counselors.length)];
    setInquiries(prev => prev.map(inq => {
      if (inq.id === id) {
        // Status should NOT change when assignee changes, unless explicitly requested
        // But the previous logic had it changing to '상담 중'. 
        // User said: "담당자 변경 이나 처리 필드 유형 바꿀 때 상태 변경 안되도록 해줘"
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
          // Rule: EMR category triggers auto-assignment
          const counselors = ['이가영', '박정훈', '김나리', '송해영'];
          updatedInq.assignee = counselors[Math.floor(Math.random() * counselors.length)];
          // Status should NOT change
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

  // filteredInquiries useMemo의 의존성 배열 확인
const filteredInquiries = useMemo(() => {
  return inquiries.filter(inquiry => {
    // Category filter
    if (mainFilter !== '전체' && inquiry.category !== mainFilter) return false;
    
    // EMR Type filter
    if (mainFilter === 'EMR' && emrFilter !== '전체' && inquiry.emrType !== emrFilter) return false;
    
    // Assignee filter
    if (assigneeFilter !== '전체' && inquiry.assignee !== assigneeFilter) return false;

    // Status filter
    if (statusFilter !== '전체' && inquiry.initialStatus !== statusFilter) return false;

    // Process filter
    if (processFilter !== '전체') {
      const firstLine = inquiry.processingResult?.split('\n')[0];
      if (firstLine !== processFilter) return false;
    }
    
    // Hospital filter
    if (appliedHospitalFilter && !inquiry.hospital.toLowerCase().includes(appliedHospitalFilter.toLowerCase())) return false;
    
    // Content search
    if (appliedContentSearch) {
      const searchLower = appliedContentSearch.toLowerCase();
      const matchesId = inquiry.id.toLowerCase().includes(searchLower);
      const matchesResponse = inquiry.customerResponse?.toLowerCase().includes(searchLower);
      if (!matchesId && !matchesResponse) return false;
    } 
    
    return true;
  });
}, [inquiries, mainFilter, emrFilter, assigneeFilter, statusFilter, processFilter, appliedHospitalFilter, appliedContentSearch]);



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

  // Reset history pages when selection changes
  useEffect(() => {
    setHistoryPage(1);
    setCustomerHistoryPage(1);
    setHistoryTab('processing');
  }, [selectedId]);

  const handleSendResponse = () => {
  if (!customerResponseText.trim() && customerResponseImages.length === 0) return;
  
  // 운영자 권한 체크 (ADMIN, COUNSELOR)
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
    
    const newHistoryRecord = {
      date: now,
      status: '답변발송',
      content: `[답변발송] ${customerResponseText.substring(0, 20)}${customerResponseText.length > 20 ? '...' : ''}`,
      author: user.name,
      wcsmLink: undefined,
      images: [...customerResponseImages]
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
          } as CustomerHistoryItem;

          const editHistoryRecord: HistoryItem = {
            date: now,
            status: '답변수정',
            content: `[답변수정] ${editResponseText.substring(0, 20)}${editResponseText.length > 20 ? '...' : ''}`,
            author: user.name,
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
      {/* Unified Dashboard Section */}
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
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className="px-6 py-6">
                <div className="flex items-center gap-6 mb-6">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">조회 기간</span>
                    <select 
                      value={dashboardPeriod}
                      onChange={(e) => setDashboardPeriod(e.target.value)}
                      className="bg-white border border-slate-200 rounded-lg px-3 h-9 text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all min-w-[120px]"
                    >
                      {DASHBOARD_PERIODS.map(period => (
                        <option key={period.value} value={period.value}>{period.label}</option>
                      ))}
                    </select>
                  </div>
                  
                  {dashboardPeriod === 'custom' && (
                    <div className="flex items-center gap-2 animate-in fade-in slide-in-from-left-2 duration-300">
                      <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 h-9 focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition-all">
                        <input 
                          type="date" 
                          value={dashboardCustomRange.start}
                          onChange={(e) => setDashboardCustomRange(prev => ({ ...prev, start: e.target.value }))}
                          className="text-xs font-bold bg-transparent focus:outline-none h-full"
                        />
                        <span className="text-slate-400 text-xs font-bold">~</span>
                        <input 
                          type="date" 
                          value={dashboardCustomRange.end}
                          onChange={(e) => setDashboardCustomRange(prev => ({ ...prev, end: e.target.value }))}
                          className="text-xs font-bold bg-transparent focus:outline-none h-full"
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex items-stretch justify-between gap-6">
                  {/* Left: Personal Status Card */}
                  <div className="flex-1 bg-slate-50 rounded-2xl p-6 flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <h2 className="text-[11px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                          <div className="w-1 h-3 bg-blue-600"></div> 개인 업무 현황
                        </h2>
                      </div>
                      <span className="text-[10px] font-bold text-blue-600 bg-blue-100/50 px-2 py-0.5 rounded-full">
                        {user.name} 님
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-12">
                        <div className="flex items-center gap-3">
                          <div className="text-amber-500">
                            <Activity size={22} />
                          </div>
                          <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">대기 중</p>
                            <p className="text-xl font-black text-slate-900">{personalStats.waiting}건</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="text-blue-600">
                            <RefreshCw size={22} />
                          </div>
                          <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">진행 중</p>
                            <p className="text-xl font-black text-slate-900">{personalStats.processing}건</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="text-green-600">
                            <CheckCircle2 size={22} />
                          </div>
                          <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">완료</p>
                            <p className="text-xl font-black text-slate-900">{personalStats.completed}건</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right: Total Inquiry Summary Card */}
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
        {/* Table Section */}
        <div className="flex-1 flex flex-col overflow-hidden bg-white">
          {/* List Header & Filters */}
          <div className="p-4 border-b border-slate-200 flex flex-col gap-3 shrink-0 bg-slate-50/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold text-slate-400 whitespace-nowrap uppercase tracking-wider">병원명</span>
                  <div className="relative">
                    <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 h-9 w-52 focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition-all">
                      <input 
                        type="text" 
                        value={hospitalSearch}
                        onChange={(e) => {
                          setHospitalSearch(e.target.value);
                          setShowHospitalList(true);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            handleSearch();
                            setShowHospitalList(false);
                          }
                        }}
                        onFocus={() => setShowHospitalList(true)}
                        placeholder="병원명 검색..." 
                        className="text-xs bg-transparent focus:outline-none flex-1 h-full"
                      />
                      <div className="flex items-center gap-1">
                        {hospitalSearch && (
                          <button 
                            onClick={() => {
                              setHospitalSearch('');
                              setAppliedHospitalFilter('');
                            }}
                            className="p-0.5 hover:bg-slate-100 rounded transition-colors text-slate-400"
                            title="지우기"
                          >
                            <X size={12} />
                          </button>
                        )}
                        <button 
                          onClick={() => {
                            handleSearch();
                            setShowHospitalList(false);
                          }}
                          className="p-1 hover:bg-slate-100 rounded transition-colors text-blue-600"
                          title="검색"
                        >
                          <Search size={14} />
                        </button>
                      </div>
                    </div>
                    {showHospitalList && filteredHospitals.length > 0 && (
                      <div className="absolute top-full left-0 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-xl z-50 max-h-48 overflow-y-auto py-1">
                        {filteredHospitals.map((h, idx) => (
                          <button
                            key={idx}
                            onClick={() => {
                              setHospitalSearch(h);
                              setAppliedHospitalFilter(h);
                              setShowHospitalList(false);
                            }}
                            className="w-full text-left px-4 py-2 text-xs hover:bg-blue-50 transition-colors text-slate-700 font-medium"
                          >
                            {h}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold text-slate-400 whitespace-nowrap uppercase tracking-wider">요청내용</span>
                  <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 h-9 w-56 focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition-all">
                    <input 
                      type="text" 
                      value={contentSearch}
                      onChange={(e) => setContentSearch(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSearch();
                      }}
                      placeholder="요청사항 내용 검색..." 
                      className="text-xs bg-transparent focus:outline-none w-full h-full"
                    />
                    <div className="flex items-center gap-1">
                      {contentSearch && (
                        <button 
                          onClick={() => {
                            setContentSearch('');
                            setAppliedContentSearch('');
                          }}
                          className="p-0.5 hover:bg-slate-100 rounded transition-colors text-slate-400"
                          title="지우기"
                        >
                          <X size={12} />
                        </button>
                      )}
                      <button 
                        onClick={handleSearch}
                        className="p-1 hover:bg-slate-100 rounded transition-colors text-blue-600"
                        title="검색"
                      >
                        <Search size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={resetFilters}
                  className="flex items-center gap-2 px-3 h-9 text-[11px] font-bold text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-all"
                >
                  <RefreshCw size={14} /> 필터 초기화
                </button>
                <button className="btn-primary flex items-center gap-2 h-9 px-4 rounded-lg">
                  <Plus size={14} /> 문의 등록
                </button>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">접수분야</span>
                <select 
                  value={mainFilter}
                  onChange={(e) => setMainFilter(e.target.value)}
                  className="bg-white border border-slate-200 rounded-lg px-2 h-9 text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                >
                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {mainFilter === 'EMR' && (
                <div className="flex items-center gap-2 animate-in fade-in slide-in-from-left-2 duration-300">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">EMR 종류</span>
                  <select 
                    value={emrFilter}
                    onChange={(e) => setEmrFilter(e.target.value)}
                    className="bg-white border border-slate-200 rounded-lg px-2 h-9 text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  >
                    {EMR_TYPES.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
              )}

              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">기간</span>
                <DateRangePicker 
                  value={dateRange}
                  onChange={setDateRange}
                />
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">담당자</span>
                <select 
                  value={assigneeFilter}
                  onChange={(e) => setAssigneeFilter(e.target.value)}
                  className="bg-white border border-slate-200 rounded-lg px-2 h-9 text-xs font-bold text-slate-700 focus:outline-none"
                >
                  <option value="전체">전체</option>
                  <option value="이가영">이가영</option>
                  <option value="박정훈">박정훈</option>
                  <option value="김나리">김나리</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">상태</span>
                <select 
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-white border border-slate-200 rounded-lg px-2 h-9 text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all min-w-[100px]"
                >
                  <option value="전체">전체 상태</option>
                  {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">처리유형</span>
                <select 
                  value={processFilter}
                  onChange={(e) => setProcessFilter(e.target.value)}
                  className="bg-white border border-slate-200 rounded-lg px-2 h-9 text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all min-w-[120px]"
                >
                  <option value="전체">전체 유형</option>
                  {PROCESSING_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Icon Legend */}
          <div className="px-4 py-2 border-b border-slate-200 bg-white flex items-center gap-4 shrink-0">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 size={14} className="text-red-500 fill-red-50" />
              <span className="text-[11px] font-bold text-slate-500">긴급</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 size={14} className="text-green-600 fill-green-50" />
              <span className="text-[11px] font-bold text-slate-500">재인입</span>
            </div>
          </div>

          <div className="flex-1 overflow-auto">
            <table className="w-full border-collapse min-w-[1000px]">
              <thead className="sticky top-0 bg-white z-10 shadow-[0_1px_0_0_rgba(0,0,0,0.05)]">
                <tr className="border-b border-slate-200">
                  {['접수번호', '분야', '차트', '병원명', '요청시간', '대기시간', '상태', '작성자', '담당자', '처리'].map((h) => (
                    <th key={h} className="text-[10px] font-bold text-slate-400 text-left px-4 py-3 uppercase tracking-wider bg-slate-50/30">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginatedInquiries.map((item) => (
                  <tr 
                    key={item.id} 
                    onClick={() => setSelectedId(item.id)}
                    className={cn(
                      "border-b border-slate-100 hover:bg-blue-50/30 transition-colors cursor-pointer group",
                      selectedId === item.id ? "bg-blue-50/50" : ""
                    )}
                  >
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-0.5 min-w-[32px]">
                          <div className="flex items-center gap-0.5 min-w-[32px]">
  {item.urgent && (
    <span title="긴급">
      <CheckCircle2 size={14} className="text-red-500 fill-red-50" />
    </span>
  )}
  {item.isReentry && (
    <span title="재인입">
      <CheckCircle2 size={14} className="text-green-600 fill-green-50" />
    </span>
  )}
</div>
                        </div>
                        <span className="text-xs font-mono font-medium text-slate-600">{item.id}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex flex-col">
                        <span className="text-[11px] font-bold text-slate-700">{item.category === '미지정' ? '-' : item.category}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="px-2 py-0.5 bg-slate-100 text-slate-500 text-[10px] font-bold rounded uppercase">{item.chart}</span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="text-xs font-bold text-slate-900">{item.hospital}</span>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="text-[10px] font-mono text-slate-400 leading-tight">
                        <div>{item.time.split(' ')[0]}</div>
                        <div>{item.time.split(' ')[1]}</div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-1.5">
                        <Clock size={12} className="text-slate-300" />
                        <span className="text-[11px] font-bold text-slate-600">{item.waitingTime || '-'}</span>
                      </div>
                    </td>
                
<td className="px-4 py-3.5">
  {item.initialStatus === '완료' ? (
    <span className="px-2 py-0.5 bg-green-50 text-green-600 text-[10px] font-bold rounded">
      {item.initialStatus}
    </span>
  ) : (
    <div className="relative group/status inline-block">
      <select
  key={`${item.id}-${item.initialStatus}`}
  value={item.initialStatus}
  onClick={(e) => e.stopPropagation()}
  onChange={(e) => {
    handleStatusChange(item.id, e.target.value);
  }}
  className={cn(
    "appearance-none px-2 py-0.5 pr-4 rounded text-[10px] font-bold border transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500/20",
    item.initialStatus === '대기 중' ? "bg-amber-50 text-amber-600 border-amber-100" :
    item.initialStatus === '상담 중' ? "bg-blue-50 text-blue-600 border-blue-100" :
    item.initialStatus === '피드백' ? "bg-purple-50 text-purple-600 border-purple-100" :
    "bg-slate-50 text-slate-600 border-slate-100"
  )}
>
  {item.initialStatus === '대기 중' && (
    <>
      <option value="대기 중">대기 중</option>
      <option value="상담 중">상담 중</option>
    </>
  )}
  {item.initialStatus === '상담 중' && (
    <>
      <option value="상담 중">상담 중</option>
      <option value="피드백">피드백</option>
      <option value="완료">완료</option>
    </>
  )}
  {item.initialStatus === '피드백' && (
    <>
      <option value="피드백">피드백</option>
      <option value="상담 중">상담 중</option>
      <option value="완료">완료</option>
    </>
  )}
</select>
      <div className="absolute right-1 top-1/2 -translate-y-1/2 pointer-events-none text-[8px] opacity-50">
        ▼
      </div>
    </div>
  )}
</td>
                    <td className="px-4 py-3.5 text-xs text-slate-600">{item.author}</td>
                    <td className="px-4 py-3.5 text-xs text-slate-600 relative">
  <div 
    className="flex items-center gap-1 cursor-pointer hover:text-blue-600 transition-colors"
    onClick={(e) => {
      e.stopPropagation();
      if (item.assignee && item.assignee !== user.name) {
        if (window.confirm("상담상태 및 담당자를 초기화하겠습니까?")) {
          setInquiries(prev => prev.map(inq => 
            inq.id === item.id 
              ? { ...inq, assignee: '', initialStatus: '대기 중' } 
              : inq
          ));
        }
      } else if (!item.assignee) {
        setInquiries(prev => prev.map(inq => 
          inq.id === item.id ? { ...inq, assignee: user.name } : inq
        ));
      }
    }}
  >
    {item.assignee || '-'}
  </div>
</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Section */}
          <div className="px-6 py-3 border-t border-slate-200 bg-white flex items-center justify-between shrink-0">
            <div className="flex items-center gap-4">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                페이지 <span className="text-slate-900">{currentPage} / {totalPages || 1}</span>
              </span>
            </div>

            <div className="flex items-center gap-6">
              {/* Page Navigation */}
              <div className="flex items-center gap-1">
                <button 
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1}
                  className="p-1.5 hover:bg-slate-100 rounded-md disabled:opacity-30 disabled:hover:bg-transparent transition-colors text-slate-600"
                  title="First Page"
                >
                  <ChevronsLeft size={16} className="stroke-[2.5px]" />
                </button>
                <button 
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="p-1.5 hover:bg-slate-100 rounded-md disabled:opacity-30 disabled:hover:bg-transparent transition-colors text-slate-600"
                  title="Previous Page"
                >
                  <ChevronLeft size={16} className="stroke-[2.5px]" />
                </button>

                <div className="flex items-center gap-1 px-2">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }

                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={cn(
                          "w-8 h-8 rounded-lg text-xs font-black transition-all",
                          currentPage === pageNum 
                            ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" 
                            : "text-slate-500 hover:bg-slate-100"
                        )}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                <button 
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages || totalPages === 0}
                  className="p-1.5 hover:bg-slate-100 rounded-md disabled:opacity-30 disabled:hover:bg-transparent transition-colors text-slate-600"
                  title="Next Page"
                >
                  <ChevronRight size={16} className="stroke-[2.5px]" />
                </button>
                <button 
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={currentPage === totalPages || totalPages === 0}
                  className="p-1.5 hover:bg-slate-100 rounded-md disabled:opacity-30 disabled:hover:bg-transparent transition-colors text-slate-600"
                  title="Last Page"
                >
                  <ChevronsRight size={16} className="stroke-[2.5px]" />
                </button>
              </div>

              {/* Specific Page Input */}
              <form onSubmit={handlePageInputSubmit} className="flex items-center gap-2">
               
                <input 
                  type="text" 
                  value={pageInput}
                  onChange={handlePageInputChange}
                  placeholder={currentPage.toString()}
                  className="w-12 h-8 bg-slate-50 border border-slate-200 rounded-lg text-center text-xs font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                />
                <button 
                  type="submit"
                  className="h-8 px-3 bg-slate-100 text-slate-600 text-[10px] font-bold rounded-lg hover:bg-slate-200 transition-all border border-slate-200"
                >
                  이동
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Right Detail Panel */}
        {selectedInquiry && (
          <div className="w-[450px] bg-white border-l border-slate-200 flex flex-col shadow-xl z-20">
            <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <span className="text-sm font-mono font-black text-slate-900">{selectedInquiry.id}</span>
              
                <div className="flex gap-1">
                  <button className="px-2 py-1 bg-white border border-slate-200 rounded text-[10px] font-bold hover:bg-slate-50 transition-colors">수정</button>
                  <button className="px-2 py-1 bg-white border border-slate-200 rounded text-[10px] font-bold text-red-500 hover:bg-red-50 transition-colors">삭제</button>
                  <button 
                    onClick={() => handleAutoAssign(selectedInquiry.id)}
                    className="px-2 py-1 bg-blue-600 text-white border border-blue-600 rounded text-[10px] font-bold hover:bg-blue-700 transition-colors"
                  >
                    EMR 배정하기
                  </button>
                </div>
              </div>
              <button onClick={() => setSelectedId(null)} className="p-1 hover:bg-slate-100 rounded-md transition-colors">
                <X size={16} className="text-slate-400" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              {/* Hospital Info */}
              <section className="space-y-3">
                <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                  <div className="w-1 h-3 bg-blue-600"></div> 병원 정보 상세
                </h4>
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <h3 className="text-xl font-black text-slate-900">{selectedInquiry.hospital}</h3>
                      <div className="flex items-center gap-1.5">
                        <span className="px-2.5 py-1 bg-blue-600 text-white text-[10px] font-black rounded flex items-center gap-1.5">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                          벳아너스
                        </span>
                        <span className="px-2.5 py-1 bg-white text-slate-400 text-[10px] font-black rounded border border-slate-200">비고객</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-8 text-sm font-bold">
                      <div className="flex items-center gap-2">
                        <span className="text-slate-400">접수분야 |</span>
                        <span className="text-slate-900">{selectedInquiry.category === '미지정' ? '-' : selectedInquiry.category}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-slate-400">접수자 |</span>
                        <span className="text-slate-900">홍길동</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-slate-100 grid grid-cols-2 gap-10">
                    <div className="space-y-4">
                      <p className="text-[11px] font-black text-slate-300 uppercase tracking-wider">해당 병원 EMR 정보</p>
                      <div className="space-y-2.5">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-black text-slate-900">EMR 제품</span>
                          <span className="text-xs font-bold text-blue-600">PMS365</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-black text-slate-900">설치 유형</span>
                          <span className="text-xs font-bold text-slate-500">타사 전환</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-black text-slate-900">이전 차트</span>
                          <span className="text-xs font-bold text-slate-500">IntovetGE</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-black text-slate-900">월 관리비</span>
                          <span className="text-xs font-black text-blue-600">290,000/월</span>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <p className="text-[11px] font-black text-slate-300 uppercase tracking-wider">사용량 정보</p>
                      <div className="space-y-2.5">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-black text-slate-900">PC Copy 수</span>
                          <span className="text-xs font-bold text-slate-500">110</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-black text-slate-900">Mobile Copy 수</span>
                          <span className="text-xs font-bold text-slate-500">110</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-black text-slate-900">클라우드 스토리지</span>
                          <span className="text-xs font-bold text-slate-500">-</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-100">
                    <div className="space-y-1">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-tight">최근 3개월 문의</p>
                      <p className="text-base font-black text-slate-900">42건</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-tight">평균 대기시간</p>
                      <p className="text-base font-black text-slate-900">8분 20초</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-tight">최대 대기시간</p>
                      <p className="text-base font-black text-slate-900">25분</p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Request Details */}
              <section className="space-y-3">
                <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                  <div className="w-1 h-3 bg-amber-500"></div> 요청 사항
                </h4>
                <div className="text-xs text-slate-600 leading-relaxed bg-amber-50/30 p-4 rounded-lg border border-amber-100">
                  연락 받으실 전화번호 및 담당자명<br/>
                  010-5684-7981<br/>
                  팀뷰어 실행 후 원격번호를 적어주세요.<br/>
                  PMS 차트비용이 또 청구가 됐네요.<br/>
                  전화주세요.
                </div>
              </section>

              {/* Reference Memo */}
              <section className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                    <div className="w-1 h-3 bg-slate-400"></div> 참고 메모
                  </h4>
                  <button className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors flex items-center gap-1 text-[10px] font-bold">
                    <Save size={12} /> 저장
                  </button>
                </div>
                <textarea 
                  className="w-full h-24 p-4 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all resize-none"
                  placeholder="내부 참고용 메모를 입력하세요..."
                ></textarea>
              </section>

              {/* Processing Details */}
              <section className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                    <div className="w-1 h-3 bg-green-500"></div> 처리 내역
                  </h4>
                  <button 
                    onClick={handleSaveProcessing}
                    className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors flex items-center gap-1 text-[10px] font-bold"
                  >
                    <Save size={12} /> 저장
                  </button>
                </div>
                <div className="space-y-2">
                  {selectedInquiry.initialStatus === '완료' && (
                    <select 
                      value={PROCESSING_OPTIONS.includes(selectedInquiry.processingResult?.split('\n')[0]) ? selectedInquiry.processingResult?.split('\n')[0] : ''}
                      onChange={(e) => {
                        const category = e.target.value;
                        const currentVal = selectedInquiry.processingResult || '';
                        const lines = currentVal.split('\n');
                        // If the first line is one of the options, replace it, otherwise prepend
                        if (lines.length > 0 && PROCESSING_OPTIONS.includes(lines[0])) {
                          lines[0] = category;
                          handleProcessingResultChange(selectedInquiry.id, lines.join('\n'));
                        } else {
                          handleProcessingResultChange(selectedInquiry.id, `${category}\n${currentVal}`);
                        }
                      }}
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all font-bold mb-2"
                    >
                      <option value="" disabled>처리 결과 카테고리 선택</option>
                      {PROCESSING_OPTIONS.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  )}
                  <textarea 
                    value={selectedInquiry.processingResult || ''}
                    onChange={(e) => handleProcessingResultChange(selectedInquiry.id, e.target.value)}
                    className="w-full h-32 p-4 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all resize-none"
                    placeholder="처리 내역을 입력하세요..."
                  />
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                      <ExternalLink size={14} />
                    </div>
                    <input 
                      type="text"
                      value={wcsmLinkInput}
                      onChange={(e) => setWcsmLinkInput(e.target.value)}
                      className="w-full pl-9 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-[11px] focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                      placeholder="WCSM 링크를 입력하세요 (선택 사항)"
                    />
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mt-2">
                    {processingImages.map((img, idx) => (
                      <div key={idx} className="relative w-16 h-16 rounded-lg overflow-hidden border border-slate-200 group">
                        <img src={img} alt="upload" className="w-full h-full object-cover" />
                        <button 
                          onClick={() => setProcessingImages(prev => prev.filter((_, i) => i !== idx))}
                          className="absolute top-0.5 right-0.5 p-0.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X size={10} />
                        </button>
                      </div>
                    ))}
                    <label className="w-16 h-16 rounded-lg border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 hover:border-blue-400 hover:text-blue-400 cursor-pointer transition-all">
                      <ImageIcon size={18} />
                      <span className="text-[9px] font-bold mt-1">이미지</span>
                      <input 
                        type="file" 
                        multiple 
                        accept="image/*" 
                        className="hidden" 
                        onChange={(e) => handleImageUpload(e, 'processing')}
                      />
                    </label>
                  </div>
                </div>
              </section>

              {/* Customer Response Section (Only for Online source) */}
              {selectedInquiry.source === 'Online' && (
                <section className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
                  <h4 className="text-[11px] font-black text-blue-600 uppercase tracking-[0.2em] flex items-center gap-2">
                    <div className="w-1 h-3 bg-blue-600"></div> 고객 답변 발송
                  </h4>
                  <textarea 
                    value={customerResponseText}
                    onChange={(e) => setCustomerResponseText(e.target.value)}
                    className="w-full h-24 p-4 bg-blue-50/30 border border-blue-100 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all resize-none"
                    placeholder="온라인 고객센터로 보낼 답변을 입력하세요..."
                  ></textarea>
                  
                  <div className="flex flex-wrap gap-2 mt-2">
                    {customerResponseImages.map((img, idx) => (
                      <div key={idx} className="relative w-16 h-16 rounded-lg overflow-hidden border border-blue-100 group">
                        <img src={img} alt="upload" className="w-full h-full object-cover" />
                        <button 
                          onClick={() => setCustomerResponseImages(prev => prev.filter((_, i) => i !== idx))}
                          className="absolute top-0.5 right-0.5 p-0.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X size={10} />
                        </button>
                      </div>
                    ))}
                    <label className="w-16 h-16 rounded-lg border-2 border-dashed border-blue-200 flex flex-col items-center justify-center text-blue-400 hover:border-blue-500 hover:bg-blue-50 cursor-pointer transition-all">
                      <ImageIcon size={18} />
                      <span className="text-[9px] font-bold mt-1">이미지</span>
                      <input 
                        type="file" 
                        multiple 
                        accept="image/*" 
                        className="hidden" 
                        onChange={(e) => handleImageUpload(e, 'customer')}
                      />
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <p className="text-[10px] text-slate-400 italic">* 전송된 답변은 수정 불가</p>
                    <button 
                      onClick={handleSendResponse}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg text-[11px] font-bold flex items-center gap-2 hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20"
                    >
                      <Send size={14} /> 전송
                    </button>
                  </div>
                </section>
              )}

              {/* Tabbed History Section */}
              <section className="space-y-4 pt-4 border-t border-slate-200">
                <div className="flex bg-slate-100 p-1 rounded-lg">
                  <button 
                    onClick={() => setHistoryTab('processing')}
                    className={cn(
                      "flex-1 py-1.5 text-[10px] font-black uppercase tracking-wider rounded-md transition-all",
                      historyTab === 'processing' ? "bg-white text-slate-900 shadow-sm" : "text-slate-400 hover:text-slate-600"
                    )}
                  >
                    처리 내역 ({selectedInquiry.history?.length || 0})
                  </button>
                  {selectedInquiry.source === 'Online' && (
                    <button 
                      onClick={() => setHistoryTab('customer')}
                      className={cn(
                        "flex-1 py-1.5 text-[10px] font-black uppercase tracking-wider rounded-md transition-all",
                        historyTab === 'customer' ? "bg-white text-blue-600 shadow-sm" : "text-slate-400 hover:text-slate-600"
                      )}
                    >
                      고객 답변 ({selectedInquiry.customerHistory?.length || 0})
                    </button>
                  )}
                </div>

                {historyTab === 'processing' ? (
                  <div className="space-y-4">
                    <div className="border border-slate-200 rounded-lg overflow-hidden">
                      <table className="w-full border-collapse text-[10px]">
                        <thead>
                          <tr className="bg-slate-50 border-b border-slate-200">
                            <th className="px-2 py-2 text-left font-bold text-slate-500 border-r border-slate-200">No</th>
                            <th className="px-2 py-2 text-left font-bold text-slate-500 border-r border-slate-200">처리일시</th>
                            <th className="px-2 py-2 text-left font-bold text-slate-500 border-r border-slate-200">내용</th>
                            <th className="px-2 py-2 text-left font-bold text-slate-500">처리자</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedInquiry.history?.slice((historyPage - 1) * historyPageSize, historyPage * historyPageSize).map((h: any, idx: number) => (
                            <tr key={idx} className="border-b border-slate-100 last:border-0 bg-white">
                              <td className="px-2 py-2 text-slate-400 border-r border-slate-200">
                                {selectedInquiry.history.length - ((historyPage - 1) * historyPageSize + idx)}
                              </td>
                              <td className="px-2 py-2 text-slate-500 border-r border-slate-200 leading-tight">
                                {h.date.split(' ')[0]}<br/>{h.date.split(' ')[1]}
                              </td>
                              <td className="px-2 py-2 text-slate-700 border-r border-slate-200 leading-relaxed">
                                <div className="flex flex-col gap-2">
                                  <span className="whitespace-pre-wrap">{h.content}</span>
                                  {h.images && h.images.length > 0 && (
                                    <div className="flex flex-wrap gap-1.5 mt-1">
                                      {h.images.map((img: string, i: number) => (
                                        <img 
                                          key={i} 
                                          src={img} 
                                          alt="history" 
                                          className="w-12 h-12 rounded border border-slate-200 object-cover cursor-zoom-in hover:scale-105 transition-transform" 
                                          onClick={() => setPreviewImage(img)}
                                        />
                                      ))}
                                    </div>
                                  )}
                                  {h.wcsmLink && (
                                    <a 
                                      href={h.wcsmLink} 
                                      target="_blank" 
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center gap-1 text-blue-600 hover:underline font-bold text-[9px]"
                                    >
                                      <ExternalLink size={10} /> WCSM 연결
                                    </a>
                                  )}
                                </div>
                              </td>
                              <td className="px-2 py-2 text-slate-600">{h.author}</td>
                            </tr>
                          ))}
                          {(!selectedInquiry.history || selectedInquiry.history.length === 0) && (
                            <tr>
                              <td colSpan={4} className="px-4 py-8 text-center text-slate-400 italic">이력이 없습니다.</td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                    {selectedInquiry.history && selectedInquiry.history.length > historyPageSize && (
                      <div className="flex items-center justify-center gap-2">
                        <button 
                          disabled={historyPage === 1}
                          onClick={() => setHistoryPage(p => p - 1)}
                          className="p-1 hover:bg-slate-100 rounded disabled:opacity-30"
                        >
                          <ChevronLeft size={14} />
                        </button>
                        <span className="text-[10px] font-bold text-slate-500">{historyPage} / {Math.ceil(selectedInquiry.history.length / historyPageSize)}</span>
                        <button 
                          disabled={historyPage === Math.ceil(selectedInquiry.history.length / historyPageSize)}
                          onClick={() => setHistoryPage(p => p + 1)}
                          className="p-1 hover:bg-slate-100 rounded disabled:opacity-30"
                        >
                          <ChevronRight size={14} />
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="border border-blue-100 rounded-lg overflow-hidden">
                      <table className="w-full border-collapse text-[10px]">
                        <thead>
                          <tr className="bg-blue-50/50 border-b border-blue-100">
                            <th className="px-2 py-2 text-left font-bold text-blue-500 border-r border-blue-100">No</th>
                            <th className="px-2 py-2 text-left font-bold text-blue-500 border-r border-blue-100">발송일시</th>
                            <th className="px-2 py-2 text-left font-bold text-blue-500 border-r border-blue-100">답변내용</th>
                            <th className="px-2 py-2 text-left font-bold text-blue-500">발송자</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedInquiry.customerHistory?.slice((customerHistoryPage - 1) * historyPageSize, customerHistoryPage * historyPageSize).map((h: any, idx: number) => {
                            const actualIndex = (customerHistoryPage - 1) * historyPageSize + idx;
                            const isEditing = editingResponseIndex === actualIndex;

                            return (
                              <tr key={idx} className="border-b border-blue-50 last:border-0 bg-white">
                                <td className="px-2 py-2 text-blue-400 border-r border-blue-100">
                                  {selectedInquiry.customerHistory.length - actualIndex}
                                </td>
                                <td className="px-2 py-2 text-slate-500 border-r border-blue-100 leading-tight">
                                  {h.date.split(' ')[0]}<br/>{h.date.split(' ')[1]}
                                </td>
                                  <td className="px-2 py-2 text-slate-700 border-r border-blue-100 leading-relaxed">
                                    {isEditing ? (
                                      <div className="space-y-2">
                                        <textarea 
                                          value={editResponseText}
                                          onChange={(e) => setEditResponseText(e.target.value)}
                                          className="w-full p-2 border border-blue-200 rounded text-[10px] focus:outline-none focus:ring-1 focus:ring-blue-500 h-20 resize-none"
                                        />
                                        <div className="flex justify-end gap-1">
                                          <button 
                                            onClick={() => setEditingResponseIndex(null)}
                                            className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-[9px] font-bold"
                                          >
                                            취소
                                          </button>
                                          <button 
                                            onClick={() => handleUpdateResponse(actualIndex)}
                                            disabled={isSavingResponse}
                                            className="px-2 py-1 bg-blue-600 text-white rounded text-[9px] font-bold disabled:opacity-50 flex items-center gap-1"
                                          >
                                            {isSavingResponse ? (
                                              <>
                                                <RefreshCw size={10} className="animate-spin" /> 저장 중
                                              </>
                                            ) : '저장'}
                                          </button>
                                        </div>
                                      </div>
                                    ) : (
                                      <div className="group relative">
                                        <div className="flex flex-col gap-2">
                                          <span>{h.content}</span>
                                          {h.images && h.images.length > 0 && (
                                            <div className="flex flex-wrap gap-1.5 mt-1">
                                              {h.images.map((img: string, i: number) => (
                                                <img 
                                                  key={i} 
                                                  src={img} 
                                                  alt="customer-history" 
                                                  className="w-12 h-12 rounded border border-blue-100 object-cover cursor-zoom-in hover:scale-105 transition-transform" 
                                                  onClick={() => setPreviewImage(img)}
                                                />
                                              ))}
                                            </div>
                                          )}
                                          {h.isEdited && (
                                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-blue-50 text-blue-600 rounded text-[9px] font-bold mt-2 w-fit border border-blue-100">
                                              <Activity size={10} /> 수정됨 ({h.editDate})
                                            </span>
                                          )}
                                        </div>
                                        <button 
                                          onClick={() => {
                                            setEditingResponseIndex(actualIndex);
                                            setEditResponseText(h.content);
                                          }}
                                          className="absolute top-0 right-0 p-1.5 text-slate-300 hover:text-blue-600 hover:bg-blue-50 rounded-md opacity-0 group-hover:opacity-100 transition-all flex items-center gap-1"
                                          title="수정"
                                        >
                                          <Pencil size={12} />
                                          <span className="text-[9px] font-bold">수정</span>
                                        </button>
                                      </div>
                                    )}
                                  </td>
                                <td className="px-2 py-2 text-slate-600">
                                  <div className="flex flex-col gap-0.5">
                                    <span className="font-medium">{h.author}</span>
                                    {h.isEdited && (
                                      <span className="text-[8px] text-white bg-blue-400 px-1 rounded font-black w-fit uppercase tracking-tighter">
                                        Editor
                                      </span>
                                    )}
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                          {(!selectedInquiry.customerHistory || selectedInquiry.customerHistory.length === 0) && (
                            <tr>
                              <td colSpan={4} className="px-4 py-8 text-center text-slate-400 italic">발송 이력이 없습니다.</td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                    {selectedInquiry.customerHistory && selectedInquiry.customerHistory.length > historyPageSize && (
                      <div className="flex items-center justify-center gap-2">
                        <button 
                          disabled={customerHistoryPage === 1}
                          onClick={() => setCustomerHistoryPage(p => p - 1)}
                          className="p-1 hover:bg-blue-50 rounded disabled:opacity-30"
                        >
                          <ChevronLeft size={14} />
                        </button>
                        <span className="text-[10px] font-bold text-blue-500">{customerHistoryPage} / {Math.ceil(selectedInquiry.customerHistory.length / historyPageSize)}</span>
                        <button 
                          disabled={customerHistoryPage === Math.ceil(selectedInquiry.customerHistory.length / historyPageSize)}
                          onClick={() => setCustomerHistoryPage(p => p + 1)}
                          className="p-1 hover:bg-blue-50 rounded disabled:opacity-30"
                        >
                          <ChevronRight size={14} />
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </section>
            </div>

          </div>
        )}
      </div>

      {/* Image Preview Modal */}
      <AnimatePresence>
        {previewImage && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setPreviewImage(null)}
            className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-8 cursor-zoom-out"
          >
            <motion.img 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              src={previewImage} 
              alt="Preview" 
              className="max-w-full max-h-full rounded-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
            <button 
              onClick={() => setPreviewImage(null)}
              className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors"
            >
              <X size={24} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Completion Modal */}
      <AnimatePresence>
        {completionModal.isOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
            >
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                  <CheckCircle2 size={18} className="text-green-600" />
                  상담 완료 처리
                </h3>
                <button 
                  onClick={() => setCompletionModal({ isOpen: false, id: null })}
                  className="p-1 hover:bg-slate-200 rounded-full transition-colors text-slate-400"
                >
                  <X size={18} />
                </button>
              </div>
              
              <div className="p-6 space-y-4">
                <div className="space-y-2">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-wider">처리 유형 (CR 유형) 선택</label>
                  <select 
                    value={selectedProcessingType}
                    onChange={(e) => setSelectedProcessingType(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 h-12 text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  >
                    <option value="">처리 유형을 선택해주세요</option>
                    {PROCESSING_OPTIONS.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>
                
                <p className="text-[11px] text-slate-400 font-medium leading-relaxed">
                  상담을 완료 상태로 변경합니다. 선택하신 처리 유형이 '처리' 필드에 기록됩니다.
                </p>
              </div>
              
              <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3">
                <button 
                  onClick={() => setCompletionModal({ isOpen: false, id: null })}
                  className="px-4 py-2 text-xs font-black text-slate-500 hover:bg-slate-200 rounded-lg transition-colors"
                >
                  취소
                </button>
                <button 
                  onClick={handleConfirmCompletion}
                  disabled={!selectedProcessingType}
                  className="px-6 py-2 text-xs font-black text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:hover:bg-blue-600 rounded-lg shadow-lg shadow-blue-500/20 transition-all"
                >
                  완료 처리
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
