import React, { useState } from 'react';
import { User, NotificationItem } from '../types';
import {
  Mail,
  ChevronDown,
  LogOut,
  RefreshCw,
  Search,
  Bell,
  CheckCircle2,
  ShieldCheck,
  UserCheck
} from 'lucide-react';

interface HeaderProps {
  currentUser: User | null;
  onLogout?: () => void;
  onSwitchUser: (user: User) => void;
  availableUsers?: User[];
  users?: User[];
  unreadEmailCount?: number;
  notifications?: NotificationItem[];
  onOpenEmails?: () => void;
  onRefreshData?: () => void;
  isRefreshing?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  onLogout,
  onSwitchUser,
  availableUsers = [],
  users = [],
  unreadEmailCount = 0,
  notifications = [],
  onOpenEmails,
  onRefreshData,
  isRefreshing
}) => {
  const [showSwitchDropdown, setShowSwitchDropdown] = useState(false);

  const allUsers = users.length > 0 ? users : availableUsers;
  const unreadNotifs = notifications.filter((n) => !n.daDoc).length;
  const activeAlertCount = unreadEmailCount > 0 ? unreadEmailCount : unreadNotifs;

  const getRoleBadgeClass = (role?: string) => {
    switch (role) {
      case 'Admin':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Cán bộ điện toán':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Lãnh đạo phòng':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Cán bộ':
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-30 shadow-xs">
      {/* Title */}
      <div className="flex items-center space-x-3">
        <h1 className="text-sm sm:text-base font-bold text-slate-800 uppercase tracking-tight">
          Quản Lý Đề Nghị Cấp Quyền Chương Trình
        </h1>
        <span className="hidden lg:inline-flex items-center text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
          VietinBank Ninh Bình
        </span>
      </div>

      {/* Right Controls */}
      <div className="flex items-center space-x-3">
        {/* Refresh data button */}
        {onRefreshData && (
          <button
            onClick={onRefreshData}
            disabled={isRefreshing}
            title="Đồng bộ dữ liệu"
            className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>
        )}

        {/* Email / Notification Alert */}
        {onOpenEmails && (
          <button
            onClick={onOpenEmails}
            className="relative p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition cursor-pointer"
            title="Thông báo hệ thống (ducnt4@vietinbank.vn)"
          >
            <Mail className="w-3.5 h-3.5" />
            {activeAlertCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                {activeAlertCount}
              </span>
            )}
          </button>
        )}

        {/* Role / User Switcher */}
        {currentUser && (
          <div className="relative">
            <button
              onClick={() => setShowSwitchDropdown(!showSwitchDropdown)}
              className="flex items-center space-x-2 bg-slate-100 hover:bg-slate-200/80 border border-slate-200 rounded-lg px-2.5 py-1.5 transition text-left cursor-pointer"
            >
              <div className="w-6 h-6 rounded-full bg-[#0054A3] text-white font-bold flex items-center justify-center text-[11px] shadow-xs">
                {currentUser.hoTen.charAt(0)}
              </div>
              <div className="hidden sm:block">
                <div className="text-xs font-bold text-slate-800 leading-none">
                  {currentUser.hoTen}
                </div>
                <div className="text-[10px] text-slate-500 font-medium leading-tight mt-0.5">
                  {currentUser.chucVu}
                </div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
            </button>

            {/* Dropdown Menu */}
            {showSwitchDropdown && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowSwitchDropdown(false)}
                />
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-200 text-slate-800 z-50 py-2">
                  <div className="px-4 py-2 border-b border-slate-100 bg-slate-50">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Đang đăng nhập
                    </p>
                    <p className="font-bold text-xs text-slate-900 mt-0.5">{currentUser.hoTen}</p>
                    <p className="text-[11px] text-slate-500">
                      {currentUser.tenPhongBan} ({currentUser.maPhongBan})
                    </p>
                    <span
                      className={`inline-block mt-1 text-[10px] px-2 py-0.5 rounded border font-bold ${getRoleBadgeClass(
                        currentUser.chucVu
                      )}`}
                    >
                      {currentUser.chucVu}
                    </span>
                  </div>

                  <div className="px-3 py-2">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 px-2">
                      Chuyển tài khoản thử nghiệm
                    </p>
                    <div className="max-h-60 overflow-y-auto space-y-1">
                      {allUsers.map((u) => {
                        const isCurrent = u.userAD === currentUser.userAD;
                        return (
                          <button
                            key={u.id}
                            onClick={() => {
                              onSwitchUser(u);
                              setShowSwitchDropdown(false);
                            }}
                            className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex items-center justify-between transition cursor-pointer ${
                              isCurrent
                                ? 'bg-blue-50 text-[#0054A3] font-bold border border-blue-200'
                                : 'hover:bg-slate-100 text-slate-700'
                            }`}
                          >
                            <div>
                              <div className="font-semibold text-slate-800">{u.hoTen}</div>
                              <div className="text-[10px] text-slate-500">
                                {u.userAD} • {u.maPhongBan}
                              </div>
                            </div>
                            <span
                              className={`text-[9px] px-1.5 py-0.5 rounded border font-medium ${getRoleBadgeClass(
                                u.chucVu
                              )}`}
                            >
                              {u.chucVu}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {onLogout && (
                    <div className="border-t border-slate-100 pt-1 px-2">
                      <button
                        onClick={() => {
                          setShowSwitchDropdown(false);
                          onLogout();
                        }}
                        className="w-full flex items-center space-x-2 px-3 py-2 text-xs text-rose-600 hover:bg-rose-50 rounded-lg font-medium transition cursor-pointer"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Đăng xuất</span>
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  );
};
