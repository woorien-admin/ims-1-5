/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import CounselingManagement from './components/CounselingManagement';
import CounselingHistory from './components/CounselingHistory';
import StatsDashboard from './components/StatsDashboard';
import StatsPerformance from './components/StatsPerformance';
import ReferenceManual from './components/ReferenceManual';
import ReferenceFAQ from './components/ReferenceFAQ';
import ReferenceNotice from './components/ReferenceNotice';
import AdminSettings from './components/AdminSettings';
import AdminSystem from './components/AdminSystem';
import ScheduleManagement from './components/ScheduleManagement';
import { UserRole, User } from './types';
import { Lock } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('counseling');
  const [user, setUser] = useState<User>({
    id: 'admin-01',
    email: 'admin@example.com',
    name: '관리자',
    role: UserRole.ADMIN,
    department: '운영지원팀'
  });

  const handleLogout = () => {
    console.log("Logout clicked");
  };

  const handleRoleChange = (role: UserRole) => {
    setUser(prev => ({ ...prev, role }));
  };

  const renderContent = () => {
    switch (activeTab) {
      // Counseling
      case 'counseling':
        return <CounselingManagement user={user} />;
      case 'counseling-history':
        return <CounselingHistory />;
      
      // Stats
      case 'statistics':
      case 'stats-chart':
      case 'stats-hospital':
      case 'stats-counselor-process':
      case 'stats-counselor-register':
      case 'stats-complete-time':
      case 'stats-delay-time':
      case 'stats-type':
      case 'stats-dashboard':
        return <StatsDashboard />;
      case 'stats-performance':
        return <StatsPerformance />;
      case 'stats-download':
        return <div className="p-8">데이터 다운로드 화면 (준비 중)</div>;
      
      // Reference
      case 'reference':
      case 'ref-inspection':
      case 'ref-plan-category':
      case 'ref-plan':
      case 'reference-manual':
        return <ReferenceManual />;
      case 'reference-faq':
        return <ReferenceFAQ />;
      
      // Notice
      case 'notice':
      case 'notice-register':
      case 'notice-list':
      case 'notice-management':
        return <ReferenceNotice activeTab={activeTab} />;
      
      // Schedule
      case 'schedule':
      case 'schedule-work':
        return <ScheduleManagement activeTab={activeTab} />;
      
      // Operation / Admin
      case 'operation':
      case 'op-accounts':
      case 'op-assignment':
      case 'op-goals':
      case 'op-cr-types':
      case 'admin':
      case 'admin-schedule':
      case 'admin-rules':
      case 'op-users':
      case 'op-hospitals':
        return <AdminSettings activeTab={activeTab} />;
      case 'admin-system':
        return <AdminSystem />;
        
      default:
        return <div className="p-8 text-slate-400">준비 중인 화면입니다. ({activeTab})</div>;
    }
  };

  return (
    <Layout 
      activeTab={activeTab} 
      setActiveTab={setActiveTab} 
      user={user} 
      onRoleChange={handleRoleChange}
      onLogout={handleLogout}
    >
      {renderContent()}
    </Layout>
  );
}


