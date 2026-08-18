import React, { useState, useEffect, useCallback } from 'react';
import {
  User,
  RequestRecord,
  PhongBan,
  ChuongTrinh,
  CanBo,
  SummaryUserMatrixRow,
  AuditLog,
  NotificationItem,
  RequestType
} from './types';
import { api } from './services/api';
import { Header } from './components/Header';
import { Sidebar, NavTab } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { RequestList } from './components/RequestList';
import { SummaryMatrixView } from './components/SummaryMatrixView';
import { LookupView } from './components/LookupView';
import { CreateRequestModal } from './components/CreateRequestModal';
import { ApprovalModal } from './components/ApprovalModal';
import { ITProcessModal } from './components/ITProcessModal';
import { PrintTicketModal } from './components/PrintTicketModal';
import { AdminUsersView } from './components/AdminUsersView';
import { AdminStaffView } from './components/AdminStaffView';
import { AdminDepartmentsView } from './components/AdminDepartmentsView';
import { AdminProgramsView } from './components/AdminProgramsView';
import { AdminAuditLogView } from './components/AdminAuditLogView';
import { AdminPermissionGuidelinesView } from './components/AdminPermissionGuidelinesView';
import { GASGuideView } from './components/GASGuideView';
import { LoginView } from './components/LoginView';
import { Loader2, AlertCircle, RefreshCw } from 'lucide-react';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [staffList, setStaffList] = useState<CanBo[]>([]);
  const [departments, setDepartments] = useState<PhongBan[]>([]);
  const [programs, setPrograms] = useState<ChuongTrinh[]>([]);
  const [requests, setRequests] = useState<RequestRecord[]>([]);
  const [matrixRows, setMatrixRows] = useState<SummaryUserMatrixRow[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Modals state
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedForApprove, setSelectedForApprove] = useState<RequestRecord | null>(null);
  const [selectedForIT, setSelectedForIT] = useState<RequestRecord | null>(null);
  const [selectedForPrint, setSelectedForPrint] = useState<RequestRecord | null>(null);

  // Load all initial data from backend
  const loadData = useCallback(async () => {
    try {
      setError(null);
      const [
        usersData,
        staffData,
        deptsData,
        progsData,
        reqsData,
        matrixData,
        logsData,
        notifsData
      ] = await Promise.all([
        api.getUsers(),
        api.getStaff(),
        api.getDepartments(),
        api.getPrograms(),
        api.getRequests(),
        api.getSummaryMatrix(),
        api.getAuditLogs(),
        api.getNotifications()
      ]);

      setUsers(usersData);
      setStaffList(staffData);
      setDepartments(deptsData);
      setPrograms(progsData);
      setRequests(reqsData);
      setMatrixRows(matrixData);
      setAuditLogs(logsData);
      setNotifications(notifsData);

      // Check if user session exists in localStorage
      const stored = localStorage.getItem('vietinbank_active_user');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          const matched = usersData.find(
            (u) => u.userAD === parsed.userAD || u.id === parsed.id
          );
          if (matched) {
            setCurrentUser(matched);
            api.setCurrentUser(matched);
          }
        } catch {
          // ignore
        }
      }
    } catch (err: any) {
      console.error('Failed to load data from backend:', err);
      setError(err.message || 'Không thể tải dữ liệu từ máy chủ.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Handle Login Authentication
  const handleAttemptLogin = async (userAD: string, matKhau: string): Promise<User> => {
    const user = await api.login(userAD, matKhau);
    return user;
  };

  const handleLogin = (user: User, remember: boolean) => {
    setCurrentUser(user);
    api.setCurrentUser(user);
    if (remember) {
      localStorage.setItem('vietinbank_active_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('vietinbank_active_user');
    }
    setActiveTab('dashboard');
    loadData();
  };

  // Handle Logout
  const handleLogout = () => {
    setCurrentUser(null);
    api.setCurrentUser(null);
    localStorage.removeItem('vietinbank_active_user');
    setActiveTab('dashboard');
  };

  // When switching test user in the Header
  const handleSwitchUser = (user: User) => {
    setCurrentUser(user);
    api.setCurrentUser(user);
    localStorage.setItem('vietinbank_active_user', JSON.stringify(user));
    setActiveTab('dashboard');
    loadData();
  };

  // Actions
  const handleCreateRequest = async (payload: {
    maChuongTrinh: string;
    loaiDeNghi: RequestType;
    soQDTuyenDung_PhanCong: string;
    noiDung: string;
  }) => {
    setIsSubmitting(true);
    try {
      await api.createRequest(payload);
      await loadData();
      setActiveTab('requests');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleApproveRequest = async (id: string, lyDo?: string) => {
    setIsSubmitting(true);
    try {
      await api.approveRequest(id, lyDo);
      await loadData();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRejectRequest = async (id: string, lyDo: string) => {
    setIsSubmitting(true);
    try {
      await api.rejectRequest(id, lyDo);
      await loadData();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCompleteRequest = async (
    id: string,
    payload: {
      ketQuaXuLy?: string;
      noiDungXuLy?: string;
      nhomQuyenGoiY?: string;
      nhomQuyenThucTe?: string;
      maNhomQuyenThucTe?: string;
      canhBaoCauHinh?: string;
      canCuVanBan?: string;
      ghiChuXuLy?: string;
    }
  ) => {
    setIsSubmitting(true);
    try {
      await api.completeRequest(id, payload);
      await loadData();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddUser = async (userData: Partial<User>) => {
    await api.createUser(userData);
    await loadData();
  };

  const handleUpdateUser = async (id: string, userData: Partial<User>) => {
    await api.updateUser(id, userData);
    await loadData();
  };

  const handleAddStaff = async (staffData: Partial<CanBo>) => {
    await api.createStaff(staffData);
    await loadData();
  };

  const handleUpdateStaff = async (id: string, staffData: Partial<CanBo>) => {
    await api.updateStaff(id, staffData);
    await loadData();
  };

  const handleAddDept = async (deptData: Partial<PhongBan>) => {
    await api.createDepartment(deptData);
    await loadData();
  };

  const handleUpdateDept = async (id: string, deptData: Partial<PhongBan>) => {
    await api.updateDepartment(id, deptData);
    await loadData();
  };

  const handleAddProgram = async (progData: Partial<ChuongTrinh>) => {
    await api.createProgram(progData);
    await loadData();
  };

  const handleUpdateProgram = async (id: string, progData: Partial<ChuongTrinh>) => {
    await api.updateProgram(id, progData);
    await loadData();
  };

  // Pending counters for badges
  const pendingApprovalCount = requests.filter(
    (r) =>
      currentUser &&
      r.maPhongBan === currentUser.maPhongBan &&
      (r.trangThai === 'Chờ lãnh đạo phòng phê duyệt' || r.trangThai === 'Đề nghị mới')
  ).length;

  const pendingProcessCount = requests.filter((r) => r.trangThai === 'Chờ xử lý').length;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-[#002855] to-[#004F9E] flex flex-col items-center justify-center p-4 text-white">
        <div className="bg-white p-4 rounded-2xl shadow-xl mb-4">
          <img
            src="https://raw.githubusercontent.com/giadinhbanker/anh-super-app-bac-phu-tho/main/Logo%20VietinBank.png"
            alt="VietinBank"
            className="h-10 w-auto object-contain"
            referrerPolicy="no-referrer"
          />
        </div>
        <Loader2 className="w-8 h-8 text-blue-200 animate-spin mb-3" />
        <div className="text-base font-bold text-white tracking-wide">
          Hệ thống Quản lý Đề nghị Cấp quyền Chương trình
        </div>
        <div className="text-xs text-blue-200 mt-1 font-medium">
          VietinBank – Chi nhánh Ninh Bình • Đang khởi tạo dữ liệu...
        </div>
      </div>
    );
  }

  if (error && !currentUser && users.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <div className="bg-white p-6 rounded-2xl border border-rose-200 shadow-lg max-w-md w-full text-center space-y-4">
          <AlertCircle className="w-12 h-12 text-rose-600 mx-auto" />
          <h2 className="text-lg font-bold text-gray-900">Không thể kết nối máy chủ</h2>
          <p className="text-xs text-gray-600 leading-relaxed">{error}</p>
          <button
            onClick={loadData}
            className="inline-flex items-center gap-2 bg-[#004F9E] text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow hover:bg-[#003B77] transition"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Thử lại</span>
          </button>
        </div>
      </div>
    );
  }

  // If not logged in, render the Login Screen
  if (!currentUser) {
    return (
      <LoginView
        users={users}
        onLogin={handleLogin}
        onAttemptLogin={handleAttemptLogin}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col md:flex-row text-slate-900 font-sans antialiased">
      {/* High Density Left Sidebar */}
      <Sidebar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        currentUser={currentUser}
        pendingApprovalCount={pendingApprovalCount}
        pendingProcessCount={pendingProcessCount}
        onLogout={handleLogout}
      />

      {/* Main Column */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen md:h-screen md:overflow-hidden bg-[#f8fafc]">
        {/* Top Header */}
        <Header
          currentUser={currentUser}
          users={users}
          onSwitchUser={handleSwitchUser}
          notifications={notifications}
          unreadEmailCount={requests.filter((r) => r.trangThai === 'Chờ xử lý').length}
          onOpenEmails={() => setActiveTab('requests')}
          onRefreshData={loadData}
          onLogout={handleLogout}
        />

        {/* Dynamic Main Workspace Content */}
        <main className="flex-1 p-4 sm:p-6 overflow-y-auto min-w-0 space-y-4">
          {activeTab === 'dashboard' && currentUser && (
            <Dashboard
              currentUser={currentUser}
              requests={requests}
              departments={departments}
              programs={programs}
              users={users}
              auditLogs={auditLogs}
              onNavigate={setActiveTab}
              onOpenCreate={() => setIsCreateOpen(true)}
              onOpenApprove={(req) => setSelectedForApprove(req)}
              onOpenReject={(req) => setSelectedForApprove(req)}
              onOpenProcess={(req) => setSelectedForIT(req)}
              onOpenPrint={(req) => setSelectedForPrint(req)}
            />
          )}

          {activeTab === 'create-request' && currentUser && (
            <div className="max-w-3xl mx-auto">
              <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm mb-4">
                <h2 className="text-base font-bold text-gray-900 mb-1">
                  Lập Đề nghị Cấp quyền Chương trình
                </h2>
                <p className="text-xs text-gray-500">
                  Điền các thông tin đề nghị Cấp mới, Thay đổi hoặc Hủy người dùng quyền truy cập theo mẫu quy định của VietinBank.
                </p>
              </div>
              <CreateRequestModal
                currentUser={currentUser}
                activePrograms={programs.filter((p) => p.trangThai === 'Hoạt động')}
                isOpen={true}
                onClose={() => setActiveTab('requests')}
                onSubmit={handleCreateRequest}
                isSubmitting={isSubmitting}
              />
            </div>
          )}

          {activeTab === 'requests' && currentUser && (
            <RequestList
              requests={requests}
              currentUser={currentUser}
              departments={departments}
              programs={programs}
              onOpenCreate={() => setIsCreateOpen(true)}
              onOpenApprove={(req) => setSelectedForApprove(req)}
              onOpenReject={(req) => setSelectedForApprove(req)}
              onOpenProcess={(req) => setSelectedForIT(req)}
              onOpenPrint={(req) => setSelectedForPrint(req)}
            />
          )}

          {activeTab === 'guidelines' && currentUser && (
            <AdminPermissionGuidelinesView
              programs={programs}
              departments={departments}
              currentUser={currentUser}
            />
          )}

          {activeTab === 'matrix' && (
            <SummaryMatrixView
              programs={programs.filter((p) => p.trangThai === 'Hoạt động')}
              rows={matrixRows}
              departments={departments}
            />
          )}

          {activeTab === 'lookup' && currentUser && (
            <LookupView
              requests={requests}
              currentUser={currentUser}
              departments={departments}
              programs={programs}
              onOpenPrint={(req) => setSelectedForPrint(req)}
            />
          )}

          {activeTab === 'staff' && (currentUser?.chucVu === 'Admin' || currentUser?.chucVu === 'Cán bộ điện toán') && (
            <AdminStaffView
              staffList={staffList}
              departments={departments}
              onAddStaff={handleAddStaff}
              onUpdateStaff={handleUpdateStaff}
            />
          )}

          {activeTab === 'users' && (currentUser?.chucVu === 'Admin' || currentUser?.chucVu === 'Cán bộ điện toán') && (
            <AdminUsersView
              users={users}
              departments={departments}
              onAddUser={handleAddUser}
              onUpdateUser={handleUpdateUser}
            />
          )}

          {activeTab === 'programs' && (currentUser?.chucVu === 'Admin' || currentUser?.chucVu === 'Cán bộ điện toán') && (
            <AdminProgramsView
              programs={programs}
              onAddProgram={handleAddProgram}
              onUpdateProgram={handleUpdateProgram}
              onNavigateToGuidelines={() => setActiveTab('guidelines')}
            />
          )}

          {activeTab === 'departments' && (currentUser?.chucVu === 'Admin' || currentUser?.chucVu === 'Cán bộ điện toán') && (
            <AdminDepartmentsView
              departments={departments}
              onAddDepartment={handleAddDept}
              onUpdateDepartment={handleUpdateDept}
            />
          )}

          {activeTab === 'audit' && (currentUser?.chucVu === 'Admin' || currentUser?.chucVu === 'Cán bộ điện toán') && (
            <AdminAuditLogView logs={auditLogs} />
          )}

          {activeTab === 'gas-guide' && (currentUser?.chucVu === 'Admin' || currentUser?.chucVu === 'Cán bộ điện toán') && (
            <GASGuideView />
          )}
        </main>
      </div>

      {/* Global Modals */}
      {currentUser && (
        <CreateRequestModal
          currentUser={currentUser}
          activePrograms={programs.filter((p) => p.trangThai === 'Hoạt động')}
          isOpen={isCreateOpen}
          onClose={() => setIsCreateOpen(false)}
          onSubmit={handleCreateRequest}
          isSubmitting={isSubmitting}
        />
      )}

      {currentUser && (
        <ApprovalModal
          request={selectedForApprove}
          currentUser={currentUser}
          isOpen={!!selectedForApprove}
          onClose={() => setSelectedForApprove(null)}
          onApprove={handleApproveRequest}
          onReject={handleRejectRequest}
          isProcessing={isSubmitting}
        />
      )}

      {currentUser && (
        <ITProcessModal
          request={selectedForIT}
          currentUser={currentUser}
          isOpen={!!selectedForIT}
          onClose={() => setSelectedForIT(null)}
          onComplete={handleCompleteRequest}
          isProcessing={isSubmitting}
        />
      )}

      {currentUser && (
        <PrintTicketModal
          request={selectedForPrint}
          currentUser={currentUser}
          isOpen={!!selectedForPrint}
          onClose={() => setSelectedForPrint(null)}
        />
      )}
    </div>
  );
}
