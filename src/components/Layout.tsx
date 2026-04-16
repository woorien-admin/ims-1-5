import React, { useState } from 'react';
import { 
  MessageSquare, 
  BarChart3, 
  BookOpen, 
  Settings, 
  Bell, 
  ChevronLeft, 
  ChevronRight,
  ShieldCheck,
  LogOut,
  Megaphone,
  ChevronDown,
  User as UserIcon,
  Search,
  Grid,
  Calendar
} from 'lucide-react';
import { cn } from '../lib/utils';
import { UserRole, type User } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  user: User | null; // user가 null일 수 있음을 명시
  onRoleChange: (role: UserRole) => void;
  onLogout: () => void;
}

export default function Layout({ children, activeTab, setActiveTab, user, onLogout }: LayoutProps) {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [expandedMenus, setExpandedMenus] = useState<string | null>('counseling');
  const [viewMode, setViewMode] = useState<'admin' | 'management'>('management');

  const toggleMenu = (menuId: string) => {
    setExpandedMenus(prev => prev === menuId ? null : menuId);
  };

  const menuItems = [
    {
      id: 'counseling',
      label: '상담 관리',
      icon: <MessageSquare size={18} />,
      subItems: []
    },
    // {
    //   id: 'statistics',
    //   label: '통계',
    //   icon: <BarChart3 size={18} />,
    //   subItems: [
    //     { id: 'stats-chart', label: '차트별 유입현황' },
    //     { id: 'stats-hospital', label: '병원별 유입현황' },
    //     { id: 'stats-counselor-process', label: '상담자별 처리현황' },
    //     { id: 'stats-counselor-register', label: '상담자별 등록현황' },
    //     { id: 'stats-complete-time', label: '상담 완료시간' },
    //     { id: 'stats-delay-time', label: '상담 지연시간' },
    //     { id: 'stats-type', label: '유형별 통계' },
    //     { id: 'stats-download', label: '데이터 다운로드', roles: [UserRole.ADMIN] },
    //   ]
    // },
    // {
    //   id: 'schedule',
    //   label: '일정 관리',
    //   icon: <Calendar size={18} />,
    //   subItems: [
    //     { id: 'schedule-work', label: '근무 일정 관리' },
    //   ]
    // },
    // {
    //   id: 'operation',
    //   label: '운영 설정',
    //   icon: <Settings size={18} />,
    //   subItems: [
    //     { id: 'op-accounts', label: '계정 관리' },
    //     { id: 'op-assignment', label: '담당자 배정 관리' },
    //     { id: 'op-goals', label: '운영 목표 관리' },
    //     { id: 'op-cr-types', label: 'CR 유형 관리' },
    //   ]
    // },
    // {
    //   id: 'reference',
    //   label: '업무 참조',
    //   icon: <BookOpen size={18} />,
    //   subItems: [
    //     { id: 'ref-inspection', label: '검사 항목 관리' },
    //     { id: 'ref-plan-category', label: 'Plan 카테고리 관리' },
    //     { id: 'ref-plan', label: 'Plan 관리' },
    //   ]
    // },
    // {
    //   id: 'notice',
    //   label: '공지사항',
    //   icon: <Bell size={18} />,
    //   subItems: [
    //     { id: 'notice-register', label: '공지 사항 관리' },
    //   ]
    // }
  ];

  const filteredMenuItems = menuItems.map(item => ({
    ...item,
    subItems: item.subItems.filter(sub => {
      // user가 null이거나, 퇴사자/미등록 유저인 경우 서브 메뉴를 표시하지 않습니다.
      if (!user || user.role === UserRole.RESIGNED || user.role === UserRole.UNREGISTERED) return false;
      
      if (!sub.roles) return true;
      return (sub.roles as UserRole[]).includes(user.role);
    })
  }));

  return (
    <div className="flex h-screen w-full bg-slate-50 overflow-hidden">
      {/* Sidebar */}
      <aside 
        className={cn(
          "bg-[#0f172a] text-white flex flex-col transition-all duration-300 ease-in-out z-30 shadow-2xl",
          isSidebarExpanded ? "w-64" : "w-20"
        )}
      >
        {/* Sidebar Header */}
        <div className="h-16 flex items-center px-6 border-b border-white/5 shrink-0">
          <div className="flex items-center gap-3">
            
            {isSidebarExpanded && (
              <span className="text-lg font-black tracking-tighter">IMS</span>
            )}
          </div>
        </div>

        {/* User Profile */}
        <div className={cn(
          "p-6 border-b border-white/5 shrink-0",
          !isSidebarExpanded && "px-4"
        )}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center border border-white/10 shrink-0">
              <UserIcon size={20} className="text-slate-300" />
            </div>
            {isSidebarExpanded && (
              <div className="overflow-hidden">
                {user && ( // user가 null이 아닐 때만 표시
                  <>
                    <p className="text-sm font-bold truncate">{user.name}</p>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest truncate">
                      {user.role === UserRole.ADMIN ? '어드민' : 
                       user.role === UserRole.COUNSELOR ? '상담원' : 
                       user.role === UserRole.EXTERNAL_COUNSELOR ? '외부 상담원' : user.role}
                    </p>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 custom-scrollbar">
          <div className="px-3 space-y-1">
            {filteredMenuItems.map((item) => (
              <div key={item.id} className="space-y-1">
                <button
                  onClick={() => {
                    if (item.subItems.length > 0) {
                      if (isSidebarExpanded) toggleMenu(item.id);
                    } else {
                      setActiveTab(item.id);
                    }
                  }}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group",
                    !isSidebarExpanded && "justify-center",
                    (activeTab.startsWith(item.id) || expandedMenus === item.id) ? "bg-white/5 text-white" : "text-slate-400 hover:text-white hover:bg-white/5"
                  )}
                >
                  <div className={cn(
                    "shrink-0 transition-transform group-hover:scale-110",
                    (activeTab.startsWith(item.id) || expandedMenus === item.id) ? "text-blue-500" : ""
                  )}>
                    {item.icon}
                  </div>
                  {isSidebarExpanded && (
                    <>
                      <span className="flex-1 text-sm font-bold text-left">{item.label}</span>
                      {item.subItems.length > 0 && (
                        <ChevronDown 
                          size={14} 
                          className={cn(
                            "transition-transform duration-300 opacity-40",
                            expandedMenus === item.id ? "rotate-180" : ""
                          )} 
                        />
                      )}
                    </>
                  )}
                </button>

                {isSidebarExpanded && expandedMenus === item.id && item.subItems.length > 0 && (
                  <div className="ml-9 space-y-1 py-1">
                    {item.subItems.map((sub) => (
                      <button
                        key={sub.id}
                        onClick={() => setActiveTab(sub.id)}
                        className={cn(
                          "w-full text-left px-3 py-2 rounded-lg text-[13px] transition-all relative",
                          activeTab === sub.id 
                            ? "text-white font-bold bg-white/5" 
                            : "text-slate-500 hover:text-slate-300"
                        )}
                      >
                        {activeTab === sub.id && (
                          <div className="absolute left-[-12px] top-1/2 -translate-y-1/2 w-1 h-4 bg-blue-500 rounded-full"></div>
                        )}
                        {sub.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-white/5 shrink-0">
          <button 
            onClick={() => setIsSidebarExpanded(!isSidebarExpanded)}
            className="w-full flex items-center justify-center p-2 text-gray-600 hover:text-gray-400 transition-colors"
          >
            {isSidebarExpanded ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-[var(--border-strong)] flex items-center justify-between px-6 shrink-0 z-20">
          <div className="flex items-center gap-4">
          
            
            
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-slate-900">
                {filteredMenuItems.find(m => m.id === activeTab || m.subItems.some(s => s.id === activeTab))?.label || '상담 관리'}
              </span>
              {filteredMenuItems.some(m => m.subItems.some(s => s.id === activeTab)) && (
                <>
                  <ChevronRight size={14} className="text-slate-400" />
                  <span className="text-sm font-medium text-slate-500">
                    {filteredMenuItems.flatMap(m => m.subItems).find(s => s.id === activeTab)?.label}
                  </span>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="p-2 text-slate-400 hover:bg-slate-50 rounded-lg transition-colors relative">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            
            <div className="h-6 w-[1px] bg-slate-200 mx-1"></div>

            <button 
              onClick={onLogout}
              className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
              title="로그아웃"
            >
              <LogOut size={20} />
            </button>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-hidden">
          {children}
        </div>
      </main>
    </div>
  );
}
