import React, { useState } from 'react';
import { User, PhongBan, UserRole } from '../types';
import {
  Users,
  Plus,
  Edit2,
  Shield,
  Building,
  UserCheck,
  AlertCircle,
  X,
  Check,
  Key,
  RefreshCw,
  Eye,
  EyeOff,
  Copy,
  CheckCircle2
} from 'lucide-react';
import { api } from '../services/api';

interface AdminUsersViewProps {
  users: User[];
  departments: PhongBan[];
  onAddUser: (user: Partial<User>) => Promise<void>;
  onUpdateUser: (id: string, user: Partial<User>) => Promise<void>;
}

export const AdminUsersView: React.FC<AdminUsersViewProps> = ({
  users,
  departments,
  onAddUser,
  onUpdateUser
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  // Form states for Add/Edit
  const [maUserAD, setMaUserAD] = useState('');
  const [hoTen, setHoTen] = useState('');
  const [userAD, setUserAD] = useState('');
  const [matKhau, setMatKhau] = useState('123456');
  const [email, setEmail] = useState('');
  const [soDienThoai, setSoDienThoai] = useState('');
  const [maPhongBan, setMaPhongBan] = useState(
    departments.length > 0 ? departments[0].maPhongBan : 'P001'
  );
  const [chucVu, setChucVu] = useState<UserRole>('Cán bộ');
  const [trangThai, setTrangThai] = useState<'Hoạt động' | 'Khóa'>('Hoạt động');

  // Password visibility map
  const [showPasswordMap, setShowPasswordMap] = useState<Record<string, boolean>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Reset Password Modal
  const [isResetPassOpen, setIsResetPassOpen] = useState(false);
  const [resetTargetUser, setResetTargetUser] = useState<User | null>(null);
  const [resetOption, setResetOption] = useState<'DEFAULT' | 'RANDOM' | 'CUSTOM'>('DEFAULT');
  const [customPassword, setCustomPassword] = useState('');
  const [generatedPassword, setGeneratedPassword] = useState('123456');

  // Handover card modal
  const [handoverData, setHandoverData] = useState<{
    hoTen: string;
    userAD: string;
    matKhau: string;
    chucVu: string;
    tenPhongBan: string;
  } | null>(null);

  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleOpenAdd = () => {
    setEditingUser(null);
    setMaUserAD(`AD_042_${String(users.length + 1).padStart(3, '0')}`);
    setHoTen('');
    setUserAD('');
    setMatKhau('123456');
    setEmail('');
    setSoDienThoai('');
    setMaPhongBan(departments.length > 0 ? departments[0].maPhongBan : 'P001');
    setChucVu('Cán bộ');
    setTrangThai('Hoạt động');
    setError('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (user: User) => {
    setEditingUser(user);
    setMaUserAD(user.maUserAD);
    setHoTen(user.hoTen);
    setUserAD(user.userAD);
    setMatKhau(user.matKhau || '123456');
    setEmail(user.email);
    setSoDienThoai(user.soDienThoai || '');
    setMaPhongBan(user.maPhongBan);
    setChucVu(user.chucVu);
    setTrangThai(user.trangThai);
    setError('');
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    const selectedDept = departments.find((d) => d.maPhongBan === maPhongBan);
    const tenPhongBan = selectedDept ? selectedDept.tenPhongBan : '';

    try {
      if (editingUser) {
        await onUpdateUser(editingUser.id, {
          maUserAD,
          hoTen,
          userAD: userAD.trim().toLowerCase(),
          matKhau: matKhau.trim() || '123456',
          email: email.trim(),
          soDienThoai: soDienThoai.trim(),
          maPhongBan,
          tenPhongBan,
          chucVu,
          trangThai
        });
      } else {
        await onAddUser({
          maUserAD,
          hoTen,
          userAD: userAD.trim().toLowerCase(),
          matKhau: matKhau.trim() || '123456',
          email: email.trim() || `${userAD.trim().toLowerCase()}@vietinbank.vn`,
          soDienThoai: soDienThoai.trim(),
          maPhongBan,
          tenPhongBan,
          chucVu,
          trangThai
        });
      }
      setIsModalOpen(false);
    } catch (err: any) {
      setError(err.message || 'Lỗi khi lưu người dùng');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenResetPass = (user: User) => {
    setResetTargetUser(user);
    setResetOption('DEFAULT');
    setGeneratedPassword('123456');
    setCustomPassword('');
    setError('');
    setIsResetPassOpen(true);
  };

  const handleSubmitResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetTargetUser) return;
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
      const res = await api.resetUserPassword(resetTargetUser.id, finalPass);
      if (res.data) {
        await onUpdateUser(resetTargetUser.id, res.data);
      }

      setIsResetPassOpen(false);
      setHandoverData({
        hoTen: resetTargetUser.hoTen,
        userAD: resetTargetUser.userAD,
        matKhau: finalPass,
        chucVu: resetTargetUser.chucVu,
        tenPhongBan: resetTargetUser.tenPhongBan
      });
    } catch (err: any) {
      setError(err.message || 'Lỗi khi đặt lại mật khẩu.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyCredentials = (user: User) => {
    const text = `[VIETINBANK - THÔNG TIN TÀI KHOẢN]\n- Cán bộ: ${user.hoTen}\n- Tài khoản User AD: ${user.userAD}\n- Mật khẩu đăng nhập: ${user.matKhau || '123456'}\n- Vai trò: ${user.chucVu}\n- Đơn vị: ${user.tenPhongBan}\n- Link đăng nhập: ${window.location.origin}`;
    navigator.clipboard.writeText(text);
    setCopiedId(user.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <Users className="w-5 h-5 text-[#004F9E]" />
            <h2 className="text-base sm:text-lg font-bold text-gray-900">
              Quản lý Người dùng & Phân quyền Hệ thống
            </h2>
            <span className="text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full font-bold">
              Sheet USERS
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Quản trị danh sách tài khoản User AD, mật khẩu đăng nhập, phân quyền vai trò (Cán bộ, Lãnh đạo, Điện toán, Admin) và reset mật khẩu do Admin quản trị.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 bg-[#004F9E] hover:bg-[#003B77] text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow transition self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm User mới</span>
        </button>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-gray-200 text-[11px] font-bold text-gray-600 uppercase">
                <th className="py-3 px-3">Mã User AD</th>
                <th className="py-3 px-3">Họ và tên</th>
                <th className="py-3 px-3">Tài khoản User AD</th>
                <th className="py-3 px-3">Mật khẩu</th>
                <th className="py-3 px-3">Phòng ban</th>
                <th className="py-3 px-3">Vai trò hệ thống</th>
                <th className="py-3 px-3">Email</th>
                <th className="py-3 px-3">Trạng thái</th>
                <th className="py-3 px-3 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.map((u) => {
                const isPasswordVisible = showPasswordMap[u.id];
                const currentPassword = u.matKhau || '123456';

                return (
                  <tr key={u.id} className="hover:bg-blue-50/40 transition">
                    <td className="py-3 px-3 font-mono font-bold text-[#004F9E]">{u.maUserAD}</td>
                    <td className="py-3 px-3 font-bold text-gray-900">{u.hoTen}</td>
                    <td className="py-3 px-3">
                      <div className="inline-flex items-center gap-1 font-mono font-bold text-gray-800 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                        <Key className="w-3 h-3 text-[#004F9E]" />
                        <span>{u.userAD}</span>
                      </div>
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap">
                      <div className="inline-flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded">
                        <span className="font-mono font-bold text-gray-700 text-[11px]">
                          {isPasswordVisible ? currentPassword : '••••••••'}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            setShowPasswordMap((prev) => ({
                              ...prev,
                              [u.id]: !prev[u.id]
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
                    </td>
                    <td className="py-3 px-3">
                      <span className="font-medium text-gray-800">{u.tenPhongBan}</span>
                      <span className="text-[10px] text-gray-400 block font-mono">{u.maPhongBan}</span>
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                          u.chucVu === 'Admin'
                            ? 'bg-purple-50 text-purple-700 border-purple-200'
                            : u.chucVu === 'Cán bộ điện toán'
                            ? 'bg-blue-50 text-blue-700 border-blue-200'
                            : u.chucVu === 'Lãnh đạo phòng'
                            ? 'bg-amber-50 text-amber-700 border-amber-200'
                            : 'bg-slate-50 text-slate-700 border-slate-200'
                        }`}
                      >
                        {u.chucVu}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-gray-500 font-mono text-[11px]">{u.email}</td>
                    <td className="py-3 px-3 whitespace-nowrap">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          u.trangThai === 'Hoạt động'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-gray-200 text-gray-600'
                        }`}
                      >
                        {u.trangThai}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Reset Password Button */}
                        <button
                          onClick={() => handleOpenResetPass(u)}
                          className="inline-flex items-center gap-1 bg-amber-500 hover:bg-amber-600 text-white font-bold px-2 py-1 rounded-lg text-[11px] shadow-sm transition"
                          title="Admin Reset Mật khẩu"
                        >
                          <RefreshCw className="w-3 h-3" />
                          <span>Reset MK</span>
                        </button>

                        {/* Copy Info Button */}
                        <button
                          onClick={() => handleCopyCredentials(u)}
                          className={`p-1.5 rounded-lg border transition ${
                            copiedId === u.id
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                              : 'bg-white hover:bg-slate-100 text-gray-600 border-gray-200'
                          }`}
                          title="Sao chép thông tin tài khoản"
                        >
                          {copiedId === u.id ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>

                        {/* Edit Button */}
                        <button
                          onClick={() => handleOpenEdit(u)}
                          className="p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition"
                          title="Chỉnh sửa thông tin User"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-gray-200">
            <div className="p-4 bg-[#004F9E] text-white flex items-center justify-between">
              <h3 className="font-bold text-base">
                {editingUser ? 'Chỉnh sửa thông tin User' : 'Thêm User AD mới'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-white/80 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-3.5 text-xs">
              {error && (
                <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 font-medium">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-gray-700 font-bold mb-1">Mã User AD: *</label>
                <input
                  type="text"
                  value={maUserAD}
                  onChange={(e) => setMaUserAD(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-1">Họ và tên cán bộ: *</label>
                <input
                  type="text"
                  value={hoTen}
                  onChange={(e) => setHoTen(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-gray-700 font-bold mb-1">Tài khoản User AD: *</label>
                  <input
                    type="text"
                    value={userAD}
                    onChange={(e) => setUserAD(e.target.value)}
                    placeholder="VD: annv12"
                    className="w-full p-2 border border-gray-300 rounded-lg font-mono font-bold"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-bold mb-1">Mật khẩu:</label>
                  <input
                    type="text"
                    value={matKhau}
                    onChange={(e) => setMatKhau(e.target.value)}
                    placeholder="123456"
                    className="w-full p-2 border border-gray-300 rounded-lg font-mono font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-gray-700 font-bold mb-1">Email VietinBank:</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="annv12@vietinbank.vn"
                    className="w-full p-2 border border-gray-300 rounded-lg font-mono"
                  />
                </div>
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
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-1">Phòng ban:</label>
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

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-gray-700 font-bold mb-1">Vai trò hệ thống:</label>
                  <select
                    value={chucVu}
                    onChange={(e) => setChucVu(e.target.value as UserRole)}
                    className="w-full p-2 border border-gray-300 rounded-lg bg-white font-semibold text-blue-900"
                  >
                    <option value="Cán bộ">Cán bộ</option>
                    <option value="Lãnh đạo phòng">Lãnh đạo phòng</option>
                    <option value="Cán bộ điện toán">Cán bộ điện toán</option>
                    <option value="Admin">Admin</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 font-bold mb-1">Trạng thái:</label>
                  <select
                    value={trangThai}
                    onChange={(e) => setTrangThai(e.target.value as any)}
                    className="w-full p-2 border border-gray-300 rounded-lg bg-white"
                  >
                    <option value="Hoạt động">Hoạt động</option>
                    <option value="Khóa">Khóa</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 border-t border-gray-100 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3.5 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition font-medium"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 bg-[#004F9E] text-white font-bold rounded-xl shadow hover:bg-[#003B77] transition"
                >
                  {isSubmitting ? 'Đang lưu...' : 'Lưu thông tin'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reset Password Modal */}
      {isResetPassOpen && resetTargetUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-gray-200">
            <div className="p-4 bg-gradient-to-r from-amber-600 to-amber-700 text-white flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <RefreshCw className="w-5 h-5" />
                <h3 className="font-bold text-base">Admin Reset Mật khẩu User</h3>
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

              <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl space-y-1 text-gray-800">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-gray-900">{resetTargetUser.hoTen}</span>
                  <span className="font-mono font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded">
                    {resetTargetUser.userAD}
                  </span>
                </div>
                <div className="text-[11px] text-gray-600">
                  Đơn vị: <strong>{resetTargetUser.tenPhongBan}</strong> ({resetTargetUser.chucVu})
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-gray-700 font-bold">Lựa chọn mật khẩu mới:</label>

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
                    name="userResetOpt"
                    checked={resetOption === 'DEFAULT'}
                    onChange={() => setResetOption('DEFAULT')}
                    className="mt-0.5 text-[#004F9E] focus:ring-[#004F9E]"
                  />
                  <div>
                    <div className="font-bold text-gray-900">Mật khẩu mặc định: <span className="font-mono text-[#004F9E]">123456</span></div>
                  </div>
                </label>

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
                    name="userResetOpt"
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
                    name="userResetOpt"
                    checked={resetOption === 'CUSTOM'}
                    onChange={() => setResetOption('CUSTOM')}
                    className="mt-0.5 text-[#004F9E] focus:ring-[#004F9E]"
                  />
                  <div className="flex-1">
                    <div className="font-bold text-gray-900">Tự nhập mật khẩu mới</div>
                    {resetOption === 'CUSTOM' && (
                      <div className="mt-1.5">
                        <input
                          type="text"
                          value={customPassword}
                          onChange={(e) => setCustomPassword(e.target.value)}
                          placeholder="Nhập mật khẩu..."
                          className="w-full p-2 border border-gray-300 rounded-lg font-mono font-bold bg-white"
                          autoFocus
                        />
                      </div>
                    )}
                  </div>
                </label>
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

      {/* Handover Success Modal */}
      {handoverData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-emerald-300">
            <div className="p-4 bg-emerald-700 text-white flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-300" />
                <h3 className="font-bold text-base">Đặt lại Mật khẩu User Thành công</h3>
              </div>
              <button onClick={() => setHandoverData(null)} className="text-white/80 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div className="p-4 bg-emerald-50/60 border border-emerald-200 rounded-2xl space-y-2.5">
                <div className="text-center pb-2 border-b border-emerald-200/70">
                  <div className="text-base font-black text-gray-900">
                    {handoverData.hoTen}
                  </div>
                  <div className="text-xs text-gray-500 font-medium">{handoverData.tenPhongBan}</div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div className="bg-white p-2.5 rounded-xl border border-gray-200">
                    <span className="text-[10px] text-gray-400 font-semibold block">USER AD</span>
                    <span className="font-mono font-black text-sm text-[#004F9E]">
                      {handoverData.userAD}
                    </span>
                  </div>

                  <div className="bg-white p-2.5 rounded-xl border border-gray-200">
                    <span className="text-[10px] text-gray-400 font-semibold block">MẬT KHẨU MỚI</span>
                    <span className="font-mono font-black text-sm text-emerald-700">
                      {handoverData.matKhau}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const text = `[VIETINBANK - THÔNG TIN TÀI KHOẢN MỚI]\n- Cán bộ: ${handoverData.hoTen}\n- User AD: ${handoverData.userAD}\n- Mật khẩu mới: ${handoverData.matKhau}\n- Vai trò: ${handoverData.chucVu}\n- Link đăng nhập: ${window.location.origin}`;
                    navigator.clipboard.writeText(text);
                    alert('Đã sao chép thông tin tài khoản!');
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
