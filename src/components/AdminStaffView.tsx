import React, { useState, useMemo } from 'react';
import { CanBo, PhongBan, UserRole } from '../types';
import {
  UserCheck,
  Plus,
  Edit2,
  X,
  AlertCircle,
  Key,
  Shield,
  Eye,
  EyeOff,
  Copy,
  Check,
  Search,
  Filter,
  Sparkles,
  RefreshCw,
  Lock,
  Unlock,
  Send,
  UserPlus,
  Building,
  CheckCircle2
} from 'lucide-react';
import { api } from '../services/api';

interface AdminStaffViewProps {
  staffList: CanBo[];
  departments: PhongBan[];
  onAddStaff: (staff: Partial<CanBo>) => Promise<void>;
  onUpdateStaff: (id: string, staff: Partial<CanBo>) => Promise<void>;
}

export const AdminStaffView: React.FC<AdminStaffViewProps> = ({
  staffList,
  departments,
  onAddStaff,
  onUpdateStaff
}) => {
  // Filters & Search
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState('ALL');
  const [accountStatusFilter, setAccountStatusFilter] = useState<'ALL' | 'HAS_ACCOUNT' | 'NO_ACCOUNT'>('ALL');
  const [workStatusFilter, setWorkStatusFilter] = useState<'ALL' | 'WORKING' | 'LEAVING'>('ALL');

  // Password visibility map
  const [showPasswordMap, setShowPasswordMap] = useState<Record<string, boolean>>({});

  // Copy success tooltip state
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Modals
  const [isAddEditOpen, setIsAddEditOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<CanBo | null>(null);

  const [isProvisionOpen, setIsProvisionOpen] = useState(false);
  const [provisionStaff, setProvisionStaff] = useState<CanBo | null>(null);

  const [isResetPassOpen, setIsResetPassOpen] = useState(false);
  const [resetTargetStaff, setResetTargetStaff] = useState<CanBo | null>(null);

  // Handover Info Modal after Provision or Reset
  const [handoverData, setHandoverData] = useState<{
    hoTen: string;
    maCanBo: string;
    userAD: string;
    matKhau: string;
    vaiTro: string;
    tenPhongBan: string;
    title: string;
  } | null>(null);

  // Form states for Add/Edit
  const [maCanBo, setMaCanBo] = useState('');
  const [hoTen, setHoTen] = useState('');
  const [maUserAD, setMaUserAD] = useState('');
  const [userAD, setUserAD] = useState('');
  const [matKhau, setMatKhau] = useState('123456');
  const [email, setEmail] = useState('');
  const [soDienThoai, setSoDienThoai] = useState('');
  const [vaiTro, setVaiTro] = useState<UserRole>('Cán bộ');
  const [maPhongBan, setMaPhongBan] = useState(departments[0]?.maPhongBan || 'P001');
  const [chucVu, setChucVu] = useState('Giao dịch viên');
  const [trangThai, setTrangThai] = useState<'Đang làm việc' | 'Nghỉ việc'>('Đang làm việc');
  const [hasAccountCheckbox, setHasAccountCheckbox] = useState(true);

  // Form states for Reset Password Modal
  const [resetOption, setResetOption] = useState<'DEFAULT' | 'RANDOM' | 'CUSTOM'>('DEFAULT');
  const [customPassword, setCustomPassword] = useState('');
  const [generatedPassword, setGeneratedPassword] = useState('123456');

  // Form states for Provision Modal
  const [provUserAD, setProvUserAD] = useState('');
  const [provMaUserAD, setProvMaUserAD] = useState('');
  const [provMatKhau, setProvMatKhau] = useState('123456');
  const [provEmail, setProvEmail] = useState('');
  const [provVaiTro, setProvVaiTro] = useState<UserRole>('Cán bộ');
  const [provSoDienThoai, setProvSoDienThoai] = useState('');

  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Helper: Remove Vietnamese tones for userAD suggestions
  const removeVietnameseTones = (str: string): string => {
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a');
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e');
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, 'i');
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o');
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u');
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y');
    str = str.replace(/đ/g, 'd');
    str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, 'A');
    str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, 'E');
    str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, 'I');
    str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, 'O');
    str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, 'U');
    str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, 'Y');
    str = str.replace(/Đ/g, 'D');
    return str.toLowerCase();
  };

  const generateUserADFromName = (name: string): string => {
    const clean = removeVietnameseTones(name.trim());
    const parts = clean.split(/\s+/).filter(Boolean);
    if (parts.length === 0) return '';
    if (parts.length === 1) return parts[0];
    const lastName = parts[parts.length - 1];
    const initials = parts.slice(0, -1).map(p => p[0]).join('');
    return `${lastName}${initials}`;
  };

  const generateRandomStrongPass = (): string => {
    const prefixes = ['Vtb@', 'Vietin#', 'NinhBinh$', 'NB@', 'VtbPass#'];
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const year = new Date().getFullYear();
    const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
    let suffix = '';
    for (let i = 0; i < 3; i++) {
      suffix += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return `${prefix}${year}!${suffix}`;
  };

  // Stats calculation
  const totalStaff = staffList.length;
  const staffWithAccount = staffList.filter((s) => s.userAD && s.userAD.trim() !== '').length;
  const staffWithoutAccount = totalStaff - staffWithAccount;
  const workingStaff = staffList.filter((s) => s.trangThai === 'Đang làm việc' || s.trangThai === 'Hoạt động').length;

  // Filtered staff
  const filteredStaff = useMemo(() => {
    return staffList.filter((s) => {
      // Search
      const search = searchTerm.toLowerCase().trim();
      const matchSearch =
        !search ||
        s.hoTen.toLowerCase().includes(search) ||
        s.maCanBo.toLowerCase().includes(search) ||
        (s.userAD && s.userAD.toLowerCase().includes(search)) ||
        (s.email && s.email.toLowerCase().includes(search)) ||
        (s.chucVu && s.chucVu.toLowerCase().includes(search));

      // Dept
      const matchDept = selectedDept === 'ALL' || s.maPhongBan === selectedDept;

      // Account status
      const hasAcc = !!(s.userAD && s.userAD.trim() !== '');
      const matchAccount =
        accountStatusFilter === 'ALL' ||
        (accountStatusFilter === 'HAS_ACCOUNT' && hasAcc) ||
        (accountStatusFilter === 'NO_ACCOUNT' && !hasAcc);

      // Work status
      const isWorking = s.trangThai === 'Đang làm việc' || s.trangThai === 'Hoạt động';
      const matchWork =
        workStatusFilter === 'ALL' ||
        (workStatusFilter === 'WORKING' && isWorking) ||
        (workStatusFilter === 'LEAVING' && !isWorking);

      return matchSearch && matchDept && matchAccount && matchWork;
    });
  }, [staffList, searchTerm, selectedDept, accountStatusFilter, workStatusFilter]);

  // Copy helper
  const handleCopyCredentials = (staff: CanBo) => {
    const text = `[VIETINBANK - THÔNG TIN TÀI KHOẢN HỆ THỐNG]\n- Cán bộ: ${staff.hoTen} (${staff.maCanBo})\n- Đơn vị: ${staff.tenPhongBan}\n- Tài khoản User AD: ${staff.userAD || 'Chưa cấp'}\n- Mật khẩu đăng nhập: ${staff.matKhau || '123456'}\n- Vai trò hệ thống: ${staff.vaiTro || 'Cán bộ'}\n- Đường dẫn truy cập: ${window.location.origin}`;
    navigator.clipboard.writeText(text);
    setCopiedId(staff.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  // Open Add Modal
  const handleOpenAdd = () => {
    setEditingStaff(null);
    const nextSeq = staffList.length + 1;
    const eightDigitCode = String(nextSeq).padStart(8, '0');
    setMaCanBo(eightDigitCode);
    setHoTen('');
    setUserAD('');
    setMaUserAD(eightDigitCode);
    setMatKhau('123456');
    setEmail('');
    setSoDienThoai('');
    setVaiTro('Cán bộ');
    setMaPhongBan(departments[0]?.maPhongBan || 'P_KHDN');
    setChucVu('Nhân viên');
    setTrangThai('Đang làm việc');
    setHasAccountCheckbox(true);
    setError('');
    setIsAddEditOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (staff: CanBo) => {
    setEditingStaff(staff);
    setMaCanBo(staff.maCanBo);
    setHoTen(staff.hoTen);
    setUserAD(staff.userAD || '');
    setMaUserAD(staff.maUserAD || '');
    setMatKhau(staff.matKhau || '123456');
    setEmail(staff.email || '');
    setSoDienThoai(staff.soDienThoai || '');
    setVaiTro(staff.vaiTro || 'Cán bộ');
    setMaPhongBan(staff.maPhongBan);
    setChucVu(staff.chucVu);
    setTrangThai(staff.trangThai === 'Nghỉ việc' ? 'Nghỉ việc' : 'Đang làm việc');
    setHasAccountCheckbox(!!(staff.userAD && staff.userAD.trim() !== ''));
    setError('');
    setIsAddEditOpen(true);
  };

  // Handle Save Staff
  const handleSubmitStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    const selectedD = departments.find((d) => d.maPhongBan === maPhongBan);
    const tenPhongBan = selectedD ? selectedD.tenPhongBan : '';

    const cleanUserAD = hasAccountCheckbox ? userAD.trim().toLowerCase() : '';
    const cleanMatKhau = hasAccountCheckbox ? (matKhau.trim() || '123456') : '';

    try {
      if (editingStaff) {
        await onUpdateStaff(editingStaff.id, {
          maCanBo,
          hoTen,
          userAD: cleanUserAD,
          maUserAD,
          matKhau: cleanMatKhau,
          email: email.trim(),
          soDienThoai: soDienThoai.trim(),
          vaiTro,
          maPhongBan,
          tenPhongBan,
          chucVu,
          trangThai,
          hasAccount: hasAccountCheckbox
        });
      } else {
        await onAddStaff({
          maCanBo,
          hoTen,
          userAD: cleanUserAD,
          maUserAD,
          matKhau: cleanMatKhau,
          email: email.trim() || (cleanUserAD ? `${cleanUserAD}@vietinbank.vn` : ''),
          soDienThoai: soDienThoai.trim(),
          vaiTro,
          maPhongBan,
          tenPhongBan,
          chucVu,
          trangThai,
          hasAccount: hasAccountCheckbox
        });
      }
      setIsAddEditOpen(false);
    } catch (err: any) {
      setError(err.message || 'Lỗi khi lưu hồ sơ cán bộ.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Open Provision Modal
  const handleOpenProvision = (staff: CanBo) => {
    setProvisionStaff(staff);
    const suggestedAD = generateUserADFromName(staff.hoTen);
    const eightDigitCode = (staff.maCanBo || String(staffList.length + 1)).padStart(8, '0');
    setProvUserAD(suggestedAD);
    setProvMaUserAD(staff.maUserAD || eightDigitCode);
    setProvMatKhau('123456');
    setProvEmail(staff.email || (suggestedAD ? `${suggestedAD}@vietinbank.vn` : ''));
    setProvVaiTro(staff.vaiTro || 'Cán bộ');
    setProvSoDienThoai(staff.soDienThoai || '');
    setError('');
    setIsProvisionOpen(true);
  };

  // Submit Provision Account
  const handleSubmitProvision = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!provisionStaff) return;
    setError('');
    setIsSubmitting(true);

    try {
      const res = await api.createStaffAccount(provisionStaff.id, {
        userAD: provUserAD.trim().toLowerCase(),
        maUserAD: provMaUserAD.trim(),
        matKhau: provMatKhau.trim() || '123456',
        vaiTro: provVaiTro,
        email: provEmail.trim() || `${provUserAD.trim().toLowerCase()}@vietinbank.vn`,
        soDienThoai: provSoDienThoai.trim()
      });

      if (res.data) {
        await onUpdateStaff(provisionStaff.id, res.data);
      }

      setIsProvisionOpen(false);
      // Show Handover Modal
      setHandoverData({
        hoTen: provisionStaff.hoTen,
        maCanBo: provisionStaff.maCanBo,
        userAD: provUserAD.trim().toLowerCase(),
        matKhau: provMatKhau.trim() || '123456',
        vaiTro: provVaiTro,
        tenPhongBan: provisionStaff.tenPhongBan,
        title: 'Cấp Tài khoản & Mật khẩu Đăng nhập Thành công'
      });
    } catch (err: any) {
      setError(err.message || 'Lỗi khi cấp tài khoản cho cán bộ.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Open Reset Password Modal
  const handleOpenResetPassword = (staff: CanBo) => {
    setResetTargetStaff(staff);
    setResetOption('DEFAULT');
    setGeneratedPassword('123456');
    setCustomPassword('');
    setError('');
    setIsResetPassOpen(true);
  };

  // Submit Reset Password
  const handleSubmitResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetTargetStaff) return;
    setError('');
    setIsSubmitting(true);

    let finalPass = '123456';
    if (resetOption === 'RANDOM') {
      finalPass = generatedPassword;
    } else if (resetOption === 'CUSTOM') {
      if (!customPassword.trim()) {
        setError('Vui lòng nhập mật khẩu mới tùy chỉnh.');
        setIsSubmitting(false);
        return;
      }
      finalPass = customPassword.trim();
    }

    try {
      const res = await api.resetStaffPassword(resetTargetStaff.id, finalPass);
      if (res.data) {
        await onUpdateStaff(resetTargetStaff.id, res.data);
      }

      setIsResetPassOpen(false);
      // Show Handover Modal
      setHandoverData({
        hoTen: resetTargetStaff.hoTen,
        maCanBo: resetTargetStaff.maCanBo,
        userAD: resetTargetStaff.userAD,
        matKhau: finalPass,
        vaiTro: resetTargetStaff.vaiTro || 'Cán bộ',
        tenPhongBan: resetTargetStaff.tenPhongBan,
        title: 'Đặt lại (Reset) Mật khẩu Thành công'
      });
    } catch (err: any) {
      setError(err.message || 'Lỗi khi đặt lại mật khẩu.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Banner & KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block">
              Tổng số Cán bộ
            </span>
            <div className="text-2xl font-black text-gray-900 mt-1">{totalStaff}</div>
            <span className="text-[11px] text-gray-400 font-medium">Toàn chi nhánh</span>
          </div>
          <div className="w-11 h-11 rounded-xl bg-blue-50 text-[#004F9E] flex items-center justify-center font-bold">
            <UserCheck className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-emerald-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wider block">
              Đã Cấp User AD & MK
            </span>
            <div className="text-2xl font-black text-emerald-800 mt-1">{staffWithAccount}</div>
            <span className="text-[11px] text-emerald-600 font-semibold">
              {totalStaff > 0 ? `${Math.round((staffWithAccount / totalStaff) * 100)}% đã kích hoạt` : ''}
            </span>
          </div>
          <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
            <Key className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-amber-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-amber-700 uppercase tracking-wider block">
              Chưa Cấp Tài Khoản
            </span>
            <div className="text-2xl font-black text-amber-800 mt-1">{staffWithoutAccount}</div>
            <span className="text-[11px] text-amber-600 font-medium">Cần cấp User AD & MK</span>
          </div>
          <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
            <UserPlus className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-blue-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-[#004F9E] uppercase tracking-wider block">
              Đang làm việc
            </span>
            <div className="text-2xl font-black text-gray-900 mt-1">{workingStaff}</div>
            <span className="text-[11px] text-blue-600 font-medium">Hồ sơ hoạt động</span>
          </div>
          <div className="w-11 h-11 rounded-xl bg-blue-50 text-[#004F9E] flex items-center justify-center font-bold">
            <Shield className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Guide Banner for Editing Staff Information */}
      <div className="p-3.5 bg-gradient-to-r from-blue-50 via-sky-50 to-indigo-50 border border-blue-200 rounded-2xl flex items-start gap-3 shadow-xs">
        <div className="p-2 bg-[#004F9E] text-white rounded-xl flex-shrink-0 mt-0.5">
          <Edit2 className="w-4 h-4" />
        </div>
        <div className="text-xs text-slate-700 space-y-1">
          <div className="font-bold text-[#004F9E] flex items-center gap-2">
            <span>Cách chỉnh sửa thông tin Cán bộ:</span>
            <span className="text-[10px] bg-blue-100 text-[#004F9E] font-bold px-2 py-0.5 rounded border border-blue-200">
              Mã User AD định dạng 8 ký tự số (VD: 00005568, 00006961)
            </span>
          </div>
          <p className="text-[11.5px] leading-relaxed text-slate-600">
            • Nhấn vào nút <strong>"Sửa" (biểu tượng ✏️ bút chì)</strong> tại cột <strong>Thao tác</strong> của cán bộ bất kỳ để chỉnh sửa: <strong>Phòng ban</strong>, <strong>Số điện thoại</strong>, <strong>Tài khoản User AD</strong>, <strong>Mã User AD (8 số)</strong>, <strong>Chức danh</strong>, <strong>Mật khẩu</strong> và <strong>Vai trò hệ thống</strong>.
            <br />
            • Sau khi lưu, thông tin sẽ được tự động cập nhật đồng bộ sang bảng USERS và Google Sheets liên tục.
          </p>
        </div>
      </div>

      {/* Main Container */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {/* Header toolbar */}
        <div className="p-4 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-3 bg-gradient-to-r from-slate-50 to-white">
          <div>
            <div className="flex items-center space-x-2">
              <div className="w-7 h-7 rounded-lg bg-[#004F9E] text-white flex items-center justify-center">
                <UserCheck className="w-4 h-4" />
              </div>
              <h2 className="text-base font-bold text-gray-900">Danh mục Hồ sơ Cán bộ & Quản lý Đăng nhập</h2>
              <span className="text-xs bg-blue-100 text-[#004F9E] font-bold px-2.5 py-0.5 rounded-full border border-blue-200">
                Admin Quản trị
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Quản lý danh sách cán bộ, cấp tài khoản User AD & mật khẩu đăng nhập, đặt lại (reset) mật khẩu do Admin quản trị.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleOpenAdd}
              className="inline-flex items-center gap-1.5 bg-[#004F9E] hover:bg-[#003B77] text-white text-xs font-bold px-3.5 py-2 rounded-xl shadow-sm transition"
            >
              <Plus className="w-4 h-4" />
              <span>Thêm Cán bộ mới</span>
            </button>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="p-3 bg-slate-50/70 border-b border-gray-200 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 text-xs">
          {/* Search */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm theo Tên, Mã CB, User AD..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#004F9E]"
            />
          </div>

          {/* Dept filter */}
          <div>
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="w-full py-1.5 px-2.5 bg-white border border-gray-200 rounded-lg text-gray-700 focus:outline-none focus:ring-1 focus:ring-[#004F9E]"
            >
              <option value="ALL">🏢 Tất cả phòng ban ({departments.length})</option>
              {departments.map((d) => (
                <option key={d.id} value={d.maPhongBan}>
                  {d.maPhongBan} - {d.tenPhongBan}
                </option>
              ))}
            </select>
          </div>

          {/* Account Status Filter */}
          <div>
            <select
              value={accountStatusFilter}
              onChange={(e) => setAccountStatusFilter(e.target.value as any)}
              className="w-full py-1.5 px-2.5 bg-white border border-gray-200 rounded-lg text-gray-700 focus:outline-none focus:ring-1 focus:ring-[#004F9E]"
            >
              <option value="ALL">🔑 Tình trạng User AD: Tất cả</option>
              <option value="HAS_ACCOUNT">✅ Đã cấp tài khoản ({staffWithAccount})</option>
              <option value="NO_ACCOUNT">⚠️ Chưa cấp tài khoản ({staffWithoutAccount})</option>
            </select>
          </div>

          {/* Work status filter */}
          <div>
            <select
              value={workStatusFilter}
              onChange={(e) => setWorkStatusFilter(e.target.value as any)}
              className="w-full py-1.5 px-2.5 bg-white border border-gray-200 rounded-lg text-gray-700 focus:outline-none focus:ring-1 focus:ring-[#004F9E]"
            >
              <option value="ALL">💼 Trạng thái công tác: Tất cả</option>
              <option value="WORKING">🟢 Đang làm việc</option>
              <option value="LEAVING">⚪ Nghỉ việc</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-100/70 border-b border-gray-200 text-[11px] font-bold text-gray-600 uppercase tracking-wider">
                <th className="py-3 px-3">Mã CB</th>
                <th className="py-3 px-3">Họ và tên Cán bộ</th>
                <th className="py-3 px-3">Phòng ban & Chức danh</th>
                <th className="py-3 px-3">Tài khoản User AD</th>
                <th className="py-3 px-3">Mật khẩu đăng nhập</th>
                <th className="py-3 px-3">Vai trò hệ thống</th>
                <th className="py-3 px-3 text-center">Trạng thái</th>
                <th className="py-3 px-3 text-right">Thao tác Quản trị</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredStaff.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-gray-400">
                    Không tìm thấy cán bộ phù hợp với điều kiện lọc.
                  </td>
                </tr>
              ) : (
                filteredStaff.map((staff) => {
                  const hasAcc = !!(staff.userAD && staff.userAD.trim() !== '');
                  const isPasswordVisible = showPasswordMap[staff.id];
                  const currentPassword = staff.matKhau || '123456';

                  return (
                    <tr key={staff.id} className="hover:bg-blue-50/30 transition">
                      {/* Ma CB */}
                      <td className="py-3 px-3 font-mono font-bold text-[#004F9E] whitespace-nowrap">
                        <div className="bg-blue-50 text-[#004F9E] px-2 py-0.5 rounded border border-blue-200 inline-block">
                          {staff.maCanBo}
                        </div>
                      </td>

                      {/* Ho Ten */}
                      <td className="py-3 px-3">
                        <div className="font-bold text-gray-900 text-sm">{staff.hoTen}</div>
                        <div className="text-[11px] text-gray-500 flex items-center gap-2 mt-0.5">
                          {staff.soDienThoai && <span>📞 {staff.soDienThoai}</span>}
                          {staff.email && <span className="font-mono text-gray-400">✉️ {staff.email}</span>}
                        </div>
                      </td>

                      {/* Phong ban & Chuc vu */}
                      <td className="py-3 px-3">
                        <div className="font-medium text-gray-800">{staff.tenPhongBan}</div>
                        <div className="text-[11px] text-blue-700 font-semibold mt-0.5">
                          {staff.chucVu}
                        </div>
                      </td>

                      {/* User AD */}
                      <td className="py-3 px-3 whitespace-nowrap">
                        {hasAcc ? (
                          <div className="space-y-0.5">
                            <div className="inline-flex items-center gap-1.5 bg-slate-100 text-slate-800 font-mono font-bold px-2 py-0.5 rounded border border-slate-300">
                              <Key className="w-3 h-3 text-[#004F9E]" />
                              <span>{staff.userAD}</span>
                            </div>
                            {staff.maUserAD && (
                              <div className="text-[10px] text-gray-400 font-mono pl-0.5">
                                {staff.maUserAD}
                              </div>
                            )}
                          </div>
                        ) : (
                          <button
                            onClick={() => handleOpenProvision(staff)}
                            className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 hover:bg-amber-100 font-bold px-2.5 py-1 rounded-lg border border-amber-300 transition text-[11px]"
                          >
                            <Sparkles className="w-3 h-3 text-amber-600" />
                            <span>Cấp User AD</span>
                          </button>
                        )}
                      </td>

                      {/* Mat Khau */}
                      <td className="py-3 px-3 whitespace-nowrap">
                        {hasAcc ? (
                          <div className="inline-flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-2 py-1 rounded-lg">
                            <span className="font-mono font-bold text-gray-800 text-[11px]">
                              {isPasswordVisible ? currentPassword : '••••••••'}
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                setShowPasswordMap((prev) => ({
                                  ...prev,
                                  [staff.id]: !prev[staff.id]
                                }))
                              }
                              className="text-gray-400 hover:text-gray-600 ml-1"
                              title={isPasswordVisible ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                            >
                              {isPasswordVisible ? (
                                <EyeOff className="w-3.5 h-3.5" />
                              ) : (
                                <Eye className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </div>
                        ) : (
                          <span className="text-gray-300 font-mono">-</span>
                        )}
                      </td>

                      {/* Vai Tro He Thong */}
                      <td className="py-3 px-3 whitespace-nowrap">
                        <span
                          className={`text-[10px] font-bold px-2.5 py-1 rounded-full border inline-block ${
                            staff.vaiTro === 'Admin'
                              ? 'bg-purple-50 text-purple-700 border-purple-200'
                              : staff.vaiTro === 'Cán bộ điện toán'
                              ? 'bg-blue-50 text-blue-700 border-blue-200'
                              : staff.vaiTro === 'Lãnh đạo phòng'
                              ? 'bg-amber-50 text-amber-700 border-amber-200'
                              : 'bg-slate-50 text-slate-700 border-slate-200'
                          }`}
                        >
                          {staff.vaiTro || 'Cán bộ'}
                        </span>
                      </td>

                      {/* Trang thai */}
                      <td className="py-3 px-3 text-center whitespace-nowrap">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            staff.trangThai === 'Đang làm việc' || staff.trangThai === 'Hoạt động'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-gray-200 text-gray-600'
                          }`}
                        >
                          {staff.trangThai}
                        </span>
                      </td>

                      {/* Thao tac Quan tri */}
                      <td className="py-3 px-3 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Reset Password Button (Admin action) */}
                          {hasAcc && (
                            <button
                              onClick={() => handleOpenResetPassword(staff)}
                              className="inline-flex items-center gap-1 bg-amber-500 hover:bg-amber-600 text-white font-bold px-2 py-1 rounded-lg text-[11px] shadow-sm transition"
                              title="Admin Reset Mật khẩu cho Cán bộ"
                            >
                              <RefreshCw className="w-3 h-3" />
                              <span>Reset MK</span>
                            </button>
                          )}

                          {/* Copy Info Button */}
                          {hasAcc && (
                            <button
                              onClick={() => handleCopyCredentials(staff)}
                              className={`p-1.5 rounded-lg border transition ${
                                copiedId === staff.id
                                  ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                                  : 'bg-white hover:bg-slate-100 text-gray-600 border-gray-200'
                              }`}
                              title="Sao chép thông tin tài khoản gửi Cán bộ"
                            >
                              {copiedId === staff.id ? (
                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>
                          )}

                          {/* Edit Button */}
                          <button
                            onClick={() => handleOpenEdit(staff)}
                            className="p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition"
                            title="Chỉnh sửa thông tin Cán bộ"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODAL 1: ADD / EDIT STAFF */}
      {/* ========================================================================= */}
      {isAddEditOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-gray-200 max-h-[90vh] flex flex-col">
            <div className="p-4 bg-[#004F9E] text-white flex items-center justify-between shrink-0">
              <div className="flex items-center space-x-2">
                <UserCheck className="w-5 h-5" />
                <h3 className="font-bold text-base">
                  {editingStaff ? 'Chỉnh sửa Hồ sơ Cán bộ' : 'Thêm Cán bộ mới vào Chi nhánh'}
                </h3>
              </div>
              <button onClick={() => setIsAddEditOpen(false)} className="text-white/80 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitStaff} className="p-5 space-y-3.5 text-xs overflow-y-auto flex-1">
              {error && (
                <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 font-medium">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-gray-700 font-bold mb-1">Mã cán bộ: *</label>
                  <input
                    type="text"
                    value={maCanBo}
                    onChange={(e) => setMaCanBo(e.target.value)}
                    placeholder="VD: CB001"
                    className="w-full p-2 border border-gray-300 rounded-lg font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-bold mb-1">Trạng thái công tác:</label>
                  <select
                    value={trangThai}
                    onChange={(e) => setTrangThai(e.target.value as any)}
                    className="w-full p-2 border border-gray-300 rounded-lg bg-white"
                  >
                    <option value="Đang làm việc">🟢 Đang làm việc</option>
                    <option value="Nghỉ việc">⚪ Nghỉ việc</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-1">Họ và tên cán bộ: *</label>
                <input
                  type="text"
                  value={hoTen}
                  onChange={(e) => {
                    setHoTen(e.target.value);
                    if (!editingStaff && hasAccountCheckbox && !userAD) {
                      setUserAD(generateUserADFromName(e.target.value));
                    }
                  }}
                  placeholder="VD: Nguyễn Văn Hùng"
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-gray-700 font-bold mb-1">Phòng ban trực thuộc: *</label>
                  <select
                    value={maPhongBan}
                    onChange={(e) => setMaPhongBan(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg bg-white"
                  >
                    {departments.map((d) => (
                      <option key={d.id} value={d.maPhongBan}>
                        {d.maPhongBan} - {d.tenPhongBan}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 font-bold mb-1">Chức danh chuyên môn: *</label>
                  <input
                    type="text"
                    value={chucVu}
                    onChange={(e) => setChucVu(e.target.value)}
                    placeholder="VD: Giao dịch viên, Cán bộ QHKH..."
                    className="w-full p-2 border border-gray-300 rounded-lg"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-gray-700 font-bold mb-1">Số điện thoại:</label>
                  <input
                    type="text"
                    value={soDienThoai}
                    onChange={(e) => setSoDienThoai(e.target.value)}
                    placeholder="0912345678"
                    className="w-full p-2 border border-gray-300 rounded-lg font-mono"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-bold mb-1">Email VietinBank:</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@vietinbank.vn"
                    className="w-full p-2 border border-gray-300 rounded-lg font-mono"
                  />
                </div>
              </div>

              {/* Account Provision Section in Add/Edit */}
              <div className="p-3 bg-blue-50/60 border border-blue-200 rounded-xl space-y-2.5 mt-2">
                <div className="flex items-center justify-between">
                  <label className="flex items-center space-x-2 font-bold text-blue-900 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={hasAccountCheckbox}
                      onChange={(e) => setHasAccountCheckbox(e.target.checked)}
                      className="rounded text-[#004F9E] focus:ring-[#004F9E]"
                    />
                    <span>Cấp Tài khoản Đăng nhập Hệ thống (User AD)</span>
                  </label>
                  <span className="text-[10px] text-blue-600 font-semibold bg-white px-2 py-0.5 rounded border border-blue-200">
                    Đồng bộ bảng USERS
                  </span>
                </div>

                {hasAccountCheckbox && (
                  <div className="space-y-2.5 pt-1">
                    <div className="grid grid-cols-2 gap-2.5">
                      <div>
                        <label className="block text-gray-700 font-bold mb-1">Tài khoản User AD: *</label>
                        <input
                          type="text"
                          value={userAD}
                          onChange={(e) => setUserAD(e.target.value)}
                          placeholder="VD: hungnv"
                          className="w-full p-2 border border-gray-300 rounded-lg font-mono bg-white font-bold"
                          required={hasAccountCheckbox}
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700 font-bold mb-1">Mã User AD (8 số):</label>
                        <input
                          type="text"
                          value={maUserAD}
                          onChange={(e) => setMaUserAD(e.target.value)}
                          placeholder="VD: 00005568, 00006961"
                          maxLength={8}
                          className="w-full p-2 border border-gray-300 rounded-lg font-mono bg-white"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2.5">
                      <div>
                        <label className="block text-gray-700 font-bold mb-1">Mật khẩu đăng nhập: *</label>
                        <input
                          type="text"
                          value={matKhau}
                          onChange={(e) => setMatKhau(e.target.value)}
                          placeholder="Mặc định: 123456"
                          className="w-full p-2 border border-gray-300 rounded-lg font-mono bg-white font-bold text-gray-800"
                          required={hasAccountCheckbox}
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700 font-bold mb-1">Vai trò phân quyền hệ thống:</label>
                        <select
                          value={vaiTro}
                          onChange={(e) => setVaiTro(e.target.value as UserRole)}
                          className="w-full p-2 border border-gray-300 rounded-lg bg-white font-bold text-blue-900"
                        >
                          <option value="Cán bộ">Cán bộ (Nghiệp vụ)</option>
                          <option value="Lãnh đạo phòng">Lãnh đạo phòng (Phê duyệt)</option>
                          <option value="Cán bộ điện toán">Cán bộ điện toán (IT)</option>
                          <option value="Admin">Admin (Quản trị toàn quyền)</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-gray-100 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsAddEditOpen(false)}
                  className="px-3.5 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition font-medium"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 bg-[#004F9E] text-white font-bold rounded-xl shadow hover:bg-[#003B77] transition"
                >
                  {isSubmitting ? 'Đang lưu...' : 'Lưu Hồ sơ Cán bộ'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: PROVISION ACCOUNT FOR STAFF (CẤP TÀI KHOẢN CHO CÁN BỘ) */}
      {/* ========================================================================= */}
      {isProvisionOpen && provisionStaff && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-gray-200">
            <div className="p-4 bg-gradient-to-r from-[#004F9E] to-blue-800 text-white flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-amber-300" />
                <h3 className="font-bold text-base">Cấp Tài khoản & Mật khẩu Đăng nhập</h3>
              </div>
              <button onClick={() => setIsProvisionOpen(false)} className="text-white/80 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitProvision} className="p-5 space-y-3.5 text-xs">
              {error && (
                <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 font-medium">
                  {error}
                </div>
              )}

              {/* Staff summary card */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <div className="font-bold text-gray-900 text-sm">{provisionStaff.hoTen}</div>
                <div className="text-gray-500 text-[11px] flex items-center justify-between">
                  <span>Mã CB: <strong className="font-mono text-[#004F9E]">{provisionStaff.maCanBo}</strong></span>
                  <span>Đơn vị: <strong>{provisionStaff.tenPhongBan}</strong></span>
                </div>
                <div className="text-gray-500 text-[11px]">
                  Chức danh: <strong>{provisionStaff.chucVu}</strong>
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-1">Tài khoản User AD: *</label>
                <input
                  type="text"
                  value={provUserAD}
                  onChange={(e) => setProvUserAD(e.target.value)}
                  placeholder="VD: hungnv"
                  className="w-full p-2 border border-gray-300 rounded-lg font-mono font-bold text-gray-900 bg-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-gray-700 font-bold mb-1">Mã User AD (8 số):</label>
                  <input
                    type="text"
                    value={provMaUserAD}
                    onChange={(e) => setProvMaUserAD(e.target.value)}
                    placeholder="VD: 00005568, 00006961"
                    maxLength={8}
                    className="w-full p-2 border border-gray-300 rounded-lg font-mono bg-white"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-bold mb-1">Vai trò hệ thống:</label>
                  <select
                    value={provVaiTro}
                    onChange={(e) => setProvVaiTro(e.target.value as UserRole)}
                    className="w-full p-2 border border-gray-300 rounded-lg bg-white font-bold text-blue-900"
                  >
                    <option value="Cán bộ">Cán bộ</option>
                    <option value="Lãnh đạo phòng">Lãnh đạo phòng</option>
                    <option value="Cán bộ điện toán">Cán bộ điện toán</option>
                    <option value="Admin">Admin</option>
                  </select>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-gray-700 font-bold">Mật khẩu khởi tạo: *</label>
                  <button
                    type="button"
                    onClick={() => setProvMatKhau(generateRandomStrongPass())}
                    className="text-[#004F9E] hover:underline font-semibold text-[11px] flex items-center gap-1"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Sinh mật khẩu ngẫu nhiên</span>
                  </button>
                </div>
                <input
                  type="text"
                  value={provMatKhau}
                  onChange={(e) => setProvMatKhau(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg font-mono font-bold text-emerald-800 bg-emerald-50/50"
                  required
                />
                <span className="text-[10px] text-gray-400 block mt-1">
                  Mật khẩu mặc định khuyến nghị: <code>123456</code> hoặc mật khẩu an toàn.
                </span>
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-1">Email nhận thông tin:</label>
                <input
                  type="email"
                  value={provEmail}
                  onChange={(e) => setProvEmail(e.target.value)}
                  placeholder="user@vietinbank.vn"
                  className="w-full p-2 border border-gray-300 rounded-lg font-mono"
                />
              </div>

              <div className="pt-3 border-t border-gray-100 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsProvisionOpen(false)}
                  className="px-3.5 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition font-medium"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 bg-[#004F9E] text-white font-bold rounded-xl shadow hover:bg-[#003B77] transition flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{isSubmitting ? 'Đang cấp...' : 'Xác nhận Cấp Tài khoản'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: ADMIN RESET PASSWORD (RESET MẬT KHẨU CÁN BỘ DO ADMIN QUẢN TRỊ) */}
      {/* ========================================================================= */}
      {isResetPassOpen && resetTargetStaff && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-gray-200">
            <div className="p-4 bg-gradient-to-r from-amber-600 to-amber-700 text-white flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <RefreshCw className="w-5 h-5" />
                <h3 className="font-bold text-base">Admin Đặt lại (Reset) Mật khẩu</h3>
              </div>
              <button onClick={() => setIsResetPassOpen(false)} className="text-white/80 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitResetPassword} className="p-5 space-y-3.5 text-xs">
              {error && (
                <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 font-medium">
                  {error}
                </div>
              )}

              {/* Target Staff Info */}
              <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl space-y-1 text-gray-800">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-gray-900">{resetTargetStaff.hoTen}</span>
                  <span className="font-mono font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded">
                    {resetTargetStaff.userAD}
                  </span>
                </div>
                <div className="text-[11px] text-gray-600 flex items-center justify-between">
                  <span>Mã CB: <strong>{resetTargetStaff.maCanBo}</strong></span>
                  <span>Đơn vị: <strong>{resetTargetStaff.tenPhongBan}</strong></span>
                </div>
              </div>

              {/* Reset Password Options */}
              <div className="space-y-2">
                <label className="block text-gray-700 font-bold">Lựa chọn phương thức đặt lại mật khẩu:</label>

                {/* Option 1: Default 123456 */}
                <label
                  onClick={() => setResetOption('DEFAULT')}
                  className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition ${
                    resetOption === 'DEFAULT'
                      ? 'border-[#004F9E] bg-blue-50/50 shadow-sm'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="resetOpt"
                    checked={resetOption === 'DEFAULT'}
                    onChange={() => setResetOption('DEFAULT')}
                    className="mt-0.5 text-[#004F9E] focus:ring-[#004F9E]"
                  />
                  <div>
                    <div className="font-bold text-gray-900">Mật khẩu mặc định chi nhánh: <span className="font-mono text-[#004F9E]">123456</span></div>
                    <div className="text-[11px] text-gray-500 mt-0.5">
                      Khôi phục về mật khẩu tiêu chuẩn VietinBank Ninh Bình.
                    </div>
                  </div>
                </label>

                {/* Option 2: Random Strong Pass */}
                <label
                  onClick={() => {
                    setResetOption('RANDOM');
                    if (generatedPassword === '123456') {
                      setGeneratedPassword(generateRandomStrongPass());
                    }
                  }}
                  className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition ${
                    resetOption === 'RANDOM'
                      ? 'border-[#004F9E] bg-blue-50/50 shadow-sm'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="resetOpt"
                    checked={resetOption === 'RANDOM'}
                    onChange={() => {
                      setResetOption('RANDOM');
                      if (generatedPassword === '123456') {
                        setGeneratedPassword(generateRandomStrongPass());
                      }
                    }}
                    className="mt-0.5 text-[#004F9E] focus:ring-[#004F9E]"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-gray-900">Sinh mật khẩu ngẫu nhiên bảo mật cao</span>
                      {resetOption === 'RANDOM' && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setGeneratedPassword(generateRandomStrongPass());
                          }}
                          className="text-[#004F9E] hover:underline font-semibold text-[10px] flex items-center gap-0.5"
                        >
                          <RefreshCw className="w-3 h-3" />
                          <span>Sinh lại</span>
                        </button>
                      )}
                    </div>
                    {resetOption === 'RANDOM' && (
                      <div className="mt-1.5 p-2 bg-white border border-blue-200 rounded-lg font-mono font-bold text-sm text-emerald-800">
                        {generatedPassword}
                      </div>
                    )}
                  </div>
                </label>

                {/* Option 3: Custom Password */}
                <label
                  onClick={() => setResetOption('CUSTOM')}
                  className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition ${
                    resetOption === 'CUSTOM'
                      ? 'border-[#004F9E] bg-blue-50/50 shadow-sm'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="resetOpt"
                    checked={resetOption === 'CUSTOM'}
                    onChange={() => setResetOption('CUSTOM')}
                    className="mt-0.5 text-[#004F9E] focus:ring-[#004F9E]"
                  />
                  <div className="flex-1">
                    <div className="font-bold text-gray-900">Tự nhập mật khẩu mới tùy chỉnh</div>
                    {resetOption === 'CUSTOM' && (
                      <div className="mt-1.5">
                        <input
                          type="text"
                          value={customPassword}
                          onChange={(e) => setCustomPassword(e.target.value)}
                          placeholder="Nhập mật khẩu mới..."
                          className="w-full p-2 border border-gray-300 rounded-lg font-mono font-bold bg-white"
                          autoFocus
                        />
                      </div>
                    )}
                  </div>
                </label>
              </div>

              {/* Safety notice */}
              <div className="p-2.5 bg-slate-100 rounded-lg text-[11px] text-gray-600 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>
                  Thao tác Reset mật khẩu sẽ được ghi nhận vào <strong>Nhật ký Audit Log</strong> hệ thống để phục vụ công tác kiểm tra kiểm soát.
                </span>
              </div>

              <div className="pt-3 border-t border-gray-100 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsResetPassOpen(false)}
                  className="px-3.5 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition font-medium"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl shadow transition flex items-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>{isSubmitting ? 'Đang thực hiện...' : 'Xác nhận Đặt lại Mật khẩu'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 4: HANDOVER CREDENTIALS SUCCESS CARD */}
      {/* ========================================================================= */}
      {handoverData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-emerald-300">
            <div className="p-4 bg-emerald-700 text-white flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-300" />
                <h3 className="font-bold text-base">{handoverData.title}</h3>
              </div>
              <button onClick={() => setHandoverData(null)} className="text-white/80 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div className="p-4 bg-emerald-50/60 border border-emerald-200 rounded-2xl space-y-2.5">
                <div className="text-center pb-2 border-b border-emerald-200/70">
                  <span className="text-[10px] uppercase tracking-wider text-emerald-700 font-bold block">
                    Thông tin Bàn giao Tài khoản Cán bộ
                  </span>
                  <div className="text-base font-black text-gray-900 mt-0.5">
                    {handoverData.hoTen} ({handoverData.maCanBo})
                  </div>
                  <div className="text-xs text-gray-500 font-medium">{handoverData.tenPhongBan}</div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div className="bg-white p-2.5 rounded-xl border border-gray-200">
                    <span className="text-[10px] text-gray-400 font-semibold block">TÀI KHOẢN USER AD</span>
                    <span className="font-mono font-black text-sm text-[#004F9E]">
                      {handoverData.userAD}
                    </span>
                  </div>

                  <div className="bg-white p-2.5 rounded-xl border border-gray-200">
                    <span className="text-[10px] text-gray-400 font-semibold block">MẬT KHẨU ĐĂNG NHẬP</span>
                    <span className="font-mono font-black text-sm text-emerald-700">
                      {handoverData.matKhau}
                    </span>
                  </div>
                </div>

                <div className="bg-white p-2.5 rounded-xl border border-gray-200 flex items-center justify-between">
                  <span className="text-[11px] text-gray-500 font-medium">Vai trò hệ thống:</span>
                  <span className="font-bold text-slate-800">{handoverData.vaiTro}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const text = `[VIETINBANK - BÀN GIAO TÀI KHOẢN HỆ THỐNG]\n- Họ tên: ${handoverData.hoTen}\n- Mã cán bộ: ${handoverData.maCanBo}\n- Phòng ban: ${handoverData.tenPhongBan}\n- Tài khoản User AD: ${handoverData.userAD}\n- Mật khẩu đăng nhập: ${handoverData.matKhau}\n- Vai trò: ${handoverData.vaiTro}\n- Link đăng nhập: ${window.location.origin}`;
                    navigator.clipboard.writeText(text);
                    alert('Đã sao chép thông tin tài khoản vào Clipboard để gửi cho cán bộ!');
                  }}
                  className="flex-1 py-2.5 bg-[#004F9E] hover:bg-[#003B77] text-white font-bold rounded-xl shadow flex items-center justify-center gap-2 transition"
                >
                  <Copy className="w-4 h-4" />
                  <span>Sao chép Thông tin gửi Cán bộ</span>
                </button>

                <button
                  type="button"
                  onClick={() => setHandoverData(null)}
                  className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
