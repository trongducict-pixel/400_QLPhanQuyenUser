import React from 'react';
import { User, UserRole } from '../types';
import {
  LayoutDashboard,
  FilePlus,
  FileText,
  Table,
  Search,
  Users,
  UserCheck,
  Building,
  Layers,
  History,
  Code2,
  Settings,
  LogOut,
  ChevronRight,
  BookOpen
} from 'lucide-react';

export type NavTab =
  | 'dashboard'
  | 'create-request'
  | 'requests'
  | 'matrix'
  | 'lookup'
  | 'guidelines'
  | 'users'
  | 'staff'
  | 'departments'
  | 'programs'
  | 'audit'
  | 'gas-guide'
  | 'config';

interface SidebarProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  currentUser: User | null;
  pendingApprovalCount?: number;
  pendingProcessCount?: number;
  onLogout?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  currentUser,
  pendingApprovalCount = 0,
  pendingProcessCount = 0,
  onLogout
}) => {
  if (!currentUser) return null;

  const role = currentUser.chucVu;

  interface NavItem {
    id: NavTab;
    label: string;
    icon: React.ElementType;
    badge?: number;
    badgeColor?: string;
    roles: UserRole[];
    section?: 'main' | 'admin';
  }

  const navItems: NavItem[] = [
    {
      id: 'dashboard',
      label: 'Bảng Điều Khiển',
      icon: LayoutDashboard,
      roles: ['Cán bộ', 'Lãnh đạo phòng', 'Cán bộ điện toán', 'Admin'],
      section: 'main'
    },
    {
      id: 'create-request',
      label: 'Lập Đề Nghị Mới',
      icon: FilePlus,
      roles: ['Cán bộ', 'Admin'],
      section: 'main'
    },
    {
      id: 'requests',
      label:
        role === 'Cán bộ'
          ? 'Đề Nghị Của Tôi'
          : role === 'Lãnh đạo phòng'
          ? 'Phê Duyệt Đề Nghị'
          : role === 'Cán bộ điện toán'
          ? 'Xử Lý Phân Quyền IT'
          : 'Quản Lý Đề Nghị',
      icon: FileText,
      badge:
        role === 'Lãnh đạo phòng'
          ? pendingApprovalCount
          : role === 'Cán bộ điện toán'
          ? pendingProcessCount
          : undefined,
      badgeColor: 'bg-red-500',
      roles: ['Cán bộ', 'Lãnh đạo phòng', 'Cán bộ điện toán', 'Admin'],
      section: 'main'
    },
    {
      id: 'guidelines',
      label: 'Căn Cứ & Hướng Dẫn',
      icon: BookOpen,
      roles: ['Cán bộ', 'Lãnh đạo phòng', 'Cán bộ điện toán', 'Admin'],
      section: 'main'
    },
    {
      id: 'matrix',
      label: 'Tổng Hợp Quyền',
      icon: Table,
      roles: ['Cán bộ', 'Lãnh đạo phòng', 'Cán bộ điện toán', 'Admin'],
      section: 'main'
    },
    {
      id: 'lookup',
      label: 'Tra Cứu Nâng Cao',
      icon: Search,
      roles: ['Cán bộ', 'Lãnh đạo phòng', 'Cán bộ điện toán', 'Admin'],
      section: 'main'
    },
    // Admin & Tools section
    {
      id: 'users',
      label: 'Quản Lý Tài Khoản User',
      icon: Users,
      roles: ['Admin'],
      section: 'admin'
    },
    {
      id: 'staff',
      label: 'Hồ Sơ Cán Bộ',
      icon: UserCheck,
      roles: ['Admin'],
      section: 'admin'
    },
    {
      id: 'departments',
      label: 'Danh Mục Phòng Ban',
      icon: Building,
      roles: ['Admin'],
      section: 'admin'
    },
    {
      id: 'programs',
      label: 'Danh Mục Chương Trình',
      icon: Layers,
      roles: ['Admin'],
      section: 'admin'
    },
    {
      id: 'audit',
      label: 'Nhật Ký Audit Log',
      icon: History,
      roles: ['Cán bộ điện toán', 'Admin'],
      section: 'admin'
    },
    {
      id: 'gas-guide',
      label: 'Google Sheets / GAS',
      icon: Code2,
      roles: ['Cán bộ', 'Lãnh đạo phòng', 'Cán bộ điện toán', 'Admin'],
      section: 'admin'
    }
  ];

  const mainNav = navItems.filter((i) => i.section === 'main' && i.roles.includes(role));
  const adminNav = navItems.filter((i) => i.section === 'admin' && i.roles.includes(role));

  const renderItem = (item: NavItem) => {
    const Icon = item.icon;
    const isActive = activeTab === item.id;
    return (
      <button
        key={item.id}
        onClick={() => onSelectTab(item.id)}
        className={`w-full flex items-center justify-between px-4 py-2.5 text-xs font-medium transition-all duration-150 cursor-pointer ${
          isActive
            ? 'text-white bg-[#ffffff18] border-l-4 border-[#DE1C24] font-semibold'
            : 'text-white/75 hover:bg-[#ffffff10] hover:text-white border-l-4 border-transparent'
        }`}
      >
        <div className="flex items-center space-x-3 truncate">
          <Icon
            className={`w-4 h-4 flex-shrink-0 ${
              isActive ? 'text-white' : 'text-white/70'
            }`}
          />
          <span className="truncate">{item.label}</span>
        </div>
        {item.badge !== undefined && item.badge > 0 && (
          <span
            className={`ml-2 text-[10px] font-bold px-1.5 py-0.5 rounded-full text-white ${
              item.badgeColor || 'bg-red-500'
            }`}
          >
            {item.badge}
          </span>
        )}
      </button>
    );
  };

  return (
    <aside className="w-64 bg-[#0054A3] flex flex-col flex-shrink-0 shadow-xl border-r border-[#004280]">
      {/* VietinBank Brand Header */}
      <div className="p-5 border-b border-white/15">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded bg-white text-[#0054A3] font-black text-sm flex items-center justify-center shadow">
            VTB
          </div>
          <div>
            <div className="text-white font-extrabold text-base leading-tight uppercase tracking-wider">
              VietinBank
            </div>
            <div className="text-blue-200 text-[10px] font-semibold uppercase tracking-widest mt-0.5">
              CN Ninh Bình • V1.0
            </div>
          </div>
        </div>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 py-3 text-xs overflow-y-auto space-y-1">
        <div className="px-4 py-1.5 text-white/40 uppercase text-[10px] font-bold tracking-widest">
          Nghiệp vụ chính
        </div>
        {mainNav.map(renderItem)}

        {adminNav.length > 0 && (
          <>
            <div className="mt-5 px-4 py-1.5 text-white/40 uppercase text-[10px] font-bold tracking-widest border-t border-white/10 pt-3">
              Hệ thống & Danh mục
            </div>
            {adminNav.map(renderItem)}
          </>
        )}
      </nav>

      {/* User Info Bar at bottom of sidebar (High Density style) */}
      <div className="p-3.5 bg-[#004280] border-t border-white/10 flex items-center">
        <div className="w-9 h-9 rounded-full bg-[#DE1C24] flex items-center justify-center font-bold text-white text-xs shadow-inner flex-shrink-0">
          {currentUser.hoTen.charAt(0)}
        </div>
        <div className="ml-2.5 min-w-0 flex-1">
          <div className="text-white text-xs font-semibold truncate leading-tight">
            {currentUser.hoTen}
          </div>
          <div className="text-white/60 text-[10px] uppercase truncate mt-0.5 font-medium">
            {currentUser.chucVu} • {currentUser.maPhongBan}
          </div>
        </div>
        {onLogout && (
          <button
            onClick={onLogout}
            title="Đăng xuất"
            className="text-white/70 hover:text-white p-1 rounded transition ml-1"
          >
            <LogOut className="w-4 h-4" />
          </button>
        )}
      </div>
    </aside>
  );
};
