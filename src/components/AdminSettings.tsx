import React, { useState } from 'react';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  User, 
  Clock, 
  Settings2, 
  Plus,
  Filter,
  CheckCircle2,
  AlertCircle,
  Trash2,
  Save,
  RotateCcw,
  Check,
  Info
} from 'lucide-react';
import { cn } from '../lib/utils';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, addMonths, subMonths } from 'date-fns';
import { ko } from 'date-fns/locale';

interface AdminSettingsProps {
  activeTab?: string;
}

interface Account {
  id: string;
  name: string;
  employeeId: string;
  role: string;
  phone?: string;
  categories?: string[];
  charts?: string[];
}

interface AssignmentCategory {
  id: number;
  name: string;
  useSms: boolean;
  assignees: { name: string; active: boolean }[];
  subCategories?: { name: string; useSms: boolean; assignees: { name: string; active: boolean }[] }[];
}

export default function AdminSettings({ activeTab: propActiveTab }: AdminSettingsProps) {
  const activeTab = propActiveTab || 'op-accounts';
  const [accounts, setAccounts] = useState<Account[]>([
    { id: '1', name: '이가영2', employeeId: 'V1234', role: '미등록관리자', categories: ['이미징CS', 'App'] },
    { id: '2', name: '심훈섭', employeeId: 'v13030', role: '상담사', categories: ['EMR'], charts: ['efriends'] },
    { id: '3', name: '김경록', employeeId: 'v14548', role: '상담사', categories: ['AI'] },
    { id: '4', name: '구현준', employeeId: 'v14491', role: '상담사', categories: ['네이버'] },
    { id: '5', name: '유재훈', employeeId: 'v14016', role: '상담사', categories: ['이미징영업'] },
    { id: '6', name: '안상민', employeeId: 'v12741', role: '상담사' },
    { id: '7', name: '정혜인', employeeId: 'V14713', role: '상담사' },
    { id: '8', name: '최인', employeeId: 'v10220', role: '상담사' },
    { id: '9', name: '정재현', employeeId: 'V14270', role: '상담사' },
    { id: '10', name: '권원표', employeeId: 'V14575', role: '상담사' },
    { id: '11', name: '조선이', employeeId: 'v11219', role: '관리자', categories: ['마이브라운', 'EMR'], charts: ['PMS1.0', 'PMS365'] },
    { id: '12', name: '황선일', employeeId: 'v13029', role: '관리자', categories: ['EMR'], charts: ['efriends', 'ef365'] },
    { id: '13', name: '안도건', employeeId: 'v12969', role: '관리자', categories: ['EMR영업'] },
    { id: '14', name: '김연희', employeeId: 'v14405', role: '관리자', categories: ['EMR'], charts: ['efriends', 'ef365'] },
    { id: '15', name: '신현신', employeeId: 'v13024', role: '관리자' },
    { id: '16', name: '조은정', employeeId: 'V14572', role: '관리자', categories: ['EMR'], charts: ['PMS1.0', 'PMS365'] },
  ]);

  const [assignmentCategories, setAssignmentCategories] = useState<AssignmentCategory[]>([
    { id: 9, name: 'EMR', useSms: true, assignees: [],
      subCategories: [
        { name: 'efriends', useSms: true, assignees: [] },
        { name: 'ef365', useSms: false, assignees: [] },
        { name: 'PMS1.0', useSms: true, assignees: [] },
        { name: 'PMS365', useSms: false, assignees: [] },
      ]
    },
    { id: 7, name: 'AI', useSms: false, assignees: [] },
    { id: 6, name: 'EMR영업', useSms: true, assignees: [] },
    { id: 5, name: '이미징영업', useSms: false, assignees: [] },
    { id: 4, name: '네이버', useSms: true, assignees: [] },
    { id: 3, name: '마이브라운', useSms: false, assignees: [] },
    { id: 2, name: 'App', useSms: true, assignees: [] },
    { id: 1, name: '이미징CS', useSms: true, assignees: [] },
  ]);

  const handleSmsToggle = (catId: number, subName?: string) => {
    const action = "문자 발송 설정을 변경하시겠습니까?";
    if (window.confirm(action)) {
      setAssignmentCategories(prev => prev.map(cat => {
        if (cat.id === catId) {
          if (subName && cat.subCategories) {
            return {
              ...cat,
              subCategories: cat.subCategories.map(sub => 
                sub.name === subName ? { ...sub, useSms: !sub.useSms } : sub
              )
            };
          }
          return { ...cat, useSms: !cat.useSms };
        }
        return cat;
      }));
    }
  };

  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [newAccount, setNewAccount] = useState<Partial<Account>>({
    role: '상담사',
    categories: [],
    charts: []
  });

  const handleRoleToggle = (role: string) => {
    setNewAccount(prev => {
      const currentCats = prev.categories || [];
      const newCats = currentCats.includes(role)
        ? currentCats.filter(c => c !== role)
        : [...currentCats, role];
      
      // If EMR is removed, also clear charts
      const newCharts = !newCats.includes('EMR') ? [] : (prev.charts || []);
      
      return { ...prev, categories: newCats, charts: newCharts };
    });
  };

  const handleChartToggle = (chart: string) => {
    setNewAccount(prev => {
      const currentCharts = prev.charts || [];
      const newCharts = currentCharts.includes(chart)
        ? currentCharts.filter(c => c !== chart)
        : [...currentCharts, chart];
      return { ...prev, charts: newCharts };
    });
  };

  const handleSaveAccount = () => {
    if (!newAccount.name || !newAccount.employeeId) {
      alert("이름과 사원번호를 입력해주세요.");
      return;
    }

    if (selectedAccount) {
      // Update
      setAccounts(prev => prev.map(acc => 
        acc.id === selectedAccount.id ? { ...acc, ...newAccount } as Account : acc
      ));
      alert("수정되었습니다.");
    } else {
      // Create
      const id = (Math.max(...accounts.map(a => parseInt(a.id))) + 1).toString();
      setAccounts(prev => [...prev, { ...newAccount, id } as Account]);
      alert("등록되었습니다.");
    }
    handleResetForm();
  };

  const handleDeleteAccount = () => {
    if (!selectedAccount) return;
    if (window.confirm(`${selectedAccount.name} 계정을 삭제하시겠습니까?`)) {
      setAccounts(prev => prev.filter(acc => acc.id !== selectedAccount.id));
      handleResetForm();
      alert("삭제되었습니다.");
    }
  };

  const handleResetForm = () => {
    setSelectedAccount(null);
    setNewAccount({
      role: '상담사',
      categories: [],
      charts: []
    });
  };

  const [newCategory, setNewCategory] = useState({
    name: '',
    useSms: true
  });

  const renderContent = () => {
    switch (activeTab) {
      case 'op-accounts':
        return (
          <div className="flex-1 flex gap-8 overflow-hidden">
            {/* Account List */}
            <div className="flex-1 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
              <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                <h3 className="font-bold text-slate-800">계정 목록</h3>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={handleResetForm}
                    className="px-2 py-1 text-[10px] font-bold text-blue-600 bg-blue-50 rounded hover:bg-blue-100 transition-colors"
                  >
                    + 신규 등록
                  </button>
                  <span className="text-xs text-slate-400 font-medium">총 {accounts.length}명</span>
                </div>
              </div>
              <div className="flex-1 overflow-auto">
                <table className="w-full border-collapse">
                  <thead className="sticky top-0 bg-white z-10 shadow-[0_1px_0_0_rgba(0,0,0,0.05)]">
                    <tr className="border-b border-slate-100">
                      <th className="text-[11px] font-bold text-slate-400 text-left px-6 py-3 uppercase tracking-wider">이름</th>
                      <th className="text-[11px] font-bold text-slate-400 text-left px-6 py-3 uppercase tracking-wider">아이디</th>
                      <th className="text-[11px] font-bold text-slate-400 text-left px-6 py-3 uppercase tracking-wider">권한</th>
                      <th className="text-[11px] font-bold text-slate-400 text-left px-6 py-3 uppercase tracking-wider">배정 역할</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {accounts.map((account) => (
                      <tr 
                        key={account.id} 
                        onClick={() => {
                          setSelectedAccount(account);
                          setNewAccount({
                            ...account,
                            categories: account.categories || [],
                            charts: account.charts || []
                          });
                        }}
                        className={cn(
                          "hover:bg-slate-50 transition-colors cursor-pointer group",
                          selectedAccount?.id === account.id ? "bg-blue-50/50" : ""
                        )}
                      >
                        <td className="px-6 py-3.5 text-sm font-bold text-slate-700">{account.name}</td>
                        <td className="px-6 py-3.5 text-sm font-medium text-slate-500">{account.employeeId}</td>
                        <td className="px-6 py-3.5 text-sm font-medium text-slate-600">{account.role}</td>
                        <td className="px-6 py-3.5">
                          <div className="flex flex-wrap gap-1">
                            {account.categories && account.categories.length > 0 ? (
                              account.categories.map(cat => (
                                <span key={cat} className="px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded text-[10px] font-bold">
                                  {cat}
                                </span>
                              ))
                            ) : (
                              <span className="text-[10px] text-slate-300">-</span>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Account Form */}
            <div className="w-[400px] bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex flex-col gap-6">
              <h3 className="font-bold text-slate-800 pb-4 border-b border-slate-100">계정 정보 설정</h3>
              
              <div className="space-y-4 overflow-y-auto pr-2 custom-scrollbar">
                <div className="grid grid-cols-3 items-center gap-4">
                  <label className="text-xs font-bold text-slate-500">사원번호</label>
                  <input 
                    type="text" 
                    className="col-span-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    placeholder="사원번호 입력"
                    value={newAccount.employeeId || ''}
                    onChange={(e) => setNewAccount({ ...newAccount, employeeId: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-3 items-center gap-4">
                  <label className="text-xs font-bold text-slate-500">비밀번호</label>
                  <input 
                    type="password" 
                    className="col-span-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    placeholder="비밀번호"
                  />
                </div>
                <div className="grid grid-cols-3 items-center gap-4">
                  <label className="text-xs font-bold text-slate-500">비밀번호 확인</label>
                  <input 
                    type="password" 
                    className="col-span-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    placeholder="비밀번호 확인"
                  />
                </div>
                <div className="grid grid-cols-3 items-center gap-4">
                  <label className="text-xs font-bold text-slate-500">이름</label>
                  <input 
                    type="text" 
                    className="col-span-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    placeholder="이름 입력"
                    value={newAccount.name || ''}
                    onChange={(e) => setNewAccount({ ...newAccount, name: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-3 items-center gap-4">
                  <label className="text-xs font-bold text-slate-500">전화번호</label>
                  <input 
                    type="text" 
                    className="col-span-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    placeholder="010-0000-0000"
                    value={newAccount.phone || ''}
                    onChange={(e) => setNewAccount({ ...newAccount, phone: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-3 items-center gap-4">
                  <label className="text-xs font-bold text-slate-500">권한</label>
                  <select 
                    className="col-span-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    value={newAccount.role || '상담사'}
                    onChange={(e) => setNewAccount({ ...newAccount, role: e.target.value })}
                  >
                    <option>상담사</option>
                    <option>관리자</option>
                    <option>미등록관리자</option>
                  </select>
                </div>

                <div className="space-y-3 pt-2">
                  <label className="text-xs font-bold text-slate-500 block">역할 (분류 선택)</label>
                  <div className="grid grid-cols-2 gap-3">
                    {['이미징CS', 'App', '마이브라운', '네이버', '이미징영업', 'EMR', 'AI', '우리엔 CRM'].map(cat => (
                      <label key={cat} className="flex items-center gap-2 cursor-pointer group">
                        <input 
                          type="checkbox" 
                          className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500/20"
                          checked={newAccount.categories?.includes(cat)}
                          onChange={() => handleRoleToggle(cat)}
                        />
                        <span className="text-xs font-medium text-slate-600 group-hover:text-slate-900 transition-colors">{cat}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {newAccount.categories?.includes('EMR') && (
                  <div className="space-y-3 pt-2 p-3 bg-blue-50/50 rounded-lg border border-blue-100 animate-in fade-in slide-in-from-top-2">
                    <label className="text-[10px] font-bold text-blue-600 uppercase tracking-wider block">EMR 차트 선택</label>
                    <div className="grid grid-cols-2 gap-2">
                      {['efriends', 'ef365', 'PMS1.0', 'PMS365'].map(chart => (
                        <label key={chart} className="flex items-center gap-2 cursor-pointer group">
                          <input 
                            type="checkbox" 
                            className="w-3.5 h-3.5 rounded border-blue-200 text-blue-600 focus:ring-blue-500/20"
                            checked={newAccount.charts?.includes(chart)}
                            onChange={() => handleChartToggle(chart)}
                          />
                          <span className="text-[11px] font-bold text-blue-700/70 group-hover:text-blue-900 transition-colors">{chart}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-3 mt-auto">
                {selectedAccount && (
                  <button 
                    onClick={handleDeleteAccount}
                    className="w-full py-2.5 bg-white text-red-500 border border-red-200 rounded-xl font-bold hover:bg-red-50 transition-all"
                  >
                    계정 삭제
                  </button>
                )}
                <button 
                  onClick={handleSaveAccount}
                  className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20"
                >
                  {selectedAccount ? '수정 내용 저장' : '신규 계정 등록'}
                </button>
              </div>
            </div>
          </div>
        );
      case 'op-assignment':
        // Flatten categories for a unified table
        const flattenedCategories: {
          id: number;
          name: string;
          chartType: string;
          useSms: boolean;
          assignees: { name: string; active: boolean }[];
          isSub?: boolean;
        }[] = [];

        assignmentCategories.forEach(cat => {
          if (cat.subCategories) {
            cat.subCategories.forEach(sub => {
              // Find assignees from accounts who have this category AND this specific chart
              const derivedAssignees = accounts
                .filter(acc => 
                  acc.categories?.includes(cat.name) && 
                  acc.charts?.includes(sub.name)
                )
                .map(acc => ({ name: acc.name, active: true }));

              flattenedCategories.push({
                id: cat.id,
                name: cat.name,
                chartType: sub.name,
                useSms: sub.useSms,
                assignees: derivedAssignees,
                isSub: true
              });
            });
          } else {
            // Find assignees from accounts who have this category
            const derivedAssignees = accounts
              .filter(acc => acc.categories?.includes(cat.name))
              .map(acc => ({ name: acc.name, active: true }));

            flattenedCategories.push({
              id: cat.id,
              name: cat.name,
              chartType: '-',
              useSms: cat.useSms,
              assignees: derivedAssignees
            });
          }
        });

        return (
          <div className="flex-1 flex flex-col gap-6 overflow-hidden">
            {/* Unified Assignment Table */}
            <div className="flex-1 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
              <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                <h3 className="font-bold text-slate-800 flex items-center gap-2">
                  <Settings2 size={18} className="text-blue-600" /> 담당자 배정 설정
                </h3>
                <span className="text-[11px] font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded">자동 배정 로직 활성화됨</span>
              </div>
              <div className="flex-1 overflow-auto">
                <table className="w-full border-collapse">
                  <thead className="sticky top-0 bg-white z-10 shadow-[0_1px_0_0_rgba(0,0,0,0.05)]">
                    <tr className="border-b border-slate-100">
                      <th className="text-[11px] font-bold text-slate-400 text-center px-4 py-3 uppercase tracking-wider w-16">번호</th>
                      <th className="text-[11px] font-bold text-slate-400 text-left px-6 py-3 uppercase tracking-wider">분류명</th>
                      <th className="text-[11px] font-bold text-slate-400 text-left px-6 py-3 uppercase tracking-wider">차트 분류</th>
                      <th className="text-[11px] font-bold text-slate-400 text-center px-4 py-3 uppercase tracking-wider w-32">문자발송</th>
                      <th className="text-[11px] font-bold text-slate-400 text-left px-6 py-3 uppercase tracking-wider">담당자 (계정관리 연동)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {flattenedCategories.map((item, idx) => (
                      <tr key={`${item.id}-${item.chartType}-${idx}`} className="hover:bg-slate-50 transition-colors group">
                        <td className="px-4 py-4 text-sm font-medium text-slate-400 text-center">{item.id}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <span className={cn(
                              "text-sm font-bold",
                              item.name === 'EMR' ? "text-blue-600" : "text-slate-700"
                            )}>
                              {item.name}
                            </span>
                            {item.name === 'EMR' && (
                              <div className="flex items-center gap-1 px-1.5 py-0.5 bg-blue-600 text-white rounded text-[9px] font-bold animate-pulse">
                                <Check size={8} /> AUTO
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={cn(
                            "text-sm",
                            item.chartType === '-' ? "text-slate-300" : "text-slate-600 font-medium"
                          )}>
                            {item.chartType}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-center">
                          <button 
                            onClick={() => handleSmsToggle(item.id, item.chartType === '-' ? undefined : item.chartType)}
                            className={cn(
                              "px-3 py-1 rounded-full text-[10px] font-bold transition-all border shadow-sm",
                              item.useSms 
                                ? "bg-blue-600 text-white border-blue-600 hover:bg-blue-700" 
                                : "bg-white text-slate-400 border-slate-200 hover:bg-slate-50"
                            )}
                          >
                            {item.useSms ? 'ON' : 'OFF'}
                          </button>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-wrap gap-1.5">
                            {item.assignees.map((a, i) => (
                              <span key={i} className="px-2 py-0.5 bg-slate-100 rounded text-[11px] text-slate-600 font-medium border border-slate-200">
                                {a.name}
                              </span>
                            ))}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Info Box */}
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-start gap-3">
              <Info size={18} className="text-blue-500 mt-0.5" />
              <div className="space-y-1">
                <p className="text-sm font-bold text-blue-900">담당자 배정 안내</p>
                <p className="text-xs text-blue-700 leading-relaxed">
                  담당자 목록은 <strong>계정 관리</strong>에서 각 계정에 설정된 '역할' 및 '차트' 정보를 기반으로 자동 조회됩니다.<br />
                  담당자를 변경하시려면 계정 관리 메뉴에서 해당 사용자의 역할을 수정해 주세요.
                </p>
              </div>
            </div>
          </div>
        );
      case 'op-goals':
      case 'op-cr-types':
      default:
        return (
          <div className="flex-1 flex flex-col items-center justify-center bg-white rounded-2xl border border-slate-200 border-dashed p-12 text-slate-400">
            <Settings2 size={48} className="mb-4 opacity-20" />
            <p className="font-bold text-slate-900 mb-1">준비 중</p>
            <p className="text-sm">해당 기능은 현재 준비 중입니다.</p>
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col h-full p-6 overflow-hidden">
      {renderContent()}
    </div>
  );
}
