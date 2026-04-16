import React, { useState } from 'react';
import { 
  Settings, 
  Shield, 
  Database, 
  Bell, 
  Globe, 
  Monitor, 
  Lock, 
  Save,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import { cn } from '../lib/utils';

export default function AdminSystem() {
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }, 1500);
  };

  return (
    <div className="flex flex-col h-full overflow-hidden bg-[var(--bg-secondary)]">
      {/* Header */}
      <div className="px-6 py-4 bg-[var(--bg-primary)] border-b border-[var(--border-tertiary)] flex items-center justify-between shrink-0">
        <div>
          <h2 className="text-xl font-bold text-[var(--text-primary)]">시스템 설정</h2>
          <p className="text-sm text-[var(--text-tertiary)]">IMS 2.0의 전역 시스템 환경을 구성하고 관리합니다.</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className={cn(
            "flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-bold transition-all shadow-md",
            saveSuccess ? "bg-[var(--bg-success)] text-[var(--text-success)]" : "bg-[#1A1A1A] text-white hover:bg-black"
          )}
        >
          {isSaving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : saveSuccess ? <CheckCircle2 size={16} /> : <Save size={16} />}
          {isSaving ? '저장 중...' : saveSuccess ? '저장 완료' : '설정 저장'}
        </button>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* General Settings */}
          <section className="bg-[var(--bg-primary)] p-6 rounded-xl border border-[var(--border-tertiary)] shadow-sm">
            <h3 className="font-bold text-[var(--text-primary)] mb-6 flex items-center gap-2">
              <Settings size={18} className="text-[var(--text-info)]" /> 일반 설정
            </h3>
            <div className="space-y-6">
              <div className="grid grid-cols-12 gap-4 items-center">
                <div className="col-span-4">
                  <label className="text-sm font-bold text-[var(--text-secondary)]">시스템 이름</label>
                  <p className="text-[10px] text-[var(--text-tertiary)] mt-0.5">브라우저 타이틀 및 헤더에 표시됩니다.</p>
                </div>
                <div className="col-span-8">
                  <input type="text" defaultValue="IMS 2.0 - Customer Counseling Management" className="w-full px-4 py-2 bg-[var(--bg-secondary)] border border-[var(--border-tertiary)] rounded-lg text-sm focus:outline-none focus:border-[var(--text-info)]" />
                </div>
              </div>
              <div className="grid grid-cols-12 gap-4 items-center">
                <div className="col-span-4">
                  <label className="text-sm font-bold text-[var(--text-secondary)]">언어 설정</label>
                  <p className="text-[10px] text-[var(--text-tertiary)] mt-0.5">시스템 기본 언어를 선택합니다.</p>
                </div>
                <div className="col-span-8">
                  <select className="w-full px-4 py-2 bg-[var(--bg-secondary)] border border-[var(--border-tertiary)] rounded-lg text-sm focus:outline-none focus:border-[var(--text-info)]">
                    <option>한국어 (Korean)</option>
                    <option>영어 (English)</option>
                  </select>
                </div>
              </div>
            </div>
          </section>

          {/* Security & Auth */}
          <section className="bg-[var(--bg-primary)] p-6 rounded-xl border border-[var(--border-tertiary)] shadow-sm">
            <h3 className="font-bold text-[var(--text-primary)] mb-6 flex items-center gap-2">
              <Shield size={18} className="text-[var(--text-danger)]" /> 보안 및 인증
            </h3>
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-tertiary)]">
                <div>
                  <label className="text-sm font-bold text-[var(--text-primary)]">2단계 인증 (2FA) 필수화</label>
                  <p className="text-xs text-[var(--text-tertiary)] mt-0.5">모든 관리자 및 상담원 계정에 대해 2단계 인증을 강제합니다.</p>
                </div>
                <div className="relative inline-block w-10 h-6">
                  <input type="checkbox" defaultChecked className="peer opacity-0 w-0 h-0" />
                  <span className="absolute cursor-pointer top-0 left-0 right-0 bottom-0 bg-gray-300 transition-all rounded-full before:absolute before:h-4 before:w-4 before:left-1 before:bottom-1 before:bg-white before:transition-all before:rounded-full peer-checked:bg-[var(--text-info)] peer-checked:before:translate-x-4"></span>
                </div>
              </div>
              <div className="grid grid-cols-12 gap-4 items-center">
                <div className="col-span-4">
                  <label className="text-sm font-bold text-[var(--text-secondary)]">세션 만료 시간</label>
                  <p className="text-[10px] text-[var(--text-tertiary)] mt-0.5">미활동 시 자동 로그아웃되는 시간(분)입니다.</p>
                </div>
                <div className="col-span-8">
                  <div className="flex items-center gap-2">
                    <input type="number" defaultValue="60" className="w-24 px-4 py-2 bg-[var(--bg-secondary)] border border-[var(--border-tertiary)] rounded-lg text-sm focus:outline-none focus:border-[var(--text-info)]" />
                    <span className="text-sm text-[var(--text-secondary)]">분</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Database & API */}
          <section className="bg-[var(--bg-primary)] p-6 rounded-xl border border-[var(--border-tertiary)] shadow-sm">
            <h3 className="font-bold text-[var(--text-primary)] mb-6 flex items-center gap-2">
              <Database size={18} className="text-[var(--text-success)]" /> 데이터베이스 및 API 연동
            </h3>
            <div className="space-y-6">
              <div className="grid grid-cols-12 gap-4 items-center">
                <div className="col-span-4">
                  <label className="text-sm font-bold text-[var(--text-secondary)]">VetCRM API Endpoint</label>
                  <p className="text-[10px] text-[var(--text-tertiary)] mt-0.5">연동할 VetCRM 서버 주소입니다.</p>
                </div>
                <div className="col-span-8">
                  <input type="text" defaultValue="https://api.vetcrm.com/v2/ims-sync" className="w-full px-4 py-2 bg-[var(--bg-secondary)] border border-[var(--border-tertiary)] rounded-lg text-sm focus:outline-none focus:border-[var(--text-info)]" />
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-[var(--bg-danger)]/10 text-[var(--text-danger)] rounded-xl border border-[var(--bg-danger)]/20">
                <AlertCircle size={18} className="shrink-0" />
                <p className="text-xs font-medium leading-relaxed">API 엔드포인트 변경 시 실시간 데이터 동기화가 일시적으로 중단될 수 있습니다. 변경 전 반드시 백업을 수행하세요.</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
